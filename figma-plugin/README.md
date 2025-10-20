# Figma Plugin Architecture

## Overview
This Figma Plugin works as a companion to the Chrome Extension. It receives extracted web page data and creates the design in Figma.

## Communication Flow
1. Chrome Extension extracts DOM/CSS from web page
2. Extension processes and structures data
3. Data is transferred via:
   - **Option 1:** Clipboard (user copies data, pastes in plugin)
   - **Option 2:** Local messaging server (automated)
   - **Option 3:** Plugin UI input field

4. Plugin receives data
5. Plugin creates Figma nodes (frames, text, images, etc.)
6. Design appears in Figma canvas

## Plugin Structure
```
figma-plugin/
├── manifest.json          # Plugin manifest
├── code.ts               # Main plugin logic (Figma Plugin API)
├── ui.html               # Plugin UI (if needed)
└── README.md             # Plugin documentation
```

## Figma Plugin API
- Uses Figma Plugin API (NOT REST API)
- Runs inside Figma Desktop/Web app
- Has full access to create/modify design elements
- Can create: Frames, Text, Rectangles, Images, Groups, etc.

# HTML to Figma - Figma Plugin

# HTML to Figma Plugin

🎨 **Import extracted HTML designs directly into Figma**

This Figma Desktop plugin works in conjunction with the HTML to Figma Chrome Extension to convert extracted web page data into editable Figma designs.

## Features

- ✅ **JSON Data Import** - Paste extracted data from Chrome extension
- ✅ **Automatic Frame Creation** - Converts HTML elements to Figma frames
- ✅ **Style Preservation** - Maintains colors, typography, spacing, and effects
- ✅ **Layout Intelligence** - Recreates CSS Grid, Flexbox, and positioning
- ✅ **Image Import** - Embeds base64 images as fills
- ✅ **SVG Support** - Imports SVG graphics as vector objects
- ✅ **Layer Naming** - Intelligent naming based on HTML structure

## Installation

### Prerequisites
- Figma Desktop application (not browser version)
- HTML to Figma Chrome Extension installed

### Install Plugin

1. **Download Plugin Files**
   - Clone or download this repository
   - Navigate to the `figma-plugin` folder

2. **Build Plugin (TypeScript Compilation)**
   ```bash
   cd figma-plugin
   npm install
   npm run build
   ```

3. **Import to Figma**
   - Open Figma Desktop
   - Go to Menu → Plugins → Development → "Import plugin from manifest..."
   - Select the `manifest.json` file in the `figma-plugin` folder
   - Plugin is now available in your Plugins menu

## Usage

### Step-by-Step

1. **Extract Website Data**
   - Use the HTML to Figma Chrome Extension on any website
   - Click "Extract Page" and copy the JSON data to clipboard

2. **Open Figma**
   - Create a new file or open existing one
   - Navigate to canvas where you want to import

3. **Run Plugin**
   - Menu → Plugins → Development → "HTML to Figma"
   - Or use Quick Actions: Ctrl/Cmd + / and search for "HTML to Figma"

4. **Paste JSON Data**
   - The plugin UI will show a text area
   - Paste the copied JSON (Ctrl+V / Cmd+V)
   - Or load from a saved .json file

5. **Create Design**
   - Click "Create Design" button
   - Wait for processing (typically 1-5 seconds)
   - Elements will appear in your canvas

6. **Edit & Refine**
   - All elements are standard Figma objects
   - Adjust positioning, colors, typography
   - Group related elements
   - Add your own design touches

## Data Structure

The plugin expects JSON data in the following format:

```typescript
{
  metadata: {
    title: string;
    url: string;
    timestamp: string;
    viewport: { width: number; height: number };
  },
  tree: {
    tagName: string;
    figmaData: {
      type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'IMAGE';
      name: string;
      layout: { x: number; y: number; width: number; height: number };
      fills: Array<{ type: 'SOLID'; color: { r, g, b, a } }>;
      // ... additional Figma properties
    },
    children: Array<ElementNode>;
  },
  images: Array<{ id, url, base64 }>;
  svgs: Array<{ id, markup, dimensions }>;
  fonts: Array<{ family, weight, style }>;
}
```

