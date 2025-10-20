# Architecture Diagram - HTML to Figma Extension

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
         ┌───────────────────────────────────────────────┐
         │         Chrome Browser Environment            │
         │                                               │
         │  ┌─────────────────────────────────────────┐ │
         │  │         Extension Popup UI              │ │
         │  │         (popup.html/js)                 │ │
         │  │                                         │ │
         │  │  [Extract Page Button]                  │ │
         │  │  [Status Display]                       │ │
         │  │  [Statistics Panel]                     │ │
         │  └──────────────┬──────────────────────────┘ │
         │                 │ chrome.tabs.sendMessage    │
         │                 ▼                            │
         │  ┌─────────────────────────────────────────┐ │
         │  │      Background Service Worker          │ │
         │  │         (background.js)                 │ │
         │  │                                         │ │
         │  │  • Event Listeners                      │ │
         │  │  • Message Router                       │ │
         │  │  • Extension Lifecycle                  │ │
         │  └──────────────┬──────────────────────────┘ │
         │                 │ chrome.runtime.onMessage   │
         │                 ▼                            │
         │  ┌─────────────────────────────────────────┐ │
         │  │         Content Script                  │ │
         │  │         (content.js)                    │ │
         │  │                                         │ │
         │  │  ┌─────────────────────────────────┐   │ │
         │  │  │   Core Extraction Engine        │   │ │
         │  │  │                                 │   │ │
         │  │  │  • performExtraction()          │   │ │
         │  │  │  • traverseDOM()                │   │ │
         │  │  │  • extractStyles()              │   │ │
         │  │  │  • extractMetadata()            │   │ │
         │  │  └─────────────┬───────────────────┘   │ │
         │  │                │                        │ │
         │  │                ▼                        │ │
         │  │  ┌─────────────────────────────────┐   │ │
         │  │  │      Parser Layer              │   │ │
         │  │  │                                 │   │ │
         │  │  │  ├─ cssMapper.js               │   │ │
         │  │  │  │   • mapColorToFigma()       │   │ │
         │  │  │  │   • mapTypographyToFigma()  │   │ │
         │  │  │  │   • mapLayoutToFigma()      │   │ │
         │  │  │  │                             │   │ │
         │  │  │  ├─ domExtractor.js            │   │ │
         │  │  │  │   • extractElement()        │   │ │
         │  │  │  │   • buildElementTree()      │   │ │
         │  │  │  │                             │   │ │
         │  │  │  └─ htmlParser.js              │   │ │
         │  │  │      • parseHTML()              │   │ │
         │  │  │      • sanitizeContent()        │   │ │
         │  │  └─────────────┬───────────────────┘   │ │
         │  │                │                        │ │
         │  │                ▼                        │ │
         │  │  ┌─────────────────────────────────┐   │ │
         │  │  │   Data Converter Layer          │   │ │
         │  │  │                                 │   │ │
         │  │  │  • figmaDataConverter.js        │   │ │
         │  │  │    - mapElementToFigmaData()    │   │ │
         │  │  │    - convertLayoutData()        │   │ │
         │  │  │    - convertTypography()        │   │ │
         │  │  │    - convertEffects()           │   │ │
         │  │  └─────────────┬───────────────────┘   │ │
         │  │                │                        │ │
         │  │                ▼                        │ │
         │  │  ┌─────────────────────────────────┐   │ │
         │  │  │    Utility Layer                │   │ │
         │  │  │                                 │   │ │
         │  │  │  ├─ errorHandling.js            │   │ │
         │  │  │  │   • ErrorHandler class      │   │ │
         │  │  │  │   • withErrorHandling()     │   │ │
         │  │  │  │   • Custom error types      │   │ │
         │  │  │  │                             │   │ │
         │  │  │  ├─ helpers.js                 │   │ │
         │  │  │  │   • parseColor()            │   │ │
         │  │  │  │   • convertUnit()           │   │ │
         │  │  │  │   • detectImageFormat()     │   │ │
         │  │  │  │                             │   │ │
         │  │  │  └─ tokenStorage.js            │   │ │
         │  │  │      • Store/retrieve tokens   │   │ │
         │  │  └─────────────┬───────────────────┘   │ │
         │  │                │                        │ │
         │  │                ▼                        │ │
         │  │       [Extracted JSON Data]             │ │
         │  │                                         │ │
         │  └─────────────────┬───────────────────────┘ │
         └────────────────────┼─────────────────────────┘
                              │
                              │ Clipboard Copy
                              │
                              ▼
         ┌─────────────────────────────────────────────┐
         │            Figma Desktop                     │
         │                                              │
         │  ┌─────────────────────────────────────────┐│
         │  │        Figma Plugin (code.ts)           ││
         │  │                                         ││
         │  │  • Receive JSON data                    ││
         │  │  • Parse data structure                 ││
         │  │  • Create Figma nodes:                  ││
         │  │    - Frames (containers)                ││
         │  │    - Text nodes (typography)            ││
         │  │    - Rectangles (images, backgrounds)   ││
         │  │    - Vectors (SVG graphics)             ││
         │  │  • Apply styles and properties          ││
         │  │  • Organize in layer hierarchy          ││
         │  │                                         ││
         │  └─────────────────────────────────────────┘│
         │                                              │
         │              [Figma Canvas]                  │
         │         ┌────────────────────┐               │
         │         │  Editable Design  │               │
         │         │   • Frames        │               │
         │         │   • Text          │               │
         │         │   • Images        │               │
         │         │   • Vectors       │               │
         │         └────────────────────┘               │
         └──────────────────────────────────────────────┘
