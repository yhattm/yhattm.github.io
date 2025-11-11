# Debug Web Application - Hybrid Mode

Monitor browser console logs with real-time streaming AND interactive capabilities.

## Your Task:

1. **Ask user which debug mode they want:**
   - **Real-time**: Fast console monitoring (debug-console.js)
   - **Interactive**: Playwright automation (screenshots, page interaction)
   - **Hybrid**: Both modes simultaneously (recommended)

2. **Check prerequisites:**
   - Dev server running (`npm run dev`)
   - For real-time mode: Edge with `--remote-debugging-port=9222`
   - For Playwright mode: Chromium will auto-launch

3. **Execute based on mode:**

### Mode 1: Real-time (Default for quick debugging)
- Use existing Edge browser with remote debugging
- Launch `debug-console.js` for WebSocket console streaming
- Lightweight, instant startup
- **Best for**: Active development debugging

### Mode 2: Interactive (For testing and screenshots)
- Launch Playwright with Chromium
- Enable page interaction (click, type, navigate)
- Capture screenshots on errors
- **Best for**: Automated testing, visual debugging

### Mode 3: Hybrid (Recommended)
- Launch BOTH debug-console.js AND Playwright
- Real-time console monitoring + Interactive capabilities
- Run in parallel for maximum visibility
- **Best for**: Complex debugging scenarios

## Hybrid Mode Workflow:

```bash
# Terminal 1: Real-time console monitor (existing browser)
node .claude/scripts/debug-console.js [route]

# Terminal 2: Playwright interactive session (new browser)
node .claude/scripts/playwright-debug.js [route]
```

## Available Options:

**Route selection:**
- `/business-card-scanner` - Business card scanner page
- `/mrt-fare-finder` - MRT fare finder
- `/` - Home page
- Custom route

**Debug actions:**
- View console logs (real-time)
- Take screenshot (Playwright)
- Click element (Playwright)
- Evaluate JavaScript (Playwright)
- Monitor network requests (Playwright)

## What to Provide:

1. **Status report**: What's running, which ports, browser status
2. **Console output**: Show recent logs from both sources
3. **Quick commands**: How to interact, take screenshot, stop debugging
4. **Error highlights**: Immediately flag any errors or warnings

## Output Format:

```
🔍 Hybrid Debug Mode Active

📡 Real-time Monitor (debug-console.js)
   ✅ Connected to Edge (port 9222)
   📍 Monitoring: http://localhost:5173/ben/business-card-scanner
   🔊 Console logs streaming...

🎭 Playwright Interactive (playwright-debug.js)
   ✅ Chromium launched
   📍 Page loaded: http://localhost:5173/ben/business-card-scanner
   📸 Ready for screenshots and interaction

Recent Console Output:
[08:30:15] 📝 LOG: Store initialized
[08:30:16] ⚠️  WARN: Missing parameter
[08:30:17] ❌ ERROR: DataCloneError

Quick Commands:
- Take screenshot: Use Playwright session
- Check latest logs: BashOutput [process_id]
- Stop monitoring: Ctrl+C or KillShell
```

## Important Notes:

- Always show process IDs for background tasks
- Provide clear stop instructions
- Highlight errors immediately with stack traces
- Keep both sessions coordinated (same URL)
- Auto-cleanup on exit
