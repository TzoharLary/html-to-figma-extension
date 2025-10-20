// Content script for HTML to Figma Extension
// Extracts complete DOM structure and styles from page

// Import error handling utilities
let errorHandling = null;
if (typeof require !== 'undefined') {
  try {
    errorHandling = require('../utils/errorHandling.js');
  } catch (e) {
    // In browser context, errorHandling will remain null
    // Functions will work without validation
  }
}

// Inline DOM extraction functions (avoiding bundler dependency)

/**
 * Extract complete page data
 */
function extractPageData(options = {}) {
  const {
    maxDepth = 50,
    includeHidden = false,
    computeStyles = true,
    selector = 'body'
  } = options;

  // Validate selector if error handling available
  if (errorHandling && errorHandling.validateSelector) {
    try {
      errorHandling.validateSelector(selector);
    } catch (error) {
      console.error('[HTML to Figma] Invalid selector:', error.message);
      throw error;
    }
  }

  const rootElement = document.querySelector(selector);
  if (!rootElement) {
    const error = errorHandling && errorHandling.ExtractionError
      ? new errorHandling.ExtractionError(
          `Root element not found: ${selector}`,
          errorHandling.ERROR_CODES.NO_CONTENT,
          { selector }
        )
      : new Error(`Root element not found: ${selector}`);
    throw error;
  }

  const extractedData = {
    metadata: {
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    tree: traverseDOM(rootElement, 0, maxDepth, includeHidden, computeStyles),
    images: extractImages(),
    svgs: extractSVGs(),
    fonts: extractFonts()
  };

  return extractedData;
}

/**
 * Recursively traverse DOM and extract element data
 */
function traverseDOM(element, depth, maxDepth, includeHidden, computeStyles) {
  if (depth > maxDepth) {
    return null;
  }

  if (!includeHidden && !isElementVisible(element)) {
    return null;
  }

  const elementData = {
    tagName: element.tagName.toLowerCase(),
    attributes: extractAttributes(element),
    textContent: getDirectTextContent(element),
    children: []
  };

  if (computeStyles) {
    const computedStyle = window.getComputedStyle(element);
    elementData.styles = extractComputedStyles(element, computedStyle);
    
    // Add Figma-compatible data mapping
    elementData.figmaData = mapStylesToFigma(elementData);
  }

  // Process children
  for (const child of element.children) {
    const childData = traverseDOM(child, depth + 1, maxDepth, includeHidden, computeStyles);
    if (childData) {
      elementData.children.push(childData);
    }
  }

  return elementData;
}

/**
 * Check if element is visible
 */
function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  const isStyleVisible = style.display !== 'none' && 
                         style.visibility !== 'hidden' && 
                         style.opacity !== '0';
  
  if (typeof element.offsetParent !== 'undefined') {
    return isStyleVisible && element.offsetParent !== null;
  }
  
  return isStyleVisible;
}

/**
 * Extract element attributes
 */
function extractAttributes(element) {
  const attrs = {};
  for (const attr of element.attributes) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}

/**
 * Get direct text content (not from children)
 */
function getDirectTextContent(element) {
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  return text.trim();
}

/**
 * Extract computed styles from element
 */
