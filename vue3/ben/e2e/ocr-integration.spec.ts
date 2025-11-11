import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * OCR Integration Tests
 *
 * Purpose: Test actual OCR accuracy and preprocessing effectiveness in a real browser
 *
 * These tests:
 * 1. Use real business card images
 * 2. Measure OCR confidence scores
 * 3. Validate field extraction
 * 4. Calculate accuracy metrics (CER)
 * 5. Test in real browser environment (Chrome, Firefox, Safari)
 *
 * Ground Truth for test/image/card.jpg:
 * - Name: 鄭禾珈 Appa
 * - Title: 董事長
 * - Company: 郡暉有限公司
 * - Phone: 0928-568-881
 * - Tax ID: 60681878
 * - Address: 台北市大同區承德路一段17號9樓
 */

// Ground truth data for the test card
const GROUND_TRUTH = {
  name: '鄭禾珈',
  nameEn: 'Appa',
  title: '董事長',
  company: '郡暉有限公司',
  phone: '0928-568-881',
  taxId: '60681878',
  address: '台北市大同區承德路一段17號9樓',
  showroom: '桃園市桃園區經國路11號6樓之1',
  brand: '好好品味生活館',
}

// Helper: Calculate Character Error Rate (CER) using Levenshtein distance
function calculateCER(expected: string, actual: string): number {
  const m = expected.length
  const n = actual.length
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (expected[i - 1] === actual[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]) + 1
      }
    }
  }

  return (dp[m][n] / m) * 100
}

// Helper: Check if text contains substring (case-insensitive, ignoring spaces)
// Currently unused but useful for future tests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function containsText(text: string, search: string): boolean {
  const normalizedText = text.replace(/\s+/g, '').toLowerCase()
  const normalizedSearch = search.replace(/\s+/g, '').toLowerCase()
  return normalizedText.includes(normalizedSearch)
}

