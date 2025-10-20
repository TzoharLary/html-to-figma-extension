# Module Interfaces: html-to-figma-extension

## Overview
תיאור הממשקים והזרימת מידע בין המודולים העיקריים של ההרחבה.

---

## Modules & Interfaces

### 1. Content Script (`src/content/content.js`)
- **Extracts HTML/CSS from active tab**
- Interface: `getPageDOM()`, `sendDOMToBackground(domData)`

### 2. Background (`src/background/background.js`)
- **Handles messaging, coordinates conversion**
- Interface: `onMessageReceived(message)`, `convertDOMToFigma(domData)`

### 3. Parsers (`src/parsers/htmlParser.js`)
- **Parses HTML/CSS to Figma-compatible structure**
- Interface: `parseHTML(html)`, `parseCSS(css)`

### 4. Figma API (`src/figma/figmaApi.js`)
- **Sends parsed data to Figma via API**
- Interface: `sendToFigma(figmaData)`, `authenticateFigma(token)`

### 5. Popup UI (`src/popup/popup.html`, `src/popup/popup.js`)
- **User interaction, triggers conversion**
- Interface: `onConvertButtonClick()`, `showStatus(status)`

### 6. Utils (`src/utils/helpers.js`)
- **Shared utility functions**
- Interface: `formatData(data)`, `log(message)`

---

## Data Flow
1. Popup triggers conversion
2. Content script extracts DOM, sends to background
3. Background coordinates parsing and Figma API calls
4. Parsers convert DOM to Figma format
5. Figma API module sends data to Figma
6. Status/feedback returned to popup

---

## MCP Integration
- **Task Master**: Tracks progress, manages workflow
- **Playwright**: Automates browser actions for testing

---

## Update Policy
- Update this file whenever interfaces or data flow change
