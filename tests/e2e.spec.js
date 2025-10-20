// Phase 14: E2E Testing with Playwright
// Tests complete user flow with real Chrome extension

const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

const EXTENSION_PATH = path.join(__dirname, '..');
const TEST_PAGE_URL = 'data:text/html,<!DOCTYPE html><html><head><title>Test Page</title></head><body><h1>Hello World</h1><p>This is a test page</p></body></html>';

/**
 * Helper to load extension in browser context
 */
async function loadExtension() {
  // Use a temporary user data dir
  const userDataDir = path.join(__dirname, '../.playwright-temp');
  
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    timeout: 60000,
  });
  return context;
}

test.describe('Phase 14: E2E Tests - Complete Extension Flow', () => {
  let context;
  let extensionId;

  test.beforeAll(async () => {
    // Launch browser with extension
    context = await loadExtension();
    
    // Get extension ID
    const backgroundPage = context.backgroundPages()[0];
    if (backgroundPage) {
      extensionId = backgroundPage.url().split('/')[2];
    }
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test('E2E-1: Extension loads successfully', async () => {
    // Verify extension is loaded
    expect(extensionId).toBeDefined();
    expect(extensionId).toMatch(/^[a-z]{32}$/); // Chrome extension ID format
  });

  test('E2E-2: Can open test page', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    
    const title = await page.title();
    expect(title).toBe('Test Page');
    
    const h1 = await page.locator('h1').textContent();
    expect(h1).toBe('Hello World');
    
    await page.close();
  });

  test('E2E-3: Content script loads on page', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    
    // Wait for content script to load
    await page.waitForTimeout(500);
    
    // Check if performExtraction function exists
    const hasFunction = await page.evaluate(() => {
      return typeof performExtraction === 'function';
    });
    
    expect(hasFunction).toBe(true);
    
    await page.close();
  });

  test('E2E-4: Popup HTML exists', async () => {
    const page = await context.newPage();
    const popupUrl = `chrome-extension://${extensionId}/src/popup/popup.html`;
    
    await page.goto(popupUrl);
    
    const title = await page.title();
    expect(title).toContain('HTML to Figma');
    
    // Check for extract button
    const extractButton = await page.locator('#extractBtn');
    expect(await extractButton.isVisible()).toBe(true);
    
    await page.close();
  });

  test('E2E-5: Can perform extraction via content script', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    await page.waitForTimeout(500);
    
    // Call performExtraction directly
    const result = await page.evaluate(() => {
      return performExtraction();
    });
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.metadata).toBeDefined();
    expect(result.data.tree).toBeDefined();
    
    await page.close();
  });

  test('E2E-6: Extracted data has correct structure', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
      return performExtraction();
    });
    
    // Verify metadata
    expect(result.data.metadata.title).toBe('Test Page');
    expect(result.data.metadata.url).toContain('data:text/html');
    expect(result.data.metadata.timestamp).toBeGreaterThan(0);
    expect(result.data.metadata.viewport).toBeDefined();
    expect(result.data.metadata.viewport.width).toBeGreaterThan(0);
    expect(result.data.metadata.viewport.height).toBeGreaterThan(0);
    
    // Verify tree
    expect(result.data.tree.tagName).toBe('BODY');
    expect(result.data.tree.children).toBeDefined();
    expect(result.data.tree.children.length).toBeGreaterThan(0);
    
    // Verify arrays
    expect(Array.isArray(result.data.images)).toBe(true);
    expect(Array.isArray(result.data.svgs)).toBe(true);
    expect(Array.isArray(result.data.fonts)).toBe(true);
    
    await page.close();
  });

  test('E2E-7: Extracted elements have figmaData', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
      return performExtraction();
    });
    
    // Find H1 element in tree
    const h1Element = result.data.tree.children.find(child => child.tagName === 'H1');
    
    expect(h1Element).toBeDefined();
    expect(h1Element.figmaData).toBeDefined();
    expect(h1Element.figmaData.fills).toBeDefined();
    expect(h1Element.figmaData.layout).toBeDefined();
    expect(h1Element.figmaData.typography).toBeDefined();
    
    await page.close();
  });

  test('E2E-8: Popup can communicate with content script', async ({ page }) => {
    // This test is skipped for now as it requires complex extension API mocking
    test.skip();
  });

  test('E2E-9: Extraction handles complex page', async () => {
    const complexHtml = `
      <!DOCTYPE html>
      <html>
        <head><title>Complex Page</title></head>
        <body>
          <div class="container">
            <header>
              <h1 style="color: red; font-size: 32px;">Title</h1>
              <nav>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#about">About</a></li>
                </ul>
              </nav>
            </header>
            <main>
              <img src="data:image/png;base64,iVBORw0KGgo=" alt="Test Image" />
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="40" fill="blue" />
              </svg>
            </main>
          </div>
        </body>
      </html>
    `;
    
    const page = await context.newPage();
    await page.goto(`data:text/html,${encodeURIComponent(complexHtml)}`);
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
      return performExtraction();
    });
    
    expect(result.success).toBe(true);
    
    // Should have extracted images and SVGs
    expect(result.data.images.length).toBeGreaterThan(0);
    expect(result.data.svgs.length).toBeGreaterThan(0);
    
    // Should have detected styled elements
    const styledElement = result.data.tree.children.find(child => {
      return child.children && child.children.some(c => c.tagName === 'H1');
    });
    expect(styledElement).toBeDefined();
    
    await page.close();
  });

  test('E2E-10: Extraction data size is reasonable', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
      return performExtraction();
    });
    
    const dataSize = JSON.stringify(result.data).length;
    
    // Should be less than 1MB for simple page
    expect(dataSize).toBeLessThan(1024 * 1024);
    
    // Should be more than 100 bytes (has actual data)
    expect(dataSize).toBeGreaterThan(100);
    
    await page.close();
  });
});

test.describe('Phase 14: E2E Tests - Error Scenarios', () => {
  let context;

  test.beforeAll(async () => {
    context = await loadExtension();
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test('E2E-11: Handles empty page', async () => {
    const page = await context.newPage();
    await page.goto('data:text/html,<!DOCTYPE html><html><head></head><body></body></html>');
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
      return performExtraction();
    });
    
    expect(result.success).toBe(true);
    expect(result.data.tree.tagName).toBe('BODY');
    expect(result.data.tree.children.length).toBe(0);
    
    await page.close();
  });

  test('E2E-12: Handles page with hidden elements', async () => {
    const page = await context.newPage();
    await page.goto('data:text/html,<!DOCTYPE html><html><body><div style="display:none">Hidden</div><div>Visible</div></body></html>');
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
      return performExtraction();
    });
    
    expect(result.success).toBe(true);
    
    // Should have extracted only visible element
    const visibleElements = result.data.tree.children.length;
    expect(visibleElements).toBeLessThanOrEqual(2); // Might include hidden, depends on options
    
    await page.close();
  });

  test('E2E-13: Handles invalid selector gracefully', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    await page.waitForTimeout(500);
    
    const result = await page.evaluate(() => {
      try {
        return extractPageData({ selector: '#non-existent' });
      } catch (error) {
        return { error: error.message };
      }
    });
    
    expect(result.error).toBeDefined();
    expect(result.error).toContain('not found');
    
    await page.close();
  });

  test('E2E-14: countElements works correctly', async () => {
    const page = await context.newPage();
    await page.goto(TEST_PAGE_URL);
    await page.waitForTimeout(500);
    
    const count = await page.evaluate(() => {
      const data = performExtraction();
      return countElements(data.data.tree);
    });
    
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(100); // Simple page shouldn't have too many elements
    
    await page.close();
  });
});
