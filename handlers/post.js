const Router = require('router');

const router = Router();

module.exports = router;

const renderTemplate = require('../renderTemplate');

const P = require('bluebird');

const storage = {};

const posts = {
    add: function (id, data) {
        storage[id] = data;
        return Promise.resolve(data);

    },
    get: function (id) {
        return Promise.resolve(storage[id]);
    },
    all: function () {
        return Promise.resolve(storage);
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
