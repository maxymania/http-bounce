http-bounce
===========

A HTTP based client to client file transfer protocol utilizing a HTTP server

This project contains the reference implementation and the documentation (if any).

# How it works

Say, we have two clients: client 1 and client 2. Client 1 wants to send a binary file to client 2.
Both clients choose a shared id: `hq9xv2b43bj23kkmbc_8`.

- Client 1 sends a PUT request to `http://example.host/bounce-api/hq9xv2b43bj23kkmbc_8` with the body containing the binary file.
- Client 2 sends a GET request to `http://example.host/bounce-api/hq9xv2b43bj23kkmbc_8`.
- The Content client 2 receives is the binary file.

It has to work, no matter wich of the both requests (GET and PUT) emerges first.

# bounce.js

This is the reference implementation of the mechanism.

```js
var http = require('http');
var bounce = require('./bounce.js');

var server = http.createServer(bounce.createBounce('/bounce-api'));

server.listen(8080);
```