See [INTERFACES.md](../docs/INTERFACES.md) for complete data structure documentation.

## Element Mapping

### HTML to Figma Conversion

| HTML Element | Figma Node Type | Notes |
|--------------|-----------------|-------|
| `<div>`, `<section>`, `<article>` | FRAME | Container elements |
| `<p>`, `<span>`, `<h1>-<h6>` | TEXT | Text elements with typography |
| `<img>` | RECTANGLE with image fill | Base64 embedded images |
| `<svg>` | VECTOR | Inline SVG as vector graphics |
| Background colors | RECTANGLE behind content | Layered approach |
| CSS Grid/Flexbox | FRAME with Auto Layout | Smart layout recreation |

### Style Mapping

| CSS Property | Figma Property | Conversion |
|--------------|----------------|------------|
| `color` | text.fills | RGB normalized to 0-1 |
| `background-color` | fills | SOLID paint type |
| `font-family` | fontName.family | Font matching |
| `font-size` | fontSize | Pixels |
| `font-weight` | fontName.weight | 100-900 scale |
| `line-height` | lineHeight | Auto or pixels |
| `letter-spacing` | letterSpacing | Pixels |
| `text-align` | textAlignHorizontal | LEFT, CENTER, RIGHT |
| `box-shadow` | effects | DROP_SHADOW effect |
| `border` | strokes | SOLID stroke |
| `border-radius` | cornerRadius | Pixels |
| `opacity` | opacity | 0-1 scale |
| `z-index` | Layer order | Stacking context |

## Limitations

### Known Issues
- **Fonts:** Some fonts may not be available in Figma (falls back to similar fonts)
- **Complex Layouts:** Nested absolute positioning may need manual adjustment
- **Animations:** CSS animations and transitions are not preserved
- **Pseudo-elements:** ::before and ::after content not captured
- **Dynamic Content:** JavaScript-generated content captured in current state only
- **Large Pages:** Pages with 1000+ elements may take longer to process

### Workarounds
- **Missing Fonts:** Install fonts in Figma or replace with available fonts
- **Layout Issues:** Use Figma's Auto Layout to refine structure
- **Large Imports:** Extract specific sections instead of entire page
- **Performance:** Close other Figma files during import

## Development

### Build from Source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Watch mode for development
npm run watch
```

### File Structure

```
figma-plugin/
├── code.ts           # Main plugin logic (TypeScript)
├── ui.html           # Plugin UI interface
├── manifest.json     # Figma plugin manifest
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

### Making Changes

1. Edit `code.ts` for plugin logic
2. Edit `ui.html` for UI changes
3. Run `npm run build` to compile
4. Reload plugin in Figma (Plugins → Development → Reload plugin)
5. Test changes

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["ES2015"],
    "module": "commonjs",
    "strict": true,
    "typeRoots": ["./node_modules/@types", "./node_modules/@figma"]
  }
}
```

## Troubleshooting

### Plugin Not Appearing
**Problem:** Plugin doesn't show in Plugins menu

**Solutions:**
1. Ensure Figma Desktop is used (not browser version)
2. Check plugin is imported (Menu → Plugins → Development)
3. Verify manifest.json path is correct
4. Try removing and re-importing plugin

### "Invalid JSON" Error
**Problem:** Plugin shows "Invalid JSON" when pasting data

**Solutions:**
1. Re-extract data from Chrome extension
2. Verify entire JSON is copied (check brackets at start/end)
3. Save JSON to file and verify with JSON validator
4. Ensure no extra characters were added during copy/paste

### Elements Not Creating
**Problem:** Plugin runs but no elements appear in canvas

**Solutions:**
1. Check Figma console for errors (Plugins → Development → Show console)
2. Verify JSON structure matches expected format
3. Check if elements are created outside visible canvas (zoom out)
4. Try with simpler page first (e.g., example.com)

### Font Errors
**Problem:** "Font is not available" errors

**Solutions:**
1. Install missing fonts in Figma
2. Edit JSON and replace font names with available fonts
3. Use Figma's font replacement feature after import

### Performance Issues
**Problem:** Plugin takes very long or crashes

**Solutions:**
1. Extract smaller sections of page
2. Close other Figma files
3. Restart Figma Desktop
4. Check system resources (RAM, CPU)

## Support

- **Bug Reports:** [GitHub Issues](https://github.com/yourusername/figma-chrome-extension/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/yourusername/figma-chrome-extension/discussions)
- **Documentation:** [Main Project Docs](../docs/)

## License

MIT License - see [LICENSE](../LICENSE) file for details.

---

**Version:** 1.0.0  
**Figma API Version:** 1.0  
**Compatible with:** Figma Desktop 116+

## Overview

The plugin receives extracted HTML/CSS data from the Chrome extension and creates corresponding design elements in Figma, preserving layout, typography, colors, and effects.

## Architecture

```
[Chrome Extension] 
    ↓ (Extract & Copy)
