const fs = require('fs-extra');
const path = require('path');
const nj = require('nunjucks');
const nunjucks = nj.configure('fixtures');
const renderFile = require('./renderFile.js')(nunjucks);

describe('renderFile', () => {

  let tmpDir;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.normalize(`${__dirname}/.tmp`));
  });

  afterAll(() => {
    fs.removeSync(tmpDir);
  });

  it('should create a new file', () => {
    return renderFile('test-template.html', {a:1}, tmpDir).then(() => {
      expect(fs.existsSync(path.resolve(tmpDir, 'test-template.html'))).toBe(true);
    });
  });

});
