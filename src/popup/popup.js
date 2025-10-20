// Popup script for HTML to Figma Extension
// Handles user interactions and data extraction

let extractedData = null;

// UI Elements
const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
const statusDiv = document.getElementById('status');
const statsDiv = document.getElementById('stats');
const elementCount = document.getElementById('elementCount');
const imageCount = document.getElementById('imageCount');

// Extract button click handler
extractBtn.addEventListener('click', async () => {
  try {
    setLoading(true);
    showStatus('🔄 Extracting page design...', 'info');
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    // Send extraction message to content script
    chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_PAGE' }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus('❌ Error: ' + chrome.runtime.lastError.message, 'error');
        setLoading(false);
        return;
      }

      if (response && response.success) {
        handleExtractionSuccess(response.data);
      } else {
        showStatus('❌ Extraction failed: ' + (response?.error || 'Unknown error'), 'error');
        setLoading(false);
      }
    });
    
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
    setLoading(false);
  }
});

// Copy button click handler
copyBtn.addEventListener('click', async () => {
  if (!extractedData) {
    showStatus('❌ No data to copy. Extract page first.', 'error');
    return;
  }

  try {
    // Copy to clipboard
    await copyToClipboard(extractedData);
    showStatus('✅ Copied to clipboard! Now open Figma plugin and paste.', 'success');
    
    // Optional: Auto-close popup after 2 seconds
    setTimeout(() => {
      window.close();
    }, 2000);
    
  } catch (error) {
    showStatus('❌ Failed to copy: ' + error.message, 'error');
  }
});

/**
 * Handle successful extraction
 */
function handleExtractionSuccess(data) {
  extractedData = data;
  
  // Update stats
  const elementTotal = countElements(data.tree);
  const imageTotal = data.images ? data.images.length : 0;
  
  elementCount.textContent = elementTotal;
  imageCount.textContent = imageTotal;
  statsDiv.style.display = 'grid';
  
  // Show copy button
  copyBtn.style.display = 'flex';
  
  // Auto-copy to clipboard
  copyToClipboard(data)
    .then(() => {
      showStatus('✅ Extracted! Data copied to clipboard automatically.', 'success');
      setLoading(false);
    })
    .catch((error) => {
      showStatus('✅ Extracted! Click "Copy to Clipboard" to copy data.', 'success');
      setLoading(false);
    });
}

/**
 * Copy data to clipboard
 */
async function copyToClipboard(data) {
  const jsonString = JSON.stringify(data, null, 2);
  
  // Modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(jsonString);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = jsonString;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Count total elements in tree
 */
function countElements(node) {
  if (!node) return 0;
  
  let count = 1; // Count current node
  
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countElements(child);
    }
  }
  
  return count;
}

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = 'status show ' + type;
  
  // Auto-hide after 5 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 5000);
  }
}

/**
 * Set loading state
 */
function setLoading(loading) {
  extractBtn.disabled = loading;
  
  if (loading) {
    extractBtn.innerHTML = '<span class="spinner"></span><span>Extracting...</span>';
  } else {
    extractBtn.innerHTML = '<span class="btn-icon">✨</span><span>Extract Page Design</span>';
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACTION_COMPLETE') {
    handleExtractionSuccess(message.data);
  } else if (message.type === 'EXTRACTION_ERROR') {
    showStatus('❌ Extraction error: ' + message.error, 'error');
    setLoading(false);
  }
});

// Initialize
console.log('HTML to Figma popup loaded');
