// Figma Plugin Code
// Receives data from Chrome Extension and creates design in Figma

// Show UI
figma.showUI(__html__, { width: 400, height: 500 });

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-design') {
    try {
      await createDesignFromData(msg.data);
    } catch (error) {
      console.error('Design creation error:', error);
      figma.ui.postMessage({
        type: 'creation-error',
        error: error.message
      });
    }
  }
};

/**
 * Main function to create design from extracted data
 */
async function createDesignFromData(data: any) {
  figma.ui.postMessage({
    type: 'creation-progress',
    message: 'Parsing data...'
  });

  // Validate data structure
  if (!data || !data.tree) {
    throw new Error('Invalid data structure. Missing tree property.');
  }

  // Create a new frame for the page
  const pageFrame = figma.createFrame();
  pageFrame.name = data.metadata?.title || 'Imported Page';
  
  if (data.metadata?.viewport) {
    pageFrame.resize(
      data.metadata.viewport.width || 1440,
      data.metadata.viewport.height || 900
    );
  }

  // Set background
  pageFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  figma.ui.postMessage({
    type: 'creation-progress',
    message: 'Creating nodes...'
  });

  let nodeCount = 0;

  // Recursively create nodes from tree
  async function createNodesFromTree(elementData: any, parent: FrameNode | GroupNode): Promise<void> {
    if (!elementData || !elementData.tagName) {
      return;
    }

    const node = await createNodeForElement(elementData, parent);
    if (node) {
      nodeCount++;
      
      // Process children
      if (elementData.children && Array.isArray(elementData.children)) {
        for (const child of elementData.children) {
          if (node.type === 'FRAME' || node.type === 'GROUP') {
            await createNodesFromTree(child, node as FrameNode);
          }
        }
      }
    }
  }

  await createNodesFromTree(data.tree, pageFrame);

  // Select the created frame
  figma.currentPage.selection = [pageFrame];
  figma.viewport.scrollAndZoomIntoView([pageFrame]);

  figma.ui.postMessage({
    type: 'creation-complete',
    nodeCount: nodeCount
  });
}

/**
 * Create appropriate Figma node for an element
 */
async function createNodeForElement(elementData: any, parent: FrameNode | GroupNode): Promise<SceneNode | null> {
  const tagName = elementData.tagName.toLowerCase();
  const styles = elementData.styles || {};

  let node: SceneNode | null = null;

  // Determine node type based on element
  if (tagName === 'img') {
    node = await createImageNode(elementData, parent);
  } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'label'].includes(tagName)) {
    node = await createTextNode(elementData, parent);
  } else if (['svg', 'path', 'circle', 'rect'].includes(tagName)) {
    node = await createVectorNode(elementData, parent);
  } else {
    // Default: create frame or rectangle
    node = createFrameNode(elementData, parent);
  }

  if (node) {
    // Apply common styles
    applyCommonStyles(node, styles);
  }

  return node;
}

/**
 * Create a frame node
 */
function createFrameNode(elementData: any, parent: FrameNode | GroupNode): FrameNode {
  const frame = figma.createFrame();
  frame.name = elementData.attributes?.id || elementData.attributes?.class || elementData.tagName;
  
  const styles = elementData.styles || {};
  
  // Size
  const width = parseSize(styles.width) || 100;
  const height = parseSize(styles.height) || 100;
  frame.resize(width, height);
  
  // Position
  frame.x = parseSize(styles.left) || 0;
  frame.y = parseSize(styles.top) || 0;

  // Auto-layout (if flex)
  if (styles.display === 'flex') {
    frame.layoutMode = styles.flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
    frame.primaryAxisAlignItems = mapJustifyContent(styles.justifyContent);
    frame.counterAxisAlignItems = mapAlignItems(styles.alignItems);
    frame.itemSpacing = parseSize(styles.gap) || 0;
    
    // Padding
    if (styles.padding) {
      frame.paddingTop = parseSize(styles.padding.top) || 0;
      frame.paddingRight = parseSize(styles.padding.right) || 0;
      frame.paddingBottom = parseSize(styles.padding.bottom) || 0;
      frame.paddingLeft = parseSize(styles.padding.left) || 0;
    }
  }

  parent.appendChild(frame);
  return frame;
}

