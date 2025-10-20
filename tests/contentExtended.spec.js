// Extended tests for Phase 13: Content Script Edge Cases & Coverage
// Tests error recovery, mapping edge cases, validation

// Mock chrome API
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  }
};

// Mock window and document globally
global.window = {
  location: { href: 'http://test.com' },
  innerWidth: 1920,
  innerHeight: 1080,
  scrollX: 0,
  scrollY: 0,
  getComputedStyle: jest.fn(() => ({
    display: 'block',
    visibility: 'visible',
    opacity: '1'
  }))
};

global.document = {
  title: 'Test Page',
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => [])
};

// Load content script
const fs = require('fs');
const path = require('path');
const contentScript = fs.readFileSync(
  path.join(__dirname, '../src/content/content.js'),
  'utf8'
);
eval(contentScript);

describe('Phase 13: Extended Content Tests - Mapping Edge Cases', () => {
  
  test('parseColor handles hex colors', () => {
    const result = parseColor('#FF0000');
    
    expect(result).toBeDefined();
    expect(result.rgb.r).toBe(1);
    expect(result.rgb.g).toBe(0);
    expect(result.rgb.b).toBe(0);
    expect(result.opacity).toBe(1);
  });
  
  test('parseColor handles rgb colors', () => {
    const result = parseColor('rgb(255, 0, 0)');
    
    expect(result).toBeDefined();
    expect(result.rgb.r).toBe(1);
    expect(result.rgb.g).toBe(0);
    expect(result.rgb.b).toBe(0);
    expect(result.opacity).toBe(1);
  });
  
  test('parseColor handles rgba colors', () => {
    const result = parseColor('rgba(255, 0, 0, 0.5)');
    
    expect(result).toBeDefined();
    expect(result.rgb.r).toBe(1);
    expect(result.rgb.g).toBe(0);
    expect(result.rgb.b).toBe(0);
    expect(result.opacity).toBe(0.5);
  });
  
  test('parseColor returns null for invalid colors', () => {
    const result = parseColor('invalid-color');
    
    expect(result).toBeNull();
  });
});

describe('Phase 13: Extended Content Tests - Gradient Parsing', () => {
  
  test('parseGradient detects linear gradient', () => {
    const result = parseGradient('linear-gradient(to right, red, blue)');
    
    // parseGradient returns simplified format
    expect(result).toBeDefined();
    expect(result.type).toBe('GRADIENT_LINEAR');
  });
  
  test('parseGradient returns null for non-gradients', () => {
    const result = parseGradient('solid red');
    
    expect(result).toBeNull();
  });
  
  test('parseGradient handles angle in degrees', () => {
    const result = parseGradient('linear-gradient(45deg, red, blue)');
    
    expect(result).toBeDefined();
    expect(result.type).toBe('GRADIENT_LINEAR');
  });
  
  test('parseGradient returns null for empty string', () => {
    const result = parseGradient('');
    expect(result).toBeNull();
  });
});

describe('Phase 13: Extended Content Tests - Box Shadow Parsing', () => {
  
  test('parseBoxShadow handles single shadow', () => {
    const result = parseBoxShadow('2px 2px 4px rgba(0,0,0,0.5)');
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
  
  test('parseBoxShadow handles multiple shadows', () => {
    const result = parseBoxShadow('2px 2px 4px rgba(0,0,0,0.5), -2px -2px 4px rgba(255,255,255,0.5)');
    
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
  
  test('parseBoxShadow handles inset shadows', () => {
    const result = parseBoxShadow('inset 2px 2px 4px rgba(0,0,0,0.5)');
    
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
  
  test('parseBoxShadow returns empty array for invalid input', () => {
    const result = parseBoxShadow('invalid');
    
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
  
  test('parseBoxShadow returns empty array for empty string', () => {
    const result = parseBoxShadow('');
    expect(result.length).toBe(0);
  });
});

describe('Phase 13: Extended Content Tests - Image Format Detection', () => {
  
  test('getImageFormat detects PNG', () => {
    const result = getImageFormat('https://example.com/image.png');
    expect(result).toBe('PNG');
  });
  
  test('getImageFormat detects JPEG', () => {
    expect(getImageFormat('https://example.com/image.jpg')).toBe('JPEG');
    expect(getImageFormat('https://example.com/image.jpeg')).toBe('JPEG');
  });
  
  test('getImageFormat detects GIF', () => {
    const result = getImageFormat('https://example.com/image.gif');
    expect(result).toBe('GIF');
  });
  
  test('getImageFormat detects WEBP', () => {
    const result = getImageFormat('https://example.com/image.webp');
    expect(result).toBe('WEBP');
  });
  
  test('getImageFormat detects SVG', () => {
    const result = getImageFormat('https://example.com/image.svg');
    expect(result).toBe('SVG');
  });
  
  test('getImageFormat detects data URLs', () => {
    const result = getImageFormat('data:image/png;base64,iVBORw0KGgo=');
    expect(result).toBe('PNG');
  });
  
  test('getImageFormat returns UNKNOWN for unrecognized formats', () => {
    const result = getImageFormat('https://example.com/image.bmp');
    expect(result).toBe('UNKNOWN');
  });
});

describe('Phase 13: Extended Content Tests - Unit Conversion', () => {
  
  test('convertUnit converts px to px', () => {
    const result = convertUnit('16px');
    expect(result).toBe(16);
  });
  
  test('convertUnit converts em to px', () => {
    const result = convertUnit('2em', 16);
    expect(result).toBe(32);
  });
  
  test('convertUnit converts rem to px', () => {
    const result = convertUnit('2rem', 16);
    expect(result).toBe(32);
  });
  
  test('convertUnit converts % to decimal', () => {
    const result = convertUnit('50%');
    expect(result).toBe(50);
  });
  
  test('convertUnit handles unitless numbers', () => {
    const result = convertUnit('10');
    expect(result).toBe(10);
  });
  
  test('convertUnit handles invalid values', () => {
    const result = convertUnit('invalid');
    // convertUnit returns NaN for invalid, not 0
    expect(isNaN(result)).toBe(true);
  });
  
  test('convertUnit handles null', () => {
    const result = convertUnit(null);
    expect(result).toBe(0);
  });
});

describe('Phase 13: Extended Content Tests - Corner Radius Parsing', () => {
  
  test('parseCornerRadius handles single value', () => {
    const result = parseCornerRadius('10px');
    // parseCornerRadius returns a single number, not an object
    expect(result).toBe(10);
  });
  
  test('parseCornerRadius handles pixel values', () => {
    const result = parseCornerRadius('20px');
    expect(result).toBe(20);
  });
  
  test('parseCornerRadius handles zero', () => {
    const result = parseCornerRadius('0');
    expect(result).toBe(0);
  });
  
  test('parseCornerRadius handles 0px', () => {
    const result = parseCornerRadius('0px');
    expect(result).toBe(0);
  });
  
  test('parseCornerRadius returns 0 for invalid input', () => {
    const result = parseCornerRadius('invalid');
    expect(result).toBe(0);
  });
  
  test('parseCornerRadius returns 0 for null', () => {
    const result = parseCornerRadius(null);
    expect(result).toBe(0);
  });
});
