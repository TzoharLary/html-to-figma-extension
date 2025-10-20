# Developer Guide - HTML to Figma Chrome Extension

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [API Reference](#api-reference)
6. [Testing Guide](#testing-guide)
7. [Development Workflow](#development-workflow)
8. [Contributing](#contributing)

---

## Architecture Overview

### System Design

The extension follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                 Chrome Extension                     │
├──────────────┬──────────────┬───────────────────────┤
│   Popup UI   │   Content    │   Background Worker   │
│  (popup.js)  │ (content.js) │   (background.js)     │
└──────┬───────┴──────┬───────┴───────┬───────────────┘
       │              │               │
       │   Messages   │   Messages    │
       │◄────────────►│◄─────────────►│
       │              │               │
       │              ▼               │
       │      ┌───────────────┐       │
       │      │  DOM Parsers  │       │
       │      ├───────────────┤       │
       │      │ • CSS Mapper  │       │
       │      │ • HTML Parser │       │
       │      │ • DOM Extract │       │
       │      └───────┬───────┘       │
       │              │               │
       │              ▼               │
       │      ┌───────────────┐       │
       │      │ Data Converters│      │
       │      ├───────────────┤       │
       │      │ • Figma Mapper│       │
       │      │ • Layout Eng. │       │
       │      │ • Image Conv. │       │
       │      └───────┬───────┘       │
       │              │               │
       │              ▼               │
       │      ┌───────────────┐       │
       │      │     Utils     │       │
       │      ├───────────────┤       │
       │      │ • Error Hand. │       │
       │      │ • Helpers     │       │
       │      │ • Token Store │       │
       │      └───────────────┘       │
       │                              │
       └──────────────┬───────────────┘
                      │ JSON Data
                      ▼
              ┌──────────────┐
              │ Figma Plugin │
              │  (code.ts)   │
              └──────────────┘
```

### Key Design Principles

1. **Modularity:** Each component has a single responsibility
2. **Separation of Concerns:** UI, extraction, and conversion are independent
3. **Error Resilience:** Comprehensive error handling at every layer
4. **Performance:** Optimized for large DOMs (1000+ elements)
5. **Testability:** 199 unit tests with 58% coverage

---

## Project Structure

```
.
├── src/                          # Main source code
│   ├── background/               # Service worker
│   │   └── background.js         # Event handling, message routing
│   ├── content/                  # Content script (runs in page context)
│   │   └── content.js            # DOM extraction, main extraction logic
│   ├── popup/                    # Extension popup UI
│   │   ├── popup.html            # Popup interface
│   │   └── popup.js              # Popup logic, user interactions
│   ├── figma/                    # Figma API integration
│   │   └── figmaApi.js           # API wrappers (future use)
│   ├── parsers/                  # Parsing utilities
│   │   ├── cssMapper.js          # CSS → Figma style mapping
│   │   ├── domExtractor.js       # DOM traversal helpers
│   │   └── htmlParser.js         # HTML structure parsing
│   ├── utils/                    # Shared utilities
│   │   ├── errorHandling.js      # Error types, handlers, wrappers
│   │   ├── helpers.js            # Common helper functions
│   │   └── tokenStorage.js       # Figma token storage (future use)
│   └── config/                   # Configuration
│       └── figmaConfig.js        # Figma API config
│
├── figma-plugin/                 # Companion Figma plugin
│   ├── code.ts                   # Main plugin logic (TypeScript)
│   ├── ui.html                   # Plugin UI
│   ├── manifest.json             # Figma plugin manifest
│   ├── package.json              # Plugin dependencies
│   └── tsconfig.json             # TypeScript config
│
├── tests/                        # Test suites
│   ├── content.spec.js           # Content script tests (50 tests)
│   ├── contentExtended.spec.js   # Edge case tests (33 tests)
│   ├── popup.spec.js             # Popup tests (15 tests)
│   ├── background.spec.js        # Background tests (10 tests)
│   ├── cssMapper.spec.js         # CSS mapper tests (20 tests)
│   ├── domExtractor.spec.js      # DOM extractor tests (15 tests)
│   ├── errorHandling.spec.js     # Error handling tests (22 tests)
│   ├── utils.spec.js             # Helper tests (12 tests)
│   └── e2e.spec.js               # E2E tests (14 tests, manual execution)
│
├── docs/                         # Documentation
│   ├── USER_MANUAL.md            # User-facing guide
│   ├── DEVELOPER_GUIDE.md        # This file
│   ├── MANUAL_TESTING.md         # Manual testing checklist
│   ├── PERFORMANCE_PLAN.md       # Optimization strategies
│   ├── architecture.md           # Detailed architecture
│   ├── INTERFACES.md             # Data structure definitions
│   └── PROJECT_CONTEXT.md        # Development history
│
├── manifest.json                 # Chrome extension manifest (V3)
├── package.json                  # Node.js dependencies
├── jest.config.js                # Jest testing configuration
└── README.md                     # Project overview
```

---

## Core Components

### 1. Content Script (`content.js`)

**Purpose:** Extracts DOM data from the active web page.

**Key Functions:**

```javascript
/**
 * Main extraction function - entry point
 * @param {Object} options - Extraction options
 * @param {string} options.selector - CSS selector (default: 'body')
 * @returns {Object} Extraction result with metadata, tree, images, svgs, fonts
 */
function performExtraction(options = {}) { /* ... */ }

/**
 * Recursively traverse DOM and build element tree
 * @param {HTMLElement} element - DOM element to traverse
 * @param {number} depth - Current recursion depth
 * @returns {Object} Element data with children
 */
function traverseDOM(element, depth = 0) { /* ... */ }

/**
 * Extract comprehensive style data from element
 * @param {HTMLElement} element - DOM element
 * @returns {Object} Computed styles object
 */
function extractStyles(element) { /* ... */ }

/**
 * Convert image to base64 data URL
 * @param {HTMLImageElement} img - Image element
 * @returns {Promise<string>} Base64 data URL
 */
async function imageToBase64(img) { /* ... */ }

/**
 * Extract inline SVG markup
 * @param {SVGElement} svg - SVG element
 * @returns {Object} SVG data with markup and dimensions
 */
function extractSVG(svg) { /* ... */ }
```

**Helper Functions:**

```javascript
// Color parsing
function parseColor(colorString) { /* ... */ }

// Gradient detection
function parseGradient(background) { /* ... */ }

// Shadow parsing
function parseBoxShadow(shadowString) { /* ... */ }

// Unit conversion
function convertUnit(value, baseFontSize = 16) { /* ... */ }

// Corner radius
function parseCornerRadius(radiusString) { /* ... */ }

// Image format detection
function detectImageFormat(src) { /* ... */ }
```

---

### 2. CSS Mapper (`cssMapper.js`)

**Purpose:** Maps CSS properties to Figma-compatible styles.

**Key Functions:**

```javascript
/**
 * Map CSS color to Figma RGBA format
 * @param {string} cssColor - CSS color string
 * @returns {Object} { r: 0-1, g: 0-1, b: 0-1, a: 0-1 }
 */
function mapColorToFigma(cssColor) { /* ... */ }

/**
 * Map CSS font properties to Figma typography
 * @param {Object} styles - Computed styles
 * @returns {Object} Figma typography object
 */
function mapTypographyToFigma(styles) { /* ... */ }

/**
 * Map CSS layout to Figma constraints
 * @param {Object} styles - Computed styles
 * @returns {Object} Figma layout constraints
 */
function mapLayoutToFigma(styles) { /* ... */ }

/**
 * Map CSS effects (shadows, blurs) to Figma
 * @param {Object} styles - Computed styles
 * @returns {Array} Figma effects array
 */
function mapEffectsToFigma(styles) { /* ... */ }
```

---

### 3. Error Handling (`errorHandling.js`)

**Purpose:** Centralized error management with categorization and logging.

**Error Types:**

```javascript
// Enum for error types
const ErrorTypes = {
  DOM_EXTRACTION: 'DOM_EXTRACTION',
  IMAGE_PROCESSING: 'IMAGE_PROCESSING',
  FIGMA_API: 'FIGMA_API',
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  PARSING: 'PARSING',
  PERMISSION: 'PERMISSION',
  UNKNOWN: 'UNKNOWN',
};

// Severity levels
const ErrorSeverity = {
  LOW: 'low',          // Ignorable, log only
  MEDIUM: 'medium',    // Recoverable, warn user
  HIGH: 'high',        // Requires user action
  CRITICAL: 'critical' // Fatal, abort operation
};
```

**Error Handler Class:**

```javascript
class ErrorHandler {
  /**
   * Create error handler instance
   * @param {Object} options - Configuration
   * @param {boolean} options.enableLogging - Enable console logs
   * @param {Function} options.onError - Custom error callback
   */
  constructor(options = {}) { /* ... */ }

  /**
   * Handle error with categorization
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  handleError(error, context = {}) { /* ... */ }

  /**
   * Get error statistics
   * @returns {Object} Error counts by type and severity
   */
  getStatistics() { /* ... */ }

  /**
   * Clear error history
   */
  clearHistory() { /* ... */ }
}
```

**Custom Error Classes:**

```javascript
class DOMExtractionError extends Error { /* ... */ }
class ImageProcessingError extends Error { /* ... */ }
class FigmaAPIError extends Error { /* ... */ }
```

**Utility Wrapper:**

```javascript
/**
 * Wrap async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function
 */
function withErrorHandling(fn, options = {}) { /* ... */ }

// Usage example:
const safeExtraction = withErrorHandling(performExtraction, {
  errorType: ErrorTypes.DOM_EXTRACTION,
  severity: ErrorSeverity.HIGH,
  fallbackValue: { success: false, error: 'Extraction failed' }
});
```

---

### 4. Popup UI (`popup.js`)

**Purpose:** User interface for triggering extraction.

**Key Functions:**

```javascript
/**
 * Initialize popup UI
 */
function initPopup() { /* ... */ }

/**
 * Send message to content script
 * @param {string} action - Action name
 * @param {Object} data - Message data
 * @returns {Promise<Object>} Response from content script
 */
async function sendMessageToContent(action, data = {}) { /* ... */ }

/**
 * Display extraction results in popup
 * @param {Object} result - Extraction result
 */
function displayResults(result) { /* ... */ }

/**
 * Copy data to clipboard
 * @param {string} text - Text to copy
 */
async function copyToClipboard(text) { /* ... */ }
```

---

### 5. Background Worker (`background.js`)

**Purpose:** Handle extension events and message routing.

**Key Functions:**

```javascript
/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener(() => { /* ... */ });

/**
 * Handle messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { /* ... */ });

/**
 * Handle browser action clicks
 */
chrome.action.onClicked.addListener((tab) => { /* ... */ });
```

---

## Data Flow

### Extraction Flow

```
1. User clicks "Extract Page" in popup
   ↓
2. Popup sends message to content script
   {action: 'extract', options: {...}}
   ↓
3. Content script calls performExtraction()
   ↓
4. traverseDOM() recursively walks the DOM
   ↓
5. For each element:
   - extractStyles() gets computed styles
   - mapToFigmaData() converts to Figma format
   - Children are recursively processed
   ↓
6. Images are converted to base64
   ↓
7. SVGs are extracted with markup
   ↓
8. Fonts are detected and collected
   ↓
9. Complete data structure assembled:
   {
     success: true,
     data: {
       metadata: {...},
       tree: {...},
       images: [...],
       svgs: [...],
       fonts: [...]
     }
   }
   ↓
10. Data sent back to popup
    ↓
11. Popup copies JSON to clipboard
    ↓
12. User pastes in Figma plugin
    ↓
13. Plugin creates design elements
```

---

## API Reference

### Data Structures

See [INTERFACES.md](./INTERFACES.md) for complete data structure definitions.

**Key Interfaces:**

```typescript
// Extraction result
interface ExtractionResult {
  success: boolean;
  data?: ExtractedPageData;
  error?: string;
  stats?: {
    elementsCount: number;
    imagesCount: number;
    svgsCount: number;
    fontsCount: number;
    executionTime: number;
  };
}

// Page data
interface ExtractedPageData {
  metadata: PageMetadata;
  tree: ElementNode;
  images: ImageData[];
  svgs: SVGData[];
  fonts: FontData[];
}

// Element node
interface ElementNode {
  tagName: string;
  id?: string;
  className?: string;
  textContent?: string;
  attributes: Record<string, string>;
  styles: ComputedStyles;
  figmaData: FigmaNodeData;
  children: ElementNode[];
}

// Figma node data
interface FigmaNodeData {
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'IMAGE' | 'SVG';
  name: string;
  layout: LayoutData;
  fills: Fill[];
  strokes: Stroke[];
  effects: Effect[];
  typography?: Typography;
  constraints?: Constraints;
}
```

---

## Testing Guide

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific suite
npm test -- tests/content.spec.js

# Watch mode
npm test -- --watch

# Verbose output
npm test -- --verbose
```

### Test Structure

```javascript
// tests/example.spec.js
describe('Module Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('Function Name', () => {
    test('should do something', () => {
      // Arrange
      const input = {...};
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe(expectedValue);
    });

    test('should handle edge case', () => {
      // ...
    });
  });
});
```

### Writing New Tests

1. **Create test file:** `tests/myModule.spec.js`
2. **Import module:**
   ```javascript
   const myModule = require('../src/utils/myModule.js');
   ```
3. **Mock dependencies:**
   ```javascript
   jest.mock('../src/utils/dependency.js');
   ```
4. **Write test cases:**
   ```javascript
   test('should handle input correctly', () => {
     expect(myModule.myFunction('input')).toBe('expected');
   });
   ```
5. **Run tests:** `npm test -- tests/myModule.spec.js`

### Coverage Goals

- **Target:** 80% overall coverage
- **Current:** 58.34%
- **Priority areas:**
  - content.js: 57% → 80%
  - popup.js: Not yet tested → 70%
  - background.js: Not yet tested → 70%

---

## Development Workflow

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/yourusername/figma-chrome-extension.git
cd figma-chrome-extension

# Install dependencies
npm install

# Install Figma plugin dependencies
cd figma-plugin
npm install
cd ..
```

### Development Cycle

1. **Make Changes**
   - Edit source files in `src/`
   - Follow ESLint rules (if configured)
   - Add JSDoc comments to functions

2. **Write Tests**
   - Add test cases in `tests/`
   - Ensure new code is tested
   - Run tests: `npm test`

3. **Manual Testing**
   - Load extension in Chrome (`chrome://extensions/`)
   - Click "Reload" button on extension card
   - Test on various websites
   - Check console for errors (F12)

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in extraction"
   ```

5. **Push & Create PR**
   ```bash
   git push origin feature-branch
   # Create pull request on GitHub
   ```

### Code Style

```javascript
// Use JSDoc comments
/**
 * Extracts data from DOM element
 * @param {HTMLElement} element - DOM element
 * @param {Object} options - Extraction options
 * @returns {Object} Extracted data
 */
function extractData(element, options = {}) {
  // Use descriptive variable names
  const computedStyle = window.getComputedStyle(element);
  
  // Early returns for error cases
  if (!element) {
    return null;
  }
  
  // Use const/let, not var
  const result = {};
  
  // Return meaningful data
  return result;
}
```

### Debugging Tips

1. **Console Logging:**
   ```javascript
   console.log('[Extension] Extraction started', options);
   ```

2. **Breakpoints:**
   - Open DevTools (F12)
   - Go to Sources tab
   - Find extension files under "Content Scripts"
   - Set breakpoints

3. **Chrome Extension Logs:**
   - Background worker: `chrome://extensions/` → "Inspect views: service worker"
   - Popup: Right-click extension icon → Inspect
   - Content script: F12 on any page

4. **Performance Profiling:**
   ```javascript
   console.time('extraction');
   performExtraction();
   console.timeEnd('extraction');
   ```

---

## Contributing

### Contribution Guidelines

1. **Fork & Branch**
   - Fork the repository
   - Create a feature branch: `git checkout -b feature/amazing-feature`

2. **Code Standards**
   - Follow existing code style
   - Add JSDoc comments
   - Write tests for new code
   - Ensure all tests pass

3. **Commit Messages**
   ```
   feat: add new feature
   fix: resolve bug
   docs: update documentation
   test: add tests
   refactor: restructure code
   perf: improve performance
   ```

4. **Pull Request**
   - Describe changes clearly
   - Reference issues: "Closes #123"
   - Wait for code review
   - Address feedback

### Testing Requirements

- All new functions must have unit tests
- Test coverage should not decrease
- Manual testing on 3+ websites required
- No console errors or warnings

### Review Process

1. Automated checks (tests, linting)
2. Code review by maintainer
3. Manual testing verification
4. Merge when approved

---

## Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [Project Architecture](./architecture.md)
- [Data Interfaces](./INTERFACES.md)

---

**Last Updated:** [Current Date]  
**Maintainer:** [Your Name]  
**License:** MIT