/**
 * Create a text node
 */
async function createTextNode(elementData: any, parent: FrameNode | GroupNode): Promise<TextNode | null> {
  const textContent = elementData.textContent || elementData.attributes?.textContent || 'Text';
  
  if (!textContent.trim()) {
    return null;
  }

  const text = figma.createText();
  text.name = elementData.tagName;
  
  // Load default font
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  
  text.characters = textContent.trim();
  
  const styles = elementData.styles || {};
  
  // Typography
  if (styles.fontSize) {
    text.fontSize = parseSize(styles.fontSize) || 16;
  }
  
  if (styles.fontFamily) {
    try {
      const fontName = parseFontFamily(styles.fontFamily);
      await figma.loadFontAsync(fontName);
      text.fontName = fontName;
    } catch (e) {
      // Font not available, keep Inter
    }
  }
  
  if (styles.fontWeight) {
    const weight = parseFontWeight(styles.fontWeight);
    text.fontName = { family: text.fontName.family, style: weight };
  }
  
  if (styles.textAlign) {
    text.textAlignHorizontal = mapTextAlign(styles.textAlign);
  }
  
  if (styles.lineHeight) {
    const lineHeight = parseLineHeight(styles.lineHeight);
    if (lineHeight.unit === 'PIXELS') {
      text.lineHeight = { unit: 'PIXELS', value: lineHeight.value };
    } else if (lineHeight.unit === 'PERCENT') {
      text.lineHeight = { unit: 'PERCENT', value: lineHeight.value };
    } else {
      text.lineHeight = { unit: 'AUTO' };
    }
  }
  
  if (styles.letterSpacing) {
    text.letterSpacing = { unit: 'PIXELS', value: parseSize(styles.letterSpacing) || 0 };
  }
  
  // Color
  if (styles.color) {
    const color = parseColor(styles.color);
    if (color) {
      text.fills = [{ type: 'SOLID', color: color.rgb, opacity: color.opacity }];
    }
  }
  
  // Position
  text.x = parseSize(styles.left) || 0;
  text.y = parseSize(styles.top) || 0;
  
  parent.appendChild(text);
  return text;
}

/**
 * Create an image node (rectangle with fill)
 */
async function createImageNode(elementData: any, parent: FrameNode | GroupNode): Promise<RectangleNode | null> {
  const rect = figma.createRectangle();
  rect.name = 'Image';
  
  const styles = elementData.styles || {};
  const width = parseSize(styles.width) || 100;
  const height = parseSize(styles.height) || 100;
  
  rect.resize(width, height);
  rect.x = parseSize(styles.left) || 0;
  rect.y = parseSize(styles.top) || 0;
  
  // Placeholder fill (actual image would require image hash)
  rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  
  parent.appendChild(rect);
  return rect;
}

/**
 * Create a vector node
 */
async function createVectorNode(elementData: any, parent: FrameNode | GroupNode): Promise<VectorNode | null> {
  // Simplified - real implementation would parse SVG path data
  const vector = figma.createVector();
  vector.name = elementData.tagName;
  
  const styles = elementData.styles || {};
  vector.x = parseSize(styles.left) || 0;
  vector.y = parseSize(styles.top) || 0;
  
  parent.appendChild(vector);
  return vector;
}

/**
 * Apply common styles to any node
 */
