// Background service worker for HTML to Figma Extension
// Handles messaging and coordinates data flow

console.log('[HTML to Figma] Background script initialized');

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[HTML to Figma] Received message:', message.type);
  
  if (message.type === 'PAGE_DATA_EXTRACTED') {
    // Data extracted from content script
    handleExtractedData(message.data, sender);
    sendResponse({ status: 'received' });
  } else if (message.type === 'EXTRACTION_ERROR') {
    // Error from content script
    console.error('[HTML to Figma] Extraction error:', message.error);
    sendResponse({ status: 'error', error: message.error });
  }
  
  return true; // Keep channel open for async responses
});

/**
 * Handle extracted data
 */
function handleExtractedData(data, sender) {
  console.log('[HTML to Figma] Processing extracted data...');
  console.log('- Elements extracted:', countElements(data.tree));
  console.log('- Images found:', data.images ? data.images.length : 0);
  console.log('- Fonts found:', data.fonts ? data.fonts.length : 0);
  
  // Store data in chrome.storage for future use
  chrome.storage.local.set({
    lastExtraction: {
      data: data,
      timestamp: Date.now(),
      url: data.metadata?.url
    }
  }, () => {
    console.log('[HTML to Figma] Data stored successfully');
  });
  
  // Notify popup if open
  chrome.runtime.sendMessage({
    type: 'EXTRACTION_COMPLETE',
    data: data
  }).catch(() => {
    // Popup might be closed, that's ok
  });
}

/**
 * Count elements in tree
 */
function countElements(node) {
  if (!node) return 0;
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countElements(child);
    }
  }
  return count;
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[HTML to Figma] Extension installed!');
    // Open welcome page or instructions
  } else if (details.reason === 'update') {
    console.log('[HTML to Figma] Extension updated to version', chrome.runtime.getManifest().version);
  }
});
