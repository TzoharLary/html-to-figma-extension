// DOM Extraction Engine
// Traverses the DOM, extracts all elements, and computes their styles

/**
 * Extract complete DOM structure and styles from current page
 * @param {Object} options - Extraction options
 * @returns {Object} Extracted page data
 */
function extractPageData(options = {}) {
  const {
    maxDepth = 50,
    includeHidden = false,
    computeStyles = true,
    selector = 'body'
  } = options;

  const rootElement = document.querySelector(selector);
  if (!rootElement) {
    throw new Error(`Root element not found: ${selector}`);
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
    fonts: extractFonts()
  };

  return extractedData;
}

/**
 * Recursively traverse DOM and extract element data
 * @param {HTMLElement} element - Current element
 * @param {number} depth - Current depth
 * @param {number} maxDepth - Maximum traversal depth
 * @param {boolean} includeHidden - Include hidden elements
 * @param {boolean} computeStyles - Compute and extract styles
 * @returns {Object} Element data
 */
function traverseDOM(element, depth, maxDepth, includeHidden, computeStyles) {
  if (depth > maxDepth) {
    return null;
  }

  // Skip non-visible elements unless includeHidden is true
  if (!includeHidden && !isElementVisible(element)) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const computedStyle = computeStyles ? window.getComputedStyle(element) : null;

  const nodeData = {
    tagName: element.tagName.toLowerCase(),
    id: element.id || null,
    className: element.className || null,
    textContent: getDirectTextContent(element),
    
    // Position and dimensions
    bounds: {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    },
    
    // Computed styles (if enabled)
    styles: computeStyles ? extractComputedStyles(element, computedStyle) : null,
    
    // Attributes
    attributes: extractAttributes(element),
    
    // Children
    children: []
  };

  // Recursively process children
  const children = Array.from(element.children);
  for (const child of children) {
    const childData = traverseDOM(child, depth + 1, maxDepth, includeHidden, computeStyles);
    if (childData) {
      nodeData.children.push(childData);
    }
  }

  return nodeData;
}

/**
 * Check if an element is visible
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  const isStyleVisible = style.display !== 'none' && 
                         style.visibility !== 'hidden' && 
                         style.opacity !== '0';
  
  // In browser, also check offsetParent
  // In test environment (jsdom), offsetParent might not work correctly
  if (typeof element.offsetParent !== 'undefined') {
    return isStyleVisible && element.offsetParent !== null;
  }
  
  return isStyleVisible;
}

/**
 * Get direct text content (not from children)
 * @param {HTMLElement} element
 * @returns {string|null}
 */
function getDirectTextContent(element) {
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  return text.trim() || null;
}

/**
 * Extract relevant computed styles
 * @param {HTMLElement} element
 * @param {CSSStyleDeclaration} computedStyle
 * @returns {Object}
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
    backgroundSize: computedStyle.backgroundSize,
    backgroundPosition: computedStyle.backgroundPosition,
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
 * Extract element attributes
 * @param {HTMLElement} element
 * @returns {Object}
 */
function extractAttributes(element) {
  const attrs = {};
  for (const attr of element.attributes) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}

/**
 * Extract images from page
 * @returns {Array} Array of image data
 */
function extractImages() {
  const images = [];
  const imgElements = document.querySelectorAll('img');
  
  imgElements.forEach((img, index) => {
    if (img.src && isElementVisible(img)) {
      const rect = img.getBoundingClientRect();
      images.push({
        src: img.src,
        alt: img.alt || '',
        width: img.naturalWidth || rect.width,
        height: img.naturalHeight || rect.height,
        position: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        }
      });
    }
  });
  
  return images;
}

/**
 * Extract fonts used in page
 * @returns {Set} Set of unique font families
 */
function extractFonts() {
  const fonts = new Set();
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    if (fontFamily) {
      // Split font-family string (may contain fallbacks)
      const fontList = fontFamily.split(',').map(f => f.trim().replace(/['"]/g, ''));
      fontList.forEach(font => fonts.add(font));
    }
  });
  
  return Array.from(fonts);
}

module.exports = {
  extractPageData,
  extractImages,
  extractFonts,
  traverseDOM,
  isElementVisible,
  extractComputedStyles
};
