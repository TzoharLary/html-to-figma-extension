# Performance Optimization Plan (Phase 16)

## Current Baseline
- Unit Tests: 199 passing ✅
- Test Execution: ~5-6 seconds
- Code Coverage: 58.34%
- Manual Testing: Phase 15 (in-progress)

## Performance Goals

### Extraction Time Targets
| Page Complexity | Elements | Target Time | Priority |
|----------------|----------|-------------|----------|
| Simple | < 100 | < 500ms | HIGH |
| Medium | 100-500 | < 2s | HIGH |
| Large | 500-2000 | < 10s | MEDIUM |
| Very Large | 2000+ | < 30s | LOW |

### Memory Targets
- Peak memory: < 100MB for typical page
- Data size limit: 10MB per extraction
- No memory leaks during repeated extractions

## Optimization Strategies

### 1. DOM Traversal Optimization
**Current:** Recursive `traverseDOM()` with repeated DOM queries

**Optimizations:**
```javascript
// Before: Multiple queries per element
const style = window.getComputedStyle(element);
const rect = element.getBoundingClientRect();
// ... repeated for each property

// After: Batch queries, cache results
function batchExtractData(elements) {
  return elements.map(el => ({
    style: window.getComputedStyle(el),
    rect: el.getBoundingClientRect(),
    // ... all data at once
  }));
}
```

**Estimated Improvement:** 20-30% faster

---

### 2. Style Computation Caching
**Current:** `getComputedStyle()` called for every element

**Optimizations:**
```javascript
// Cache computed styles
const styleCache = new WeakMap();

function getCachedStyle(element) {
  if (!styleCache.has(element)) {
    styleCache.set(element, window.getComputedStyle(element));
  }
  return styleCache.get(element);
}
```

**Estimated Improvement:** 15-25% faster

---

### 3. Image Conversion - Lazy Loading
**Current:** All images converted to base64 immediately

**Optimizations:**
```javascript
// Only convert visible images initially
function isImageVisible(img) {
  const rect = img.getBoundingClientRect();
  return rect.top < window.innerHeight + 1000; // viewport + buffer
}

// Defer off-screen images
const deferredImages = [];
if (!isImageVisible(img)) {
  deferredImages.push({ id: img.id, src: img.src });
  continue; // Skip base64 conversion
}
```

**Estimated Improvement:** 40-60% faster for image-heavy pages

---

### 4. Web Worker for Heavy Processing
**Current:** All processing on main thread (blocks UI)

**Optimizations:**
```javascript
// Create worker for:
// - Figma data mapping (figmaDataConverter.js)
// - JSON stringification
// - Image base64 encoding

// worker.js
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  if (type === 'mapToFigma') {
    const figmaData = mapElementToFigmaData(data);
    self.postMessage({ type: 'figmaData', result: figmaData });
  }
  
  if (type === 'encodeImage') {
    // Base64 encoding in worker
    const base64 = encodeImageToBase64(data);
    self.postMessage({ type: 'imageData', result: base64 });
  }
};
```

**Estimated Improvement:** 30-50% faster, no UI blocking

---

### 5. Progressive Extraction (Chunking)
**Current:** Extract entire page in one blocking operation

**Optimizations:**
```javascript
async function* extractPageProgressive() {
  const chunkSize = 50; // Process 50 elements at a time
  const allElements = document.body.querySelectorAll('*');
  
  for (let i = 0; i < allElements.length; i += chunkSize) {
    const chunk = Array.from(allElements).slice(i, i + chunkSize);
    const extractedChunk = chunk.map(traverseElement);
    
    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
    
    yield extractedChunk;
  }
}

// UI stays responsive, progress bar possible
```

**Estimated Improvement:** Better perceived performance, no freezing

---

### 6. Selector Optimization
**Current:** Repeated `querySelectorAll()` calls

**Optimizations:**
```javascript
// Single DOM walk, collect all data
function extractAllAtOnce() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    null
  );
  
  const elements = [];
  let node;
  while (node = walker.nextNode()) {
    elements.push(extractNodeData(node));
  }
  
  return elements;
}
```

**Estimated Improvement:** 10-20% faster

---

