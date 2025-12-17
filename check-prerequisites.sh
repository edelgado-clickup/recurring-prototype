#!/bin/bash

# Check Prerequisites - Verify system requirements
# Run this to check if your system is ready

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🔍 Checking Prerequisites               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

ALL_GOOD=true

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}✓ Found $NODE_VERSION${NC}"
    else
        echo -e "${RED}✗ Version $NODE_VERSION is too old (need 18+)${NC}"
        ALL_GOOD=false
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    ALL_GOOD=false
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    NPM_MAJOR=$(echo $NPM_VERSION | cut -d'.' -f1)
    if [ "$NPM_MAJOR" -ge 10 ]; then
        echo -e "${GREEN}✓ Found v$NPM_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠ Version $NPM_VERSION (recommended: 10+)${NC}"
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    ALL_GOOD=false
fi

# Check Python (optional but used by gallery)
echo -n "Checking Python3... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo -e "${GREEN}✓ Found $PYTHON_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Not found (gallery will need alternative server)${NC}"
fi

# Check if node_modules exists
echo -n "Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Run 'npm install' first${NC}"
fi

echo ""

if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}═══════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ All prerequisites met!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Run: ${YELLOW}npm install${NC} (if you haven't already)"
    echo -e "  2. Run: ${YELLOW}./create-prototype.sh${NC} to create your first prototype"
    echo -e "  3. Run: ${YELLOW}./start-all.sh${NC} to start everything"
    echo ""
else
    echo -e "${RED}═══════════════════════════════════════════${NC}"
    echo -e "${RED}❌ Missing prerequisites${NC}"
    echo -e "${RED}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}To install Node.js and npm:${NC}"
    echo -e "  Visit: ${YELLOW}https://nodejs.org/${NC}"
    echo -e "  Download the LTS version (includes npm)"
    echo ""
fi






