#!/usr/bin/env node
// Console Log Monitor for Edge DevTools Protocol
// Connects to Edge remote debugging and streams console logs in real-time

import http from 'http';
import WebSocket from 'ws';

const DEBUG_PORT = process.env.DEBUG_PORT || '9222';
const TARGET_URL = process.argv[2]; // Optional: filter by URL

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Get list of debugging targets
function getTargets() {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${DEBUG_PORT}/json`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log(colorize('blue', `\n🔍 Connecting to Edge DevTools on port ${DEBUG_PORT}...\n`));

    const targets = await getTargets();
    console.log(colorize('gray', `Found ${targets.length} debugging target(s)\n`));

    // Find the target page
    let target;
    if (TARGET_URL) {
      target = targets.find((t) => t.url && t.url.includes(TARGET_URL));
      if (!target) {
        console.log(colorize('yellow', `⚠️  No target found matching "${TARGET_URL}"`));
        console.log(colorize('gray', '\nAvailable targets:'));
        targets.forEach((t, i) => {
          console.log(colorize('gray', `  ${i + 1}. ${t.title || 'Untitled'} - ${t.url || 'No URL'}`));
        });
        target = targets[0];
      }
    } else {
      target = targets.find((t) => t.type === 'page') || targets[0];
    }

    if (!target) {
      console.error(colorize('red', '❌ No debugging target found'));
      process.exit(1);
    }

    console.log(colorize('green', `✅ Connected to: ${target.title}`));
    console.log(colorize('gray', `   URL: ${target.url}\n`));
    console.log(colorize('blue', '📡 Starting console monitor...\n'));
    console.log(colorize('gray', '='.repeat(80)));
    console.log(colorize('gray', 'CONSOLE OUTPUT'));
    console.log(colorize('gray', '='.repeat(80) + '\n'));

    // Connect to WebSocket
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.on('open', () => {
      // Enable Runtime domain to receive console messages
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      // Enable Console domain
      ws.send(JSON.stringify({ id: 2, method: 'Console.enable' }));
      // Enable Log domain
      ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));
    });

    ws.on('message', (data) => {
      const message = JSON.parse(data);

      // Handle console API calls (console.log, console.error, etc.)
      if (message.method === 'Runtime.consoleAPICalled') {
        const { type, args, stackTrace, timestamp } = message.params;

        // Format timestamp
        const date = new Date(timestamp);
        const time = date.toLocaleTimeString('en-US', { hour12: false });

        // Extract arguments
        const texts = args.map((arg) => {
          if (arg.value !== undefined) return String(arg.value);
          if (arg.description) return arg.description;
          if (arg.preview) return JSON.stringify(arg.preview, null, 2);
          return `[${arg.type}]`;
        });

        // Colorize based on type
        let prefix, color;
        switch (type.toLowerCase()) {
          case 'error':
            prefix = '❌ ERROR';
            color = 'red';
            break;
          case 'warning':
            prefix = '⚠️  WARN';
            color = 'yellow';
            break;
          case 'debug':
            prefix = '🐛 DEBUG';
            color = 'blue';
            break;
          case 'log':
          default:
            prefix = '📝 LOG';
            color = 'gray';
        }

        console.log(colorize(color, `[${time}] ${prefix}:`), texts.join(' '));

        // Show stack trace for errors
        if (stackTrace && type === 'error') {
          console.log(colorize('gray', '  Stack:'));
          stackTrace.callFrames.slice(0, 3).forEach((frame) => {
            console.log(
              colorize('gray', `    at ${frame.functionName || '<anonymous>'} (${frame.url}:${frame.lineNumber}:${frame.columnNumber})`)
            );
          });
        }
      }

      // Handle exceptions
      if (message.method === 'Runtime.exceptionThrown') {
        const { exceptionDetails } = message.params;
        const timestamp = exceptionDetails.timestamp || Date.now();
        const date = new Date(timestamp);
        const time = date.toLocaleTimeString('en-US', { hour12: false });

        console.log(colorize('red', `\n[${time}] 💥 EXCEPTION: ${exceptionDetails.text}`));

        if (exceptionDetails.exception) {
          console.log(colorize('red', `   ${exceptionDetails.exception.description || ''}`));
        }

        if (exceptionDetails.stackTrace) {
          console.log(colorize('gray', '  Stack trace:'));
          exceptionDetails.stackTrace.callFrames.forEach((frame) => {
            console.log(
              colorize('gray', `    at ${frame.functionName || '<anonymous>'} (${frame.url}:${frame.lineNumber}:${frame.columnNumber})`)
            );
          });
        }
        console.log('');
      }

      // Handle Log domain
      if (message.method === 'Log.entryAdded') {
        const { level, text, url, lineNumber, timestamp } = message.params.entry;
        const date = new Date(timestamp);
        const time = date.toLocaleTimeString('en-US', { hour12: false });

        const color = level === 'error' ? 'red' : level === 'warning' ? 'yellow' : 'gray';
        console.log(colorize(color, `[${time}] ${level.toUpperCase()}: ${text}`));
        if (url) {
          console.log(colorize('gray', `   at ${url}:${lineNumber}`));
        }
      }
    });

    ws.on('error', (error) => {
      console.error(colorize('red', `\n❌ WebSocket error: ${error.message}`));
      process.exit(1);
    });

    ws.on('close', () => {
      console.log(colorize('yellow', '\n⚠️  DevTools connection closed'));
      process.exit(0);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log(colorize('blue', '\n\n👋 Stopping console monitor...'));
      ws.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(colorize('red', `❌ Error: ${error.message}`));
    if (error.code === 'ECONNREFUSED') {
      console.log(colorize('yellow', '\n💡 Tip: Make sure Edge is running with --remote-debugging-port=9222'));
    }
    process.exit(1);
  }
}

main();
