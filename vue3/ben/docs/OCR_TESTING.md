# OCR Testing Guide

This document explains how to test and improve OCR accuracy for the Business Card Scanner feature.

## Why Browser-Based Testing?

Tesseract.js requires a real browser environment with Web Worker support. It cannot run properly in Node.js test environments (jsdom/happy-dom) because:
- Web Workers behave differently in Node.js vs browsers
- Tesseract.js relies on browser-specific APIs
- Image preprocessing uses Canvas API which has limitations in jsdom

Therefore, OCR integration tests must run in a **real browser environment**.

## Testing Methods

### 1. Playwright E2E Tests (Recommended for Automated Testing)

**Location**: `e2e/ocr-integration.spec.ts`

**Features**:
- ✅ Automated tests that run in real browsers (Chrome, Firefox, Safari)
- ✅ Test OCR confidence scores
- ✅ Validate field extraction (phone, name, company)
- ✅ Calculate Character Error Rate (CER)
- ✅ Verify OCR service version
- ✅ CI/CD integration ready
- ✅ Repeatable and consistent results

**Usage**:
```bash
# Run all E2E tests (includes OCR tests)
npm run test:e2e

# Run only OCR tests
npx playwright test ocr-integration

# Run in headed mode (see browser)
npx playwright test ocr-integration --headed

# Run in specific browser
npx playwright test ocr-integration --project=chromium
npx playwright test ocr-integration --project=firefox
npx playwright test ocr-integration --project=webkit

# Debug mode (step through tests)
npx playwright test ocr-integration --debug
```

**Test Coverage**:
- ✅ Baseline OCR recognition with confidence validation
- ✅ Key field extraction (phone, name, company)
- ✅ Character accuracy measurement (CER for phone number)
- ✅ OCR service version detection
- ✅ Bilingual name parsing

**Expected Results**:
```
✓ should recognize text from test business card with acceptable confidence
✓ should extract key fields from business card
✓ should measure character accuracy for phone number
✓ should detect OCR service version
✓ should parse bilingual name if present
✓ should document current preprocessing method
```

### 2. Browser-Based Test Page (Manual Testing)

**Location**: `http://localhost:5173/ocr-test.html`

**Features**:
- Load test image (`test/image/card.jpg`) or upload custom images
- Run OCR with current preprocessing (Otsu's thresholding + 2x upscaling)
- View detailed metrics:
  - Confidence score
  - Character Error Rate (CER)
  - Field extraction results
- Compare expected vs actual values
- See raw OCR text output

**Usage**:
```bash
# Start dev server if not running
npm run dev

# Open browser and navigate to:
# http://localhost:5173/ocr-test.html

# Click "Load Test Card" to load test/image/card.jpg
# Click "Run OCR Test" to process the image
# Review results and console output
```

**What to Look For**:
- ✅ **Confidence > 60%** = Good
- ⚠️ **Confidence 30-60%** = Acceptable but needs improvement
- ❌ **Confidence < 30%** = Poor, needs better preprocessing

- ✅ **Phone CER < 10%** = Excellent character accuracy
- ⚠️ **Phone CER 10-30%** = Acceptable
- ❌ **Phone CER > 30%** = Poor accuracy

### 3. Manual Testing in App

**Location**: Business Card Scanner page

**Usage**:
1. Navigate to Business Card Scanner
2. Upload test image or use camera
3. Check browser console for OCR logs:
   - `🔍 OCR Service initializing... Version: v2.1.0`
   - `📊 OCR Service v2.1.0 - Confidence: XX%`
   - Raw OCR text output
4. Review extracted fields in the form

### 4. Integration Test Documentation

**Location**: `src/services/__tests__/ocr-service.spec.ts`

This file serves as **documentation** for what should be tested:
- Baseline OCR performance metrics
- Key field extraction validation
- Character accuracy measurements (CER)
- Preprocessing effectiveness comparison

The tests are **skipped** in Vitest (`.skip()`) but provide the structure for:
- Ground truth data
- Helper functions (CER calculation, text matching)
- Test scenarios to validate

**Note**: These tests are skipped in Vitest because Tesseract.js requires a real browser. Use the Playwright E2E tests instead for automated testing.

## Ground Truth Data

Test image: `test/image/card.jpg`

**Expected Values**:
| Field | Value |
|-------|-------|
| Name (姓名) | 鄭禾珈 Appa |
| Title (職稱) | 董事長 |
| Company (公司) | 郡暉有限公司 |
| Phone (電話) | 0928-568-881 |
| Tax ID (統編) | 60681878 |
| Address (地址) | 台北市大同區承德路一段17號9樓 |
| Showroom (展廳) | 桃園市桃園區經國路11號6樓之1 |
| Brand (品牌) | 好好品味生活館 |

## Current OCR Configuration

**Service**: `src/services/ocr-service.ts`
- **Version**: v2.1.0
- **Language Models**: chi_tra (Traditional Chinese) + eng (English)
- **OCR Engine Mode (OEM)**: 1 (LSTM neural nets only)
- **Page Segmentation Mode (PSM)**: 6 (Single uniform block of text)

**Preprocessing**: `preprocessImage()` method
- **Upscaling**: 2x image resolution
- **Grayscale Conversion**: Weighted RGB (0.299R + 0.587G + 0.114B)
- **Thresholding**: Otsu's adaptive method
- **Threshold Adjustment**: +20 brightness (helps with dark backgrounds)

## Improving OCR Accuracy

### Current Known Issues

**OCR Character Confusion**:
- 珈 → 過
- 董 → 黃
- 郡暉 → 可唔

**Root Cause**: Similar-looking Chinese characters are misrecognized

**Confidence Score**: ~45% (below ideal 60%+)

### Optimization Strategies

#### 1. Preprocessing Methods

Try different preprocessing approaches in `ocr-service.ts`:

**Current**: Otsu's thresholding
```typescript
// Current implementation in preprocessImage()
threshold = Math.min(threshold + 20, 255)
```

**Alternatives to Test**:

a) **Adaptive Thresholding (Local)**
```typescript
// Apply local adaptive thresholding instead of global
// Better for images with varying lighting/backgrounds
```

