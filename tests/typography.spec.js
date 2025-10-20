// Tests for Phase 8: Typography & Fonts
// Tests advanced typography features: font families, fallbacks, decorations, text case

// Mock chrome API
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  }
};

const {
  mapTypography,
  parseFontFamily,
  parseFontWeight,
  parseTextDecorationLine,
  parseTextDecorationStyle,
  mapTextCase
} = require('../src/content/content.js');

describe('Phase 8: Typography - Font Family Mapping', () => {
  test('parseFontFamily extracts primary and fallbacks', () => {
    const result = parseFontFamily('Arial, Helvetica, sans-serif');
    
    expect(result.primary).toBe('Arial');
    expect(result.fallbacks).toEqual(['Helvetica', 'Inter']);
  });
  
  test('parseFontFamily handles quoted font names', () => {
    const result = parseFontFamily('"Times New Roman", Georgia, serif');
    
    expect(result.primary).toBe('Times New Roman');
    expect(result.fallbacks).toEqual(['Georgia', 'Times New Roman']);
  });
  
  test('parseFontFamily maps generic families to Figma fonts', () => {
    const result = parseFontFamily('sans-serif');
    expect(result.primary).toBe('Inter');
  });
  
  test('parseFontFamily maps serif to Times New Roman', () => {
    const result = parseFontFamily('serif');
    expect(result.primary).toBe('Times New Roman');
  });
  
  test('parseFontFamily maps monospace to Courier New', () => {
    const result = parseFontFamily('monospace');
    expect(result.primary).toBe('Courier New');
  });
  
  test('parseFontFamily handles single font', () => {
    const result = parseFontFamily('Roboto');
    
    expect(result.primary).toBe('Roboto');
    expect(result.fallbacks).toEqual([]);
  });
  
  test('parseFontFamily handles empty/null input', () => {
    const result = parseFontFamily('');
    
    expect(result.primary).toBe('Inter');
    expect(result.fallbacks).toEqual([]);
  });
  
  test('parseFontFamily handles Google Fonts', () => {
    const result = parseFontFamily('Montserrat, Open Sans, sans-serif');
    
    expect(result.primary).toBe('Montserrat');
    expect(result.fallbacks).toEqual(['Open Sans', 'Inter']);
  });
});

describe('Phase 8: Typography - Font Weight Mapping', () => {
  test('parseFontWeight handles numeric values', () => {
    expect(parseFontWeight('100')).toBe(100);
    expect(parseFontWeight('400')).toBe(400);
    expect(parseFontWeight('700')).toBe(700);
    expect(parseFontWeight('900')).toBe(900);
  });
  
  test('parseFontWeight handles named values', () => {
    expect(parseFontWeight('normal')).toBe(400);
    expect(parseFontWeight('bold')).toBe(700);
    expect(parseFontWeight('lighter')).toBe(300);
    expect(parseFontWeight('bolder')).toBe(700);
  });
  
  test('parseFontWeight handles extended named values', () => {
    expect(parseFontWeight('thin')).toBe(100);
    expect(parseFontWeight('extra-light')).toBe(200);
    expect(parseFontWeight('light')).toBe(300);
    expect(parseFontWeight('medium')).toBe(500);
    expect(parseFontWeight('semi-bold')).toBe(600);
    expect(parseFontWeight('extra-bold')).toBe(800);
    expect(parseFontWeight('black')).toBe(900);
  });
  
  test('parseFontWeight defaults to 400 for invalid input', () => {
    expect(parseFontWeight('invalid')).toBe(400);
    expect(parseFontWeight('')).toBe(400);
  });
});

describe('Phase 8: Typography - Text Decoration', () => {
  test('parseTextDecorationLine detects underline', () => {
    expect(parseTextDecorationLine('underline')).toBe('UNDERLINE');
    expect(parseTextDecorationLine('underline solid')).toBe('UNDERLINE');
  });
  
  test('parseTextDecorationLine detects line-through', () => {
    expect(parseTextDecorationLine('line-through')).toBe('STRIKETHROUGH');
  });
  
  test('parseTextDecorationLine handles none', () => {
    expect(parseTextDecorationLine('none')).toBe('NONE');
    expect(parseTextDecorationLine('')).toBe('NONE');
  });
  
  test('parseTextDecorationStyle detects styles', () => {
    expect(parseTextDecorationStyle('underline dotted')).toBe('DOTTED');
    expect(parseTextDecorationStyle('underline dashed')).toBe('DASHED');
    expect(parseTextDecorationStyle('underline wavy')).toBe('WAVY');
    expect(parseTextDecorationStyle('underline solid')).toBe('SOLID');
  });
  
  test('parseTextDecorationStyle defaults to SOLID', () => {
    expect(parseTextDecorationStyle('underline')).toBe('SOLID');
    expect(parseTextDecorationStyle('none')).toBe('SOLID');
  });
});

