const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const config = {};
const basename = path.basename(module.filename);

/**
 * load all config variables in memory
 *
 * @return {[type]} [description]
 */
const init = () => {
  fs.readdirSync(path.join(__dirname))
    .filter(file => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach(file => {
      let importPath = path.join(__dirname, file);

      const c = require(importPath);
      const key = file.replace('.js', '');
      config[key] = c;
    });
};

init();

module.exports = config;
