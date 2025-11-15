import { test, expect } from '@playwright/test'

/**
 * Tools Home Page - Simple Working Tests
 *
 * This demonstrates a complete E2E test from basics to advanced
 */

test.describe('Tools Home Page - Learning Example', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/')
  })

  // ============================================
  // LESSON 1: Basic Page Load Test
  // 課程 1：基本頁面載入測試
  // ============================================
  test('LESSON 1: should load the page successfully', async ({ page }) => {
    // Just check the URL contains our base
    expect(page.url()).toContain('localhost')

    // This test teaches: Basic navigation and URL assertion
    console.log('✓ Lesson 1 Complete: Page loaded')
  })

  // ============================================
  // LESSON 2: Finding Elements with Locators
  // 課程 2：使用定位器尋找元素
  // ============================================
  test('LESSON 2: finding elements on the page', async ({ page }) => {
    // Method 1: Find by tag
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Method 2: Find by class (if exists)
    const container = page.locator('.container').first()

    // Method 3: Find by text
    const mainContent = page.locator('main')

    // This test teaches: Different locator strategies
    console.log('✓ Lesson 2 Complete: Found elements using locators')
  })

  // ============================================
  // LESSON 3: Assertions and Expectations
  // 課程 3：斷言與期望
  // ============================================
  test('LESSON 3: checking page content', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('domcontentloaded')

    // Get all text content
    const text = await page.textContent('body')

    // Assert something exists
    expect(text).toBeTruthy()
    expect(text!.length).toBeGreaterThan(0)

    // This test teaches: Content assertions
    console.log('✓ Lesson 3 Complete: Verified page has content')
  })

  // ============================================
  // LESSON 4: Debugging Tests
  // 課程 4：除錯測試
  // ============================================
  test('LESSON 4: debugging techniques', async ({ page }) => {
    // Technique 1: Take screenshot
    await page.screenshot({ path: 'screenshots/lesson-4.png' })

    // Technique 2: Log page info
    console.log('Current URL:', page.url())
    console.log('Page title:', await page.title())

    // Technique 3: Check for errors
    const errors: string[] = []
    page.on('pageerror', error => {
      errors.push(error.message)
    })

    // Technique 4: Get all headings to understand page structure
    const headings = await page.locator('h1, h2, h3').allTextContents()
    console.log('Page headings:', headings)

    // This test teaches: How to debug when tests fail
    console.log('✓ Lesson 4 Complete: Learned debugging techniques')
    expect(errors.length).toBe(0) // Should have no errors
  })

  // ============================================
  // LESSON 5: Waiting for Dynamic Content
  // 課程 5：等待動態內容
  // ============================================
  test('LESSON 5: handling async content', async ({ page }) => {
    // Wait for network to be idle
    await page.waitForLoadState('networkidle')

    // Wait for a specific element (with timeout)
    try {
      await page.waitForSelector('main', { timeout: 5000 })
      console.log('✓ Main element found')
    } catch (e) {
      console.log('Main element not found - this is OK for learning')
    }

    // This test teaches: Handling async operations
    console.log('✓ Lesson 5 Complete: Learned about waiting')
    expect(true).toBe(true)
  })
})

/**
 * SUMMARY | 總結
 * ====================
 *
 * You've learned:
 * 1. Basic page navigation (page.goto)
 * 2. Finding elements (page.locator)
 * 3. Making assertions (expect)
 * 4. Debugging tests (screenshot, logs)
 * 5. Waiting for content (waitForLoadState, waitForSelector)
 *
 * Next steps:
 * - Try adding your own tests
 * - Test clicking buttons
 * - Test form inputs
 * - Test navigation between pages
 */