describe('Phase 8: Typography - Text Transform', () => {
  test('mapTextCase handles uppercase', () => {
    expect(mapTextCase('uppercase')).toBe('UPPER');
  });
  
  test('mapTextCase handles lowercase', () => {
    expect(mapTextCase('lowercase')).toBe('LOWER');
  });
  
  test('mapTextCase handles capitalize', () => {
    expect(mapTextCase('capitalize')).toBe('TITLE');
  });
  
  test('mapTextCase handles none', () => {
    expect(mapTextCase('none')).toBe('ORIGINAL');
  });
  
  test('mapTextCase defaults to ORIGINAL', () => {
    expect(mapTextCase('')).toBe('ORIGINAL');
    expect(mapTextCase(null)).toBe('ORIGINAL');
  });
});

describe('Phase 8: Typography - Complete Mapping', () => {
  test('mapTypography includes all typography properties', () => {
    const styles = {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: '18px',
      fontWeight: '500',
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: '1.5',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      textDecoration: 'underline solid',
      color: 'rgb(51, 51, 51)',
      padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      border: { radius: '0px', width: '0px' }
    };
    
    const result = mapTypography(styles);
    
    expect(result.fontFamily).toBe('Roboto');
    expect(result.fontFallbacks).toEqual(['Arial', 'Inter']);
    expect(result.fontSize).toBe(18);
    expect(result.fontWeight).toBe(500);
    expect(result.fontStyle).toBe('ITALIC');
    expect(result.textAlign).toBe('CENTER');
    expect(result.lineHeight.unit).toBe('PERCENT');
    expect(result.lineHeight.value).toBe(150);
    expect(result.letterSpacing).toBe(0.5);
    expect(result.textCase).toBe('UPPER');
    expect(result.textDecorationLine).toBe('UNDERLINE');
    expect(result.textDecorationStyle).toBe('SOLID');
    expect(result.color).toBeDefined();
    expect(result.color.rgb.r).toBeCloseTo(0.2, 1);
  });
  
  test('mapTypography handles minimal styles', () => {
    const styles = {
      fontFamily: '',
      fontSize: '',
      fontWeight: '',
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 'normal',
      letterSpacing: '',
      textTransform: 'none',
      textDecoration: 'none',
      color: 'rgb(0, 0, 0)',
      padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      border: { radius: '0px', width: '0px' }
    };
    
    const result = mapTypography(styles);
    
    expect(result.fontFamily).toBe('Inter');
    expect(result.fontSize).toBe(16); // default
    expect(result.fontWeight).toBe(400); // default
    expect(result.fontStyle).toBe('NORMAL');
    expect(result.textCase).toBe('ORIGINAL');
    expect(result.textDecorationLine).toBe('NONE');
  });
  
  test('mapTypography handles complex font stack', () => {
    const styles = {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'justify',
      lineHeight: '20px',
      letterSpacing: '0px',
      textTransform: 'capitalize',
      textDecoration: 'line-through',
      color: 'rgb(255, 0, 0)',
      padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      border: { radius: '0px', width: '0px' }
    };
    
    const result = mapTypography(styles);
    
    expect(result.fontFamily).toBe('Helvetica Neue');
    expect(result.fontFallbacks).toEqual(['Helvetica', 'Arial', 'Inter']);
    expect(result.textCase).toBe('TITLE');
    expect(result.textDecorationLine).toBe('STRIKETHROUGH');
  });
});

describe('Phase 8: Typography - Edge Cases', () => {
  test('handles monospace fonts', () => {
    const result = parseFontFamily('Courier New, Courier, monospace');
    
    expect(result.primary).toBe('Courier New');
    expect(result.fallbacks).toEqual(['Courier New', 'Courier New']);
  });
  
  test('handles cursive fonts', () => {
    const result = parseFontFamily('cursive');
    expect(result.primary).toBe('Comic Sans MS');
  });
  
  test('handles fantasy fonts', () => {
    const result = parseFontFamily('fantasy');
    expect(result.primary).toBe('Impact');
  });
  
  test('handles multiple text decorations', () => {
    // CSS can have multiple decorations, but Figma typically supports one
    const line1 = parseTextDecorationLine('underline line-through');
    expect(line1).toBe('UNDERLINE'); // Takes first
  });
});
