const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs-extra'));

module.exports = function (nunjucks) {
 return function renderFile (filename, data, location='') {

  const content = nunjucks.render(`${filename}`, data);

  return fs.writeFileAsync(path.resolve(location, filename), content)
    .then(() => console.log(`✓ Generated ${filename}`));
  } 

}
