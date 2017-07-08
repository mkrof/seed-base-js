const nunjucks = require('nunjucks');
const utils = require('./utils');
const env = nunjucks.configure('.');

describe('utils', () => {
  describe('isNunjucks', () => {
    it('should return true when provided a valid object', () => {
      expect(utils.isNunjucks(env)).toBe(true);
      expect(utils.isNunjucks({})).toBe(false);
    });
  });
});
