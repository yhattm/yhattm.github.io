import { test, expect } from '@playwright/test'

test.describe('Portfolio Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays the homepage with all sections', async ({ page }) => {
    // Check that all main sections are present
    await expect(page.locator('#home')).toBeVisible()
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.locator('#experience')).toBeVisible()
    await expect(page.locator('#tech')).toBeVisible()
    await expect(page.locator('#contact')).toBeVisible()
  })

  test('language toggle switches between English and Chinese', async ({ page }) => {
    const langButton = page.locator('.lang-btn')

    // Initially should show "中文" (switch to Chinese)
    await expect(langButton).toHaveText('中文')

    // Check some English content
    const heroTitle = page.locator('.hero-subtitle')
    await expect(heroTitle).toHaveText('Backend Developer')

    // Click to switch to Chinese
    await langButton.click()

    // Button should now show "English"
    await expect(langButton).toHaveText('English')

    // Content should be in Chinese
    await expect(heroTitle).toHaveText('後端開發工程師')

    // Switch back to English
    await langButton.click()
    await expect(langButton).toHaveText('中文')
    await expect(heroTitle).toHaveText('Backend Developer')
  })

  test('navigation links scroll to correct sections', async ({ page }) => {
    // Click About link
    await page.locator('a[href="#about"]').click()

    // Check that we scrolled to about section
    const aboutSection = page.locator('#about')
    await expect(aboutSection).toBeInViewport()

    // Click Experience link
    await page.locator('a[href="#experience"]').click()

    const experienceSection = page.locator('#experience')
    await expect(experienceSection).toBeInViewport()

    // Click Tech Stack link
    await page.locator('a[href="#tech"]').click()

    const techSection = page.locator('#tech')
    await expect(techSection).toBeInViewport()

    // Click Contact link
    await page.locator('a[href="#contact"]').click()

    const contactSection = page.locator('#contact')
    await expect(contactSection).toBeInViewport()
  })

  test('displays statistics cards with correct numbers', async ({ page }) => {
    await page.locator('a[href="#about"]').click()

    const statCards = page.locator('.stat-card')
    await expect(statCards).toHaveCount(3)

    // Check stat numbers
    await expect(statCards.nth(0).locator('.stat-number')).toHaveText('20+')
    await expect(statCards.nth(1).locator('.stat-number')).toHaveText('3')
    await expect(statCards.nth(2).locator('.stat-number')).toHaveText('50+')
  })

  test('displays timeline with three experiences', async ({ page }) => {
    await page.locator('a[href="#experience"]').click()

    const timelineItems = page.locator('.timeline-item')
    await expect(timelineItems).toHaveCount(3)

    // Check first experience (VIVOTEK - R&D Manager)
    await expect(timelineItems.nth(0).locator('.timeline-title')).toHaveText('VIVOTEK')
  })

  test('displays tech stack with four categories', async ({ page }) => {
    await page.locator('a[href="#tech"]').click()

    const techCategories = page.locator('.tech-category')
    await expect(techCategories).toHaveCount(4)

    // Verify category titles in English
    await expect(techCategories.nth(0).locator('.tech-category-title')).toContainText(
      'Backend Development'
    )
    await expect(techCategories.nth(1).locator('.tech-category-title')).toContainText(
      'Cloud & DevOps'
    )
    await expect(techCategories.nth(2).locator('.tech-category-title')).toContainText(
      'Frontend & Mobile'
    )
    await expect(techCategories.nth(3).locator('.tech-category-title')).toContainText(
      'Embedded & IoT'
    )
  })

  test('external links open in new tab', async ({ page }) => {
    await page.locator('a[href="#contact"]').click()

    // Check LinkedIn link
    const linkedInLink = page.locator('a[href="https://www.linkedin.com/in/chihpin/"]').first()
    await expect(linkedInLink).toHaveAttribute('target', '_blank')
    await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer')

    // Check GitHub link
    const githubLink = page.locator('a[href="https://github.com/yhattm"]').first()
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('code window displays typing animation', async ({ page }) => {
    const codeWindow = page.locator('.code-window')
    await expect(codeWindow).toBeVisible()

    const codeContent = page.locator('.code-content code')
    await expect(codeContent).toBeVisible()

    // Wait for typing animation to complete by checking for content
    await expect(codeContent).toContainText('package main', { timeout: 5000 })
  })

  test('navbar is sticky on scroll', async ({ page }) => {
    const navbar = page.locator('.navbar')

    // Initially visible
    await expect(navbar).toBeVisible()

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))

    // Navbar should still be visible (sticky)
    await expect(navbar).toBeVisible()
  })

  test('language preference persists on reload', async ({ page }) => {
    const langButton = page.locator('.lang-btn')

    // Switch to Chinese
    await langButton.click()
    await expect(langButton).toHaveText('English')

    // Reload page
    await page.reload()

    // Language should still be Chinese
    await expect(langButton).toHaveText('English')
    await expect(page.locator('.hero-subtitle')).toHaveText('後端開發工程師')
  })
})

test.describe('Responsive Design', () => {
  test('displays correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check that content is visible
    await expect(page.locator('.hero-title')).toBeVisible()
    await expect(page.locator('.nav-menu')).toBeVisible()
  })

  test('displays correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await expect(page.locator('.hero')).toBeVisible()
    await expect(page.locator('.about')).toBeVisible()
  })

  test('displays correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    await expect(page.locator('.hero')).toBeVisible()
    await expect(page.locator('.code-window')).toBeVisible()
  })
})