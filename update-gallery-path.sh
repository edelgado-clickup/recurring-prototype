#!/bin/bash

# Update Gallery Path - Sets the correct workspace path in the gallery
# This script updates the gallery to show the actual file path

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get the script directory (this is the workspace root)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GALLERY_HTML="$SCRIPT_DIR/apps/gallery/index.html"

echo ""
echo -e "${BLUE}📍 Updating gallery with workspace path...${NC}"
echo ""
echo -e "Workspace: ${GREEN}$SCRIPT_DIR${NC}"
echo ""

# Update the path in the HTML file (both display text and onclick attribute)
# Escape the path for sed
ESCAPED_PATH=$(echo "$SCRIPT_DIR" | sed 's/[\/&]/\\&/g')

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    # Replace in the display text
    sed -i '' "s|<span class=\"command-text\">cd [^<]*</span>|<span class=\"command-text\">cd $SCRIPT_DIR</span>|g" "$GALLERY_HTML"
    # Replace in the onclick attribute
    sed -i '' "s|onclick=\"copyToClipboard('cd [^']*')\"|onclick=\"copyToClipboard('cd $SCRIPT_DIR')\"|g" "$GALLERY_HTML"
else
    # Linux
    sed -i "s|<span class=\"command-text\">cd [^<]*</span>|<span class=\"command-text\">cd $SCRIPT_DIR</span>|g" "$GALLERY_HTML"
    sed -i "s|onclick=\"copyToClipboard('cd [^']*')\"|onclick=\"copyToClipboard('cd $SCRIPT_DIR')\"|g" "$GALLERY_HTML"
fi

echo -e "${GREEN}✅ Gallery updated!${NC}"
echo ""
echo -e "${BLUE}The gallery now shows the correct path:${NC}"
echo -e "   ${GREEN}cd $SCRIPT_DIR${NC}"
echo ""

