// Unit test for HTML parser
const { parseHTML, parseCSS } = require('../src/parsers/htmlParser');

test('parseHTML returns object', () => {
  const result = parseHTML('<div></div>');
  expect(typeof result).toBe('object');
});

test('parseCSS returns object', () => {
  const result = parseCSS('div { color: red; }');
  expect(typeof result).toBe('object');
});
