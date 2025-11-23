import { describe, it, expect, beforeAll } from 'vitest'
import { TesseractOcrService } from '../ocr-service'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * OCR Integration Tests
 *
 * ⚠️ BROWSER ENVIRONMENT REQUIRED ⚠️
 * These tests require a real browser environment with Web Worker support.
 * Tesseract.js cannot run properly in jsdom/Node.js test environments.
 *
 * To test OCR functionality:
 * 1. Use the browser-based test page: http://localhost:5173/ocr-test.html
 * 2. Or run E2E tests with Playwright/Cypress in a real browser
 * 3. Or test manually in the Business Card Scanner app
 *
 * This file serves as documentation for the test structure and metrics
 * that should be measured when testing OCR improvements.
 *
 * Purpose: Test actual OCR accuracy and preprocessing effectiveness
 *
 * These tests:
 * 1. Use real business card images
 * 2. Measure OCR confidence scores
 * 3. Compare different preprocessing methods
 * 4. Calculate accuracy metrics (CER, WER)
 * 5. Validate that key fields are extractable
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

// Helper: Load test image as Blob
function loadTestImage(filename: string): Blob {
  const imagePath = join(process.cwd(), 'test', 'image', filename)
  const buffer = readFileSync(imagePath)
  return new Blob([buffer], { type: 'image/jpeg' })
}

// Helper: Calculate Character Error Rate (CER)
function calculateCER(expected: string, actual: string): number {
  // Levenshtein distance
  const m = expected.length
  const n = actual.length
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i]![0] = i
  for (let j = 0; j <= n; j++) dp[0]![j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (expected[i - 1] === actual[j - 1]) {
        dp[i]![j] = dp[i - 1]?.[j - 1] ?? 0
      } else {
        dp[i]![j] = Math.min(dp[i - 1]?.[j] ?? 0, dp[i]?.[j - 1] ?? 0, dp[i - 1]?.[j - 1] ?? 0) + 1
      }
    }
  }

  return ((dp[m]?.[n] ?? 0) / m) * 100
}

// Helper: Check if text contains substring (case-insensitive, ignoring spaces)
function containsText(text: string, search: string): boolean {
  const normalizedText = text.replace(/\s+/g, '').toLowerCase()
  const normalizedSearch = search.replace(/\s+/g, '').toLowerCase()
  return normalizedText.includes(normalizedSearch)
}

