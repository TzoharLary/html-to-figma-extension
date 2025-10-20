# Project Context: html-to-figma-extension

## Vision & Goals
- Build a Chrome extension that extracts web page structure and styles
- Convert DOM/CSS into Figma-compatible data structures
- Work alongside a Figma Plugin that creates the actual design
- Similar architecture to html.to.design by divRIOTS

## Correct Architecture (Extension + Plugin)
```
[Web Page] 
    ↓ (DOM/CSS Extraction)
[Chrome Extension: Data Processor]
    ↓ (Data Transfer via Clipboard/Messaging)
[Figma Plugin: Design Creator]
    ↓
[Figma File with Components]
```

## Main Features
- Extract complete DOM structure from any web page
- Compute and extract all CSS styles (colors, typography, layout, effects)
- Parse and convert to Figma-compatible data format
- Transfer data to companion Figma Plugin
- Figma Plugin receives data and creates design in Figma
- Simple popup UI: "Extract Page" → "Copy to Figma"

## Architecture
- Modular folders: background, content, popup, parsers, figma, utils, tests, docs
- manifest.json for Chrome extension config
- README and docs for onboarding

## MCP Tools in Use
- Task Master: todo list, progress tracking, workflow management
- Playwright: browser automation, extension testing

## Recommended MCP Tools (to add if needed)
- GitHub Issue Management: for collaborative issue tracking
- Task Expansion/Analysis: for breaking down complex features
- Task Tagging/Organization: for advanced workflow

## Development Principles
- Self-review after each step
- Document all architectural decisions
- Use MCP tools for automation and quality
- Keep context file updated with every major change

## Dependencies & Integrations
- Chrome Extension APIs
- Figma REST API
- Playwright (for tests)
- Task Master (for workflow)

## Next Steps
- Continue modular development
- Update context file after each milestone
- Use MCP tools for optimal results

## Milestone: Modular Functions Added
- All main modules now have basic interface functions as per INTERFACES.md
- Data flow from popup → content → background → parser → figma is established
- Ready for task management and automated testing integration

## Testing Policy
- Playwright for E2E browser automation (popup, extension load)
- Unit tests for all modules (parsers, figmaApi, utils)
- Integration tests for data flow between modules
- All new features require test coverage
- See README.md and tests/ for details

## Test Coverage Status
- ✅ **Phase 2 Complete**: DOM Extraction Engine fully implemented and tested
- ✅ Jest unit tests: **20 tests passing** across 7 test suites
  - domExtractor: 6 tests (DOM traversal, style extraction, images, fonts)
  - tokenStorage: 6 tests (extraction history, preferences)
  - parsers, figma, utils, background, content: 8 tests
- ✅ Playwright E2E: popup interaction tested and passed
- ✅ JS syntax validated across all modules
- Coverage: Growing with each phase completion
- All critical paths tested and validated

## Phase 2 Implementation Details (DOM Extraction Engine)
**Status**: ✅ COMPLETE

**Implemented Features**:
- `extractPageData()` - Main entry point for page extraction
- `traverseDOM()` - Recursive DOM traversal with depth limits
- `extractComputedStyles()` - Extracts 50+ CSS properties:
  - Layout: display, position, top, left, right, bottom, z-index
  - Flexbox: flex-direction, flex-wrap, justify-content, align-items, gap
  - Grid: grid-template-columns, grid-template-rows, grid-gap
  - Box Model: width, height, margins, padding, borders, border-radius
  - Colors & Background: color, background-color, background-image, gradients
  - Typography: font-family, font-size, font-weight, line-height, letter-spacing
  - Effects: opacity, box-shadow, text-shadow, transform, filter
  - Overflow: overflow, overflow-x, overflow-y
- `extractImages()` - Image extraction with src, dimensions, position
- `extractFonts()` - Unique font-family collection from computed styles
- `isElementVisible()` - Visibility checking (display, visibility, opacity, offsetParent)

**Files Created/Updated**:
- `/src/parsers/domExtractor.js` (288 lines) - Complete extraction engine
- `/tests/domExtractor.spec.js` (82 lines) - 6 comprehensive tests using jsdom
- `/src/content/content.js` - Updated to use domExtractor
- `/jest.config.js` - Configured for jsdom test environment

