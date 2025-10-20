// Storage utilities for extension preferences and history
const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  EXTRACTION_HISTORY: 'extraction_history',
  LAST_EXTRACTED_URL: 'last_extracted_url'
};

/**
 * Store extraction history
 * @param {Object} extraction - Extraction metadata
 */
async function storeExtraction(extraction) {
  if (!extraction || typeof extraction !== 'object') {
    throw new Error('Invalid extraction data');
  }
  
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEYS.EXTRACTION_HISTORY], (result) => {
      const history = result[STORAGE_KEYS.EXTRACTION_HISTORY] || [];
      history.unshift({
        ...extraction,
        timestamp: Date.now()
      });
      
      // Keep only last 50 extractions
      const trimmedHistory = history.slice(0, 50);
      
      chrome.storage.local.set({ 
        [STORAGE_KEYS.EXTRACTION_HISTORY]: trimmedHistory,
        [STORAGE_KEYS.LAST_EXTRACTED_URL]: extraction.url
      }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(true);
        }
      });
    });
  });
}

/**
 * Get extraction history
 * @returns {Promise<Array>}
 */
async function getExtractionHistory() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEYS.EXTRACTION_HISTORY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[STORAGE_KEYS.EXTRACTION_HISTORY] || []);
      }
    });
  });
}

/**
 * Clear extraction history
 */
async function clearHistory() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([STORAGE_KEYS.EXTRACTION_HISTORY, STORAGE_KEYS.LAST_EXTRACTED_URL], () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Store user preferences
 * @param {Object} preferences
 */
async function storePreferences(preferences) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEYS.USER_PREFERENCES]: preferences }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Get user preferences
 * @returns {Promise<Object>}
 */
async function getPreferences() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEYS.USER_PREFERENCES], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[STORAGE_KEYS.USER_PREFERENCES] || {});
      }
    });
  });
}

module.exports = {
  storeExtraction,
  getExtractionHistory,
  clearHistory,
  storePreferences,
  getPreferences
};
