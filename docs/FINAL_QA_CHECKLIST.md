# Final QA & Publishing Checklist - Phase 18

**Project:** HTML to Figma Chrome Extension  
**Version:** 1.0.0  
**Date:** October 20, 2025  
**Status:** Pre-Launch

---

## Pre-Launch Checklist

### 1. Code Quality & Testing ✅

#### Unit Tests
- [x] All 199 tests passing
- [x] Test execution time acceptable (<10s)
- [x] No test failures or errors
- [x] Coverage above 50% threshold (58.34%)

**Verification Command:**
```bash
npm test
```

**Expected Output:**
```
Test Suites: 15 passed, 15 total (excluding e2e)
Tests:       199 passed, 199 total
Time:        ~6-7 seconds
```

#### Code Coverage
- [x] Overall coverage: 58.34%
- [x] content.js: 57.04%
- [x] errorHandling.js: 82.35%
- [x] Helpers: 83.33%
- [x] Parsers: 80%+

**Verification Command:**
```bash
npm test -- --coverage
```

#### Code Quality
- [ ] No console errors in any component
- [ ] No eslint warnings (if configured)
- [ ] All JSDoc comments complete
- [ ] No TODO/FIXME comments in production code
- [ ] No hardcoded credentials or tokens

---

### 2. Manual Testing (Phase 15) 🔄

Test on each of the following websites and document results in `docs/MANUAL_TESTING.md`:

#### Test Site 1: Simple Page ✅
- [ ] **URL:** https://example.com
- [ ] Extraction completes < 1 second
- [ ] All elements captured
- [ ] No console errors
- [ ] JSON data size < 100KB
- [ ] Figma plugin accepts data
- [ ] Design created successfully

#### Test Site 2: GitHub Profile 🔄
- [ ] **URL:** https://github.com/[username]
- [ ] Extraction completes < 5 seconds
- [ ] Images extracted (avatar, icons)
- [ ] SVGs captured (GitHub icons)
- [ ] Data size < 2MB
- [ ] No console errors

#### Test Site 3: Amazon Product 🔄
- [ ] **URL:** https://amazon.com/[product]
- [ ] Extraction completes < 15 seconds
- [ ] Multiple images extracted
- [ ] Complex layout preserved
- [ ] Data size < 10MB
- [ ] No memory errors

#### Test Site 4: Figma Website 🔄
- [ ] **URL:** https://figma.com
- [ ] SVG icons extracted
- [ ] CSS Grid layouts detected
- [ ] Typography captured
- [ ] Extraction completes successfully

#### Test Site 5: Empty/Minimal Page 🔄
- [ ] **URL:** data:text/html,<html><body></body></html>
- [ ] Handles gracefully (no crash)
- [ ] Returns valid data structure
- [ ] Tree has empty children array

#### Test Site 6: Error Scenarios 🔄
- [ ] Hidden elements (display:none)
- [ ] Invalid selectors
- [ ] Pages with JavaScript errors
- [ ] Very large pages (1000+ elements)

#### Test Site 7: Responsive Testing 🔄
- [ ] Desktop viewport (1920x1080)
- [ ] Tablet viewport (768x1024)
- [ ] Mobile viewport (375x667)

#### Test Site 8: Browser Compatibility 🔄
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Brave (latest)

**Testing Documentation:**
- [ ] All test results documented
- [ ] Screenshots captured for each test
- [ ] Issues logged in GitHub Issues
- [ ] Performance metrics recorded

---

### 3. Figma Plugin Testing 🔄

#### Plugin Installation
- [ ] TypeScript compiles without errors
- [ ] Plugin imports into Figma Desktop
- [ ] Plugin appears in Plugins menu

**Build Command:**
```bash
cd figma-plugin
npm install
npm run build
```

#### Plugin Functionality
- [ ] UI displays correctly
- [ ] Can paste JSON data
- [ ] "Create Design" button works
- [ ] Elements appear in canvas
- [ ] Frames created correctly
- [ ] Text nodes have correct styles
- [ ] Images embedded as fills
- [ ] SVGs imported as vectors
- [ ] Layout preserved
- [ ] Colors accurate (±5% tolerance)
- [ ] Typography matches source

