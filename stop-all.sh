#!/bin/bash

# Prototypes Monorepo - Stop All Servers

echo "🛑 Stopping all development servers..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if PID file exists
if [ -f ".dev-pids" ]; then
    # Read all PIDs and kill them
    while IFS='=' read -r key value; do
        if [ ! -z "$value" ]; then
            # Extract name from key (e.g., GALLERY_PID -> Gallery)
            NAME=$(echo "$key" | sed 's/_PID$//' | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')
            echo "   Stopping $NAME (PID: $value)..."
            kill $value 2>/dev/null || echo "   $NAME already stopped"
        fi
    done < .dev-pids
    
    rm -f .dev-pids
    echo "✅ All servers stopped!"
else
    echo "⚠️  No running servers found (no .dev-pids file)"
    echo ""
    echo "Attempting to kill processes on common ports..."
    
    # Try to find and kill processes on these ports
    python3 - <<PYTHON_SCRIPT
import json
import subprocess
import os

# Kill gallery on port 3000
try:
    subprocess.run(['lsof', '-ti:3000'], capture_output=True, check=True, text=True)
    subprocess.run(['lsof', '-ti:3000', '|', 'xargs', 'kill', '-9'], shell=True)
    print("   Killed process on port 3000")
except:
    pass

# Read prototypes.json and kill each port
try:
    with open('apps/gallery/prototypes.json', 'r') as f:
        data = json.load(f)
    
    for prototype in data['prototypes']:
        port = prototype['port']
        try:
            result = subprocess.run(['lsof', f'-ti:{port}'], capture_output=True, text=True)
            if result.stdout.strip():
                subprocess.run(f'lsof -ti:{port} | xargs kill -9', shell=True)
                print(f"   Killed process on port {port}")
        except:
            pass
except:
    pass
PYTHON_SCRIPT
fi

echo ""
