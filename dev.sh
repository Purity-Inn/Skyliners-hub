#!/usr/bin/env zsh
# Skyliners Hub — start both dev servers cleanly
# Usage: ./dev.sh

echo "🧹 Cleaning up old processes..."
pkill -f nodemon 2>/dev/null
pkill -f "node server.js" 2>/dev/null
pkill -f vite 2>/dev/null
fuser -k 5000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
sleep 1

echo "🚀 Starting backend (port 5000)..."
cd "$(dirname "$0")/server" && npm run dev &
BACKEND_PID=$!

sleep 3

echo "⚡ Starting frontend (port 5173)..."
cd "$(dirname "$0")/client" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers running!"
echo "   Backend  → http://localhost:5000"
echo "   Frontend → http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."

# Stop both on Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; pkill -f nodemon 2>/dev/null; pkill -f vite 2>/dev/null; exit 0" INT

wait
