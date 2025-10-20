// Unit test for content script
// Note: Chrome APIs are mocked for testing
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  }
};

const contentScript = require('../src/content/content.js');

test('content script loads without errors', () => {
  expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
});
