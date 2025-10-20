// Unit test for utils
const { formatData, log } = require('../src/utils/helpers');

test('formatData returns string', () => {
  const result = formatData({ a: 1 });
  expect(typeof result).toBe('string');
});

test('log is a function', () => {
  expect(typeof log).toBe('function');
});
