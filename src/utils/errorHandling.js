// Error Handling and Validation Utilities
// Provides comprehensive error handling for HTML to Figma Extension

/**
 * Custom error class for extraction errors
 */
class ExtractionError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ExtractionError';
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
  }
}

/**
 * Error codes for different failure scenarios
 */
const ERROR_CODES = {
  NO_CONTENT: 'NO_CONTENT',
  INVALID_SELECTOR: 'INVALID_SELECTOR',
  EXTRACTION_FAILED: 'EXTRACTION_FAILED',
  PARSE_ERROR: 'PARSE_ERROR',
  MEMORY_ERROR: 'MEMORY_ERROR',
  TIMEOUT: 'TIMEOUT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

/**
 * Validate extracted data structure
 */
function validateExtractionData(data) {
  const errors = [];
  
  // Check required top-level properties
  if (!data) {
    errors.push('Data is null or undefined');
    return { valid: false, errors };
  }
  
  if (!data.metadata) {
    errors.push('Missing metadata');
  } else {
    if (!data.metadata.url) errors.push('Missing metadata.url');
    if (!data.metadata.title) errors.push('Missing metadata.title');
    if (!data.metadata.timestamp) errors.push('Missing metadata.timestamp');
  }
  
  if (!data.tree) {
    errors.push('Missing tree structure');
  } else {
    if (typeof data.tree !== 'object') {
      errors.push('Tree must be an object');
    }
    if (!data.tree.tagName) {
      errors.push('Tree root missing tagName');
    }
  }
  
  if (!Array.isArray(data.images)) {
    errors.push('images must be an array');
  }
  
  if (!Array.isArray(data.fonts)) {
    errors.push('fonts must be an array');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Figma data structure
 */
function validateFigmaData(figmaData) {
  const errors = [];
  
  if (!figmaData) {
    return { valid: true, errors: [] }; // Optional field
  }
  
  if (typeof figmaData !== 'object') {
    errors.push('figmaData must be an object');
    return { valid: false, errors };
  }
  
  // Check required properties
  const requiredProps = ['fills', 'strokes', 'effects', 'layout', 'typography', 'constraints'];
  requiredProps.forEach(prop => {
    if (!(prop in figmaData)) {
      errors.push(`Missing required property: ${prop}`);
    }
  });
  
  // Validate arrays
  if (figmaData.fills && !Array.isArray(figmaData.fills)) {
    errors.push('fills must be an array');
  }
  
  if (figmaData.strokes && !Array.isArray(figmaData.strokes)) {
    errors.push('strokes must be an array');
  }
  
  if (figmaData.effects && !Array.isArray(figmaData.effects)) {
    errors.push('effects must be an array');
  }
  
  // Validate layout object
  if (figmaData.layout) {
    if (typeof figmaData.layout !== 'object') {
      errors.push('layout must be an object');
    } else {
      if (typeof figmaData.layout.width !== 'number') {
        errors.push('layout.width must be a number');
      }
      if (typeof figmaData.layout.height !== 'number') {
        errors.push('layout.height must be a number');
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize URL for safe logging
 */
function sanitizeUrl(url) {
  try {
    const urlObj = new URL(url);
    // Remove sensitive query params
    const sensitiveParams = ['token', 'key', 'secret', 'password', 'auth'];
    sensitiveParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  } catch (e) {
    return '[invalid URL]';
  }
}

/**
 * Safe JSON stringify with circular reference handling
 */
function safeStringify(obj, maxDepth = 10) {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, 2);
}

/**
 * Log error with context
 */
function logError(error, context = {}) {
  const errorLog = {
    message: error.message,
    name: error.name,
    code: error.code || 'UNKNOWN',
    timestamp: Date.now(),
    context: {
      url: context.url ? sanitizeUrl(context.url) : undefined,
      selector: context.selector,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      viewport: context.viewport
    },
    stack: error.stack
  };
  
  console.error('[HTML to Figma] Error:', safeStringify(errorLog));
  
  return errorLog;
}

/**
 * Wrap async function with error handling
 */
function withErrorHandling(fn, context = {}) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorLog = logError(error, context);
      throw new ExtractionError(
        error.message,
        error.code || ERROR_CODES.EXTRACTION_FAILED,
        errorLog
      );
    }
  };
}

/**
 * Validate selector is safe and valid
 */
function validateSelector(selector) {
  if (!selector || typeof selector !== 'string') {
    throw new ExtractionError(
      'Selector must be a non-empty string',
      ERROR_CODES.INVALID_SELECTOR,
      { selector }
    );
  }
  
  // Test if selector is valid
  try {
    document.querySelector(selector);
  } catch (e) {
    throw new ExtractionError(
      `Invalid CSS selector: ${selector}`,
      ERROR_CODES.INVALID_SELECTOR,
      { selector, originalError: e.message }
    );
  }
  
  return true;
}

/**
 * Check if extraction data size is within limits
 */
function validateDataSize(data, maxSize = 10 * 1024 * 1024) { // 10MB default
  try {
    const jsonString = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonString]).size;
    
    if (sizeInBytes > maxSize) {
      throw new ExtractionError(
        `Extracted data too large: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB (max: ${(maxSize / 1024 / 1024).toFixed(0)}MB)`,
        ERROR_CODES.MEMORY_ERROR,
        { sizeInBytes, maxSize }
      );
    }
    
    return { valid: true, sizeInBytes };
  } catch (error) {
    if (error instanceof ExtractionError) throw error;
    
    throw new ExtractionError(
      'Failed to calculate data size',
      ERROR_CODES.EXTRACTION_FAILED,
      { originalError: error.message }
    );
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ExtractionError,
    ERROR_CODES,
    validateExtractionData,
    validateFigmaData,
    sanitizeUrl,
    safeStringify,
    logError,
    withErrorHandling,
    validateSelector,
    validateDataSize
  };
}
