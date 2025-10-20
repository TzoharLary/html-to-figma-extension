// Unit test for background script
// Note: Chrome APIs are mocked for testing
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    },
    onInstalled: {
      addListener: jest.fn()
    }
  },
  storage: {
    local: {
      set: jest.fn(),
      get: jest.fn()
    }
  }
};

const backgroundScript = require('../src/background/background.js');

test('background script loads without errors', () => {
  expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
});
