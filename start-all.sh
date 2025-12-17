#!/bin/bash

# Prototypes Monorepo - Start All Servers
# Run this script in your terminal to start all development servers

echo "🚀 Starting Prototypes Monorepo Development Servers..."
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to kill process on a specific port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🔄 Killing existing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
    echo ""
fi

# Update gallery path to current user's path
echo "📍 Updating gallery path..."
./update-gallery-path.sh > /dev/null 2>&1 || echo "⚠️  Could not update path (continuing anyway)"

# Sync gallery to remove any deleted prototypes
echo "🔄 Syncing gallery with filesystem..."
./sync-gallery.sh > /dev/null 2>&1 || echo "⚠️  Could not sync gallery (continuing anyway)"
echo ""

echo "Starting servers in background..."
echo ""

# Kill port 3000 if in use
kill_port 3000

# Start Gallery
echo "🎨 Starting Gallery on http://localhost:3000"
cd "$SCRIPT_DIR/apps/gallery"
python3 -m http.server 3000 > /tmp/gallery.log 2>&1 &
GALLERY_PID=$!
echo "   Gallery PID: $GALLERY_PID"

# Initialize PID file
echo "GALLERY_PID=$GALLERY_PID" > "$SCRIPT_DIR/.dev-pids"

# Wait a moment
sleep 2

# Read prototypes from gallery JSON and start each one
cd "$SCRIPT_DIR"

# Parse prototypes.json and start each prototype
python3 - <<PYTHON_SCRIPT
import json
import os
import subprocess
import sys

try:
    with open('apps/gallery/prototypes.json', 'r') as f:
        data = json.load(f)
    
    for prototype in data['prototypes']:
        prototype_id = prototype['id']
        prototype_name = prototype['name']
        prototype_port = prototype['port']
        prototype_dir = f"apps/{prototype_id}"
        
        # Check if directory exists
        if os.path.exists(prototype_dir):
            # Kill any existing process on this port
            kill_result = subprocess.run(
                ['bash', '-c', f'lsof -ti:{prototype_port} 2>/dev/null | xargs kill -9 2>/dev/null || true'],
                capture_output=True
            )
            
            print(f"🚀 Starting {prototype_name} on http://localhost:{prototype_port}")
            
            # Start the prototype in background
            log_file = f"/tmp/{prototype_id}.log"
            with open(log_file, 'w') as log:
                proc = subprocess.Popen(
                    ['npm', 'run', 'dev'],
                    cwd=prototype_dir,
                    stdout=log,
                    stderr=subprocess.STDOUT,
                    start_new_session=True
                )
                print(f"   {prototype_name} PID: {proc.pid}")
                
                # Save PID to file for stop script
                with open('.dev-pids', 'a') as pid_file:
                    pid_file.write(f"{prototype_id.upper().replace('-', '_')}_PID={proc.pid}\n")
        else:
            print(f"⚠️  Skipping {prototype_name} - directory not found: {prototype_dir}")
        
        # Small delay between starts
        import time
        time.sleep(1)
    
except Exception as e:
    print(f"Error starting prototypes: {e}")
    sys.exit(1)
PYTHON_SCRIPT

echo ""
echo "✅ All servers started!"
echo ""
echo "📍 Access Points:"
python3 - <<PYTHON_SCRIPT
import json
try:
    with open('apps/gallery/prototypes.json', 'r') as f:
        data = json.load(f)
    print("   • Gallery:        http://localhost:3000")
    for prototype in data['prototypes']:
        print(f"   • {prototype['name']:16} http://localhost:{prototype['port']}")
except:
    pass
PYTHON_SCRIPT
echo ""
echo "📝 Logs:"
echo "   • Gallery:        tail -f /tmp/gallery.log"
python3 - <<PYTHON_SCRIPT
import json
try:
    with open('apps/gallery/prototypes.json', 'r') as f:
        data = json.load(f)
    for prototype in data['prototypes']:
        print(f"   • {prototype['name']:16} tail -f /tmp/{prototype['id']}.log")
except:
    pass
PYTHON_SCRIPT
echo ""
echo "🛑 To stop all servers:"
echo "   ./stop-all.sh"
echo ""

# Keep script running and show output
echo "Press Ctrl+C to stop all servers..."

# Build kill list from PID file
ALL_PIDS="$GALLERY_PID"
if [ -f "$SCRIPT_DIR/.dev-pids" ]; then
    while IFS='=' read -r key value; do
        if [ ! -z "$value" ] && [ "$key" != "GALLERY_PID" ]; then
            ALL_PIDS="$ALL_PIDS $value"
        fi
    done < "$SCRIPT_DIR/.dev-pids"
fi

trap "echo ''; echo '🛑 Stopping all servers...'; kill $ALL_PIDS 2>/dev/null; rm -f '$SCRIPT_DIR/.dev-pids'; exit" INT TERM

# Wait for all background processes
wait
