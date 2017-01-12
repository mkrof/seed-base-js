const inquirer = require('inquirer');
const path = require('path');

const questions = [{
  name: 'projectName',
  message: 'Project name: ',
  default: process.cwd().split(path.sep).pop()
}];

inquirer.prompt(questions).then(scaffold);

function scaffold (answers) {
  console.log(answers);
}
