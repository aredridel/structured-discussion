const router = module.exports = require('router')();

const posts = require('../storage')('posts');

const uuid = require('uuid');
const renderTemplate = require('../renderTemplate');
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
