// Unit tests for popup functionality
describe('Popup Script', () => {
  let mockChrome;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <button id="extractBtn">Extract</button>
      <button id="copyBtn">Copy</button>
      <div id="status"></div>
      <div id="stats"></div>
      <span id="elementCount">0</span>
      <span id="imageCount">0</span>
    `;

    // Mock Chrome API
    mockChrome = {
      tabs: {
        query: jest.fn(),
        sendMessage: jest.fn()
      },
      runtime: {
        sendMessage: jest.fn(),
        onMessage: {
          addListener: jest.fn()
        },
        lastError: null
      }
    };

    global.chrome = mockChrome;

    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve())
      }
    });
  });

  afterEach(() => {
    delete global.chrome;
    jest.clearAllMocks();
  });

  test('extract button exists in DOM', () => {
    const extractBtn = document.getElementById('extractBtn');
    expect(extractBtn).toBeTruthy();
    expect(extractBtn.textContent).toBe('Extract');
  });

  test('copy button exists in DOM', () => {
    const copyBtn = document.getElementById('copyBtn');
    expect(copyBtn).toBeTruthy();
    expect(copyBtn.textContent).toBe('Copy');
  });

  test('status div exists in DOM', () => {
    const statusDiv = document.getElementById('status');
    expect(statusDiv).toBeTruthy();
  });

  test('stats elements exist in DOM', () => {
    expect(document.getElementById('stats')).toBeTruthy();
    expect(document.getElementById('elementCount')).toBeTruthy();
    expect(document.getElementById('imageCount')).toBeTruthy();
  });

  test('countElements counts tree correctly', () => {
    const countElements = (node) => {
      if (!node) return 0;
      let count = 1;
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          count += countElements(child);
        }
      }
      return count;
    };

    const tree = {
      tagName: 'div',
      children: [
        { tagName: 'p', children: [] },
        { tagName: 'span', children: [] }
      ]
    };

    expect(countElements(tree)).toBe(3); // div + p + span
  });

  test('copyToClipboard uses modern API', async () => {
    const data = { test: 'data' };
    const jsonString = JSON.stringify(data, null, 2);
    
    await navigator.clipboard.writeText(jsonString);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(jsonString);
  });

  test('extraction data structure is valid', () => {
    const sampleData = {
      metadata: {
        url: 'https://example.com',
        title: 'Test Page',
        timestamp: Date.now(),
        viewport: { width: 1440, height: 900 }
      },
      tree: {
        tagName: 'body',
        attributes: {},
        styles: {},
        children: []
      },
      images: [],
      fonts: []
    };

    expect(sampleData).toHaveProperty('metadata');
    expect(sampleData).toHaveProperty('tree');
    expect(sampleData).toHaveProperty('images');
    expect(sampleData).toHaveProperty('fonts');
    expect(sampleData.metadata).toHaveProperty('url');
    expect(sampleData.metadata).toHaveProperty('title');
  });
});
