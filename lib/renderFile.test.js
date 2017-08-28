const fs = require('fs-extra');
const path = require('path');
const nj = require('nunjucks');
const nunjucks = nj.configure('fixtures');
const renderFileFactory = require('./renderFile.js');
const renderFile = renderFileFactory(nunjucks);

describe('renderFileFactory', () => {
  it('should throw if not passed a nunjucks environment', () => {
    expect(() => renderFileFactory()).toThrow();
    expect(() => renderFileFactory(nunjucks)).not.toThrow();
  });
});

describe('renderFile', () => {

  const templateName = 'test-template.html';
  let tmpDir;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.normalize(`${__dirname}/.tmp`));
  });

  afterAll(() => {
    fs.removeSync(tmpDir);
  });

  it('should call nunjucks.render with the file name and data', () => {
    const render = jest.spyOn(nunjucks, 'render');
    const data = {};
    return renderFile(templateName, data, tmpDir).then(() => {
      expect(render).toHaveBeenCalledTimes(1);
      expect(render).toHaveBeenCalledWith(templateName, data);
      render.mockReset();
      render.mockRestore();
    });
  });

  it('should create a new file', () => {
    return renderFile(templateName, {}, tmpDir).then(() => {
      expect(fs.existsSync(path.resolve(tmpDir, templateName))).toBe(true);
    });
  });

  it('should resolve a success message', () => {
    return expect(renderFile(templateName, {}, tmpDir)).resolves.toBeDefined();
  });

  it('should reject if the template does not exist', () => {
    return expect(renderFile('bad template', {}, tmpDir)).rejects.toBeDefined();
  });

  it('should reject if the file cannot be created', () => {
    return expect(renderFile(templateName, {}, 5)).rejects.toBeDefined();
  });
});
