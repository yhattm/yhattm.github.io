import { test, expect } from '@playwright/test'

test.describe('Tools Home Page', () => {
  // This runs before each test in this group
  test.beforeEach(async ({ page }) => {
    //  Use '/' - baseURL from config handles the /ben/ prefix
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('DEBUG: check what is on the page', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Take a screenshot to see what the page looks like
    await page.screenshot({ path: 'screenshots/tools-home-debug.png' })

    // Get the page HTML
    const bodyText = await page.locator('body').textContent()
    console.log('Page text content:', bodyText?.substring(0, 200))

    // Check the URL
    console.log('Current URL:', page.url())

    // List all h1, h2, h3 elements
    const headings = await page.locator('h1, h2, h3, h4').allTextContents()
    console.log('All headings:', headings)

    // List all buttons
    const buttons = await page.locator('button').allTextContents()
    console.log('All buttons:', buttons)

    // Check for errors
    console.log('Console errors:', errors)

    // Always pass - this is just for debugging
    expect(true).toBe(true)
  })

  test('should load and display the page title', async ({ page }) => {
    // Find the h1 element - this is the main title
    const title = page.locator('h1')

    // Check that it's visible on the page
    await expect(title).toBeVisible()

    // Check the text content (will vary by language, so just check it exists)
    const titleText = await title.textContent()
    expect(titleText).toBeTruthy()
    expect(titleText!.length).toBeGreaterThan(0)

    console.log('Page title:', titleText)
  })

  test('should display the clock card', async ({ page }) => {
    // Look for the clock/time card by finding text
    // Using i18n keys from ToolsHomeView.vue
    const timeCard = page.locator('text=/現在時間|Current Time/i')

    // Verify the card is visible
    await expect(timeCard).toBeVisible()

    console.log('✓ Clock card is displayed')
  })

  test('should display tool cards', async ({ page }) => {
    // The tools are in clickable cards
    // Let's find buttons with "Open Tool" text
    const toolButtons = page.locator('button', { hasText: /Open Tool/i })

    // Should have 2 tool cards (MRT Fare Finder + Business Card Scanner)
    await expect(toolButtons).toHaveCount(2)

    console.log('✓ Found 2 tool cards')
  })
})