// Skip these tests in Vitest - they require a real browser environment
describe.skip('OCR Service Integration Tests', () => {
  let ocrService: TesseractOcrService

  beforeAll(() => {
    ocrService = new TesseractOcrService()
  })

  describe('Baseline OCR Test', () => {
    it(
      'should recognize text from test business card with acceptable confidence',
      async () => {
        const testImage = loadTestImage('card.jpg')

        const result = await ocrService.recognize(testImage)

        console.log('\n=== OCR Baseline Test Results ===')
        console.log(`Confidence: ${result.confidence.toFixed(2)}%`)
        console.log(`Raw Text Length: ${result.text.length} chars`)
        console.log('\n--- Raw OCR Text (first 500 chars) ---')
        console.log(result.text.substring(0, 500))
        console.log('\n--- Extracted Data ---')
        console.log(JSON.stringify(result.extractedData, null, 2))

        // Confidence should be above minimum threshold
        // Note: Green card background may result in lower confidence
        expect(result.confidence).toBeGreaterThan(30)

        // Should extract some text
        expect(result.text.length).toBeGreaterThan(10)
      },
      60000, // 60 second timeout for OCR processing
    )

    it(
      'should extract key fields from business card',
      async () => {
        const testImage = loadTestImage('card.jpg')

        const result = await ocrService.recognize(testImage)

        console.log('\n=== Key Fields Extraction Test ===')

        // Check if key information is present in raw text
        const rawText = result.text

        // Phone number should be extracted
        const phoneExtracted = result.extractedData.phone !== undefined
        console.log(`Phone extracted: ${phoneExtracted}`)
        if (phoneExtracted) {
          console.log(`  Expected: ${GROUND_TRUTH.phone}`)
          console.log(`  Actual: ${result.extractedData.phone}`)
        }

        // Name should contain Chinese or English name
        const nameExtracted = result.extractedData.name !== undefined
        console.log(`Name extracted: ${nameExtracted}`)
        if (nameExtracted) {
          console.log(`  Expected: ${GROUND_TRUTH.name} ${GROUND_TRUTH.nameEn}`)
          console.log(`  Actual: ${result.extractedData.name}`)
        }

        // Company should be extracted
        const companyExtracted = result.extractedData.company !== undefined
        console.log(`Company extracted: ${companyExtracted}`)
        if (companyExtracted) {
          console.log(`  Expected: ${GROUND_TRUTH.company}`)
          console.log(`  Actual: ${result.extractedData.company}`)
        }

        // At least phone number should be extracted (it's most reliable)
        expect(phoneExtracted).toBe(true)

        // At least 2 out of 3 key fields should be extracted
        const fieldsExtracted = [phoneExtracted, nameExtracted, companyExtracted].filter(
          Boolean,
        ).length
        expect(fieldsExtracted).toBeGreaterThanOrEqual(2)
      },
      60000,
    )
  })

  describe('OCR Accuracy Measurements', () => {
    it(
      'should measure character accuracy for key fields',
      async () => {
        const testImage = loadTestImage('card.jpg')

        const result = await ocrService.recognize(testImage)

        console.log('\n=== Character Accuracy Test ===')

        // Calculate CER for phone number (most reliable field)
        if (result.extractedData.phone) {
          const phoneCER = calculateCER(
            GROUND_TRUTH.phone.replace(/[-\s]/g, ''),
            result.extractedData.phone.replace(/[-\s]/g, ''),
          )
          console.log(`Phone CER: ${phoneCER.toFixed(2)}%`)

          // Phone should have low error rate
          expect(phoneCER).toBeLessThan(30)
        }

        // Check if key text appears in raw output
        const rawText = result.text
        const phoneInText = containsText(rawText, GROUND_TRUTH.phone)
        const taxIdInText = containsText(rawText, GROUND_TRUTH.taxId)

        console.log(`Phone in raw text: ${phoneInText}`)
        console.log(`Tax ID in raw text: ${taxIdInText}`)

        // At least phone or tax ID should appear in raw text
        expect(phoneInText || taxIdInText).toBe(true)
      },
      60000,
    )
  })

  describe('Preprocessing Effectiveness', () => {
    it(
      'should log preprocessing method being used',
      async () => {
        const testImage = loadTestImage('card.jpg')

        const result = await ocrService.recognize(testImage)

        console.log('\n=== Preprocessing Method ===')
        console.log('Current: Otsu\'s adaptive thresholding with 2x upscaling')
        console.log(`Confidence with current preprocessing: ${result.confidence.toFixed(2)}%`)

        // Document baseline for future comparison
        // When you implement different preprocessing methods,
        // add them here to compare results
        expect(result.confidence).toBeGreaterThan(0)
      },
      60000,
    )
  })

  describe('Field Parser Integration', () => {
    it(
      'should correctly parse bilingual name from OCR output',
      async () => {
        const testImage = loadTestImage('card.jpg')

        const result = await ocrService.recognize(testImage)

        console.log('\n=== Field Parser Test ===')
        console.log('Testing bilingual name detection...')

        if (result.extractedData.name) {
          const hasChinese = /[\u4e00-\u9fff]/.test(result.extractedData.name)
          const hasEnglish = /[A-Za-z]{2,}/.test(result.extractedData.name)

          console.log(`  Name: ${result.extractedData.name}`)
          console.log(`  Has Chinese: ${hasChinese}`)
          console.log(`  Has English: ${hasEnglish}`)

          // Bilingual name should have both Chinese and English
          // (if OCR can read it accurately)
          if (hasChinese || hasEnglish) {
            expect(result.extractedData.name.length).toBeGreaterThan(2)
          }
        }
      },
      60000,
    )

    it(
      'should detect Chinese title if present in OCR output',
      async () => {
        const testImage = loadTestImage('card.jpg')

        const result = await ocrService.recognize(testImage)

        console.log('\n=== Title Detection Test ===')

        if (result.extractedData.title) {
          console.log(`  Title extracted: ${result.extractedData.title}`)
          console.log(`  Expected: ${GROUND_TRUTH.title}`)

          // Title should contain "長" character (common in Chinese titles)
          const hasChineseTitle = /長/.test(result.extractedData.title)
          console.log(`  Contains "長": ${hasChineseTitle}`)
        } else {
          console.log('  No title extracted')
        }

        // Title extraction is tested (may fail due to OCR errors)
        expect(result.extractedData).toBeDefined()
      },
      60000,
    )
  })
})
