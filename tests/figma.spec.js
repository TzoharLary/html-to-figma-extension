// Unit test for Figma API integration
const { sendToFigma, authenticateFigma } = require('../src/figma/figmaApi');

test('sendToFigma is a function', () => {
  expect(typeof sendToFigma).toBe('function');
});

test('authenticateFigma is a function', () => {
  expect(typeof authenticateFigma).toBe('function');
});
