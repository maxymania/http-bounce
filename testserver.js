
var http = require('http');
var bounce = require('./bounce.js');

var server = http.createServer(bounce.createBounce(''));

server.listen(8080);
