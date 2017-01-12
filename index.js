const path = require('path');
const inquirer = require('inquirer');
const nunjucks = require('nunjucks');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));

const config = {
  paths: {
    templateDirectory: `${__dirname}/tpl`
  },
  questions: [{
    name: 'projectName',
    message: 'Project name: ',
    default: process.cwd().split(path.sep).pop()
  }]
};

nunjucks.configure(config.paths.templateDirectory);

inquirer.prompt(config.questions)
  .then(scaffold)
  .then(() => console.log('Finished.'), err => console.log(`✖ ${err}`));

function scaffold (answers) {
  return Promise.all([
    copyFile('.babelrc'),
    renderFile('package.json', answers)
  ])
}

function renderFile (filename, data) {
  return fs.writeFileAsync(filename, nunjucks.render(`${filename}`, data))
    .then(() => console.log(`✓ Generated ${filename}`));
}

function copyFile (filename) {
  return fs.copyAsync(`${config.paths.templateDirectory}/${filename}`, filename)
    .then(() => console.log(`✓ Copied ${filename}`))
}
