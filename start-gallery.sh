#!/bin/bash

# Start Gallery Only - No Prototypes
# This starts just the gallery on port 3000

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GALLERY_DIR="$SCRIPT_DIR/apps/gallery"

echo ""
echo -e "${BLUE}🎨 Starting Gallery Only...${NC}"
echo ""

# Kill any existing process on port 3000
PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo -e "${BLUE}🔄 Killing existing process on port 3000...${NC}"
    kill -9 $PID 2>/dev/null
    sleep 1
fi

# Update gallery path first
echo -e "${BLUE}📍 Updating gallery path...${NC}"
"$SCRIPT_DIR/update-gallery-path.sh" > /dev/null 2>&1

echo -e "${GREEN}✅ Gallery starting on port 3000${NC}"
echo ""
echo -e "${BLUE}🌐 Open in browser:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop${NC}"
echo ""

# Change to gallery directory and start server
cd "$GALLERY_DIR"
python3 -m http.server 3000

