const Router = require('router');

const router = Router();

module.exports = router;

const renderTemplate = require('../renderTemplate');

const P = require('bluebird');

const path = require('path');
const fs = P.promisifyAll(require('fs'));

const dataPath = path.resolve(__dirname, '..', 'data', 'data.json')

let storage = fs.readFileAsync(dataPath, 'utf-8').then(JSON.parse).catch(err => { 
    if (err.code = 'ENOENT') return {};
    throw err;
});

const posts = {
    add: function (id, data) {
        return storage.then(all => {
            all[id] = data;
            storage = Promise.resolve(storage);
            return all;
        }).then(JSON.stringify).then(all => fs.writeFileAsync(dataPath, all)).then(() => data)
    },
    get: function (id) {
        return storage.then(all => all[id]);
    },
    all: function () {
        return storage;
    }
};

const uuid = require('uuid');
router.get('/post', renderTemplate(function (req, res, render) {
    render('post', { uuid: uuid() });
}));

const bodyParser = require('body-parser');
router.post('/post/:id', bodyParser.urlencoded({extended: false}), function (req, res, next) {
    posts.get(req.params.id).then(assertEmpty).then(() => posts.add(req.params.id, req.body)).then(() => res.end("YAY!"), next);
});

router.get('/posts', (req, res) => {
    posts.all().then(posts => res.end(JSON.stringify(posts, null, 3)))
});

function assertEmpty(post) {
    if (post) throw new Error("That post has already been made");
}
