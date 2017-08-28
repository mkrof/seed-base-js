const Promise = require('bluebird');
const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils');
const messages = require('./messages');

module.exports = function renderFileFactory (nunjucks) {
  if (!utils.isNunjucks(nunjucks)) {
    throw new Error('A nunjucks Environment is required.');
  }
  return function renderFile (fileName, data, location='') {
    return new Promise((resolve, reject) => {
      try {
        const content = nunjucks.render(`${fileName}`, data);
        fs.writeFileSync(path.resolve(location, fileName), content)
        resolve(messages.success.fileGenerated(fileName, location));
      } catch (err) {
        reject(err);
      }
    });
  }
};