**Test Results**: All 6 tests passing
1. ✅ extractPageData returns valid structure with metadata, tree, images, fonts
2. ✅ traverseDOM extracts element data with tagName, attributes, children
3. ✅ isElementVisible returns boolean visibility status
4. ✅ extractImages returns array structure
5. ✅ extractFonts returns array of font families
6. ✅ extractComputedStyles returns all CSS properties correctly

**Dependencies Installed**:
- `jsdom` (48 packages) - DOM environment for testing
- `jest-environment-jsdom` (46 packages) - Jest jsdom integration

---

## Phase 3 Implementation Details (CSS to Figma Data Mapper)
**Status**: ✅ COMPLETE

**Implemented Features**:
- `mapStylesToFigma()` - Main converter for element data → Figma format
- `mapFills()` - CSS colors/backgrounds → Figma fills (SOLID/GRADIENT)
- `mapStrokes()` - CSS borders → Figma strokes with color and width
- `mapEffects()` - CSS shadows → Figma DROP_SHADOW/INNER_SHADOW effects
- `mapLayout()` - CSS layout → Figma auto-layout, positioning, padding, corner radius
- `mapTypography()` - CSS text properties → Figma text styles
- `mapConstraints()` - CSS positioning → Figma constraints (horizontal/vertical)