#### Plugin Error Handling
- [ ] Invalid JSON shows clear error
- [ ] Missing fonts handled gracefully
- [ ] Large data (>5MB) works
- [ ] Empty data handled

---

### 4. Documentation Review 📚

#### User-Facing Documentation
- [x] **USER_MANUAL.md** - Complete and proofread
- [x] **README.md** - Updated with badges and features
- [x] **figma-plugin/README.md** - Complete usage guide

**Review Checklist:**
- [ ] No typos or grammatical errors
- [ ] All links working
- [ ] Screenshots added (if applicable)
- [ ] Version numbers correct
- [ ] Contact information accurate

#### Developer Documentation
- [x] **DEVELOPER_GUIDE.md** - API reference complete
- [x] **ARCHITECTURE_DIAGRAM.md** - System design documented
- [x] **INTERFACES.md** - Data structures defined
- [x] **PROJECT_CONTEXT.md** - Development history

#### Publishing Documentation
- [x] **CHROME_WEB_STORE_LISTING.md** - Store description ready
- [x] **MANUAL_TESTING.md** - Test scenarios defined
- [x] **PERFORMANCE_PLAN.md** - Optimization strategies
- [x] **PROJECT_STATUS.md** - Current status documented

---

### 5. Chrome Web Store Preparation 🌐

#### Extension Package
- [ ] Create `.zip` file of extension
- [ ] Includes manifest.json
- [ ] Includes all src/ files
- [ ] Includes icons/ (if exists)
- [ ] Excludes node_modules/
- [ ] Excludes tests/
- [ ] Excludes .git/
- [ ] Package size < 20MB

**Package Command:**
```bash
# Create clean package
zip -r extension-v1.0.0.zip \
  manifest.json \
  src/ \
  -x "*.git*" "node_modules/*" "tests/*" "docs/*"
```

#### Store Assets

##### 1. Icon Images (Required)
- [ ] **16x16** - Toolbar icon
- [ ] **32x32** - Toolbar icon @2x
- [ ] **48x48** - Extension management
- [ ] **128x128** - Chrome Web Store

**Format:** PNG with transparency  
**Location:** Create `icons/` folder

##### 2. Screenshots (Required: 5 images)
- [ ] **Screenshot 1:** Extension popup (1280x800 or 640x400)
- [ ] **Screenshot 2:** Extraction in progress
- [ ] **Screenshot 3:** Extraction results
- [ ] **Screenshot 4:** Figma plugin interface
- [ ] **Screenshot 5:** Final Figma design

**Format:** PNG or JPG  
**Size:** 1280x800 or 640x400  
**Location:** `docs/screenshots/`

##### 3. Promotional Images (Required)

- [ ] **Small Tile:** 440x280
  - Extension icon + name
  - Key feature highlight
  
- [ ] **Large Tile:** 1280x800
  - Hero image
  - Extension showcase
  - "Extract any website to Figma"
  
- [ ] **Marquee (Optional):** 1400x560
  - Feature highlights
  - Call to action

**Format:** PNG or JPG  
**Location:** `docs/promo/`

##### 4. Demo Video (Highly Recommended)
- [ ] 30-90 seconds length
- [ ] Shows installation process
- [ ] Demonstrates extraction
- [ ] Shows Figma plugin usage
- [ ] Highlights key features
- [ ] High quality (1080p)

**Upload to:** YouTube (unlisted or public)  
**Add link to:** Store listing

#### Store Listing Content

##### Short Description (132 characters max)
```
Extract any website and convert it to Figma designs. Preserves layout, typography, colors, images, and SVG graphics instantly.
```
**Character count:** 131 ✅

##### Detailed Description
- [x] Copy from `CHROME_WEB_STORE_LISTING.md`
- [ ] Proofread for typos
- [ ] Check formatting
- [ ] Verify links work
- [ ] Update version number

##### Category & Tags
- **Category:** Developer Tools
- **Tags:** 
  - design
  - figma
  - web design
  - prototyping
  - developer tools
  - design tools
  - html to figma
  - extraction
  - ui design

