"use strict";
const P = require('bluebird');
const path = require('path');
const fs = P.promisifyAll(require('fs'));

module.exports = function createStorage(type) {

    const dataPath = path.resolve(__dirname, 'data', type + '.json')

    let storage = fs.readFileAsync(dataPath, 'utf-8').then(JSON.parse).catch(err => {
        if (err.code = 'ENOENT') return {};
        throw err;
    });

    return {
        add: function (id, data) {
            storage = storage.then(all => {
                all[id] = data;
                return all;
            })

            return storage.then(JSON.stringify).then(all => fs.writeFileAsync(dataPath, all)).then(() => data)
        },
        get: function (id) {
            return storage.then(all => all[id]);
        },
        all: function () {
            return storage;
        }
    };
};
