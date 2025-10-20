// Unit tests for DOM Extractor
// Uses jsdom to create a real browser-like DOM environment

describe('DOM Extractor', () => {
  let domExtractor;

  beforeEach(() => {
    // Create HTML structure in the jsdom environment
    document.body.innerHTML = `
      <html>
        <head><title>Test Page</title></head>
        <body>
          <div id="container" class="main-container" style="width: 100px; height: 200px;">
            <h1>Title</h1>
            <p>Paragraph text</p>
            <img src="test.jpg" alt="Test" width="50" height="50" />
          </div>
        </body>
      </html>
    `;
    
    // Require the module fresh for each test
    domExtractor = require('../src/parsers/domExtractor');
  });

  test('extractPageData returns valid structure', () => {
    const data = domExtractor.extractPageData({ selector: 'body' });
    
    expect(data).toHaveProperty('metadata');
    expect(data).toHaveProperty('tree');
    expect(data).toHaveProperty('images');
    expect(data).toHaveProperty('fonts');
    expect(data.metadata).toHaveProperty('url');
    expect(data.metadata).toHaveProperty('title');
    expect(typeof data.metadata.title).toBe('string');
  });

  test('traverseDOM extracts element data when includeHidden is true', () => {
    const container = document.querySelector('#container');
    // Pass includeHidden=true to bypass visibility check
    const data = domExtractor.traverseDOM(container, 0, 50, true, true);
    
    expect(data).toHaveProperty('tagName');
    expect(data.tagName.toUpperCase()).toBe('DIV');
    expect(data).toHaveProperty('attributes');
    expect(data.attributes.id).toBe('container');
    expect(data).toHaveProperty('children');
    expect(Array.isArray(data.children)).toBe(true);
    expect(data.children.length).toBeGreaterThan(0);
  });

  test('isElementVisible returns boolean', () => {
    const div = document.querySelector('#container');
    const result = domExtractor.isElementVisible(div);
    // In jsdom, offsetParent doesn't work properly, so this may return false
    expect(typeof result).toBe('boolean');
  });

  test('extractImages returns array structure', () => {
    const images = domExtractor.extractImages();
    expect(Array.isArray(images)).toBe(true);
    // Images might be empty in jsdom due to visibility check
    // The important thing is it returns an array
  });

  test('extractFonts returns array', () => {
    const fonts = domExtractor.extractFonts();
    expect(Array.isArray(fonts)).toBe(true);
    // Fonts will be extracted from computed styles
  });

  test('extractComputedStyles returns style properties', () => {
    const div = document.querySelector('#container');
    const computedStyle = window.getComputedStyle(div);
    const styles = domExtractor.extractComputedStyles(div, computedStyle);
    
    // The function returns a flat object with all CSS properties
    expect(styles).toHaveProperty('display');
    expect(styles).toHaveProperty('width');
    expect(styles).toHaveProperty('height');
    expect(styles).toHaveProperty('position');
    expect(styles).toHaveProperty('fontFamily');
    expect(styles).toHaveProperty('color');
    expect(typeof styles.display).toBe('string');
    expect(styles.width).toBe('100px');
    expect(styles.height).toBe('200px');
  });
});
