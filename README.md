# html-to-figma-extension

# HTML to Figma Chrome Extension

🚀 **Extract any website and convert it to Figma designs instantly**

A powerful Chrome extension that analyzes web pages and converts them into editable Figma designs, preserving layout, typography, colors, images, and SVG graphics.

[![Tests Passing](https://img.shields.io/badge/tests-199%20passing-success)](./tests)
[![Coverage](https://img.shields.io/badge/coverage-58.34%25-yellow)](./coverage)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## ✨ Features

- 🎨 **Complete Visual Extraction** - Captures layout, typography, colors, borders, shadows, and effects
- 📐 **Advanced Layout Detection** - Supports CSS Grid, Flexbox, absolute positioning, and z-index layering
- 🖼️ **Image & SVG Support** - Extracts images with base64 conversion and preserves inline SVG graphics
- 📝 **Typography Mapping** - Detects fonts, weights, sizes, line height, letter spacing, and text decorations
- 🎯 **Smart Element Selection** - Choose specific elements or extract the entire page
- 🔄 **Direct Figma Integration** - Companion Figma plugin receives extracted data and creates designs
- ⚡ **Fast & Efficient** - Optimized extraction with error handling and performance monitoring
- 🛡️ **Robust Error Handling** - Gracefully handles edge cases, CORS issues, and invalid data

## 🚀 Quick Start

> **⚡ [5-Minute Quick Start](./QUICK_START.md)** - Get started in 5 minutes!  
> **📖 [Visual Step-by-Step Guide](./docs/QUICK_START_VISUAL_GUIDE.md)** - Complete installation and usage guide with ASCII diagrams!

### Installation

#### From Chrome Web Store (Recommended)
1. Visit [Chrome Web Store](#) (Coming Soon)
2. Click "Add to Chrome"
3. Grant necessary permissions

#### Manual Installation (Developer Mode)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/figma-chrome-extension.git
   cd figma-chrome-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Verify setup** (optional but recommended):
   ```bash
   ./setup-check.sh
   # This script checks all files are present and provides next steps
   ```

4. Load extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the project directory

5. Install Figma Plugin:
   - Open Figma Desktop (not browser!)
   - `Plugins` → `Development` → `Import plugin from manifest...`
   - Select `figma-plugin/manifest.json`

### Usage

1. **Navigate to any website** you want to extract
2. **Click the extension icon** in Chrome toolbar
3. **Click "Extract Page"** button in the popup
4. **Wait for extraction** to complete (status shows progress)
5. **JSON is automatically copied** to clipboard
6. **Open Figma Desktop** and run the companion plugin (`Plugins` → `Development` → `HTML to Figma`)
7. **Paste the JSON** (should be auto-pasted) and click "Create Design"
8. **Your design is ready!** Edit, refine, and export

> **💡 First time?** Try it on [example.com](https://example.com) - takes only 1-2 seconds!

## 📚 Documentation

### 🎯 Getting Started
- **[Quick Start Visual Guide](./docs/QUICK_START_VISUAL_GUIDE.md)** - 🆕 Step-by-step with ASCII screenshots!
- **[User Manual](./docs/USER_MANUAL.md)** - Complete installation, usage, troubleshooting, and FAQ

### 👨‍💻 For Developers
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Architecture, API reference, testing, and contribution guidelines
- **[Architecture Diagram](./docs/ARCHITECTURE_DIAGRAM.md)** - Visual system design with flow diagrams
- **[Interfaces](./docs/INTERFACES.md)** - Data structures and API contracts

### 🧪 Testing & Quality
- **[Manual Testing Guide](./docs/MANUAL_TESTING.md)** - Step-by-step testing instructions
- **[Performance Plan](./docs/PERFORMANCE_PLAN.md)** - Optimization strategies and benchmarks
- **[Final QA Checklist](./docs/FINAL_QA_CHECKLIST.md)** - Complete launch preparation checklist

### 📊 Project Management
- **[Project Status](./docs/PROJECT_STATUS.md)** - Current development status and progress
- **[Chrome Web Store Listing](./docs/CHROME_WEB_STORE_LISTING.md)** - Store submission guide

## 🧪 Testing

This project has comprehensive test coverage with **199 unit tests** across all components.

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test suite
npm test -- tests/content.spec.js

# Watch mode for development
npm test -- --watch
```

### Test Coverage
- **Overall:** 58.34%
- **content.js:** 57% (core extraction logic)
- **errorHandling.js:** 82% (error utilities)
- **utils/helpers.js:** 83% (utility functions)
- **parsers:** 83% (CSS and DOM parsing)

### Test Categories
- ✅ **Unit Tests:** 199 tests covering all functions
- ✅ **Integration Tests:** Popup, content script, background communication
- ✅ **Edge Cases:** Color parsing, gradients, shadows, unit conversion, image formats
- ⚠️ **E2E Tests:** Manual testing recommended (see [MANUAL_TESTING.md](./docs/MANUAL_TESTING.md))

## 📦 Project Structure

```
├── src/
│   ├── background/        # Service worker (event handling)
│   ├── content/           # Content script (DOM extraction)
│   ├── popup/             # Extension popup UI
│   ├── figma/             # Figma API integration
│   ├── parsers/           # CSS and HTML parsers
│   ├── utils/             # Helpers and error handling
│   └── config/            # Configuration files
├── figma-plugin/          # Companion Figma plugin
├── tests/                 # Test suites (199 tests)
├── docs/                  # Documentation
└── coverage/              # Test coverage reports
```

## 🔧 Development

### Prerequisites
- Node.js 16+
- Chrome Browser
- Figma Desktop (for plugin testing)

### Setup Development Environment
```bash
# Install dependencies
npm install

# Run tests in watch mode
npm test -- --watch

# Check code coverage
npm test -- --coverage

# Build Figma plugin (TypeScript)
cd figma-plugin && npm install && npm run build
```

### Development Workflow
1. Make changes to source files
2. Run tests: `npm test`
3. Validate manually in Chrome (reload extension)
4. Test with Figma plugin
5. Commit when tests pass

## 🎯 Roadmap

### Completed ✅
- [x] Phase 1-5: Core architecture and basic extraction
- [x] Phase 6: Figma data converter integration
- [x] Phase 7: Layout engine (Grid, Flexbox, positioning)
- [x] Phase 8: Typography system
- [x] Phase 9: Images & SVG handling
- [x] Phase 10-11: Effects & UI polish
- [x] Phase 12: Error handling system
- [x] Phase 13: Extended unit tests (199 total)
- [x] Phase 14: E2E test suite created

### In Progress 🔄
- [ ] **Phase 15:** Manual testing on real websites
- [ ] **Phase 16:** Performance optimization (target: 50% faster)
- [ ] **Phase 17:** Complete documentation
- [ ] **Phase 18:** Final QA & Chrome Web Store publishing

### Future Enhancements 🔮
- [ ] Component detection (buttons, cards, headers)
- [ ] Design system extraction (colors, typography scale)
- [ ] Multi-page extraction
- [ ] Responsive design variants
- [ ] Animation and transition capture
- [ ] Custom element mapping

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Chrome Extension Manifest V3
- Figma Plugin API
- Jest testing framework
- CSS-tree for CSS parsing
- jsdom for DOM testing

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/figma-chrome-extension/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/figma-chrome-extension/discussions)
- **Email:** your.email@example.com

---

Made with ❤️ by [Your Name](https://github.com/yourusername)

## Structure
- `src/background/` — Service worker scripts
- `src/content/` — Content scripts for DOM extraction
- `src/popup/` — Extension popup UI
- `src/parsers/` — HTML/CSS parsing logic
- `src/figma/` — Figma API integration
- `src/utils/` — Utility functions
- `tests/` — Automated and manual tests
- `docs/` — Documentation

## Getting Started
1. Clone the repo
2. Load as unpacked extension in Chrome
3. Click the extension icon and use the popup

## Development
- Modern JavaScript (ES6+)
- Modular codebase
- Ready for Playwright and Task Master integration

## How to Launch the Extension

1. Open Chrome and go to chrome://extensions
2. Enable 'Developer mode' (top right)
3. Click 'Load unpacked'
4. Select the project folder: /Users/tzoharlary/FigmaFirstTryChromeExtention
5. The extension will appear in your Chrome toolbar
6. Click the extension icon and use the popup to start conversion

For debugging, open the popup and use Chrome DevTools (right-click → Inspect).

## Running Tests

All dependencies are pre-installed. Run:

### Unit Tests (Jest)
```bash
npm test
# With coverage:
npm test -- --coverage
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
# Or directly:
npx playwright test tests/popup.spec.js
```

### Test Results
- ✅ 8 Jest unit tests passed
- ✅ 1 Playwright E2E test passed
- ✅ All JS syntax validated
- Coverage: 34.78% and growing

See tests/README.md for more info.