##### Permissions Justification
Document why each permission is needed:

1. **activeTab**
   - "Access current page content when you click 'Extract Page' to read HTML, CSS, and images"

2. **clipboardWrite**
   - "Copy extracted design data to clipboard for pasting into Figma"

3. **storage** (if used)
   - "Save your preferences and settings locally"

#### Legal Pages

##### Privacy Policy
- [ ] Create privacy policy page
- [ ] Host on GitHub Pages or own domain
- [ ] URL: https://yourusername.github.io/figma-chrome-extension/privacy-policy.html
- [ ] Add to store listing

**Template:** Available in `CHROME_WEB_STORE_LISTING.md`

##### Terms of Service
- [ ] Create terms of service page
- [ ] Host on GitHub Pages or own domain
- [ ] URL: https://yourusername.github.io/figma-chrome-extension/terms.html
- [ ] Add to store listing

**Template:** Available in `CHROME_WEB_STORE_LISTING.md`

#### Developer Account
- [ ] Create Chrome Web Store developer account
- [ ] Pay $5 one-time registration fee
- [ ] Verify email address
- [ ] Set up payment method (if offering paid features)

---

### 6. Figma Plugin Publishing 🎨

#### Plugin Preparation
- [ ] Compile TypeScript: `cd figma-plugin && npm run build`
- [ ] Test compiled plugin in Figma Desktop
- [ ] Verify all functionality works
- [ ] No console errors

#### Plugin Assets
- [ ] **Plugin thumbnail:** 960x960 PNG
- [ ] **Plugin icon:** 128x128 PNG
- [ ] **Cover image:** 1920x960 PNG (optional)

#### Plugin Manifest
```json
{
  "name": "HTML to Figma",
  "id": "YOUR_PLUGIN_ID",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "documentAccess": "dynamic-page"
}
```

- [ ] Update manifest.json
- [ ] Add plugin description
- [ ] Add tags (design, import, html, web)
- [ ] Set correct API version

#### Plugin Submission
- [ ] Open Figma Desktop
- [ ] Go to Plugins → Development → Publish new plugin
- [ ] Fill in plugin details:
  - Name: "HTML to Figma"
  - Description: Copy from documentation
  - Tags: design, import, html, web, conversion
  - Support URL: GitHub Issues link
- [ ] Upload thumbnail and cover
- [ ] Submit for review

**Review Time:** Typically 1-3 business days

---

### 7. Repository Cleanup 🧹

#### Git Cleanup
- [ ] Remove debug logs
- [ ] Remove commented code
- [ ] Clean up .gitignore
- [ ] Ensure no sensitive data committed

#### Repository Organization
- [ ] All docs in `docs/` folder
- [ ] All tests in `tests/` folder
- [ ] Source code in `src/` folder
- [ ] Plugin code in `figma-plugin/` folder

#### GitHub Repository
- [ ] Update repository description
- [ ] Add topics/tags
- [ ] Create comprehensive README.md
- [ ] Add LICENSE file (MIT)
- [ ] Add CONTRIBUTING.md
- [ ] Add CODE_OF_CONDUCT.md (optional)

#### Release Preparation
- [ ] Create GitHub release v1.0.0
- [ ] Add release notes
- [ ] Attach packaged extension (.zip)
- [ ] Tag release in git

**Git commands:**
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

### 8. Final Verification ✔️

#### Pre-Submission Checklist
- [ ] All 199 tests passing
- [ ] Manual testing complete (8 scenarios)
- [ ] Documentation proofread
- [ ] Screenshots captured (5 minimum)
- [ ] Promotional images created
- [ ] Demo video recorded
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Extension packaged (.zip)
- [ ] Figma plugin compiled
- [ ] GitHub repository clean
- [ ] All links tested
- [ ] Version numbers consistent

#### Submission Checklist
- [ ] Chrome Web Store submission:
  - [ ] Developer account created
  - [ ] Extension package uploaded
  - [ ] Store listing complete
  - [ ] Screenshots uploaded
  - [ ] Privacy policy linked
  - [ ] Permissions explained
  - [ ] Submit for review
  
