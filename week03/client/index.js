const net = require('net');
const parser = require('./parse');

class Request {
    constructor(options) {
        const { method = 'GET', host, port = 80, path = '/', headers = {}, body = {} } = options;
        this.method = method;
        this.host = host;
        this.port = port;
        this.path = path;
        this.headers = headers;
        this.body = body;
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (this.headers['Content-Type'] == 'application/json') {
            this.bodyText = JSON.stringify(this.body)
        } else if (this.headers['Content-Type'] = 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map((key) => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }

        // legnth 必须是bodyText的length，否则是非法的请求
        this.headers['Content-Length'] = this.bodyText.length;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', (data) => {
                console.log('data', data);
                parser.receive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        })
    };

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}:${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`
    }
}


class ResponseParser {
    constructor() {
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.wait_status_line_end = this.wait_status_line_end.bind(this);
        this.wait_header_name = this.wait_header_name.bind(this);
        this.wait_header_space = this.wait_header_space.bind(this);
        this.wait_header_value = this.wait_header_value.bind(this);
        this.wait_header_line_end = this.wait_header_line_end.bind(this);
        this.wait_header_block_end = this.wait_header_block_end.bind(this);
        this.wait_body = this.wait_body.bind(this);
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 (\d+) (\S+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive(string) {
        let state = this.start;
        for (let i = 0; i < string.length; i++) {
            state = state(string.charAt(i));
        }
        return state == this.end;
    }

    start(char) {
        if (char == '\r') {
            return this.wait_status_line_end;
        } else {
            this.statusLine += char;
            return this.start;
        }
    }

    end() {
        return end;
    }

    wait_status_line_end(char) {
        if (char === '\n') {
            return this.wait_header_name
        }
    }

    wait_header_name(char) {
        if (char === ':') {
            return this.wait_header_space
        } else if (char === '\r') {
            if (this.headers['Transfer-Encoding'] === 'chunked') {
                this.bodyParser = new ChunkedBodyParser();
            }
            return this.wait_header_block_end;
        } else {
            this.headerName += char;
            return this.wait_header_name;
        }
    }

    wait_header_space(char) {
        if (char === ' ') {
            return this.wait_header_value;
        }
    }
    wait_header_value(char) {
        if (char === '\r') {
            this.headers[this.headerName] = this.headerValue;
            this.headerName = "";
            this.headerValue = "";
            return this.wait_header_line_end;
        } else {
            this.headerValue += char;
            return this.wait_header_value;
        }
    }

    wait_header_line_end(char) {
        if (char === '\n') {
            return this.wait_header_name;
        }
    }
    wait_header_block_end(char) {
        if (char === '\n') {
            return this.wait_body;
        }
    }

    wait_body(char) {
        this.bodyParser.receiveChar(char);
        return this.wait_body;
    }
}

class ChunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_CHUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
        this.parser = new ResponseParser;
    }

    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                this.current = this.WAITING_LENGTH_LINE_END;
                if (this.length === 0) {
                    this.isFinished = true;
                }
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_CHUNK;
            }
        } else if (this.current === this.READING_CHUNK) {
            if (this.length !== 0) {
                this.content.push(char);
            }
            if (this.content.length === this.length) {
                this.current = this.WAITING_NEW_LINE;
                this.length = 0;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
                return this.parser.end;
            }
        }
    }
}




void async function () {
    const options = {
        method: 'POST',
        host: '127.0.0.1',
        port: '8080',
        path: '/',
        headers: {
            ['X-Foo2']: 'customed'
        },
        body: {
            name: 'lily'
        }
    }
    let request = new Request(options);
    let response = await request.send();

    console.log(response, '-----');

    let dom = parser.parserHTML(response.body);

}()