function extractComputedStyles(element, computedStyle) {
  return {
    // Layout
    display: computedStyle.display,
    position: computedStyle.position,
    top: computedStyle.top,
    left: computedStyle.left,
    right: computedStyle.right,
    bottom: computedStyle.bottom,
    zIndex: computedStyle.zIndex,
    
    // Flexbox
    flexDirection: computedStyle.flexDirection,
    flexWrap: computedStyle.flexWrap,
    justifyContent: computedStyle.justifyContent,
    alignItems: computedStyle.alignItems,
    gap: computedStyle.gap,
    
    // Grid
    gridTemplateColumns: computedStyle.gridTemplateColumns,
    gridTemplateRows: computedStyle.gridTemplateRows,
    gridGap: computedStyle.gridGap,
    gridAutoFlow: computedStyle.gridAutoFlow,
    
    // Box model
    width: computedStyle.width,
    height: computedStyle.height,
    margin: {
      top: computedStyle.marginTop,
      right: computedStyle.marginRight,
      bottom: computedStyle.marginBottom,
      left: computedStyle.marginLeft
    },
    padding: {
      top: computedStyle.paddingTop,
      right: computedStyle.paddingRight,
      bottom: computedStyle.paddingBottom,
      left: computedStyle.paddingLeft
    },
    
    // Border
    border: {
      width: computedStyle.borderWidth,
      style: computedStyle.borderStyle,
      color: computedStyle.borderColor,
      radius: computedStyle.borderRadius
    },
    
    // Colors & Background
    color: computedStyle.color,
    backgroundColor: computedStyle.backgroundColor,
    backgroundImage: computedStyle.backgroundImage,
    backgroundPosition: computedStyle.backgroundPosition,
    backgroundSize: computedStyle.backgroundSize,
    backgroundRepeat: computedStyle.backgroundRepeat,
    
    // Typography
    fontFamily: computedStyle.fontFamily,
    fontSize: computedStyle.fontSize,
    fontWeight: computedStyle.fontWeight,
    fontStyle: computedStyle.fontStyle,
    lineHeight: computedStyle.lineHeight,
    letterSpacing: computedStyle.letterSpacing,
    textAlign: computedStyle.textAlign,
    textDecoration: computedStyle.textDecoration,
    textTransform: computedStyle.textTransform,
    
    // Effects
    opacity: computedStyle.opacity,
    boxShadow: computedStyle.boxShadow,
    textShadow: computedStyle.textShadow,
    transform: computedStyle.transform,
    filter: computedStyle.filter,
    
    // Overflow
    overflow: computedStyle.overflow,
    overflowX: computedStyle.overflowX,
    overflowY: computedStyle.overflowY
  };
}

/**
 * Extract images from page with enhanced metadata
 */
function extractImages() {
  const images = [];
  const imgElements = document.querySelectorAll('img');
  
  imgElements.forEach((img) => {
    if (img.src && isElementVisible(img)) {
      const rect = img.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(img);
      
      const imageData = {
        type: 'IMAGE',
        src: img.src,
        alt: img.alt || '',
        width: img.naturalWidth || rect.width,
        height: img.naturalHeight || rect.height,
        displayWidth: rect.width,
        displayHeight: rect.height,
        position: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        },
        objectFit: computedStyle.objectFit,
        objectPosition: computedStyle.objectPosition,
        isDataUrl: img.src.startsWith('data:'),
        format: getImageFormat(img.src)
      };
      
      // Try to convert to base64 if not already
      if (!imageData.isDataUrl && img.complete && img.naturalWidth > 0) {
        try {
          imageData.base64 = convertImageToBase64(img);
        } catch (e) {
          // CORS or other issues - keep original src
          imageData.base64Error = e.message;
        }
      }
      
      images.push(imageData);
    }
  });
  
  return images;
}

/**
 * Extract SVG elements from page
 */
function extractSVGs() {
  const svgs = [];
  const svgElements = document.querySelectorAll('svg');
  
  svgElements.forEach((svg) => {
    if (isElementVisible(svg)) {
      const rect = svg.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(svg);
      
      const svgData = {
        type: 'SVG',
        markup: svg.outerHTML,
        viewBox: svg.getAttribute('viewBox'),
        width: svg.getAttribute('width') || rect.width,
        height: svg.getAttribute('height') || rect.height,
        displayWidth: rect.width,
        displayHeight: rect.height,
        position: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        },
        fill: computedStyle.fill,
        stroke: computedStyle.stroke,
        strokeWidth: computedStyle.strokeWidth
      };
      
      // Try to convert SVG to data URL for easier handling
      try {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        svgData.dataUrl = 'data:image/svg+xml;base64,' + btoa(svgString);
      } catch (e) {
        svgData.dataUrlError = e.message;
      }
      
      svgs.push(svgData);
    }
  });
  
  return svgs;
}

/**
 * Get image format from URL
 */
function getImageFormat(src) {
  if (src.startsWith('data:image/')) {
    const match = src.match(/^data:image\/([^;]+)/);
    return match ? match[1].toUpperCase() : 'UNKNOWN';
  }
  
  const url = src.toLowerCase();
  if (url.endsWith('.png')) return 'PNG';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'JPEG';
  if (url.endsWith('.gif')) return 'GIF';
  if (url.endsWith('.webp')) return 'WEBP';
  if (url.endsWith('.svg')) return 'SVG';
  
  return 'UNKNOWN';
}

/**
 * Convert image element to base64 data URL
 */
function convertImageToBase64(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  // Try PNG first, fall back to JPEG
  try {
    return canvas.toDataURL('image/png');
  } catch (e) {
    return canvas.toDataURL('image/jpeg', 0.9);
  }
}

/**
 * Extract fonts used in page
 */
