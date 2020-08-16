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
                body div img {
                    color: yellow;
                }
                body div #myId {
                    background: red;
                }
            </style>
        </head>
        <body>
            <div>
                <img src="" alt="" id="myId" />
                <img src="" alt="" />
            </div>
        </body>
        </html>`)
    })
}).listen(8080)

console.log('server start');