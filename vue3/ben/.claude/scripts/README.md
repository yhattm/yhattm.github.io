# Claude Debug Scripts

Utility scripts for debugging web applications with Claude.

## Overview

Three debugging modes available:
1. **Real-time** - Fast console monitoring (debug-console.js)
2. **Interactive** - Playwright automation (playwright-debug.js)
3. **Hybrid** - Both modes simultaneously (recommended)

## debug-console.js

Real-time browser console monitoring using Edge DevTools Protocol.

### Features
- ✅ Real-time console log monitoring (log, debug, warning, error)
- ✅ Exception tracking with stack traces
- ✅ Color-coded output for easy reading
- ✅ Automatic target selection or URL filtering
- ✅ Timestamps for all messages

### Usage

**Basic usage** (monitors first available page):
```bash
node .claude/scripts/debug-console.js
```

**Monitor specific URL**:
```bash
node .claude/scripts/debug-console.js business-card-scanner
# Monitors any page with "business-card-scanner" in URL
```

**Custom debugging port**:
```bash
DEBUG_PORT=9223 node .claude/scripts/debug-console.js
```

### Prerequisites

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Open Edge with remote debugging**:
   ```bash
   "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
     --remote-debugging-port=9222 \
     --new-window "http://localhost:5173/ben/"
   ```

3. **Run the monitor**:
   ```bash
   node .claude/scripts/debug-console.js
   ```

### Output Format

```
🔍 Connecting to Edge DevTools on port 9222...

Found 5 debugging target(s)

✅ Connected to: Vite App
   URL: http://localhost:5173/ben/business-card-scanner

📡 Starting console monitor...

================================================================================
CONSOLE OUTPUT
================================================================================

[08:15:30] 📝 LOG: 🍍 "businessCard" store installed 🆕
[08:15:35] ⚠️  WARN: Parameter not found: language_model_ngram_on
[08:15:40] ❌ ERROR: DataCloneError: Failed to execute 'add'
  Stack:
    at addCard (http://localhost:5173/src/stores/businessCard.ts:93:7)
    at async saveCard (http://localhost:5173/src/views/BusinessCardScannerView.vue:104:5)
```

### Integration with Claude

Use the `/debug-web` slash command for automated setup:

```
/debug-web
```

This command will:
1. Check if dev server is running
2. Ask which route to debug
3. Open Edge with debugging
4. Start console monitoring
5. Display all console output

### Tips

- Press `Ctrl+C` to stop monitoring
- Use URL filter to focus on specific pages
- Console output updates in real-time as you interact with the app
- Errors show full stack traces automatically
- All messages are timestamped for debugging

### Troubleshooting

**Connection refused**:
- Make sure Edge is running with `--remote-debugging-port=9222`
- Check if another process is using port 9222

**No targets found**:
- Ensure Edge is open with at least one tab
- Try refreshing the page in Edge

**Messages not showing**:
- Refresh the page to reconnect
- Check if the correct tab is active in Edge

---

## playwright-debug.js

Interactive Playwright debug session with page interaction and screenshots.

### Features
- ✅ Page interaction (click, type, navigate)
- ✅ Automatic screenshots on errors
- ✅ Manual screenshot capture (Press S)
- ✅ Page reload (Press R)
- ✅ Network request monitoring
- ✅ Console log capture
- ✅ Interactive keyboard controls

### Usage

**Basic usage**:
```bash
node .claude/scripts/playwright-debug.js
```

**Specific route**:
```bash
node .claude/scripts/playwright-debug.js /business-card-scanner
```

**Custom base URL**:
```bash
BASE_URL=http://localhost:3000 node .claude/scripts/playwright-debug.js /app
```

### Interactive Commands

While the session is running:
- **S** - Take screenshot
- **R** - Reload page
- **H** - Show help
- **Q** - Quit (or Ctrl+C)

### Output

Screenshots are saved to: `screenshots/`
- `error-{N}-{timestamp}.png` - Auto-captured on errors
- `manual-{timestamp}.png` - Manual captures (Press S)

### Example Session

```
🎭 Playwright Interactive Debug Session

📍 Target URL: http://localhost:5173/ben/business-card-scanner

🚀 Launching Chromium...

🌐 Navigating to http://localhost:5173/ben/business-card-scanner...

[08:30:15] 📝 LOG: Store initialized
[08:30:16] ⚠️  WARN: Missing parameter
✅ Page loaded successfully!

📊 SESSION SUMMARY
Console messages: 5 logs, 2 warnings, 0 errors
Page errors: 0
Network requests: 12

🎮 Interactive Mode Active

Available commands:
  - Press S: Take screenshot
  - Press R: Reload page
  - Press Q: Quit and close browser
  - Press H: Show this help
```

---

## Hybrid Mode (Recommended)

Run both real-time monitoring AND interactive debugging simultaneously.

### Setup

**Terminal 1 - Real-time Console Monitor**:
```bash
# Start Edge with debugging
"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  --remote-debugging-port=9222 \
  --new-window "http://localhost:5173/ben/business-card-scanner"

# Monitor console
node .claude/scripts/debug-console.js business-card-scanner
```

**Terminal 2 - Interactive Playwright**:
```bash
node .claude/scripts/playwright-debug.js /business-card-scanner
```

### Using the `/debug-web` Command

The easiest way to start hybrid debugging:

```
/debug-web
```

Claude will:
1. Ask which debug mode you want (Real-time / Interactive / Hybrid)
2. Check if dev server is running
3. Launch appropriate browser(s)
4. Start monitoring sessions
5. Provide process IDs and control commands

### Benefits of Hybrid Mode

| Feature | Real-time | Interactive | Hybrid |
|---------|-----------|-------------|--------|
| Console monitoring | ✅ | ✅ | ✅✅ |
| Real-time streaming | ✅ | ❌ | ✅ |
| Screenshots | ❌ | ✅ | ✅ |
| Page interaction | ❌ | ✅ | ✅ |
| Lightweight | ✅ | ❌ | ⚠️ |
| Use existing browser | ✅ | ❌ | ✅ |

### Comparison

**Real-time (debug-console.js)**:
- Connects to your actual browser
- Instant startup (~0.1s)
- Lightweight (~10MB)
- WebSocket streaming
- **Best for**: Active development

**Interactive (playwright-debug.js)**:
- Launches new Chromium
- Full automation (~3s startup)
- Heavy (~200MB+)
- Event-based logging
- **Best for**: Testing & screenshots

**Hybrid (Both)**:
- Best of both worlds
- Maximum visibility
- Parallel execution
- **Best for**: Complex debugging

### Quick Start Guide

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Use the slash command**:
   ```
   /debug-web
   ```

3. **Choose mode**: Real-time / Interactive / Hybrid

4. **Debug your app**:
   - View real-time console logs
   - Take screenshots on errors
   - Interact with the page
   - Monitor network requests

5. **Stop debugging**:
   - Press Ctrl+C or Q
   - Use `KillShell` for background processes

### Tips

- **Use hybrid mode** for complex issues
- **Use real-time** for quick console checks
- **Use interactive** for visual debugging and testing
- Screenshots are auto-saved on errors in interactive mode
- Both modes can run simultaneously without conflicts
