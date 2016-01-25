'use strict'

const http = require('http');
P.promisifyAll(http.Server.prototype);

const Router = require('router');

const P = require('bluebird');

const router = Router();

const server = http.createServer((req, res) => router(req, res, () => done(req, res)));

server.listenAsync(process.env.PORT || 3880).then(() => logPort(server), logErrorAndExit);

function logPort(server) {
    console.log("listening on port", server.address().port);
}

function logErrorAndExit(err) {
    console.warn(err);
    process.exit(1);
}

function done(req, res) {
    res.statusCode = 404;
    res.end('not found\n');
}
