const Router = require('router');

const router = Router();

module.exports = router;

router.get('/', sendHTML('index.html'));

const fs = require('fs');
const path = require('path');
function sendHTML(template) {
    return (req, res) => {
        res.setHeader('content-type',  'text/html; charset=utf-8');
        fs.createReadStream(path.resolve(__dirname, '..', 'templates', template)).pipe(res);
    }
}

