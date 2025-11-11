#!/usr/bin/env node
// Interactive Playwright Debug Session
// Complements debug-console.js with page interaction and screenshots

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173/ben';
const TARGET_ROUTE = process.argv[2] || '/business-card-scanner';
const SCREENSHOT_DIR = join(__dirname, '../screenshots');

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

async function main() {
  console.log(colorize('magenta', '\n🎭 Playwright Interactive Debug Session\n'));
  console.log(colorize('gray', '='.repeat(80)));

  const url = `${BASE_URL}${TARGET_ROUTE}`;
  console.log(colorize('blue', `📍 Target URL: ${url}`));
  console.log(colorize('gray', '='.repeat(80) + '\n'));

  // Launch browser
  console.log(colorize('blue', '🚀 Launching Chromium...\n'));
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100, // Slow down for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Console log tracking
  let consoleCount = { log: 0, warn: 0, error: 0, debug: 0 };

  // Set up console listener
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    consoleCount[type] = (consoleCount[type] || 0) + 1;

    const icons = { error: '❌', warning: '⚠️', log: '📝', debug: '🐛' };
    const icon = icons[type] || '📝';
    const color = type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'gray';

    console.log(colorize(color, `[${timestamp}] ${icon} ${type.toUpperCase()}: ${text}`));
  });

  // Page error tracking
  let errorCount = 0;
  page.on('pageerror', async (error) => {
    errorCount++;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    console.log(colorize('red', `\n[${timestamp}] 💥 PAGE ERROR #${errorCount}:`));
    console.log(colorize('red', `   ${error.message}`));
    console.log(colorize('gray', `   Stack: ${error.stack?.split('\n')[0]}`));

    // Auto-screenshot on error
    try {
      const screenshotPath = join(SCREENSHOT_DIR, `error-${errorCount}-${Date.now()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(colorize('green', `   📸 Screenshot saved: ${screenshotPath}`));
    } catch (e) {
      console.log(colorize('yellow', `   ⚠️  Failed to save screenshot: ${e.message}`));
    }
  });

  // Request tracking
  let requestCount = 0;
  page.on('request', (request) => {
    requestCount++;
    const url = request.url();
    if (!url.includes('localhost:5173/@vite') && !url.includes('node_modules')) {
      console.log(colorize('blue', `📤 Request: ${request.method()} ${url}`));
    }
  });

  // Response tracking
  page.on('response', (response) => {
    const url = response.url();
    const status = response.status();
    if (!url.includes('localhost:5173/@vite') && !url.includes('node_modules')) {
      const color = status >= 400 ? 'red' : status >= 300 ? 'yellow' : 'green';
      console.log(colorize(color, `📥 Response: ${status} ${url}`));
    }
  });

  // Navigate to page
  console.log(colorize('blue', `🌐 Navigating to ${url}...\n`));

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    console.log(colorize('green', '✅ Page loaded successfully!\n'));
  } catch (e) {
    console.log(colorize('red', `❌ Navigation failed: ${e.message}\n`));
  }

  // Wait a bit for initial logs
  await page.waitForTimeout(2000);

  // Display summary
  console.log(colorize('gray', '\n' + '='.repeat(80)));
  console.log(colorize('magenta', '📊 SESSION SUMMARY'));
  console.log(colorize('gray', '='.repeat(80)));
  console.log(colorize('gray', `Console messages: ${consoleCount.log || 0} logs, ${consoleCount.warn || 0} warnings, ${consoleCount.error || 0} errors`));
  console.log(colorize('gray', `Page errors: ${errorCount}`));
  console.log(colorize('gray', `Network requests: ${requestCount}`));
  console.log(colorize('gray', '='.repeat(80) + '\n'));

  // Interactive mode
  console.log(colorize('green', '🎮 Interactive Mode Active\n'));
  console.log(colorize('blue', 'Available commands:'));
  console.log(colorize('gray', '  - Press S: Take screenshot'));
  console.log(colorize('gray', '  - Press R: Reload page'));
  console.log(colorize('gray', '  - Press Q: Quit and close browser'));
  console.log(colorize('gray', '  - Press H: Show this help\n'));

  // Keep session alive and interactive
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', async (key) => {
    const char = key.toString();

    if (char === 's' || char === 'S') {
      const screenshotPath = join(SCREENSHOT_DIR, `manual-${Date.now()}.png`);
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(colorize('green', `\n📸 Screenshot saved: ${screenshotPath}\n`));
      } catch (e) {
        console.log(colorize('red', `\n❌ Screenshot failed: ${e.message}\n`));
      }
    } else if (char === 'r' || char === 'R') {
      console.log(colorize('blue', '\n🔄 Reloading page...\n'));
      await page.reload({ waitUntil: 'networkidle' });
      console.log(colorize('green', '✅ Page reloaded\n'));
    } else if (char === 'h' || char === 'H') {
      console.log(colorize('blue', '\n📖 Help:'));
      console.log(colorize('gray', '  S - Screenshot'));
      console.log(colorize('gray', '  R - Reload'));
      console.log(colorize('gray', '  Q - Quit'));
      console.log(colorize('gray', '  H - Help\n'));
    } else if (char === 'q' || char === 'Q' || char === '\u0003') {
      // Ctrl+C or Q
      console.log(colorize('yellow', '\n\n👋 Closing browser and exiting...\n'));
      await browser.close();
      process.exit(0);
    }
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    console.log(colorize('yellow', '\n\n👋 Received SIGINT, closing browser...\n'));
    await browser.close();
    process.exit(0);
  });
}

main().catch(async (error) => {
  console.error(colorize('red', `\n❌ Error: ${error.message}\n`));
  process.exit(1);
});