```

## Component Interaction Flow

```
┌──────────┐     Message      ┌──────────┐     Inject      ┌──────────┐
│  Popup   │ ───────────────► │Background│ ──────────────► │ Content  │
│   UI     │                  │  Worker  │                 │  Script  │
└────┬─────┘                  └────┬─────┘                 └────┬─────┘
     │                             │                            │
     │ User clicks "Extract"       │                            │
     │                             │                            │
     │                             │ Forwards message           │
     │                             │ ─────────────────────────► │
     │                             │                            │
     │                             │                            │ Starts extraction
     │                             │                            │ ─────────┐
     │                             │                            │          │
     │                             │                            │ ◄────────┘
     │                             │                            │
     │                             │    Returns JSON data       │
     │                             │ ◄───────────────────────── │
     │                             │                            │
     │       Returns result        │                            │
     │ ◄────────────────────────── │                            │
     │                             │                            │
     │ Displays stats              │                            │
     │ Copies to clipboard         │                            │
     │                             │                            │
     ▼                             ▼                            ▼
```

## Data Flow Diagram

```
┌─────────────┐
│  Web Page   │
│  (DOM Tree) │
└──────┬──────┘
       │
       │ Read DOM
       ▼
┌─────────────────┐
│ traverseDOM()   │
│ Recursive walk  │
└──────┬──────────┘
       │
       │ For each element
       ▼
┌─────────────────────────────────┐
│    Extract Element Data         │
├─────────────────────────────────┤
│ • getComputedStyle()            │
│ • getBoundingClientRect()       │
│ • element.textContent           │
│ • element.attributes            │
└──────┬──────────────────────────┘
       │
       │ Raw data
       ▼
┌─────────────────────────────────┐
│      Parse & Convert            │
├─────────────────────────────────┤
│ • parseColor()                  │
│ • convertUnit()                 │
│ • parseBoxShadow()              │
│ • parseGradient()               │
└──────┬──────────────────────────┘
       │
       │ Normalized data
       ▼
┌─────────────────────────────────┐
│   Map to Figma Format           │
├─────────────────────────────────┤
│ • mapColorToFigma()             │
│ • mapTypographyToFigma()        │
│ • mapLayoutToFigma()            │
│ • mapEffectsToFigma()           │
└──────┬──────────────────────────┘
       │
       │ Figma-compatible data
       ▼
