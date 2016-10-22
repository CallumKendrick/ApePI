var http = require('http');

var server = http.createServer();
server.on("request", function(request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({hello: "world"}));
    response.end();
});

server.listen(3000);