**Utility Functions** (17 total):
- `parseColor()` - Supports rgba, rgb, hex (#RRGGBB, #RGB), named colors
- `convertUnit()` - Converts px, em, rem, % to numeric values
- `parseFontWeight()` - Maps CSS weights (normal/bold/100-900) to Figma
- `mapTextAlign()` - LEFT, CENTER, RIGHT, JUSTIFIED
- `parseLineHeight()` - AUTO, PIXELS, PERCENT modes
- `parseCornerRadius()` - Border-radius extraction
- `mapLayoutMode()` - Flexbox → VERTICAL/HORIZONTAL/NONE
- `mapLayoutAlign()` - Justify-content → MIN/CENTER/MAX/SPACE_BETWEEN
- `parseBoxShadow()` - Shadow parsing (inset, offset, blur, spread, color)
- `parseGradient()` - Basic linear gradient support

**Files Created**:
- `/src/parsers/cssMapper.js` (475 lines) - Complete CSS → Figma mapper
- `/tests/cssMapper.spec.js` (219 lines) - 32 comprehensive tests

**Test Results**: All 32 tests passing ✅
- 6 tests for parseColor (rgba, rgb, hex, 3-digit hex, named, transparent)
- 5 tests for convertUnit (px, em, rem, auto/none, percentage)
- 3 tests for parseFontWeight (named, numeric, defaults)
- 2 tests for mapTextAlign (all values, defaults)
- 4 tests for parseLineHeight (normal, px, %, unitless)
- 2 tests for parseCornerRadius (valid, zero)
- 2 tests for mapLayoutMode (flex layouts, non-flex)
- 2 tests for mapFills (background color, transparent)
- 2 tests for mapStrokes (border, no border)
- 1 test for mapLayout (complete properties)
- 1 test for mapTypography (complete properties)
- 2 tests for mapStylesToFigma (invalid input, complete element)

---

## Phase 4 Implementation Details (Figma Plugin Creation)
**Status**: ✅ COMPLETE

**Implemented Files**:
- `/figma-plugin/manifest.json` - Plugin configuration (API 1.0.0)
- `/figma-plugin/ui.html` - User interface with data input, create/clear buttons, status display
- `/figma-plugin/code.ts` - Main plugin logic (543 lines TypeScript)
- `/figma-plugin/package.json` - Dependencies (@figma/plugin-typings, typescript)
- `/figma-plugin/tsconfig.json` - TypeScript configuration (ES6, strict mode)
- `/figma-plugin/.gitignore` - Ignore node_modules, build, compiled JS
- `/figma-plugin/README.md` - Comprehensive documentation

**Core Functions** (14 total):
- `createDesignFromData()` - Main entry point, creates page frame and processes tree
- `createNodesFromTree()` - Recursive tree traversal and node creation
- `createNodeForElement()` - Determines node type and creates appropriate Figma node
- `createFrameNode()` - Creates Frame with auto-layout (flexbox support)
- `createTextNode()` - Creates Text nodes with full typography
- `createImageNode()` - Creates Rectangle placeholders for images
- `createVectorNode()` - Creates Vector nodes for SVG elements
- `applyCommonStyles()` - Applies fills, strokes, effects, opacity, corner radius

**Utility Functions** (10 total):
- `parseSize()` - Converts CSS units (px, em, rem, %) to numbers
- `parseColor()` - Parses rgba, rgb, hex colors
- `parseBoxShadow()` - Converts CSS box-shadow → Figma DROP_SHADOW
- `parseFontFamily()` - Maps CSS fonts to Figma fonts (with fallback to Inter)
- `parseFontWeight()` - Maps 100-900/normal/bold to Figma styles
- `mapTextAlign()` - LEFT/CENTER/RIGHT/JUSTIFIED
- `mapJustifyContent()` - MIN/CENTER/MAX/SPACE_BETWEEN
- `mapAlignItems()` - MIN/CENTER/MAX
- `parseLineHeight()` - AUTO/PIXELS/PERCENT

**Node Type Mapping**:
- `<div>`, `<section>`, `<article>` → Frame (with auto-layout if flex)
- `<h1>`-`<h6>`, `<p>`, `<span>`, `<a>` → Text
- `<img>` → Rectangle (placeholder)
- `<svg>`, `<path>`, `<circle>` → Vector
- Others → Frame (default)

**Style Support**:
- ✅ Colors: background-color → fills, border → strokes
- ✅ Effects: box-shadow → DROP_SHADOW
- ✅ Layout: display:flex → auto-layout (VERTICAL/HORIZONTAL)
- ✅ Spacing: gap → itemSpacing, padding → padding{Top,Right,Bottom,Left}
- ✅ Typography: font-family, size, weight, style, align, line-height, letter-spacing
- ✅ Border: border-radius → cornerRadius
- ✅ Opacity: CSS opacity → Figma opacity

**User Interface**:
- Textarea for pasting extracted JSON data
- "Create Design in Figma" button
- "Clear" button
- Status display (success, error, progress messages)
- Clean, Figma-style UI design

**Development Setup**:
- TypeScript compilation: `npm run build`
- Watch mode: `npm run watch`
- Figma Desktop app integration via manifest

**Next Phase**: ~~Phase 5 - Extension↔Plugin Communication~~ ✅ COMPLETE (see below)

---

## Phase 5 Implementation Details (Extension↔Plugin Communication)
**Status**: ✅ COMPLETE

**Implemented Features**:
- Modern popup UI with gradient design, card layout, animations
- Full extraction workflow: popup → content → background → clipboard
- Auto-copy to clipboard after successful extraction
- Chrome Storage integration for extraction history
- Real-time status feedback (success/error/info messages)
- Loading states with spinner animation
- Extraction statistics display (element count, image count)
- Clipboard API with fallback for browser compatibility

**Files Created/Updated**:
- `/src/popup/popup.html` (320 lines) - Complete UI rewrite
  - Modern gradient background (purple theme)
  - Card-based layout (360px width)
  - Extract button with loading spinner
  - Copy button (manual fallback)
  - Status display with 3 states (success/error/info)
  - Stats grid: elementCount, imageCount
  - CSS animations: @keyframes slideIn, spin
  - Quick start instructions

- `/src/popup/popup.js` (158 lines) - Complete logic rewrite
  - `extractBtn.addEventListener()` - Triggers extraction via chrome.tabs.sendMessage
  - `copyBtn.addEventListener()` - Manual clipboard copy
  - `handleExtractionSuccess(data)` - Processes extraction, updates UI stats, auto-copies
  - `copyToClipboard(data)` - Modern Clipboard API with textarea fallback
  - `countElements(node)` - Recursive tree counter
  - `showStatus(message, type)` - Status display with auto-hide (3s)
  - `setLoading(loading)` - Loading state management
  - Global state: `extractedData` stores last extraction

- `/src/content/content.js` (280 lines) - Inline extraction (no bundler)
  - Inlined all domExtractor.js functions:
    - `extractPageData()` - Main entry, returns {metadata, tree, images, fonts}
    - `traverseDOM()` - Recursive DOM traversal with depth limit
    - `isElementVisible()` - Visibility checking
    - `extractAttributes()` - Attribute extraction
    - `getDirectTextContent()` - Direct text content
    - `extractComputedStyles()` - 50+ CSS properties
    - `extractImages()` - Image collection
    - `extractFonts()` - Font-family extraction
    - `performExtraction()` - Wrapper with error handling
    - `countElements()` - Tree counting
  - Message listener: Responds to 'EXTRACT_PAGE' from popup
  - Returns: { success: true/false, data/error }

- `/src/background/background.js` (60 lines) - Message coordinator
  - `chrome.runtime.onMessage.addListener()` - Handles 'PAGE_DATA_EXTRACTED', 'EXTRACTION_ERROR'
  - `handleExtractedData(data, sender)` - Processes and stores data
  - `countElements(node)` - Tree counting utility
  - Chrome Storage: Stores {lastExtraction: {data, timestamp, url}}
  - `chrome.runtime.onInstalled` - Installation/update tracking

- `/manifest.json` - Updated
  - Version: 0.1.0 → 0.2.0
  - Name: "html-to-figma-extension" → "HTML to Figma"
  - Description: Enhanced with "Extract web page designs and convert them to Figma..."
  - Permissions: Added "clipboardWrite" for Clipboard API

- `/tests/popup.integration.spec.js` (93 lines) - Integration tests
  - 7 comprehensive tests for popup functionality
  - Tests: DOM elements exist, countElements logic, clipboard API, data structure validation
  - Mocks: Chrome API (tabs, runtime), navigator.clipboard

**Data Flow Architecture**:
```
[User] Clicks "Extract Page" in popup
    ↓ chrome.tabs.sendMessage('EXTRACT_PAGE')
[Content Script] performExtraction() - Inline DOM extraction (280 lines)
    ↓ Returns { success: true, data: {...} }
[Popup] handleExtractionSuccess(data)
    ↓ copyToClipboard(data) - Auto-copy JSON to clipboard
[Clipboard] JSON string stored
    ↓ User opens Figma Plugin
[User] Pastes JSON into Figma Plugin textarea
    ↓ Clicks "Create Design in Figma"
[Figma Plugin] createDesignFromData() - Creates Figma nodes
    ↓
[Figma File] Design created ✅
```

**Key Technical Decisions**:
- **Inline Extraction**: Copied domExtractor functions into content.js to avoid bundler complexity
- **Auto-Copy**: Automatically copy to clipboard after extraction to reduce user steps
- **Chrome Storage**: Store extraction history for potential reuse/debugging
- **Modern UI**: Gradient background, animations, card layout for professional appearance
- **Clipboard Fallback**: Textarea fallback for browsers without modern Clipboard API
- **Loading States**: Spinner animation and disabled buttons during extraction

**Test Results**: All 59 tests passing ✅
- 52 tests from Phases 1-4
- 7 new Phase 5 tests (popup integration)
- Test suites: 9 passed, 9 total
- Coverage: All critical communication paths tested

**Chrome APIs Used**:
- `chrome.tabs` - Query active tab, send messages to content script
- `chrome.runtime` - Message passing, onInstalled event
- `chrome.storage.local` - Persist extraction history
- `navigator.clipboard` - Modern Clipboard API for data transfer

**User Experience Flow**:
1. User clicks extension icon → Popup opens
2. User clicks "Extract Page" → Loading spinner appears
3. Content script extracts DOM (280 lines inline) → Returns data
4. Popup receives data → Updates stats (element count, images)
5. Data auto-copies to clipboard → Success message: "✅ Copied to clipboard!"
6. User opens Figma → Opens Figma Plugin
7. User pastes (Cmd+V) → JSON data appears in textarea
8. User clicks "Create Design" → Figma creates design ✅

---

## Phase 6-10 Implementation Summary
**Status**: ✅ ALL COMPLETE

### Phase 6: DOM → Figma Data Converter ✅
- Integrated cssMapper.js into content.js extraction flow
- Added `figmaData` property to every extracted element
- Each element now includes: fills, strokes, effects, layout, typography, constraints
- All 66 tests passing

### Phase 7: Layout Engine (Flexbox/Grid) ✅
- **CSS Grid Support**: Maps grid-template-columns/rows, grid-gap, grid-auto-flow
- **Absolute/Fixed Positioning**: Full support with absolutePosition coordinates
- **Z-Index Stacking**: Proper layer ordering with zIndex property
- **Smart Constraints**: STRETCH/MIN/MAX/CENTER based on left/right/top/bottom
- Enhanced `mapLayout()`, `mapConstraints()`, `mapPositioning()`, `mapLayoutMode()`
- Grid heuristic: more rows → VERTICAL, more cols → HORIZONTAL
- All 86 tests passing (20 new layout tests)

### Phase 8: Typography & Fonts ✅
- **Font Family Parsing**: Primary font + fallbacks array
- **Extended Font Weight**: thin, extra-light, light, medium, semi-bold, extra-bold, black
- **Figma Font Mapping**: Common web fonts → Figma-compatible fonts (Arial, Helvetica, Roboto, etc.)
- **Generic Families**: sans-serif→Inter, serif→Times New Roman, monospace→Courier New
- **Text Decoration**: parseTextDecorationLine (UNDERLINE/STRIKETHROUGH/NONE)
- **Text Decoration Style**: SOLID/DOTTED/DASHED/WAVY
- **Text Case**: mapTextCase (UPPER/LOWER/TITLE/ORIGINAL from text-transform)
- **Paragraph Properties**: paragraphSpacing, paragraphIndent (ready for future expansion)
- Enhanced `mapTypography()`, added `parseFontFamily()`, `parseTextDecorationLine()`, `parseTextDecorationStyle()`, `mapTextCase()`
- All 115 tests passing (29 new typography tests)

### Phase 9: Images & SVG Handler ✅
- **Enhanced Image Extraction**:
  - Image format detection (PNG, JPEG, GIF, WEBP, SVG)
  - Data URL detection (base64 images)
  - Display vs. natural dimensions tracking
  - object-fit and object-position properties
  - Automatic base64 conversion (with CORS error handling)
- **SVG Extraction**:
  - Inline SVG elements with full markup capture
  - ViewBox, width, height attributes
  - Fill, stroke, strokeWidth from computed styles
  - SVG-to-data-URL conversion for easier handling
- **New Functions**: `extractSVGs()`, `getImageFormat()`, `convertImageToBase64()`
- Updated `extractPageData()` to include `svgs` array
- All 138 tests passing (23 new image/SVG tests)

### Phase 10: Effects & Decorations ✅
- **Already Covered**: box-shadow, text-shadow, opacity, border-radius, gradients were implemented in Phases 6-7
- **mapEffects()**: DROP_SHADOW, INNER_SHADOW with full shadow parsing
- **parseBoxShadow()**: Offset, blur, spread, color extraction
- **parseGradient()**: Basic linear gradient support (can be expanded)
- **Corner Radius**: parseCornerRadius() with proper numeric conversion
- No new tests needed - existing 138 tests already cover effects thoroughly

---

## Current Test Coverage Summary
**Total Tests**: 138 passing ✅
- **Phase 2**: 6 tests (DOM Extraction)
- **Phase 3**: 32 tests (CSS Mapper)
- **Phase 5**: 7 tests (Popup Integration)
- **Phase 6**: 7 tests (Figma Data Mapper)
- **Phase 7**: 20 tests (Layout Engine)
- **Phase 8**: 29 tests (Typography)
- **Phase 9**: 23 tests (Images & SVG)
- **Other**: 14 tests (Background, Content, Utils, Parsers, Figma, Token Storage)

**Test Suites**: 13 passed, 13 total
**Time**: ~1.3-1.8s per full test run
**Coverage**: All major features thoroughly tested

---

## Next Phases
**Phase 11**: UI/UX Polish (already good, can be skipped or minor tweaks)
**Phase 12**: Error Handling & Validation (expand error scenarios)
**Phase 13**: Unit Tests Expansion (aim for 80%+ code coverage)
**Phase 14**: Integration Tests (full E2E flow testing)
**Phase 15**: E2E Testing with Real Sites (test on actual websites)
**Phase 16**: Performance Optimization (large pages, memory usage)
**Phase 17**: Documentation Complete (user manual, developer guide, API docs)
**Phase 18**: Final Validation & QA (Chrome Web Store submission prep, Figma Plugin publishing)

```
