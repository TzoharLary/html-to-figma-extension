// CSS to Figma Data Mapper
// Converts extracted CSS properties to Figma-compatible data structures

/**
 * Map raw CSS styles to Figma-compatible format
 * @param {Object} elementData - Element data from DOM extractor
 * @returns {Object} Figma-compatible style data
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
 * @param {Object} styles - CSS styles object
 * @returns {Array} Figma fills array
 */
function mapFills(styles) {
  const fills = [];
  
  // Background color
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
  
  // Background gradient
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
 * @param {Object} styles - CSS styles object
 * @returns {Array} Figma strokes array
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
 * Map CSS effects (shadows, blur) to Figma effects
 * @param {Object} styles - CSS styles object
 * @returns {Array} Figma effects array
 */
function mapEffects(styles) {
  const effects = [];
  
  // Box shadow
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
  
  // Opacity
  if (styles.opacity && parseFloat(styles.opacity) < 1) {
    // Opacity is handled at node level in Figma, not as an effect
    // But we track it here for completeness
  }
  
  return effects;
}

/**
 * Map CSS layout properties to Figma layout
 * @param {Object} styles - CSS styles object
 * @returns {Object} Figma layout properties
 */
function mapLayout(styles) {
  return {
    width: convertUnit(styles.width),
    height: convertUnit(styles.height),
    x: convertUnit(styles.left) || 0,
    y: convertUnit(styles.top) || 0,
    // Auto-layout (Flexbox)
    layoutMode: mapLayoutMode(styles),
    layoutAlign: mapLayoutAlign(styles),
    itemSpacing: convertUnit(styles.gap) || 0,
    padding: {
      top: convertUnit(styles.padding.top) || 0,
      right: convertUnit(styles.padding.right) || 0,
      bottom: convertUnit(styles.padding.bottom) || 0,
      left: convertUnit(styles.padding.left) || 0
    },
    // Border radius
    cornerRadius: parseCornerRadius(styles.border.radius),
    // Position
    positioning: styles.position === 'absolute' ? 'ABSOLUTE' : 'AUTO'
  };
}

/**
 * Map CSS typography to Figma text styles
 * @param {Object} styles - CSS styles object
 * @returns {Object} Figma typography properties
 */
function mapTypography(styles) {
  return {
    fontFamily: styles.fontFamily || 'Inter',
    fontSize: convertUnit(styles.fontSize) || 16,
    fontWeight: parseFontWeight(styles.fontWeight),
    fontStyle: styles.fontStyle === 'italic' ? 'ITALIC' : 'NORMAL',
    textAlign: mapTextAlign(styles.textAlign),
    lineHeight: parseLineHeight(styles.lineHeight, styles.fontSize),
    letterSpacing: convertUnit(styles.letterSpacing) || 0,
    textTransform: styles.textTransform,
    textDecoration: styles.textDecoration,
    color: parseColor(styles.color)
  };
}

/**
 * Map CSS positioning to Figma constraints
 * @param {Object} styles - CSS styles object
 * @returns {Object} Figma constraints
 */
function mapConstraints(styles) {
  // Figma constraints determine how a layer resizes with its parent
  return {
    horizontal: 'MIN', // LEFT, RIGHT, CENTER, SCALE, STRETCH, MIN, MAX
    vertical: 'MIN'
  };
}

// ========== Utility Functions ==========

/**
 * Parse color string to Figma color object
 * @param {string} colorString - CSS color (hex, rgb, rgba, hsl, etc.)
 * @returns {Object|null} {rgb: {r, g, b}, opacity}
 */
function parseColor(colorString) {
  if (!colorString || colorString === 'transparent') {
    return null;
  }
  
  // Handle rgba
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
  
  // Handle hex
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
  
  // Named colors (basic support)
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
 * Parse CSS gradient to Figma gradient
 * @param {string} gradientString - CSS gradient
 * @returns {Object|null} Figma gradient object
 */
function parseGradient(gradientString) {
  // Basic linear gradient support
  if (gradientString.includes('linear-gradient')) {
    // This is simplified - full gradient parsing is complex
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
 * @param {string} shadowString - CSS box-shadow
 * @returns {Array} Array of shadow objects
 */
function parseBoxShadow(shadowString) {
  // Simplified parsing - real implementation needs to handle multiple shadows
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
 * @param {string} value - CSS value with unit
 * @returns {number} Value in pixels
 */
function convertUnit(value) {
  if (!value || value === 'auto' || value === 'none') {
    return 0;
  }
  
  const num = parseFloat(value);
  
  // Already in pixels
  if (value.endsWith('px')) {
    return num;
  }
  
  // Em/Rem (approximate - would need context for exact conversion)
  if (value.endsWith('em') || value.endsWith('rem')) {
    return num * 16; // Assume 16px base
  }
  
  // Percentage (needs context to convert properly)
  if (value.endsWith('%')) {
    return num; // Return as-is, will need parent context
  }
  
  return num;
}

/**
 * Parse CSS font-weight to Figma weight
 * @param {string} weight - CSS font-weight
 * @returns {number} Figma font weight
 */
function parseFontWeight(weight) {
  const weights = {
    'normal': 400,
    'bold': 700,
    'lighter': 300,
    'bolder': 700
  };
  
  return weights[weight] || parseInt(weight) || 400;
}

/**
 * Map CSS text-align to Figma text-align
 * @param {string} align - CSS text-align
 * @returns {string} Figma text align
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
 * @param {string} lineHeight - CSS line-height
 * @param {string} fontSize - CSS font-size for context
 * @returns {Object} Figma line height
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
  
  // Unitless (multiplier)
  return { unit: 'PERCENT', value: value * 100 };
}

/**
 * Parse border-radius
 * @param {string} radius - CSS border-radius
 * @returns {number|Object} Corner radius value or object
 */
function parseCornerRadius(radius) {
  if (!radius || radius === '0px') {
    return 0;
  }
  
  const value = parseFloat(radius);
  return isNaN(value) ? 0 : value;
}

/**
 * Map CSS display/flexbox to Figma layout mode
 * @param {Object} styles - CSS styles
 * @returns {string} Figma layout mode
 */
function mapLayoutMode(styles) {
  if (styles.display === 'flex') {
    return styles.flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
  }
  return 'NONE';
}

/**
 * Map CSS flex/align properties to Figma layout align
 * @param {Object} styles - CSS styles
 * @returns {string} Figma layout align
 */
function mapLayoutAlign(styles) {
  // Simplified - would need more context for complete mapping
  const justifyMap = {
    'flex-start': 'MIN',
    'center': 'CENTER',
    'flex-end': 'MAX',
    'space-between': 'SPACE_BETWEEN'
  };
  
  return justifyMap[styles.justifyContent] || 'MIN';
}

module.exports = {
  mapStylesToFigma,
  mapFills,
  mapStrokes,
  mapEffects,
  mapLayout,
  mapTypography,
  mapConstraints,
  parseColor,
  parseGradient,
  parseBoxShadow,
  convertUnit,
  parseFontWeight,
  mapTextAlign,
  parseLineHeight,
  parseCornerRadius,
  mapLayoutMode,
  mapLayoutAlign
};