┌─────────────────────────────────┐
│    Build Element Tree           │
├─────────────────────────────────┤
│ {                               │
│   tagName: 'DIV',               │
│   figmaData: {...},             │
│   children: [...]               │
│ }                               │
└──────┬──────────────────────────┘
       │
       │ Element tree
       ▼
┌─────────────────────────────────┐
│   Collect Additional Data       │
├─────────────────────────────────┤
│ • images[] (base64)             │
│ • svgs[] (markup)               │
│ • fonts[] (families)            │
└──────┬──────────────────────────┘
       │
       │ Complete data package
       ▼
┌─────────────────────────────────┐
│    Assemble Final JSON          │
├─────────────────────────────────┤
│ {                               │
│   metadata: {...},              │
│   tree: {...},                  │
│   images: [...],                │
│   svgs: [...],                  │
│   fonts: [...]                  │
│ }                               │
└──────┬──────────────────────────┘
       │
       │ JSON string
       ▼
┌─────────────────────────────────┐
│      Copy to Clipboard          │
└─────────────────────────────────┘
       │
       │ User pastes in Figma
       ▼
┌─────────────────────────────────┐
│     Figma Plugin Receives       │
└──────┬──────────────────────────┘
       │
       │ Parse JSON
       ▼
┌─────────────────────────────────┐
│    Create Figma Nodes           │
├─────────────────────────────────┤
│ For each element in tree:       │
│  • figma.createFrame()          │
│  • figma.createText()           │
│  • figma.createRectangle()      │
│  • Apply fills, strokes, etc.   │
│  • Set layout properties        │
└──────┬──────────────────────────┘
       │
       │ Figma nodes
       ▼
┌─────────────────────────────────┐
│      Figma Canvas               │
│   (Editable Design)             │
└─────────────────────────────────┘
```

## Error Handling Flow

```
┌──────────────┐
│  Operation   │
│  Starts      │
└──────┬───────┘
       │
       │ Try
       ▼
┌──────────────────┐
│  Execute Code    │
└──────┬───────────┘
       │
       │ Error?
       ├─── No ─────► Success ───► Return Result
       │
       │ Yes
       ▼
┌──────────────────────────────┐
│  withErrorHandling() Wrapper │
└──────┬───────────────────────┘
       │
       │ Catch error
       ▼
┌──────────────────────────────┐
│  Categorize Error            │
├──────────────────────────────┤
│ • Type (DOM/Image/API/etc)   │
│ • Severity (Low/High/etc)    │
│ • Category (Recoverable/etc) │
└──────┬───────────────────────┘
       │
       │ Error object
       ▼
┌──────────────────────────────┐
│  ErrorHandler.handleError()  │
├──────────────────────────────┤
│ • Log to console             │
│ • Record in history          │
│ • Update statistics          │
└──────┬───────────────────────┘
       │
       │ Based on severity
       ├─── Low ────────► Log only, continue
       │
       ├─── Medium ─────► Warn user, continue
       │
       ├─── High ───────► Show error, partial result
       │
       └─── Critical ──► Abort, show error message
```

## Module Dependencies

```
┌─────────────────┐
│   content.js    │  ◄─── Main entry point
└────────┬────────┘
         │
         │ Imports
         ▼
    ┌────────────────────────────┐
    │                            │
    ▼                            ▼
┌──────────┐              ┌──────────┐
│ Parsers  │              │ Converters│
├──────────┤              ├──────────┤
│ cssMapper│              │ figmaData│
│ domExtract│             │ Converter│
│ htmlParser│             └────┬─────┘
└────┬─────┘                   │
     │                         │
     │ Both use               │
     ▼                         ▼