[Clipboard JSON]
    ↓ (Paste into Plugin)
[Figma Plugin UI]
    ↓ (Parse & Create)
[Figma Design Nodes]
```

### Communication Flow

1. User runs Chrome extension on a webpage
2. Extension extracts DOM structure and computed styles
3. Data is copied to clipboard in JSON format
4. User opens this Figma plugin
5. User pastes data into the plugin UI
6. Plugin creates Figma nodes matching the original design

### Data Format

The plugin expects JSON data with this structure:

```json
{
  "metadata": {
    "url": "https://example.com",
    "title": "Page Title",
    "viewport": { "width": 1440, "height": 900 },
    "timestamp": 1234567890
  },
  "tree": {
    "tagName": "body",
    "attributes": { "id": "main", "class": "container" },
    "styles": {
      "display": "flex",
      "flexDirection": "column",
      "width": "1440px",
      "backgroundColor": "rgb(255, 255, 255)",
      "padding": { "top": "20px", "right": "20px", "bottom": "20px", "left": "20px" }
    },
    "children": [...]
  },
  "images": [
    { "src": "...", "width": 200, "height": 100, "position": { "x": 0, "y": 0 } }
  ],
  "fonts": ["Inter", "Arial", "Roboto"]
}
```

## Implementation Status

### ✅ Phase 4 Complete

- ✅ Plugin manifest.json
- ✅ UI for data input (ui.html)
- ✅ Main plugin code (code.ts)
- ✅ Node creation engine
  - Frame nodes with auto-layout (flexbox support)
  - Text nodes with typography
  - Rectangle nodes (for images/placeholders)
  - Vector nodes (SVG support)
- ✅ Style application
  - Colors (fills, strokes)
  - Effects (box-shadow → DROP_SHADOW)
  - Border radius
  - Opacity
  - Padding and spacing
- ✅ Layout engine
  - Flexbox → Auto-layout (VERTICAL/HORIZONTAL)
  - Justify-content → primaryAxisAlignItems
  - Align-items → counterAxisAlignItems
  - Gap → itemSpacing
- ✅ Typography mapping
  - Font family, size, weight, style
  - Text align, line height, letter spacing
  - Color
- ✅ Recursive tree traversal

### Node Type Mapping

| HTML Element | Figma Node Type | Notes |
|--------------|----------------|-------|
| `<div>`, `<section>`, `<article>` | Frame | Container with auto-layout if flex |
| `<h1>`-`<h6>`, `<p>`, `<span>`, `<a>` | Text | Typography preserved |
| `<img>` | Rectangle | Placeholder (actual images need hash) |
| `<svg>`, `<path>`, `<circle>` | Vector | Simplified vector support |
| Others | Frame | Default fallback |

### Style Mapping

| CSS Property | Figma Property | Implementation |
|--------------|----------------|----------------|
| `background-color` | fills (SOLID) | ✅ RGB/RGBA/Hex support |
| `border` | strokes | ✅ Width, color, style |
| `border-radius` | cornerRadius | ✅ Parsed from px |
| `box-shadow` | effects (DROP_SHADOW) | ✅ Offset, blur, color |
| `display: flex` | layoutMode | ✅ VERTICAL/HORIZONTAL |
| `flex-direction` | layoutMode | ✅ Column → VERTICAL |
| `justify-content` | primaryAxisAlignItems | ✅ MIN/CENTER/MAX/SPACE_BETWEEN |
| `align-items` | counterAxisAlignItems | ✅ MIN/CENTER/MAX |
| `gap` | itemSpacing | ✅ Parsed from px |
| `padding` | padding{Top,Right,Bottom,Left} | ✅ All sides |
| `opacity` | opacity | ✅ 0-1 range |
| `font-family` | fontName.family | ✅ With fallback to Inter |
| `font-size` | fontSize | ✅ px/em/rem → px |
| `font-weight` | fontName.style | ✅ 100-900 → Regular/Bold/etc |
| `text-align` | textAlignHorizontal | ✅ LEFT/CENTER/RIGHT/JUSTIFIED |
| `line-height` | lineHeight | ✅ AUTO/PIXELS/PERCENT |
| `letter-spacing` | letterSpacing | ✅ PIXELS unit |
| `color` | fills (text) | ✅ RGB/RGBA/Hex |

## Installation & Usage

### For Developers

1. Install dependencies in the plugin folder:
   ```bash
   cd figma-plugin
   npm install
   ```

2. Build the TypeScript code:
   ```bash
   npm run build
   ```

3. In Figma Desktop app:
   - Go to **Plugins** → **Development** → **Import plugin from manifest**
   - Select this folder's `manifest.json`
   - Plugin appears in Plugins menu

### For Users

1. Run the HTML to Figma Chrome extension on any webpage
2. Click "Extract Page" button
3. Data is automatically copied to clipboard
4. Open Figma and run this plugin: **Plugins** → **HTML to Figma**
5. Paste the data into the text area
6. Click "Create Design in Figma"
7. The plugin will create a frame with all extracted elements

## Development

### Project Structure

```
figma-plugin/
├── manifest.json      # Plugin configuration
├── ui.html           # Plugin UI (shown to user)
├── code.ts           # Main plugin logic (TypeScript)
├── code.js           # Compiled output (created by tsc)
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

