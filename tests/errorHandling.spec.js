// Tests for Phase 12: Error Handling & Validation
// Tests error handling utilities, validation functions, error logging

const {
  ExtractionError,
  ERROR_CODES,
  validateExtractionData,
  validateFigmaData,
  sanitizeUrl,
  safeStringify,
  validateSelector,
  validateDataSize
} = require('../src/utils/errorHandling.js');

describe('Phase 12: Error Handling - ExtractionError Class', () => {
  test('ExtractionError creates error with code and details', () => {
    const error = new ExtractionError('Test error', ERROR_CODES.EXTRACTION_FAILED, { test: true });
    
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ERROR_CODES.EXTRACTION_FAILED);
    expect(error.details.test).toBe(true);
    expect(error.timestamp).toBeDefined();
    expect(error.name).toBe('ExtractionError');
  });
  
  test('ExtractionError works without details', () => {
    const error = new ExtractionError('Simple error', ERROR_CODES.NO_CONTENT);
    
    expect(error.message).toBe('Simple error');
    expect(error.code).toBe(ERROR_CODES.NO_CONTENT);
    expect(error.details).toEqual({});
  });
});

describe('Phase 12: Error Handling - Validation Functions', () => {
  test('validateExtractionData accepts valid data', () => {
    const validData = {
      metadata: {
        url: 'https://example.com',
        title: 'Test Page',
        timestamp: Date.now()
      },
      tree: {
        tagName: 'body',
        children: []
      },
      images: [],
      fonts: []
    };
    
    const result = validateExtractionData(validData);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  
  test('validateExtractionData rejects null data', () => {
    const result = validateExtractionData(null);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Data is null or undefined');
  });
  
  test('validateExtractionData detects missing metadata', () => {
    const invalidData = {
      tree: { tagName: 'body' },
      images: [],
      fonts: []
    };
    
    const result = validateExtractionData(invalidData);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing metadata');
  });
  
  test('validateExtractionData detects missing tree', () => {
    const invalidData = {
      metadata: { url: 'test', title: 'test', timestamp: 123 },
      images: [],
      fonts: []
    };
    
    const result = validateExtractionData(invalidData);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing tree structure');
  });
  
  test('validateExtractionData checks array types', () => {
    const invalidData = {
      metadata: { url: 'test', title: 'test', timestamp: 123 },
      tree: { tagName: 'body' },
      images: 'not-an-array',
      fonts: {}
    };
    
    const result = validateExtractionData(invalidData);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('images must be an array');
    expect(result.errors).toContain('fonts must be an array');
  });
});

describe('Phase 12: Error Handling - Figma Data Validation', () => {
  test('validateFigmaData accepts null (optional field)', () => {
    const result = validateFigmaData(null);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  
  test('validateFigmaData accepts valid figma data', () => {
    const validFigmaData = {
      fills: [],
      strokes: [],
      effects: [],
      layout: {
        width: 100,
        height: 50
      },
      typography: {},
      constraints: {}
    };
    
    const result = validateFigmaData(validFigmaData);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  
  test('validateFigmaData detects missing required properties', () => {
    const invalidData = {
      fills: [],
      strokes: []
      // missing effects, layout, typography, constraints
    };
    
    const result = validateFigmaData(invalidData);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required property: effects');
    expect(result.errors).toContain('Missing required property: layout');
    expect(result.errors).toContain('Missing required property: typography');
    expect(result.errors).toContain('Missing required property: constraints');
  });
  
  test('validateFigmaData checks array types', () => {
    const invalidData = {
      fills: 'not-array',
      strokes: {},
      effects: 'not-array',
      layout: {},
      typography: {},
      constraints: {}
    };
    
    const result = validateFigmaData(invalidData);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('fills must be an array');
    expect(result.errors).toContain('strokes must be an array');
    expect(result.errors).toContain('effects must be an array');
  });
  
  test('validateFigmaData validates layout dimensions', () => {
    const invalidData = {
      fills: [],
      strokes: [],
      effects: [],
      layout: {
        width: 'not-a-number',
        height: null
      },
      typography: {},
      constraints: {}
    };
    
    const result = validateFigmaData(invalidData);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('layout.width must be a number');
    expect(result.errors).toContain('layout.height must be a number');
  });
});

describe('Phase 12: Error Handling - URL Sanitization', () => {
  test('sanitizeUrl removes sensitive query params', () => {
    const url = 'https://example.com/page?token=secret123&key=abc&page=1';
    const sanitized = sanitizeUrl(url);
    
    expect(sanitized).not.toContain('secret123');
    expect(sanitized).not.toContain('token=');
    expect(sanitized).toContain('page=1');
  });
  
  test('sanitizeUrl handles invalid URLs', () => {
    const result = sanitizeUrl('not-a-url');
    expect(result).toBe('[invalid URL]');
  });
  
  test('sanitizeUrl preserves safe params', () => {
    const url = 'https://example.com/search?q=test&page=2&sort=date';
    const sanitized = sanitizeUrl(url);
    
    expect(sanitized).toContain('q=test');
    expect(sanitized).toContain('page=2');
    expect(sanitized).toContain('sort=date');
  });
});

describe('Phase 12: Error Handling - Safe Stringify', () => {
  test('safeStringify handles circular references', () => {
    const obj = { a: 1 };
    obj.self = obj;
    
    const result = safeStringify(obj);
    
    expect(result).toContain('"a": 1');
    expect(result).toContain('[Circular]');
  });
  
  test('safeStringify handles normal objects', () => {
    const obj = { name: 'test', value: 123, nested: { key: 'value' } };
    const result = safeStringify(obj);
    
    expect(result).toContain('"name": "test"');
    expect(result).toContain('"value": 123');
    expect(result).toContain('"key": "value"');
  });
  
  test('safeStringify formats with indentation', () => {
    const obj = { a: 1, b: 2 };
    const result = safeStringify(obj);
    
    expect(result).toContain('\n'); // Has line breaks
    expect(result).toContain('  '); // Has indentation
  });
});

describe('Phase 12: Error Handling - Selector Validation', () => {
  test('validateSelector accepts valid CSS selector', () => {
    expect(() => validateSelector('body')).not.toThrow();
    expect(() => validateSelector('#app')).not.toThrow();
    expect(() => validateSelector('.container')).not.toThrow();
    expect(() => validateSelector('div.class')).not.toThrow();
  });
  
  test('validateSelector rejects null/undefined', () => {
    expect(() => validateSelector(null)).toThrow(ExtractionError);
    expect(() => validateSelector(undefined)).toThrow(ExtractionError);
  });
  
  test('validateSelector rejects empty string', () => {
    expect(() => validateSelector('')).toThrow(ExtractionError);
  });
  
  test('validateSelector rejects invalid CSS', () => {
    expect(() => validateSelector('div[')).toThrow(ExtractionError);
    expect(() => validateSelector(':::')).toThrow(ExtractionError);
  });
  
  test('validateSelector error has correct code', () => {
    try {
      validateSelector(null);
    } catch (error) {
      expect(error.code).toBe(ERROR_CODES.INVALID_SELECTOR);
    }
  });
});

describe('Phase 12: Error Handling - Data Size Validation', () => {
  test('validateDataSize accepts small data', () => {
    const smallData = { test: 'small' };
    const result = validateDataSize(smallData);
    
    expect(result.valid).toBe(true);
    expect(result.sizeInBytes).toBeLessThan(1024);
  });
  
  test('validateDataSize rejects large data', () => {
    // Create large object (> 10MB)
    const largeData = { bigArray: new Array(2000000).fill('x'.repeat(10)) };
    
    expect(() => validateDataSize(largeData)).toThrow(ExtractionError);
  });
  
  test('validateDataSize respects custom limit', () => {
    const data = { test: 'a'.repeat(100) };
    
    // Should pass with 1KB limit
    expect(() => validateDataSize(data, 1024)).not.toThrow();
    
    // Should fail with 10 byte limit
    expect(() => validateDataSize(data, 10)).toThrow(ExtractionError);
  });
  
  test('validateDataSize error has correct code', () => {
    const largeData = { bigArray: new Array(2000000).fill('x'.repeat(10)) };
    
    try {
      validateDataSize(largeData);
    } catch (error) {
      expect(error.code).toBe(ERROR_CODES.MEMORY_ERROR);
    }
  });
});

describe('Phase 12: Error Handling - Error Codes', () => {
  test('ERROR_CODES contains expected codes', () => {
    expect(ERROR_CODES.NO_CONTENT).toBe('NO_CONTENT');
    expect(ERROR_CODES.INVALID_SELECTOR).toBe('INVALID_SELECTOR');
    expect(ERROR_CODES.EXTRACTION_FAILED).toBe('EXTRACTION_FAILED');
    expect(ERROR_CODES.PARSE_ERROR).toBe('PARSE_ERROR');
    expect(ERROR_CODES.MEMORY_ERROR).toBe('MEMORY_ERROR');
    expect(ERROR_CODES.TIMEOUT).toBe('TIMEOUT');
    expect(ERROR_CODES.PERMISSION_DENIED).toBe('PERMISSION_DENIED');
    expect(ERROR_CODES.NETWORK_ERROR).toBe('NETWORK_ERROR');
  });
});
