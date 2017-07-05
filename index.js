const path = require('path');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const nj = require('nunjucks');
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

const nunjucks = nj.configure(config.paths.templateDirectory);

const renderFile = require('./lib/renderFile')(nunjucks);

inquirer.prompt(config.questions)
  .then(scaffold)
  .then(() => console.log('Finished.'), err => console.log(`✖ ${err}`));

function scaffold (answers) {

  mkdirp('Scripts/src/components');
  mkdirp('Scripts/src/utils');
  mkdirp('Styles/src/components');
  mkdirp('ui/src/components');
  mkdirp('ui/src/layouts');
  mkdirp('ui/src/pages');
  mkdirp('ui/assets');
  mkdirp('ui/build');

  return Promise.all([
    copyFile('.gitignore'),
    copyFile('.babelrc'),
    copyFile('.tern-project'),
    renderFile('package.json', answers)
  ]);
}


function copyFile (filename) {
  return fs.copyAsync(`${config.paths.templateDirectory}/${filename}`, filename)
    .then(() => console.log(`✓ Copied ${filename}`));
}
