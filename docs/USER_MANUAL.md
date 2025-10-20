# User Manual - HTML to Figma Chrome Extension

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Using the Extension](#using-the-extension)
5. [Using the Figma Plugin](#using-the-figma-plugin)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)
8. [Privacy & Security](#privacy--security)

---

## Introduction

The HTML to Figma Chrome Extension allows you to extract any website's design and convert it into editable Figma designs. It preserves:

- ✅ Layout (CSS Grid, Flexbox, absolute positioning)
- ✅ Typography (fonts, sizes, weights, decorations)
- ✅ Colors (text, backgrounds, borders)
- ✅ Images (converted to base64 for portability)
- ✅ SVG graphics (with full markup)
- ✅ Effects (shadows, borders, border radius)
- ✅ Z-index layering

Perfect for:
- 🎨 **Designers:** Quickly prototype from existing sites
- 👨‍💻 **Developers:** Create design specs from production sites
- 📊 **Product Teams:** Document competitor designs
- 🏫 **Students:** Learn from real-world design patterns

---

## Installation

### Option A: Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (Coming Soon)
2. Search for "HTML to Figma"
3. Click "Add to Chrome"
4. Click "Add Extension" in the confirmation dialog
5. The extension icon will appear in your toolbar

### Option B: Manual Installation (Developer Mode)
1. Download the extension files from [GitHub](https://github.com/yourusername/figma-chrome-extension)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right
4. Click "Load unpacked"
5. Select the downloaded extension folder
6. The extension icon will appear in your toolbar

### Installing the Figma Plugin
1. Open Figma Desktop application
2. Go to Menu → Plugins → Development → "Import plugin from manifest..."
3. Navigate to the `figma-plugin` folder in the extension files
4. Select `manifest.json`
5. The plugin is now available in Figma

---

## Getting Started

### First-Time Setup

1. **Pin the Extension (Optional but Recommended)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "HTML to Figma" in the list
   - Click the pin icon to keep it visible

2. **Test on a Simple Page**
   - Navigate to `https://example.com`
   - Click the extension icon
   - Click "Extract Page"
   - You should see "Extraction complete!" within 1-2 seconds

3. **Verify in Figma**
   - Open Figma Desktop
   - Create a new file
   - Run the "HTML to Figma" plugin
   - Paste the extracted JSON
   - Click "Create Design"
   - Elements should appear in your canvas

---

## Using the Extension

### Basic Extraction

1. **Navigate to Target Page**
   - Go to any website you want to extract
   - Wait for the page to fully load

2. **Open Extension Popup**
   - Click the extension icon in Chrome toolbar
   - The popup will open with controls

3. **Extract the Page**
   - Click the "Extract Page" button
   - Wait for extraction to complete (1-10 seconds depending on page complexity)
   - Status message will show progress

4. **Review Results**
   - Check the extraction statistics:
     - Elements count
     - Images extracted
     - SVGs found
     - Fonts detected
   - Data is automatically copied to clipboard

5. **Use in Figma**
   - Open Figma Desktop
   - Run the plugin
   - Paste (Ctrl+V / Cmd+V)
   - Click "Create Design"

### Advanced Options (Coming Soon)

- **Select Specific Elements:** Right-click → "Extract This Element"
- **Exclude Elements:** Mark elements to skip during extraction
- **Custom Viewport:** Set specific viewport size for extraction
- **Export Options:** Choose between full data or lightweight version

---

## Using the Figma Plugin

### Step-by-Step

1. **Open Figma Desktop**
   - Open an existing file or create a new one
   - Navigate to the canvas where you want to create the design

2. **Run the Plugin**
   - Go to Menu → Plugins → Development → "HTML to Figma"
   - Or use the shortcut: `Ctrl+Alt+P` (Windows) / `Cmd+Option+P` (Mac), then search for "HTML to Figma"

3. **Paste JSON Data**
   - The plugin UI will show a text area
   - Paste the copied JSON from the extension (Ctrl+V / Cmd+V)
   - Or manually load a saved JSON file

4. **Create Design**
   - Click "Create Design" button
   - Wait for processing (1-5 seconds for typical pages)
   - Elements will appear in your canvas

5. **Edit and Refine**
   - All elements are editable Figma objects
   - Adjust positioning, colors, typography as needed
   - Group related elements
   - Add your own design touches

### Plugin Features

- ✅ **Frame Creation:** Each major element becomes a Figma frame
- ✅ **Auto-Layout:** Flexbox and Grid layouts preserved
- ✅ **Typography Mapping:** Fonts, sizes, and styles applied
- ✅ **Image Import:** Images embedded as fills
- ✅ **SVG Support:** SVG graphics imported as vector objects
- ✅ **Layer Naming:** Elements named based on HTML structure

---

## Troubleshooting

### Extension Issues

#### Extension Icon Not Visible
**Solution:**
1. Open `chrome://extensions/`
2. Find "HTML to Figma"
3. Ensure it's enabled (toggle should be blue)
4. Click the puzzle piece icon and pin the extension

#### "Extraction Failed" Error
**Possible Causes:**
- Page hasn't fully loaded → Wait for page to finish loading
- Content blocked by CSP → Some sites (banking, government) block extensions
- Network issues → Check internet connection

**Solutions:**
1. Refresh the page and try again
2. Check browser console for error details (F12 → Console)
3. Try on a different website to verify extension works

#### Data Size Too Large
**Symptoms:** Extraction takes very long or fails on complex pages

**Solutions:**
1. Extract specific sections instead of the entire page (coming soon)
2. Simplify the page (close sidebars, popups)
3. Try on a less complex page first

#### Clipboard Not Working
**Solution:**
1. Manually copy the JSON from the popup (click "Copy" button)
2. Grant clipboard permissions:
   - `chrome://extensions/`
   - Find extension → Details → Permissions
   - Ensure "Read and change clipboard" is enabled

### Figma Plugin Issues

#### Plugin Not Showing Up
**Solution:**
1. Verify plugin is installed:
   - Menu → Plugins → Development
   - Should see "HTML to Figma" in the list
2. Re-import the plugin manifest if missing

#### "Invalid JSON" Error
**Causes:**
- JSON was corrupted during copy/paste
- Data not copied correctly from extension

**Solutions:**
1. Re-extract the page in Chrome
2. Ensure full JSON is selected when copying
3. Save JSON to file and load from file in plugin

#### Design Elements Missing
**Possible Causes:**
- Some elements failed to convert
- Hidden elements (display: none) were skipped
- Images failed to load

**Solutions:**
1. Check browser console during extraction for errors
2. Verify all images loaded on original page
3. Try extracting again with page fully loaded

#### Performance Slow
**Symptoms:** Plugin takes >30 seconds to create design

**Solutions:**
1. Extract smaller sections of the page
2. Close other Figma files
3. Restart Figma Desktop
4. Use a simpler page for testing first

---

## FAQ

### General Questions

**Q: Is this extension free?**  
A: Yes, completely free and open source.

**Q: Does it work on any website?**  
A: Most websites work, but some (banking sites, government sites) block extensions for security.

**Q: Is my data sent to any servers?**  
A: No, all processing happens locally in your browser. No data is sent externally.

**Q: Can I extract mobile views?**  
A: Yes, resize your browser to mobile size or use device emulation (F12 → Toggle Device Toolbar).

**Q: Does it work with single-page apps (React, Vue, etc.)?**  
A: Yes, it extracts the rendered DOM, so any framework works.

### Technical Questions

**Q: What browsers are supported?**  
A: Chrome and Chromium-based browsers (Edge, Brave, Opera). Firefox support coming soon.

**Q: Do I need Figma Desktop or can I use Figma in browser?**  
A: You need Figma Desktop for the plugin. Browser version doesn't support plugins yet.

**Q: What image formats are supported?**  
A: PNG, JPEG, GIF, WEBP, SVG, and data URLs.

**Q: Does it support CSS animations?**  
A: No, only static styles are captured. Animations are not preserved.

**Q: Can I extract password-protected pages?**  
A: Yes, as long as you're logged in and can view the page in Chrome.

**Q: What about responsive design?**  
A: Currently captures one viewport size. Extract at different sizes to get multiple variants.

### Usage Questions

**Q: How do I extract just a section of a page?**  
A: Right-click the element and select "Extract This Element" (coming in v2.0).

**Q: Can I save extracted data for later?**  
A: Yes, copy the JSON and save it to a .json file. Load it in the Figma plugin later.

**Q: How do I report bugs or request features?**  
A: Visit our [GitHub Issues](https://github.com/yourusername/figma-chrome-extension/issues) page.

---

## Privacy & Security

### What Data Does the Extension Access?

The extension requests permission to:
1. **Read page content** - To extract HTML, CSS, and images
2. **Access clipboard** - To copy extracted JSON data
3. **Run on all websites** - To work on any page you visit

### What Data is Collected?

**None.** The extension:
- ❌ Does NOT send data to any servers
- ❌ Does NOT track your browsing
- ❌ Does NOT store your data
- ❌ Does NOT use analytics or telemetry
- ✅ Processes everything locally in your browser

### Security Best Practices

1. **Only extract public pages** - Don't extract sensitive data (banking, medical records)
2. **Review extracted data** - Check the JSON before sharing with others
3. **Keep extension updated** - Install updates for security fixes
4. **Report vulnerabilities** - Email security@example.com for private disclosure

### Open Source

This extension is fully open source:
- Code: [GitHub Repository](https://github.com/yourusername/figma-chrome-extension)
- License: MIT
- Contributions welcome

---

## Support & Contact

- **Bug Reports:** [GitHub Issues](https://github.com/yourusername/figma-chrome-extension/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/yourusername/figma-chrome-extension/discussions)
- **Email:** support@example.com
- **Documentation:** [GitHub Docs](https://github.com/yourusername/figma-chrome-extension/tree/main/docs)

---

**Version:** 1.0.0  
**Last Updated:** [Current Date]  
**Author:** [Your Name]
