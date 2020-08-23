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
        response.end(`<html lang="en">
        <head>
            <title>Document</title>
            <style>
                #container {
                    width: 500px;
                    height: 300px;
                    display: flex;
                }
                #container #myId {
                    width: 200px;
                }
                #container .c1 {
                    flex:1;
                }
            </style>
        </head>
        <body>
            <div id="container">
                <div id="myId"></div>
                <div class="c1"></div>
            </div>
        </body>
        </html>`)
    })
}).listen(8080)

console.log('server start');