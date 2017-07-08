const Promise = require('bluebird');
const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils');


module.exports = function renderFileFactory (nunjucks) {
  if (!utils.isNunjucks(nunjucks)) {
    throw new Error('A nunjucks Environment is required.');
  }
  return function renderFile (filename, data, location='') {
    return new Promise((resolve, reject) => {

      try {
        const content = nunjucks.render(`${filename}`, data);
        fs.writeFileSync(path.resolve(location, filename), content)
      } catch (err) {
        reject(err);
      }

      console.log(`✓ Generated ${filename}`);
      resolve();
    });
  }
}