function applyCommonStyles(node: SceneNode, styles: any) {
  // Opacity
  if (styles.opacity && parseFloat(styles.opacity) < 1) {
    node.opacity = parseFloat(styles.opacity);
  }
  
  // Fills (background)
  if ('fills' in node && styles.backgroundColor) {
    const color = parseColor(styles.backgroundColor);
    if (color && color.rgb.r + color.rgb.g + color.rgb.b > 0) {
      node.fills = [{ type: 'SOLID', color: color.rgb, opacity: color.opacity }];
    }
  }
  
  // Strokes (border)
  if ('strokes' in node && styles.border && styles.border.width && parseSize(styles.border.width) > 0) {
    const borderColor = parseColor(styles.border.color);
    if (borderColor) {
      node.strokes = [{ type: 'SOLID', color: borderColor.rgb, opacity: borderColor.opacity }];
      node.strokeWeight = parseSize(styles.border.width) || 1;
    }
  }
  
  // Corner radius
  if ('cornerRadius' in node && styles.border && styles.border.radius) {
    node.cornerRadius = parseSize(styles.border.radius) || 0;
  }
  
  // Effects (shadows)
  if ('effects' in node && styles.boxShadow && styles.boxShadow !== 'none') {
    const effects = parseBoxShadow(styles.boxShadow);
    if (effects.length > 0) {
      node.effects = effects;
    }
  }
}

// ========== UTILITY FUNCTIONS ==========

function parseSize(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (!value || value === 'auto' || value === 'none') return 0;
  
  const num = parseFloat(value as string);
  if (isNaN(num)) return 0;
  
  // Handle different units
  if ((value as string).endsWith('em') || (value as string).endsWith('rem')) {
    return num * 16;
  }
  
  return num;
}

function parseColor(colorString: string): { rgb: RGB, opacity: number } | null {
  if (!colorString || colorString === 'transparent') return null;
  
  // RGBA
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
  
  // Hex
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
  
  return null;
}

function parseBoxShadow(shadowString: string): Effect[] {
  const effects: Effect[] = [];
  
  // Simplified shadow parsing
  const match = shadowString.match(/(-?\d+px)\s+(-?\d+px)\s+(\d+px)(?:\s+(-?\d+px))?\s+(.*)/);
  if (match) {
    const color = parseColor(match[5]) || { rgb: { r: 0, g: 0, b: 0 }, opacity: 0.25 };
    effects.push({
      type: 'DROP_SHADOW',
      color: { ...color.rgb, a: color.opacity },
      offset: { x: parseFloat(match[1]), y: parseFloat(match[2]) },
      radius: parseFloat(match[3]),
      visible: true,
      blendMode: 'NORMAL'
    });
  }
  
  return effects;
}

function parseFontFamily(fontFamily: string): FontName {
  const family = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
  
  // Map common fonts
  const fontMap: { [key: string]: string } = {
    'arial': 'Arial',
    'helvetica': 'Helvetica',
    'times': 'Times New Roman',
    'courier': 'Courier New',
    'verdana': 'Verdana',
    'georgia': 'Georgia'
  };
  
  const mapped = fontMap[family.toLowerCase()] || 'Inter';
  return { family: mapped, style: 'Regular' };
}

function parseFontWeight(weight: string | number): string {
  const weightMap: { [key: string]: string } = {
    '100': 'Thin',
    '200': 'Extra Light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Semi Bold',
    '700': 'Bold',
    '800': 'Extra Bold',
    '900': 'Black',
    'normal': 'Regular',
    'bold': 'Bold'
  };
  
  return weightMap[weight.toString()] || 'Regular';
}

function mapTextAlign(align: string): 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED' {
  const map: { [key: string]: any } = {
    'left': 'LEFT',
    'center': 'CENTER',
    'right': 'RIGHT',
    'justify': 'JUSTIFIED'
  };
  return map[align] || 'LEFT';
}

function mapJustifyContent(justify: string): 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN' {
  const map: { [key: string]: any } = {
    'flex-start': 'MIN',
    'center': 'CENTER',
    'flex-end': 'MAX',
    'space-between': 'SPACE_BETWEEN'
  };
  return map[justify] || 'MIN';
}

function mapAlignItems(align: string): 'MIN' | 'CENTER' | 'MAX' {
  const map: { [key: string]: any } = {
    'flex-start': 'MIN',
    'center': 'CENTER',
    'flex-end': 'MAX'
  };
  return map[align] || 'MIN';
}

function parseLineHeight(lineHeight: string): { unit: string, value: number } {
  if (!lineHeight || lineHeight === 'normal') {
    return { unit: 'AUTO', value: 0 };
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
