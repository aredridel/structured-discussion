const fs = require('fs');
const path = require('path');
const ejs = require('ejs')
const bl = require('bl');

module.exports = function renderTemplate(go) {
    return function (req, res, next) {
        res.setHeader('content-type',  'text/html; charset=utf-8');
        try {
            go(req, res, function render(template, data) {
                const filename = path.resolve(__dirname, 'templates', template + '.ejs');
                fs.createReadStream(filename).pipe(bl((err, buf) => {
                    if (err) {
                        next(err);
                    } else {
                        res.end(ejs.render(buf.toString(), data, { filename }));
                    }
                }))
            }, next);
        } catch(e) {
            next(e);
        }
    };
}

