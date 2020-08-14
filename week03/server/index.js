const http = require('http');

http.createServer((request, response) => {
    let body = [];
    request.on('err', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body server', body);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(`hello ${body.split('=')[1]}`)

    })
}).listen(8080)

console.log('server start');