function extractFonts() {
  const fonts = new Set();
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    if (fontFamily) {
      const fontList = fontFamily.split(',').map(f => f.trim().replace(/['"]/g, ''));
      fontList.forEach(font => fonts.add(font));
    }
  });
  
  return Array.from(fonts);
}

/**
 * Main extraction function
 */
function performExtraction() {
  try {
    console.log('[HTML to Figma] Starting extraction...');
    
    const pageData = extractPageData({
      maxDepth: 50,
      includeHidden: false,
      computeStyles: true,
      selector: 'body'
    });
    
    console.log('[HTML to Figma] Extraction complete. Elements:', countElements(pageData.tree));
    
    // Validate extracted data if error handling available
    if (errorHandling && errorHandling.validateExtractionData) {
      const validation = errorHandling.validateExtractionData(pageData);
      if (!validation.valid) {
        const error = new errorHandling.ExtractionError(
          'Invalid extraction data: ' + validation.errors.join(', '),
          errorHandling.ERROR_CODES.EXTRACTION_FAILED,
          { errors: validation.errors }
        );
        console.error('[HTML to Figma] Validation failed:', validation.errors);
        throw error;
      }
    }
    
    // Validate data size if error handling available
    if (errorHandling && errorHandling.validateDataSize) {
      try {
        const sizeCheck = errorHandling.validateDataSize(pageData);
        console.log('[HTML to Figma] Data size:', (sizeCheck.sizeInBytes / 1024 / 1024).toFixed(2), 'MB');
      } catch (error) {
        console.error('[HTML to Figma] Data too large:', error.message);
        throw error;
      }
    }
    
    return { success: true, data: pageData };
    
  } catch (error) {
    console.error('[HTML to Figma] Extraction error:', error);
    
    // Log error with context if available
    if (errorHandling && errorHandling.logError) {
      const errorLog = errorHandling.logError(error, {
        url: window.location.href,
        selector: 'body',
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
      console.error('[HTML to Figma] Error log:', errorLog);
    }
    
    return { 
      success: false, 
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Count elements in tree
 */
function countElements(node) {
  if (!node) return 0;
  let count = 1;
  if (node.children) {
    node.children.forEach(child => {
      count += countElements(child);
    });
  }
  return count;
}

// ========== CSS to Figma Mapper Functions ==========

/**
 * Map raw CSS styles to Figma-compatible format
 */
function mapStylesToFigma(elementData) {
  if (!elementData || !elementData.styles) {
    return null;
  }

  const styles = elementData.styles;
  
  return {
    fills: mapFills(styles),
    strokes: mapStrokes(styles),
    effects: mapEffects(styles),
    layout: mapLayout(styles),
    typography: mapTypography(styles),
    constraints: mapConstraints(styles)
  };
}

/**
 * Map CSS colors and backgrounds to Figma fills
 */
function mapFills(styles) {
  const fills = [];
  
  if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    const color = parseColor(styles.backgroundColor);
    if (color) {
      fills.push({
        type: 'SOLID',
        color: color.rgb,
        opacity: color.opacity
      });
    }
  }
  
  if (styles.backgroundImage && styles.backgroundImage.includes('gradient')) {
    const gradient = parseGradient(styles.backgroundImage);
    if (gradient) {
      fills.push(gradient);
    }
  }
  
  return fills;
}

/**
 * Map CSS borders to Figma strokes
 */
function mapStrokes(styles) {
  const strokes = [];
  
  if (styles.border && styles.border.width && styles.border.width !== '0px') {
    const color = parseColor(styles.border.color);
    if (color) {
      strokes.push({
        type: 'SOLID',
        color: color.rgb,
        opacity: color.opacity
      });
    }
  }
  
  return strokes;
}

/**
 * Map CSS effects to Figma effects
 */
function mapEffects(styles) {
  const effects = [];
  
  if (styles.boxShadow && styles.boxShadow !== 'none') {
    const shadows = parseBoxShadow(styles.boxShadow);
    shadows.forEach(shadow => {
      effects.push({
        type: shadow.inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
        color: shadow.color,
        offset: { x: shadow.x, y: shadow.y },
        radius: shadow.blur,
        spread: shadow.spread || 0,
        visible: true,
        blendMode: 'NORMAL'
      });
    });
  }
  
  return effects;
}

/**
 * Map CSS layout to Figma layout
 */
function mapLayout(styles) {
  const layout = {
    width: convertUnit(styles.width),
    height: convertUnit(styles.height),
    x: convertUnit(styles.left) || 0,
    y: convertUnit(styles.top) || 0,
    layoutMode: mapLayoutMode(styles),
    layoutAlign: mapLayoutAlign(styles),
    itemSpacing: convertUnit(styles.gap) || 0,
    padding: {
      top: convertUnit(styles.padding.top) || 0,
      right: convertUnit(styles.padding.right) || 0,
      bottom: convertUnit(styles.padding.bottom) || 0,
      left: convertUnit(styles.padding.left) || 0
    },
    cornerRadius: parseCornerRadius(styles.border.radius),
    positioning: mapPositioning(styles),
    zIndex: parseInt(styles.zIndex) || 0
  };
  
  // Add Grid-specific properties if CSS Grid is detected
  if (styles.display === 'grid') {
    layout.gridProperties = {
      templateColumns: styles.gridTemplateColumns,
      templateRows: styles.gridTemplateRows,
      gap: styles.gridGap,
      autoFlow: styles.gridAutoFlow
    };
  }
  
  // Add absolute positioning coordinates if applicable
  if (styles.position === 'absolute' || styles.position === 'fixed') {
    layout.absolutePosition = {
      top: convertUnit(styles.top),
      right: convertUnit(styles.right),
      bottom: convertUnit(styles.bottom),
      left: convertUnit(styles.left)
    };
  }
  
  return layout;
}

/**
 * Map CSS typography to Figma text styles
 */
function mapTypography(styles) {
  const fontFamily = parseFontFamily(styles.fontFamily);
  const fontSize = convertUnit(styles.fontSize) || 16;
  
  return {
    fontFamily: fontFamily.primary,
    fontFallbacks: fontFamily.fallbacks,
    fontSize: fontSize,
    fontWeight: parseFontWeight(styles.fontWeight),
    fontStyle: styles.fontStyle === 'italic' ? 'ITALIC' : 'NORMAL',
    textAlign: mapTextAlign(styles.textAlign),
    lineHeight: parseLineHeight(styles.lineHeight, styles.fontSize),
    letterSpacing: convertUnit(styles.letterSpacing) || 0,
    textTransform: styles.textTransform,
    textDecoration: styles.textDecoration,
    textDecorationLine: parseTextDecorationLine(styles.textDecoration),
    textDecorationStyle: parseTextDecorationStyle(styles.textDecoration),
    textCase: mapTextCase(styles.textTransform),
    paragraphSpacing: 0, // Can be enhanced with CSS paragraph spacing
    paragraphIndent: 0,  // Can be enhanced with CSS text-indent
    color: parseColor(styles.color)
  };
}

/**
 * Map CSS positioning to Figma constraints
 */
function mapConstraints(styles) {
  const constraints = {
    horizontal: 'MIN',
    vertical: 'MIN'
  };
  
  // Determine horizontal constraint based on position properties
  if (styles.position === 'absolute' || styles.position === 'fixed') {
    const hasLeft = styles.left && styles.left !== 'auto';
    const hasRight = styles.right && styles.right !== 'auto';
    
    if (hasLeft && hasRight) {
      constraints.horizontal = 'STRETCH';
    } else if (hasRight) {
      constraints.horizontal = 'MAX';
    } else if (hasLeft) {
      constraints.horizontal = 'MIN';
    } else {
      constraints.horizontal = 'CENTER';
    }
  }
  
  // Determine vertical constraint based on position properties
  if (styles.position === 'absolute' || styles.position === 'fixed') {
    const hasTop = styles.top && styles.top !== 'auto';
    const hasBottom = styles.bottom && styles.bottom !== 'auto';
    
    if (hasTop && hasBottom) {
      constraints.vertical = 'STRETCH';
    } else if (hasBottom) {
      constraints.vertical = 'MAX';
    } else if (hasTop) {
      constraints.vertical = 'MIN';
    } else {
      constraints.vertical = 'CENTER';
    }
  }
  
  return constraints;
}

/**
 * Map CSS position property to Figma positioning
 */
function mapPositioning(styles) {
  const positionMap = {
    'absolute': 'ABSOLUTE',
    'fixed': 'ABSOLUTE',
    'relative': 'AUTO',
    'static': 'AUTO',
    'sticky': 'AUTO'
  };
  
  return positionMap[styles.position] || 'AUTO';
}

/**
 * Parse color string to Figma color
 */
function parseColor(colorString) {
  if (!colorString || colorString === 'transparent') {
    return null;
  }
  
  const rgbaMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    return {
      rgb: {
        r: parseInt(rgbaMatch[1]) / 255,
        g: parseInt(rgbaMatch[2]) / 255,
        b: parseInt(rgbaMatch[3]) / 255
      },
      opacity: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
    };
  }
  
  const hexMatch = colorString.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    return {
      rgb: {
        r: parseInt(hex.substr(0, 2), 16) / 255,
        g: parseInt(hex.substr(2, 2), 16) / 255,
        b: parseInt(hex.substr(4, 2), 16) / 255
      },
      opacity: 1
    };
  }
  
  const namedColors = {
    'black': { r: 0, g: 0, b: 0 },
    'white': { r: 1, g: 1, b: 1 },
    'red': { r: 1, g: 0, b: 0 },
    'green': { r: 0, g: 0.5, b: 0 },
    'blue': { r: 0, g: 0, b: 1 }
  };
  
  const normalized = colorString.toLowerCase().trim();
  if (namedColors[normalized]) {
    return { rgb: namedColors[normalized], opacity: 1 };
  }
  
  return null;
}

/**
 * Parse CSS gradient
 */
function parseGradient(gradientString) {
  if (gradientString.includes('linear-gradient')) {
    return {
      type: 'GRADIENT_LINEAR',
      gradientStops: [
        { position: 0, color: { r: 0, g: 0, b: 0 }, opacity: 1 },
        { position: 1, color: { r: 1, g: 1, b: 1 }, opacity: 1 }
      ],
      gradientTransform: [[1, 0, 0], [0, 1, 0]]
    };
  }
  return null;
}

/**
 * Parse box-shadow string
 */
function parseBoxShadow(shadowString) {
  const match = shadowString.match(/(inset\s+)?(-?\d+px)\s+(-?\d+px)\s+(\d+px)(?:\s+(-?\d+px))?\s+(.*)/);
  if (!match) return [];
  
  return [{
    inset: !!match[1],
    x: parseFloat(match[2]),
    y: parseFloat(match[3]),
    blur: parseFloat(match[4]),
    spread: match[5] ? parseFloat(match[5]) : 0,
    color: parseColor(match[6]) || { rgb: { r: 0, g: 0, b: 0 }, opacity: 0.25 }
  }];
}

/**
 * Convert CSS unit to pixels
 */
function convertUnit(value) {
  if (!value || value === 'auto' || value === 'none') {
    return 0;
  }
  
  const num = parseFloat(value);
  
  if (value.endsWith('px')) {
    return num;
  }
  
  if (value.endsWith('em') || value.endsWith('rem')) {
    return num * 16;
  }
  
  if (value.endsWith('%')) {
    return num;
  }
  
  return num;
}

/**
 * Parse CSS font-weight
 */
function parseFontWeight(weight) {
  const weights = {
    'normal': 400,
    'bold': 700,
    'lighter': 300,
    'bolder': 700,
    'thin': 100,
    'extra-light': 200,
    'light': 300,
    'medium': 500,
    'semi-bold': 600,
    'extra-bold': 800,
    'black': 900
  };
  return weights[weight] || parseInt(weight) || 400;
}

/**
 * Parse CSS font-family into primary and fallbacks
 */
function parseFontFamily(fontFamilyString) {
  if (!fontFamilyString) {
    return { primary: 'Inter', fallbacks: [] };
  }
  
  // Split by comma and clean up quotes
  const fonts = fontFamilyString
    .split(',')
    .map(f => f.trim().replace(/['"]/g, ''))
    .filter(f => f.length > 0);
  
  // Map common web fonts to Figma-compatible fonts
  const figmaFontMap = {
    'Arial': 'Arial',
    'Helvetica': 'Helvetica',
    'Times New Roman': 'Times New Roman',
    'Times': 'Times New Roman',
    'Courier New': 'Courier New',
    'Courier': 'Courier New',
    'Verdana': 'Verdana',
    'Georgia': 'Georgia',
    'Palatino': 'Palatino',
    'Garamond': 'Garamond',
    'Comic Sans MS': 'Comic Sans MS',
    'Trebuchet MS': 'Trebuchet MS',
    'Impact': 'Impact',
    'Arial Black': 'Arial Black',
    'Roboto': 'Roboto',
    'Open Sans': 'Open Sans',
    'Lato': 'Lato',
    'Montserrat': 'Montserrat',
    'sans-serif': 'Inter',
    'serif': 'Times New Roman',
    'monospace': 'Courier New',
    'cursive': 'Comic Sans MS',
    'fantasy': 'Impact'
  };
  
  const primary = figmaFontMap[fonts[0]] || fonts[0] || 'Inter';
  const fallbacks = fonts.slice(1).map(f => figmaFontMap[f] || f);
  
  return { primary, fallbacks };
}

/**
 * Parse text-decoration-line from text-decoration
 */
function parseTextDecorationLine(textDecoration) {
  if (!textDecoration || textDecoration === 'none') {
    return 'NONE';
  }
  
  if (textDecoration.includes('underline')) {
    return 'UNDERLINE';
  }
  
  if (textDecoration.includes('line-through')) {
    return 'STRIKETHROUGH';
  }
  
  return 'NONE';
}

/**
 * Parse text-decoration-style from text-decoration
 */
function parseTextDecorationStyle(textDecoration) {
  if (!textDecoration || textDecoration === 'none') {
    return 'SOLID';
  }
  
  if (textDecoration.includes('dotted')) {
    return 'DOTTED';
  }
  
  if (textDecoration.includes('dashed')) {
    return 'DASHED';
  }
  
  if (textDecoration.includes('wavy')) {
    return 'WAVY';
  }
  
  return 'SOLID';
}

/**
 * Map CSS text-transform to Figma textCase
 */
function mapTextCase(textTransform) {
  const caseMap = {
    'uppercase': 'UPPER',
    'lowercase': 'LOWER',
    'capitalize': 'TITLE',
    'none': 'ORIGINAL'
  };
  
  return caseMap[textTransform] || 'ORIGINAL';
}

/**
 * Map CSS text-align
 */
function mapTextAlign(align) {
  const mapping = {
    'left': 'LEFT',
    'center': 'CENTER',
    'right': 'RIGHT',
    'justify': 'JUSTIFIED'
  };
  return mapping[align] || 'LEFT';
}

/**
 * Parse CSS line-height
 */
function parseLineHeight(lineHeight, fontSize) {
  if (!lineHeight || lineHeight === 'normal') {
    return { unit: 'AUTO' };
  }
  
  const value = parseFloat(lineHeight);
  
  if (lineHeight.endsWith('px')) {
    return { unit: 'PIXELS', value };
  }
  
  if (lineHeight.endsWith('%')) {
    return { unit: 'PERCENT', value };
  }
  
  return { unit: 'PERCENT', value: value * 100 };
}

/**
 * Parse border-radius
 */
function parseCornerRadius(radius) {
  if (!radius || radius === '0px') {
    return 0;
  }
  const value = parseFloat(radius);
  return isNaN(value) ? 0 : value;
}

/**
 * Map CSS layout mode
 */
function mapLayoutMode(styles) {
  // Flexbox support
  if (styles.display === 'flex') {
    return styles.flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
  }
  
  // CSS Grid support (map to closest Figma equivalent)
  // Note: Figma doesn't have native Grid, so we map to auto-layout
  if (styles.display === 'grid') {
    // Check if grid is more vertical or horizontal based on template
    const cols = styles.gridTemplateColumns;
    const rows = styles.gridTemplateRows;
    
    // Simple heuristic: if more rows than columns, treat as vertical
    if (cols && rows) {
      const colCount = cols.split(' ').length;
      const rowCount = rows.split(' ').length;
      return rowCount > colCount ? 'VERTICAL' : 'HORIZONTAL';
    }
    
    // Default to horizontal for grid
    return 'HORIZONTAL';
  }
  
  return 'NONE';
}

/**
 * Map CSS layout align
 */
function mapLayoutAlign(styles) {
  const justifyMap = {
    'flex-start': 'MIN',
    'center': 'CENTER',
    'flex-end': 'MAX',
    'space-between': 'SPACE_BETWEEN'
  };
  return justifyMap[styles.justifyContent] || 'MIN';
}

// Listen for extraction requests from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACT_PAGE') {
    const result = performExtraction();
    sendResponse(result);
  }
  return true; // Keep channel open for async response
});

console.log('[HTML to Figma] Content script loaded and ready');

// Export for testing (only in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractPageData,
    mapStylesToFigma,
    traverseDOM,
    extractImages,
    extractSVGs,
    getImageFormat,
    mapFills,
    mapStrokes,
    mapEffects,
    mapLayout,
    mapTypography,
    mapConstraints,
    mapPositioning,
    parseColor,
    convertUnit,
    parseFontWeight,
    parseFontFamily,
    parseTextDecorationLine,
    parseTextDecorationStyle,
    mapTextCase,
    mapTextAlign,
    parseLineHeight,
    parseCornerRadius,
    mapLayoutMode,
    mapLayoutAlign
  };
}
