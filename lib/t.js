const fs = require('fs');
const path = require('path');
const nj = require('nunjucks');
const nunjucks = nj.configure('../fixtures');
const renderFile = require('./renderFile.js')(nunjucks);


  let tmpDir;

  tmpDir = fs.mkdtempSync(path.normalize(`${__dirname}/.tmp`));

  console.log('tmpDir', tmpDir);
  console.log('render', nunjucks.render('test-template.html', {}))

  renderFile('test-template.html', {}, tmpDir).then(() => {
    console.log('destDir', (path.resolve(tmpDir, 'test-template.html')));
    console.log(fs.existsSync(path.resolve(tmpDir, 'test-template.html')));
  });

//fs.rmdirSync(tmpDir);