### 7. JSON Optimization
**Current:** `JSON.stringify()` entire data structure

**Optimizations:**
```javascript
// Streaming JSON for large data
function* streamJSON(data) {
  yield '{"metadata":';
  yield JSON.stringify(data.metadata);
  yield ',"tree":';
  
  // Stream tree nodes
  for (const node of data.tree) {
    yield JSON.stringify(node);
  }
  
  yield '}';
}

// Or use compression
import pako from 'pako';
const compressed = pako.gzip(JSON.stringify(data));
```

**Estimated Improvement:** 20-30% faster for large pages

---

## Implementation Plan

### Week 1: Profiling & Baseline
- [ ] Add performance marks to key functions
- [ ] Profile extraction on small/medium/large pages
- [ ] Identify top 3 bottlenecks
- [ ] Document current timings

### Week 2: Quick Wins
- [ ] Implement style caching (Strategy #2)
- [ ] Optimize selector usage (Strategy #6)
- [ ] Add performance tests
- [ ] Validate 10-20% improvement

### Week 3: Major Optimizations
- [ ] Implement lazy image loading (Strategy #3)
- [ ] Add progressive extraction (Strategy #5)
- [ ] Create Web Worker (Strategy #4)
- [ ] Validate 40-60% improvement

### Week 4: Polish & Testing
- [ ] Optimize DOM traversal (Strategy #1)
- [ ] Add JSON streaming (Strategy #7)
- [ ] Performance regression tests
- [ ] Document final benchmarks

---

## Performance Testing

### Automated Performance Tests
```javascript
// tests/performance.spec.js
describe('Performance Benchmarks', () => {
  test('Small page extraction < 500ms', async () => {
    const startTime = performance.now();
    const result = await performExtraction({ pageSize: 'small' });
    const duration = performance.now() - startTime;
    
    expect(duration).toBeLessThan(500);
    expect(result.tree.children.length).toBeLessThan(100);
  });
  
  test('Medium page extraction < 2s', async () => {
    const startTime = performance.now();
    const result = await performExtraction({ pageSize: 'medium' });
    const duration = performance.now() - startTime;
    
    expect(duration).toBeLessThan(2000);
    expect(result.tree.children.length).toBeLessThan(500);
  });
  
  test('Memory usage stays under 100MB', async () => {
    const before = performance.memory.usedJSHeapSize;
    await performExtraction({ pageSize: 'large' });
    const after = performance.memory.usedJSHeapSize;
    
    const memoryUsed = (after - before) / 1024 / 1024; // MB
    expect(memoryUsed).toBeLessThan(100);
  });
});
```

---

## Benchmarking Tools

### Chrome DevTools Performance
1. Open DevTools → Performance tab
2. Click Record
3. Trigger extraction
4. Stop recording
5. Analyze flame chart

**Look for:**
- Long tasks (> 50ms)
- Style recalculation
- Layout thrashing
- JavaScript execution time

### Lighthouse CI
```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/test-page.html'],
      numberOfRuns: 5,
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 5000 }],
      },
    },
  },
};
```

---

## Success Metrics

### Before Optimization (Baseline)
```
Test Case: GitHub Profile Page
- Elements: 450
- Extraction Time: [TO BE MEASURED]
- Data Size: [TO BE MEASURED]
- Memory Peak: [TO BE MEASURED]
```

### After Optimization (Target)
```
Test Case: GitHub Profile Page
- Elements: 450
- Extraction Time: < 1.5s (target: < 2s)
- Data Size: < 2MB
- Memory Peak: < 50MB
```

### Improvement Goal: 50%+ faster overall

---

## Risk Mitigation

### Compatibility Risks
- **Risk:** Web Workers not supported in some contexts
- **Mitigation:** Fallback to main thread processing

### Complexity Risks
- **Risk:** Progressive extraction adds complexity
- **Mitigation:** Keep both sync and async modes

### Regression Risks
- **Risk:** Optimizations break existing functionality
- **Mitigation:** Run full test suite (199 tests) after each change

---

## Next Steps After Phase 16
1. Document performance improvements in README
2. Update MANUAL_TESTING.md with new benchmarks
3. Add performance badge to GitHub
4. Proceed to Phase 17 (Documentation)
