"use strict";

const path = require('path');
const utils = require('../utils');
const fs = require('fs');
const PATH = __dirname;

function init(sequelize) {

    let files = fs.readdirSync(PATH);
    let exclude = ['index.js'];

    utils.removeAll(exclude, files);

    files.forEach(function (file) {
        if (!fs.statSync(path.join(PATH, file)).isDirectory()) {
            file = file.split('.')[0];
            require(`./${file}`)(sequelize);
        }
    });
}

module.exports.init = init;