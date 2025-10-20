// Configuration for Extension + Plugin Architecture
const EXTENSION_CONFIG = {
  // Data transfer method
  TRANSFER_METHOD: 'clipboard', // 'clipboard' | 'local-server' | 'manual'
  
  // Data format version
  DATA_VERSION: '1.0.0',
  
  // Extraction settings
  EXTRACTION: {
    MAX_IMAGE_SIZE: 4096, // Max dimension in pixels
    IMAGE_FORMAT: 'PNG',
    SIMPLIFY_STRUCTURE: false,
    MERGE_SIMILAR_LAYERS: false,
    INCLUDE_HIDDEN_ELEMENTS: false,
    MAX_DEPTH: 50, // Max DOM depth to traverse
    COMPUTE_STYLES: true
  },
  
  // Conversion settings
  CONVERSION: {
    PRESERVE_HIERARCHY: true,
    AUTO_LAYOUT: true, // Try to detect and preserve flexbox/grid
    FLATTEN_SIMPLE_DIVS: true,
    CONVERT_TEXT_NODES: true,
    EXTRACT_IMAGES: true,
    EXTRACT_SVG: true
  }
};

// Storage keys for chrome.storage.local
const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  EXTRACTION_HISTORY: 'extraction_history',
  LAST_EXTRACTED_URL: 'last_extracted_url'
};

module.exports = { EXTENSION_CONFIG, STORAGE_KEYS };
