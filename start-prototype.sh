#!/bin/bash

# Start a single prototype (kills any existing process on its port first)
# Usage: ./start-prototype.sh prototype-name

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a prototype name"
    echo ""
    echo "Usage: ./start-prototype.sh <prototype-name>"
    echo ""
    echo "Available prototypes:"
    python3 - <<PYTHON
import json
try:
    with open('apps/gallery/prototypes.json', 'r') as f:
        data = json.load(f)
    for p in data['prototypes']:
        print(f"  • {p['id']:<20} (port {p['port']})")
except:
    pass
PYTHON
    exit 1
fi

PROTOTYPE_NAME=$1
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Get port number from prototypes.json
PORT=$(python3 - <<PYTHON
import json
import sys
try:
    with open('apps/gallery/prototypes.json', 'r') as f:
        data = json.load(f)
    for p in data['prototypes']:
        if p['id'] == '$PROTOTYPE_NAME':
            print(p['port'])
            sys.exit(0)
    sys.exit(1)
except:
    sys.exit(1)
PYTHON
)

if [ -z "$PORT" ]; then
    echo "❌ Error: Prototype '$PROTOTYPE_NAME' not found in prototypes.json"
    exit 1
fi

# Kill any existing process on this port
echo "🔄 Checking port $PORT..."
PID=$(lsof -ti:$PORT 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo "🔄 Killing existing process on port $PORT (PID: $PID)"
    kill -9 $PID 2>/dev/null
    sleep 1
fi

# Start the prototype
echo "🚀 Starting $PROTOTYPE_NAME on http://localhost:$PORT"
cd "apps/$PROTOTYPE_NAME"
npm run dev






