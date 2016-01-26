const Router = require('router');

const router = Router();

module.exports = router;

const renderTemplate = require('../renderTemplate');

const uuid = require('uuid');
router.get('/post', renderTemplate(function (req, res, render) {
    render('post', { uuid: uuid() });
}));

const bodyParser = require('body-parser');
router.post('/post/:id', bodyParser.urlencoded({extended: false}), function (req, res) {
    res.end(JSON.stringify({body: req.body, params: req.params }));
});
