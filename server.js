const http = require('http');
const app = require('./app');

const port = process.env.PORT ||  3000;
// Port at which the server should run

const server = http.createServer(app);

server.listen(port);