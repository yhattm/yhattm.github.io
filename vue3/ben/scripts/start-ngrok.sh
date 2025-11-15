#!/bin/bash

# Auto-detect Vite dev server port and start ngrok
# Usage: npm run ngrok

echo "🔍 Detecting Vite dev server port..."

# Find the port Vite is running on
PORT=$(lsof -ti:5173,5174,5175,5176 -sTCP:LISTEN | head -1 | xargs -I {} lsof -Pan -p {} -i | grep LISTEN | grep -oE ':[0-9]+' | grep -oE '[0-9]+' | head -1)

if [ -z "$PORT" ]; then
    echo "❌ No Vite dev server found running on ports 5173-5176"
    echo "💡 Start the dev server first with: npm run dev"
    exit 1
fi

echo "✅ Found Vite running on port $PORT"
echo "🚀 Starting ngrok tunnel..."

# Start ngrok
ngrok http $PORT > /dev/null 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get the public URL
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PUBLIC_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    echo "💡 Check if ngrok is running: curl http://localhost:4040/api/tunnels"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════"
echo "🎉 Ngrok tunnel is ready!"
echo "════════════════════════════════════════════"
echo ""
echo "📱 Public URL:  $PUBLIC_URL/ben/"
echo "🏠 Local:       http://localhost:$PORT/ben/"
echo "📊 Dashboard:   http://localhost:4040"
echo ""
echo "════════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop ngrok"
echo ""

# Wait for ngrok process
wait $NGROK_PID
