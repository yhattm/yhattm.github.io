// Test Playwright Console Log Capture
// Compare with debug-console.js approach

import { chromium } from '@playwright/test';

async function testConsoleCapture() {
  console.log('🧪 Testing Playwright Console Log Capture...\n');

  // Launch browser
  const browser = await chromium.launch({
    headless: false, // Show browser for visibility
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Storage for console logs
  const consoleLogs = [];
  const consoleErrors = [];
  const pageErrors = [];

  // Capture console messages
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    const logEntry = {
      timestamp,
      type,
      text,
    };

    consoleLogs.push(logEntry);

    // Color output based on type
    const colors = {
      error: '\x1b[31m',
      warning: '\x1b[33m',
      log: '\x1b[37m',
      debug: '\x1b[34m',
      reset: '\x1b[0m',
    };

    const color = colors[type] || colors.log;
    const icons = {
      error: '❌',
      warning: '⚠️',
      log: '📝',
      debug: '🐛',
    };
    const icon = icons[type] || '📝';

    console.log(`${color}[${timestamp}] ${icon} ${type.toUpperCase()}: ${text}${colors.reset}`);

    if (type === 'error') {
      consoleErrors.push(logEntry);
    }
  });

  // Capture page errors (uncaught exceptions)
  page.on('pageerror', (error) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    console.log(`\x1b[31m[${timestamp}] 💥 PAGE ERROR: ${error.message}\x1b[0m`);
    console.log(`\x1b[90m   Stack: ${error.stack}\x1b[0m`);
    pageErrors.push({ timestamp, message: error.message, stack: error.stack });
  });

  // Navigate to the app
  console.log('\n🌐 Navigating to http://localhost:5173/ben/business-card-scanner\n');
  await page.goto('http://localhost:5173/ben/business-card-scanner', {
    waitUntil: 'networkidle',
  });

  // Wait a bit to capture initial console logs
  await page.waitForTimeout(3000);

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total console messages: ${consoleLogs.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  console.log(`Page errors (exceptions): ${pageErrors.length}`);

  if (consoleErrors.length > 0) {
    console.log('\n⚠️  Console Errors:');
    consoleErrors.forEach((err) => {
      console.log(`   [${err.timestamp}] ${err.text}`);
    });
  }

  if (pageErrors.length > 0) {
    console.log('\n💥 Page Exceptions:');
    pageErrors.forEach((err) => {
      console.log(`   [${err.timestamp}] ${err.message}`);
    });
  }

  console.log('\n✅ Test complete! Browser will stay open for 5 seconds...\n');

  // Keep browser open for inspection
  await page.waitForTimeout(5000);

  await browser.close();
}

testConsoleCapture().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