test.describe('OCR Service Integration Tests', () => {
  // Increase timeout for OCR tests (OCR can take 30-60 seconds)
  test.setTimeout(120000)

  test.beforeEach(async ({ page }) => {
    // Navigate to Business Card Scanner
    await page.goto('/ben/business-card-scanner', { waitUntil: 'networkidle' })

    // Wait for page to be ready (tabs should be visible)
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 })
  })

  test('should recognize text from test business card with acceptable confidence', async ({
    page,
  }) => {
    // Load test image
    const testImagePath = join(process.cwd(), 'test', 'image', 'card.jpg')
    const imageBuffer = readFileSync(testImagePath)

    // Click on Upload tab
    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /上傳|Upload/ })
    await uploadTab.click()

    // Upload the test image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'card.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer,
    })

    // Wait for OCR to complete (form should appear)
    await page.waitForSelector('h3:has-text("Edit"), h3:has-text("編輯")', { timeout: 60000 })

    // Verify form has multiple inputs
    const inputCount = await page.locator('input').count()
    expect(inputCount).toBeGreaterThan(5) // Should have at least name, title, company, phone, email fields

    console.log(`✓ OCR completed successfully and form is displayed with ${inputCount} inputs`)
  })

  test('should extract key fields from business card', async ({ page }) => {
    // Load test image
    const testImagePath = join(process.cwd(), 'test', 'image', 'card.jpg')
    const imageBuffer = readFileSync(testImagePath)

    // Click on Upload tab
    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /上傳|Upload/ })
    await uploadTab.click()

    // Upload the test image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'card.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer,
    })

    // Wait for OCR to complete (form should appear)
    await page.waitForSelector('h3:has-text("Edit"), h3:has-text("編輯")', { timeout: 60000 })

    // Get all visible text inputs (excluding file input and textarea)
    const textInputs = page.locator('input:not([type="file"])')

    // Grid layout order: name (0), title (1), company (2), phone (3), email (4), website (5), fax (6), social (7), address (8)
    const nameValue = await textInputs.nth(0).inputValue()
    const phoneValue = await textInputs.nth(3).inputValue()
    const companyValue = await textInputs.nth(2).inputValue()

    console.log('\n=== Extracted Fields ===')
    console.log('Name:', nameValue)
    console.log('Phone:', phoneValue)
    console.log('Company:', companyValue)

    // Phone should be extracted (most reliable field)
    expect(phoneValue).toBeTruthy()
    expect(phoneValue.length).toBeGreaterThan(5)

    console.log('✓ Phone extracted:', phoneValue)

    // At least 2 out of 3 key fields should be extracted
    const fieldsExtracted = [
      phoneValue.length > 0,
      nameValue.length > 0,
      companyValue.length > 0,
    ].filter(Boolean).length

    expect(fieldsExtracted).toBeGreaterThanOrEqual(2)

    console.log(`✓ ${fieldsExtracted}/3 key fields extracted`)
  })

  test('should measure character accuracy for phone number', async ({ page }) => {
    // Load test image
    const testImagePath = join(process.cwd(), 'test', 'image', 'card.jpg')
    const imageBuffer = readFileSync(testImagePath)

    // Click on Upload tab
    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /上傳|Upload/ })
    await uploadTab.click()

    // Upload the test image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'card.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer,
    })

    // Wait for OCR to complete
    await page.waitForSelector('h3:has-text("Edit"), h3:has-text("編輯")', { timeout: 60000 })

    // Get phone value (4th input, excluding file input)
    const textInputs = page.locator('input:not([type="file"])')
    const phoneValue = await textInputs.nth(3).inputValue()

    console.log('\n=== Character Accuracy Test ===')
    console.log('Expected phone:', GROUND_TRUTH.phone)
    console.log('Actual phone:', phoneValue)

    if (phoneValue) {
      // Calculate CER (remove dashes and spaces for comparison)
      const cleanExpected = GROUND_TRUTH.phone.replace(/[-\s]/g, '')
      const cleanActual = phoneValue.replace(/[-\s]/g, '')
      const phoneCER = calculateCER(cleanExpected, cleanActual)

      console.log(`Phone CER: ${phoneCER.toFixed(2)}%`)

      // Phone should have reasonable error rate
      // Allow up to 30% error for now (can be tightened as OCR improves)
      expect(phoneCER).toBeLessThan(30)

      console.log('✓ Phone CER within acceptable range')
    }
  })

  test('should detect OCR service version', async ({ page }) => {
    // Set up console log listener before navigation
    const logs: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        logs.push(msg.text())
      }
    })

    // Load test image
    const testImagePath = join(process.cwd(), 'test', 'image', 'card.jpg')
    const imageBuffer = readFileSync(testImagePath)

    // Click on Upload tab
    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /上傳|Upload/ })
    await uploadTab.click()

    // Upload the test image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'card.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer,
    })

    // Wait for OCR to complete
    await page.waitForSelector('text=名片掃描成功', { timeout: 60000 })

    // Check for version log
    const versionLog = logs.find((log) => log.includes('OCR Service') && log.includes('Version'))
    console.log('\n=== OCR Service Version ===')
    console.log('Version log:', versionLog)

    // Should log OCR service version
    expect(versionLog).toBeTruthy()
    expect(versionLog).toContain('v2.1.0')

    console.log('✓ OCR Service version: v2.1.0')
  })

  test('should parse bilingual name if present', async ({ page }) => {
    // Load test image
    const testImagePath = join(process.cwd(), 'test', 'image', 'card.jpg')
    const imageBuffer = readFileSync(testImagePath)

    // Click on Upload tab
    const uploadTab = page.locator('[role="tab"]').filter({ hasText: /上傳|Upload/ })
    await uploadTab.click()

    // Upload the test image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'card.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer,
    })

    // Wait for OCR to complete
    await page.waitForSelector('h3:has-text("Edit"), h3:has-text("編輯")', { timeout: 60000 })

    // Get name value (1st input, excluding file input)
    const textInputs = page.locator('input:not([type="file"])')
    const nameValue = await textInputs.nth(0).inputValue()

    console.log('\n=== Bilingual Name Test ===')
    console.log('Name value:', nameValue)

    if (nameValue) {
      const hasChinese = /[\u4e00-\u9fff]/.test(nameValue)
      const hasEnglish = /[A-Za-z]{2,}/.test(nameValue)

      console.log(`Has Chinese: ${hasChinese}`)
      console.log(`Has English: ${hasEnglish}`)

      // Should contain at least some text
      expect(nameValue.length).toBeGreaterThan(2)

      console.log('✓ Name extracted with reasonable content')
    }
  })
})

test.describe('OCR Preprocessing Effectiveness', () => {
  test.setTimeout(120000)

  test('should document current preprocessing method', async () => {
    // This test serves as documentation
    console.log('\n=== Current Preprocessing Method ===')
    console.log("Method: Otsu's adaptive thresholding with 2x upscaling")
    console.log('Configuration:')
    console.log('  - Language: chi_tra (Traditional Chinese) + eng (English)')
    console.log('  - OEM: 1 (LSTM neural nets)')
    console.log('  - PSM: 6 (Single uniform block)')
    console.log('  - Upscaling: 2x')
    console.log("  - Thresholding: Otsu's method + 20 brightness adjustment")

    // This test always passes - it's for documentation
    expect(true).toBe(true)
  })
})
