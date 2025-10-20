// Unit tests for storage utilities
const storage = require('../src/utils/tokenStorage');

// Mock chrome.storage.local
global.chrome = {
  storage: {
    local: {
      set: jest.fn((items, callback) => callback && callback()),
      get: jest.fn((keys, callback) => callback && callback({})),
      remove: jest.fn((keys, callback) => callback && callback())
    }
  },
  runtime: {
    lastError: null
  }
};

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    chrome.runtime.lastError = null;
  });

  test('storeExtraction stores extraction data', async () => {
    const extraction = { url: 'https://example.com', elements: 10 };
    await storage.storeExtraction(extraction);
    expect(chrome.storage.local.set).toHaveBeenCalled();
  });

  test('storeExtraction rejects invalid data', async () => {
    await expect(storage.storeExtraction(null)).rejects.toThrow('Invalid extraction');
  });

  test('getExtractionHistory retrieves history', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ extraction_history: [{ url: 'test.com' }] });
    });
    
    const history = await storage.getExtractionHistory();
    expect(Array.isArray(history)).toBe(true);
  });

  test('clearHistory removes all history', async () => {
    await storage.clearHistory();
    expect(chrome.storage.local.remove).toHaveBeenCalled();
  });

  test('storePreferences stores preferences', async () => {
    await storage.storePreferences({ theme: 'dark' });
    expect(chrome.storage.local.set).toHaveBeenCalled();
  });

  test('getPreferences retrieves preferences', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ user_preferences: { theme: 'dark' } });
    });
    
    const prefs = await storage.getPreferences();
    expect(typeof prefs).toBe('object');
  });
});
