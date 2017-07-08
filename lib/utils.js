function isNunjucks (obj) {
  const expectedApi = [
    'render',
    'renderString',
    'addGlobal',
    'getGlobal'
  ];

  return obj && expectedApi.reduce(
    (acc, cur) => acc && Object.keys(Object.getPrototypeOf(obj)).includes(cur),
    true
  );
}

module.exports = {
  isNunjucks
};