- [ ] Figma Plugin submission:
  - [ ] Plugin compiled and tested
  - [ ] Plugin assets uploaded
  - [ ] Description complete
  - [ ] Submit for review

#### Post-Submission
- [ ] Monitor developer dashboard for feedback
- [ ] Check email for review status
- [ ] Respond to reviewer questions within 24h
- [ ] Address any requested changes
- [ ] Announce launch on social media
- [ ] Post on Product Hunt (optional)
- [ ] Share on Hacker News (optional)

---

### 9. Launch Day Checklist 🚀

#### When Approved
- [ ] Extension goes live on Chrome Web Store
- [ ] Update README with store link
- [ ] Add Chrome Web Store badge to README
- [ ] Tweet/post about launch
- [ ] Share in design communities:
  - [ ] Designer News
  - [ ] Figma Community Forum
  - [ ] Reddit r/web_design
  - [ ] Reddit r/Figma
  - [ ] Product Hunt

#### Monitor
- [ ] Chrome Web Store reviews (respond within 48h)
- [ ] GitHub Issues (respond within 24h)
- [ ] User feedback via email
- [ ] Usage analytics (if implemented)
- [ ] Error reports

---

### 10. Post-Launch Support 📞

#### First Week
- [ ] Monitor for critical bugs
- [ ] Respond to all user feedback
- [ ] Document common issues
- [ ] Create FAQ from user questions
- [ ] Update documentation based on feedback

#### First Month
- [ ] Collect feature requests
- [ ] Prioritize improvements
- [ ] Plan v1.1.0 features
- [ ] Address critical bugs
- [ ] Improve documentation

#### Ongoing
- [ ] Monthly releases with improvements
- [ ] Respond to reviews and issues
- [ ] Keep dependencies updated
- [ ] Security patches as needed
- [ ] Feature development based on feedback

---

## Timeline Estimate

### Week 1: Testing & Assets
- Days 1-2: Manual testing (8 scenarios)
- Days 3-4: Create screenshots and promotional images
- Day 5: Record demo video

### Week 2: Documentation & Legal
- Days 1-2: Proofread all documentation
- Days 3-4: Create and publish privacy policy & terms
- Day 5: Final code review and cleanup

### Week 3: Packaging & Submission
- Days 1-2: Package extension, compile plugin
- Day 3: Submit to Chrome Web Store
- Day 4: Submit Figma plugin
- Day 5: Buffer for any issues

### Week 4-5: Review Period
- Wait for Chrome Web Store review (3-7 business days)
- Wait for Figma plugin review (1-3 business days)
- Address any reviewer feedback
- Make required changes if needed

### Week 5-6: Launch
- Extension and plugin approved
- Go live on both platforms
- Launch activities (social media, communities)
- Monitor for issues

**Total Time to Launch: 5-6 weeks**

---

## Success Metrics

### Launch Goals
- [ ] Extension published on Chrome Web Store
- [ ] Plugin published on Figma Community
- [ ] Zero critical bugs reported in first week
- [ ] 4+ star average rating
- [ ] 100+ installs in first month

### Quality Metrics
- [x] 199 tests passing
- [x] 58%+ code coverage
- [ ] < 5% error rate in production
- [ ] < 10s extraction time for typical pages
- [ ] < 1% crash rate

---

## Risk Mitigation

### Potential Issues & Solutions

**Issue:** Chrome Web Store rejection  
**Solution:** Follow all guidelines, clear permissions explanation, have privacy policy

**Issue:** Figma plugin doesn't work  
**Solution:** Thorough testing on multiple files, error handling

**Issue:** Performance problems on large sites  
**Solution:** Implement Phase 16 optimizations, set data size limits

**Issue:** Font availability in Figma  
**Solution:** Document font fallback in user manual

**Issue:** User confusion about workflow  
**Solution:** Clear user manual, demo video, tooltip guidance

---

## Notes

- Keep `e2e.spec.js` in repository but exclude from test runs
- Document known limitations clearly
- Set realistic user expectations
- Have rollback plan if critical issues found
- Keep backup of working version

---

**Checklist Owner:** Development Team  
**Target Launch Date:** December 1, 2025  
**Last Updated:** October 20, 2025
