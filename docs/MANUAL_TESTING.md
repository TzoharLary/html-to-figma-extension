# Phase 15: Manual Testing Guide

## Prerequisites
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select this project directory

## Test Scenarios

### Test 1: Simple Page (example.com)
**URL:** https://example.com

**Steps:**
1. Navigate to example.com
2. Click extension icon
3. Click "Extract Page"
4. Observe status message
5. Check extracted data in clipboard

**Expected Results:**
- ✅ Status shows "Extraction complete!"
- ✅ Stats show element count
- ✅ Clipboard contains valid JSON
- ✅ JSON has metadata, tree, images, svgs, fonts
- ✅ No console errors

**Actual Results:**
```
Date: [FILL IN]
Status: [PASS/FAIL]
Notes: [OBSERVATIONS]
```

---

### Test 2: GitHub Profile Page
**URL:** https://github.com/[any-username]

**Steps:**
1. Navigate to a GitHub profile
2. Click extension icon
3. Click "Extract Page"
4. Verify extraction completes within 5 seconds
5. Check data size

**Expected Results:**
- ✅ Extraction completes < 5 seconds
- ✅ Data size < 5MB
- ✅ Images extracted (avatar, icons)
- ✅ SVGs extracted (GitHub icons)
- ✅ No console errors

**Actual Results:**
```
Date: [FILL IN]
Status: [PASS/FAIL]
Extraction Time: [X seconds]
Data Size: [X MB]
Images Count: [X]
SVGs Count: [X]
Notes: [OBSERVATIONS]
```

---

### Test 3: Amazon Product Page
**URL:** https://amazon.com/[any-product]

**Steps:**
1. Navigate to an Amazon product page
2. Click extension icon
3. Click "Extract Page"
4. Wait for extraction (may take longer)
5. Verify data structure

**Expected Results:**
- ✅ Extraction completes < 15 seconds
- ✅ Data size < 10MB (within limit)
- ✅ Multiple images extracted (product photos)
- ✅ Nested elements captured (reviews, descriptions)
- ✅ No crashes or errors

**Actual Results:**
```
Date: [FILL IN]
Status: [PASS/FAIL]
Extraction Time: [X seconds]
Data Size: [X MB]
Elements Count: [X]
Notes: [OBSERVATIONS]
```

---

### Test 4: Figma Website
**URL:** https://figma.com

**Steps:**
1. Navigate to figma.com
2. Click extension icon
3. Click "Extract Page"
4. Verify SVG icons extracted
5. Check for CSS Grid layouts

**Expected Results:**
- ✅ Extraction completes successfully
- ✅ SVG icons extracted
- ✅ CSS Grid layouts detected
- ✅ Complex typography captured
- ✅ No console errors

**Actual Results:**
```
Date: [FILL IN]
Status: [PASS/FAIL]
Notes: [OBSERVATIONS]
```

---

### Test 5: Empty/Minimal Page
**URL:** data:text/html,<html><body></body></html>

**Steps:**
1. Navigate to minimal HTML page
2. Click extension icon
3. Click "Extract Page"

**Expected Results:**
- ✅ Extraction completes without errors
- ✅ Tree has BODY with 0 children
- ✅ No crashes

**Actual Results:**
```
Date: [FILL IN]
Status: [PASS/FAIL]
Notes: [OBSERVATIONS]
```

---

### Test 6: Page with Errors
**URL:** data:text/html,<html><body><div style="display:none">Hidden</div></body></html>

**Steps:**
1. Navigate to page with hidden elements
2. Click extension icon
3. Click "Extract Page"

**Expected Results:**
- ✅ Extraction completes
- ✅ Hidden elements handled gracefully
- ✅ No JavaScript errors

**Actual Results:**
```
Date: [FILL IN]
Status: [PASS/FAIL]
Notes: [OBSERVATIONS]
```

---

### Test 7: Performance Benchmark

**Test Pages:**
1. **Small:** example.com (< 100 elements)
2. **Medium:** github.com profile (100-500 elements)
3. **Large:** amazon.com product (500-2000 elements)

**Measurements:**

| Page | Element Count | Extraction Time | Data Size | Status |
|------|--------------|-----------------|-----------|--------|
| Small | [X] | [X ms] | [X KB] | [PASS/FAIL] |
| Medium | [X] | [X ms] | [X KB] | [PASS/FAIL] |
| Large | [X] | [X ms] | [X MB] | [PASS/FAIL] |

**Performance Goals:**
- Small: < 500ms ⚡
- Medium: < 2s ✅
- Large: < 10s 🟡

---

### Test 8: Figma Plugin Integration

**Steps:**
1. Extract page data (any site)
2. Copy JSON to clipboard
3. Open Figma Desktop
4. Plugins → Development → Import from HTML
5. Paste JSON
6. Click "Create Design"

**Expected Results:**
- ✅ Plugin accepts JSON
- ✅ Design created successfully
- ✅ Elements positioned correctly
- ✅ Styles applied
- ✅ Images loaded

**Actual Results:**
```
Date: [FILL IN]
Status: [PASS/FAIL]
Issues: [OBSERVATIONS]
```

---

## Console Error Checks

For each test, open DevTools Console and verify:
- ❌ No red errors
- ⚠️ Warnings acceptable
- ℹ️ Info logs expected

**Common Issues to Watch For:**
- CORS errors (images from different domains)
- Memory warnings (large pages)
- Permission errors (restricted content)
- Timeout errors (very slow pages)

---

## Test Summary

| Test | Status | Date | Tester | Notes |
|------|--------|------|--------|-------|
| 1. Simple Page | [ ] | | | |
| 2. GitHub Profile | [ ] | | | |
| 3. Amazon Product | [ ] | | | |
| 4. Figma Website | [ ] | | | |
| 5. Empty Page | [ ] | | | |
| 6. Error Handling | [ ] | | | |
| 7. Performance | [ ] | | | |
| 8. Figma Plugin | [ ] | | | |

**Overall Status:** [READY/NEEDS WORK]

**Critical Issues:**
- [LIST ANY BLOCKERS]

**Minor Issues:**
- [LIST ANY NICE-TO-HAVE FIXES]

**Next Steps:**
- [ACTIONS REQUIRED]
