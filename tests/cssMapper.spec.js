// Unit tests for CSS to Figma Mapper
const cssMapper = require('../src/parsers/cssMapper');

describe('CSS to Figma Mapper', () => {
  
  describe('parseColor', () => {
    test('parses rgba color correctly', () => {
      const result = cssMapper.parseColor('rgba(255, 128, 64, 0.5)');
      expect(result).toEqual({
        rgb: { r: 1, g: 128/255, b: 64/255 },
        opacity: 0.5
      });
    });

    test('parses rgb color correctly', () => {
      const result = cssMapper.parseColor('rgb(255, 0, 0)');
      expect(result).toEqual({
        rgb: { r: 1, g: 0, b: 0 },
        opacity: 1
      });
    });

    test('parses hex color correctly', () => {
      const result = cssMapper.parseColor('#ff8040');
      expect(result.rgb.r).toBeCloseTo(1);
      expect(result.rgb.g).toBeCloseTo(128/255, 2);
      expect(result.rgb.b).toBeCloseTo(64/255, 2);
      expect(result.opacity).toBe(1);
    });

    test('parses 3-digit hex color correctly', () => {
      const result = cssMapper.parseColor('#f00');
      expect(result.rgb).toEqual({ r: 1, g: 0, b: 0 });
      expect(result.opacity).toBe(1);
    });

    test('parses named color correctly', () => {
      const result = cssMapper.parseColor('black');
      expect(result.rgb).toEqual({ r: 0, g: 0, b: 0 });
      expect(result.opacity).toBe(1);
    });

    test('returns null for transparent', () => {
      const result = cssMapper.parseColor('transparent');
      expect(result).toBeNull();
    });
  });

  describe('convertUnit', () => {
    test('converts px to number', () => {
      expect(cssMapper.convertUnit('16px')).toBe(16);
      expect(cssMapper.convertUnit('100px')).toBe(100);
    });

    test('converts em to px (approximate)', () => {
      expect(cssMapper.convertUnit('1em')).toBe(16);
      expect(cssMapper.convertUnit('2em')).toBe(32);
    });

    test('converts rem to px (approximate)', () => {
      expect(cssMapper.convertUnit('1rem')).toBe(16);
      expect(cssMapper.convertUnit('1.5rem')).toBe(24);
    });

    test('returns 0 for auto/none', () => {
      expect(cssMapper.convertUnit('auto')).toBe(0);
      expect(cssMapper.convertUnit('none')).toBe(0);
    });

    test('handles percentage', () => {
      expect(cssMapper.convertUnit('50%')).toBe(50);
    });
  });

  describe('parseFontWeight', () => {
    test('converts named weights', () => {
      expect(cssMapper.parseFontWeight('normal')).toBe(400);
      expect(cssMapper.parseFontWeight('bold')).toBe(700);
      expect(cssMapper.parseFontWeight('lighter')).toBe(300);
    });

    test('converts numeric weights', () => {
      expect(cssMapper.parseFontWeight('600')).toBe(600);
      expect(cssMapper.parseFontWeight('900')).toBe(900);
    });

    test('defaults to 400', () => {
      expect(cssMapper.parseFontWeight('')).toBe(400);
      expect(cssMapper.parseFontWeight(undefined)).toBe(400);
    });
  });

  describe('mapTextAlign', () => {
    test('maps text-align values', () => {
      expect(cssMapper.mapTextAlign('left')).toBe('LEFT');
      expect(cssMapper.mapTextAlign('center')).toBe('CENTER');
      expect(cssMapper.mapTextAlign('right')).toBe('RIGHT');
      expect(cssMapper.mapTextAlign('justify')).toBe('JUSTIFIED');
    });

    test('defaults to LEFT', () => {
      expect(cssMapper.mapTextAlign('start')).toBe('LEFT');
      expect(cssMapper.mapTextAlign('')).toBe('LEFT');
    });
  });

  describe('parseLineHeight', () => {
    test('returns AUTO for normal', () => {
      const result = cssMapper.parseLineHeight('normal', '16px');
      expect(result).toEqual({ unit: 'AUTO' });
    });

    test('parses px values', () => {
      const result = cssMapper.parseLineHeight('24px', '16px');
      expect(result).toEqual({ unit: 'PIXELS', value: 24 });
    });

    test('parses percentage values', () => {
      const result = cssMapper.parseLineHeight('150%', '16px');
      expect(result).toEqual({ unit: 'PERCENT', value: 150 });
    });

    test('parses unitless multiplier', () => {
      const result = cssMapper.parseLineHeight('1.5', '16px');
      expect(result).toEqual({ unit: 'PERCENT', value: 150 });
    });
  });

  describe('parseCornerRadius', () => {
    test('parses valid radius', () => {
      expect(cssMapper.parseCornerRadius('8px')).toBe(8);
      expect(cssMapper.parseCornerRadius('16px')).toBe(16);
    });

    test('returns 0 for no radius', () => {
      expect(cssMapper.parseCornerRadius('0px')).toBe(0);
      expect(cssMapper.parseCornerRadius('')).toBe(0);
    });
  });

  describe('mapLayoutMode', () => {
    test('maps flex layouts', () => {
      expect(cssMapper.mapLayoutMode({ display: 'flex', flexDirection: 'row' })).toBe('HORIZONTAL');
      expect(cssMapper.mapLayoutMode({ display: 'flex', flexDirection: 'column' })).toBe('VERTICAL');
    });

    test('returns NONE for non-flex', () => {
      expect(cssMapper.mapLayoutMode({ display: 'block' })).toBe('NONE');
      expect(cssMapper.mapLayoutMode({ display: 'inline' })).toBe('NONE');
    });
  });

  describe('mapFills', () => {
    test('maps background color to fill', () => {
      const styles = {
        backgroundColor: 'rgb(255, 0, 0)',
        backgroundImage: ''
      };
      const fills = cssMapper.mapFills(styles);
      
      expect(fills.length).toBe(1);
      expect(fills[0].type).toBe('SOLID');
      expect(fills[0].color.r).toBe(1);
      expect(fills[0].color.g).toBe(0);
      expect(fills[0].color.b).toBe(0);
      expect(fills[0].opacity).toBe(1);
    });

    test('returns empty array for transparent', () => {
      const styles = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        backgroundImage: ''
      };
      const fills = cssMapper.mapFills(styles);
      expect(fills.length).toBe(0);
    });
  });

  describe('mapStrokes', () => {
    test('maps border to stroke', () => {
      const styles = {
        border: {
          width: '2px',
          color: 'rgb(0, 0, 255)',
          style: 'solid'
        }
      };
      const strokes = cssMapper.mapStrokes(styles);
      
      expect(strokes.length).toBe(1);
      expect(strokes[0].type).toBe('SOLID');
      expect(strokes[0].color.b).toBe(1);
    });

    test('returns empty array for no border', () => {
      const styles = {
        border: {
          width: '0px',
          color: '',
          style: 'none'
        }
      };
      const strokes = cssMapper.mapStrokes(styles);
      expect(strokes.length).toBe(0);
    });
  });

  describe('mapLayout', () => {
    test('maps complete layout properties', () => {
      const styles = {
        width: '200px',
        height: '100px',
        left: '10px',
        top: '20px',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        padding: {
          top: '16px',
          right: '16px',
          bottom: '16px',
          left: '16px'
        },
        border: {
          radius: '8px'
        }
      };
      
      const layout = cssMapper.mapLayout(styles);
      
      expect(layout.width).toBe(200);
      expect(layout.height).toBe(100);
      expect(layout.x).toBe(10);
      expect(layout.y).toBe(20);
      expect(layout.layoutMode).toBe('HORIZONTAL');
      expect(layout.itemSpacing).toBe(8);
      expect(layout.padding.top).toBe(16);
      expect(layout.cornerRadius).toBe(8);
      expect(layout.positioning).toBe('ABSOLUTE');
    });
  });

  describe('mapTypography', () => {
    test('maps complete typography properties', () => {
      const styles = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: '1.5',
        letterSpacing: '0.5px',
        color: 'rgb(0, 0, 0)'
      };
      
      const typography = cssMapper.mapTypography(styles);
      
      expect(typography.fontFamily).toBe('Arial, sans-serif');
      expect(typography.fontSize).toBe(18);
      expect(typography.fontWeight).toBe(700);
      expect(typography.fontStyle).toBe('ITALIC');
      expect(typography.textAlign).toBe('CENTER');
      expect(typography.lineHeight.value).toBe(150);
      expect(typography.letterSpacing).toBe(0.5);
      expect(typography.color.rgb.r).toBe(0);
    });
  });

  describe('mapStylesToFigma', () => {
    test('returns null for invalid input', () => {
      expect(cssMapper.mapStylesToFigma(null)).toBeNull();
      expect(cssMapper.mapStylesToFigma({})).toBeNull();
    });

    test('maps complete element data', () => {
      const elementData = {
        tagName: 'div',
        styles: {
          backgroundColor: 'rgb(255, 255, 255)',
          color: 'rgb(0, 0, 0)',
          width: '100px',
          height: '100px',
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: '400',
          display: 'block',
          border: {
            width: '1px',
            color: 'rgb(200, 200, 200)',
            radius: '4px'
          },
          padding: {
            top: '8px',
            right: '8px',
            bottom: '8px',
            left: '8px'
          }
        }
      };
      
      const figmaData = cssMapper.mapStylesToFigma(elementData);
      
      expect(figmaData).toHaveProperty('fills');
      expect(figmaData).toHaveProperty('strokes');
      expect(figmaData).toHaveProperty('effects');
      expect(figmaData).toHaveProperty('layout');
      expect(figmaData).toHaveProperty('typography');
      expect(figmaData).toHaveProperty('constraints');
      
      expect(figmaData.fills.length).toBeGreaterThan(0);
      expect(figmaData.layout.width).toBe(100);
      expect(figmaData.typography.fontSize).toBe(16);
    });
  });
});