### Development Workflow

1. Make changes to `code.ts`
2. Run `npm run build` to compile
3. Reload plugin in Figma: **Plugins** → **Development** → **Reload plugin**
4. Test with sample data

### Watch Mode

For active development:
```bash
npm run watch
```

This will automatically recompile on file changes.

## Testing

To test the plugin:

1. Copy sample data from `../docs/sample-extracted-data.json` (if available)
2. Open plugin in Figma
3. Paste data and create design
4. Verify:
   - Hierarchy is preserved
   - Layout matches original (spacing, alignment)
   - Colors are accurate
   - Typography is correct
   - Effects (shadows) are applied

## Limitations & Known Issues

1. **Images**: Currently creates placeholder rectangles. Actual image import requires Figma image hashes.
2. **Fonts**: Only supports fonts available in Figma. Falls back to Inter for unavailable fonts.
3. **SVG**: Basic vector support. Complex SVG paths not fully parsed.
4. **Gradients**: Basic linear gradient support. Radial/complex gradients not implemented.
5. **Transforms**: CSS transforms (rotate, scale, skew) not yet mapped to Figma.
6. **Grid Layout**: CSS Grid not yet implemented (only Flexbox → Auto-layout).
7. **Absolute Positioning**: Elements with absolute positioning may not render correctly.

## Future Enhancements

- [ ] Image import with base64 encoding
- [ ] Advanced font mapping with Google Fonts
- [ ] Component extraction and reuse detection
- [ ] Variants support for responsive designs
- [ ] CSS Grid → Figma layout
- [ ] CSS Transform → Figma transform/rotation
- [ ] Advanced gradient support
- [ ] Animation/transition metadata
- [ ] Batch processing for multiple pages

## Contributing

This plugin is part of the larger HTML to Figma project. See the main README for contribution guidelines.

## License

MIT License - See LICENSE file in project root


## Next Steps
1. Build Chrome Extension data extractor
2. Define complete data schema
3. Implement Figma Plugin to consume data
4. Test end-to-end flow