b) **Contrast Enhancement**
```typescript
// Increase contrast before thresholding
// histogram equalization or CLAHE
```

c) **Noise Reduction**
```typescript
// Add Gaussian blur before thresholding
// Helps reduce noise from colored backgrounds
```

d) **Morphological Operations**
```typescript
// Dilation/erosion to clean up text edges
// After thresholding
```

#### 2. Tesseract Configuration

Try different PSM modes in `init()`:
```typescript
await this.worker.setParameters({
  tessedit_pageseg_mode: '6', // Try: 1, 3, 4, 6, 11, 13
  preserve_interword_spaces: '1',
})
```

**PSM Options**:
- `1`: Automatic page segmentation with OSD
- `3`: Fully automatic (no OSD or OCR)
- `4`: Single column of text
- `6`: Single uniform block (current)
- `11`: Sparse text
- `13`: Raw line (treat as single line)

#### 3. Post-Processing

**Dictionary-Based Correction**:
```typescript
// After OCR, check against common business card terms
const corrections = {
  '黃事長': '董事長',
  '可唔': '郡暉',
  '過': '珈',
}
```

**Fuzzy Matching**:
```typescript
// Use Levenshtein distance to match against known companies/titles
// Suggest corrections when confidence is low
```

#### 4. Multi-Pass OCR

**Strategy**: Run OCR multiple times with different settings and combine results
```typescript
// 1st pass: High threshold (dark text on light background)
// 2nd pass: Low threshold (light text on dark background)
// 3rd pass: Different PSM mode
// Combine results using confidence scores
```

### Testing Workflow

1. **Baseline**: Record current metrics using test page
2. **Modify**: Change preprocessing or config in `ocr-service.ts`
3. **Hard Refresh**: Cmd+Shift+R to clear browser cache
4. **Test**: Run OCR test page again
5. **Compare**: Check if confidence/CER improved
6. **Iterate**: Try different approaches
7. **Document**: Record findings for future reference

### Example Test Log

```
=== Baseline (v2.1.0 - Otsu's) ===
Confidence: 45.23%
Phone CER: 27.50%
Fields Extracted: 3/4 (phone ✓, name ✓, company ✓, title ✗)

=== After Contrast Enhancement ===
Confidence: 58.12%
Phone CER: 15.20%
Fields Extracted: 4/4 ✓

Improvement: +12.89% confidence, -12.30% CER
```

## Additional Resources

**Tesseract.js Documentation**:
- https://tesseract.projectnaptha.com/
- https://github.com/naptha/tesseract.js

**OCR Preprocessing Best Practices**:
- https://tesseract-ocr.github.io/tessdoc/ImproveQuality
- Otsu's Method: https://en.wikipedia.org/wiki/Otsu%27s_method

**Character Error Rate (CER)**:
- Levenshtein Distance calculation
- Lower is better (0% = perfect match)

## Future Improvements

### Completed Features
- [x] **E2E tests with Playwright** - Automated OCR testing in real browsers

### Planned Features
- [ ] Preprocessing method comparison in test page
- [ ] Multiple images test suite
- [ ] Performance benchmarking (measure OCR speed)

### Advanced Techniques
- [ ] Multi-pass OCR with result fusion
- [ ] Dictionary-based post-correction
- [ ] Machine learning for character correction
- [ ] User feedback loop for improving accuracy

## Troubleshooting

**Issue**: OCR test page shows "Failed to load test image"
- **Solution**: Ensure dev server is running (`npm run dev`)
- **Solution**: Check that `test/image/card.jpg` exists

**Issue**: Low confidence scores (<30%)
- **Cause**: Poor image quality or preprocessing
- **Solution**: Try different preprocessing methods
- **Solution**: Check original image quality

**Issue**: Characters misrecognized (董→黃)
- **Cause**: Similar-looking Chinese characters
- **Solution**: Implement post-processing dictionary correction
- **Solution**: Try higher resolution images
- **Solution**: Adjust preprocessing threshold values

**Issue**: Version not updating after code changes
- **Cause**: Browser cache
- **Solution**: Hard refresh (Cmd+Shift+R on macOS, Ctrl+Shift+R on Windows)
- **Solution**: Open DevTools and disable cache

---

**Last Updated**: 2025-11-11
**OCR Service Version**: v2.1.0