┌────────────────────────────────┐
│        Utils Layer             │
├────────────────────────────────┤
│ • errorHandling.js             │
│ • helpers.js                   │
│ • tokenStorage.js              │
└────────────────────────────────┘
```

## Testing Architecture

```
┌─────────────────────────────────┐
│        Test Suites              │
├─────────────────────────────────┤
│                                 │
│  ┌────────────────────────┐    │
│  │   Unit Tests           │    │
│  │   (199 tests)          │    │
│  │                        │    │
│  │ • content.spec.js      │    │
│  │ • cssMapper.spec.js    │    │
│  │ • errorHandling.spec.js│    │
│  │ • helpers.spec.js      │    │
│  │ • ... (16 files total) │    │
│  └────────────────────────┘    │
│                                 │
│  ┌────────────────────────┐    │
│  │  Integration Tests     │    │
│  │                        │    │
│  │ • popup.integration    │    │
│  │ • figmaDataMapper      │    │
│  │ • layoutEngine         │    │
│  └────────────────────────┘    │
│                                 │
│  ┌────────────────────────┐    │
│  │   E2E Tests            │    │
│  │   (Manual execution)   │    │
│  │                        │    │
│  │ • e2e.spec.js          │    │
│  │   (Playwright - docs   │    │
│  │    only, not runnable) │    │
│  └────────────────────────┘    │
│                                 │
│  ┌────────────────────────┐    │
│  │   Manual Tests         │    │
│  │                        │    │
│  │ • MANUAL_TESTING.md    │    │
│  │   - 8 test scenarios   │    │
│  │   - Real websites      │    │
│  │   - Performance tests  │    │
│  └────────────────────────┘    │
└─────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Development                 │
├─────────────────────────────────────┤
│ • Local code editing                │
│ • npm test (Jest)                   │
│ • Load unpacked in Chrome           │
│ • Test in Figma Desktop             │
└─────────────┬───────────────────────┘
              │
              │ Build & Package
              ▼
┌─────────────────────────────────────┐
│         Staging                     │
├─────────────────────────────────────┤
│ • Compile TypeScript (Figma plugin) │
│ • Run all tests (199 pass)          │
│ • Manual QA on test sites           │
│ • Create .zip package               │
└─────────────┬───────────────────────┘
              │
              │ Submit
              ▼
┌─────────────────────────────────────┐
│         Production                  │
├─────────────────────────────────────┤
│ • Chrome Web Store                  │
│   - Extension published             │
│   - Auto-updates enabled            │
│                                     │
│ • Figma Community                   │
│   - Plugin published                │
│   - Available in plugin browser     │
└─────────────────────────────────────┘
```

## Performance Optimization Architecture (Phase 16 - Planned)

```
┌──────────────────────────┐
│   Current Architecture   │
├──────────────────────────┤
│ Main Thread Processing   │
│ • DOM traversal          │
│ • Style computation      │
│ • Image conversion       │
│ • JSON stringification   │
└────────┬─────────────────┘
         │
         │ Phase 16: Optimize
         ▼
┌──────────────────────────────────────┐
│   Optimized Architecture             │
├──────────────────────────────────────┤
│                                      │
│  Main Thread:                        │
│  • DOM traversal (cached)            │
│  • Style computation (WeakMap cache) │
│  • Lazy image loading (visible only) │
│  • Progressive extraction (chunked)  │
│                                      │
│  Web Worker:                         │
│  • Heavy Figma data mapping          │
│  • Image base64 encoding             │
│  • JSON stringification              │
│                                      │
└──────────────────────────────────────┘
         │
         │ Result
         ▼
┌──────────────────────────┐
│  50%+ Performance Gain   │
│  No UI Blocking          │
└──────────────────────────┘
```

---

## Legend

- `┌─┐ └─┘`: Module/component boundaries
- `│ ─`: Connections and flows
- `▼ ▲ ► ◄`: Data flow direction
- `• ├ └`: List items and sub-items

---

**Last Updated:** October 20, 2025  
**Version:** 1.0.0  
**Maintainer:** Development Team
