'use strict'

const P = require('bluebird');

const http = require('http');
P.promisifyAll(http.Server.prototype);

const Router = require('router');

const router = Router();


const uuid = require('uuid');
router.get('/post', renderTemplate(function (req, res, render) {
    render('post', { uuid: uuid() });
}));

const bodyParser = require('body-parser');
router.post('/post', bodyParser.urlencoded({extended: false}), function (req, res) {
    res.end(JSON.stringify(req.body));
});

router.get('/', sendHTML('index.html'));

const server = http.createServer((req, res) => router(req, res, (err) => done(err, req, res)));

server.listenAsync(process.env.PORT || 3880).then(() => logPort(server), logErrorAndExit);

function logPort(server) {
    console.log("listening on port", server.address().port);
}

function logErrorAndExit(err) {
    console.warn(err);
    process.exit(1);
}

function done(err, req, res) {
    if (err) {
        res.end(String(err.stack || err));
        res.statusCode = 500;
    } else {
        res.statusCode = 404;
        res.end('not found\n');
    }
}

const fs = require('fs');
const path = require('path');
function sendHTML(template) {
    return (req, res) => {
        res.setHeader('content-type',  'text/html; charset=utf-8');
        fs.createReadStream(path.resolve(__dirname, 'templates', template)).pipe(res);
    }
}

const ejs = require('ejs')
const bl = require('bl');
function renderTemplate(go) {
    return function (req, res, next) {
        res.setHeader('content-type',  'text/html; charset=utf-8');
        try {
            go(req, res, function render(template, data) {
                const filename = path.resolve(__dirname, 'templates', template + '.ejs');
                fs.createReadStream(filename).pipe(bl((err, buf) => {
                    res.end(ejs.render(buf.toString(), data, { filename }));
                })).on('error', next)
            }, next);
        } catch(e) {
            next(e);
        }
    };
}
