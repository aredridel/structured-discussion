'use strict'

const http = require('http');
const Router = require('router');
const P = require('bluebird');

P.promisifyAll(http.Server.prototype);

const router = Router();

function done(req, res) {
    res.statusCode = 404;
    res.end('not found\n');
}

const server = http.createServer((req, res) => router(req, res, () => done(req, res)));

server.listenAsync(process.env.PORT || 3880).then(x => console.log("listening on port", server.address().port)).catch(err => {
    console.warn(err);
    process.exit(1);
});
