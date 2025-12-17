#!/bin/bash

# Prototypes Monorepo - Create New Prototype
# Interactive script to duplicate the template and set up a new prototype

set -e  # Exit on error

# Color codes for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🎨 Create New Prototype                 ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Check if template exists
if [ ! -d "apps/prototype-template" ]; then
    echo -e "${RED}❌ Error: Template directory not found at apps/prototype-template${NC}"
    exit 1
fi

# Function to convert string to kebab-case
to_kebab_case() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g'
}

# Function to convert string to PascalCase
to_pascal_case() {
    echo "$1" | sed -r 's/(^|-)([a-z])/\U\2/g' | sed 's/-//g'
}

# Prompt for prototype name
echo -e "${YELLOW}What is the name of your prototype?${NC}"
echo -e "${BLUE}(e.g., 'Product Catalog', 'User Dashboard', 'Shopping Cart')${NC}"
read -p "Name: " PROTOTYPE_DISPLAY_NAME

if [ -z "$PROTOTYPE_DISPLAY_NAME" ]; then
    echo -e "${RED}❌ Error: Prototype name cannot be empty${NC}"
    exit 1
fi

# Generate kebab-case name for directory and package
PROTOTYPE_NAME=$(to_kebab_case "$PROTOTYPE_DISPLAY_NAME")

# Check if prototype already exists
if [ -d "apps/$PROTOTYPE_NAME" ]; then
    echo -e "${RED}❌ Error: Prototype 'apps/$PROTOTYPE_NAME' already exists${NC}"
    exit 1
fi

# Set defaults (no prompts needed)
FRAMEWORK="Angular 21"
ICON="🎨"

echo ""
echo -e "${YELLOW}Brief description of your prototype:${NC}"
read -p "Description: " DESCRIPTION

if [ -z "$DESCRIPTION" ]; then
    DESCRIPTION="A new prototype built with $FRAMEWORK"
fi

echo ""
echo -e "${YELLOW}What port should this run on?${NC}"
echo -e "${BLUE}(Default: 4201, Gallery uses 3000, Recurring Task uses 4200)${NC}"
read -p "Port: " PORT

if [ -z "$PORT" ]; then
    PORT="4201"
fi

echo ""
echo -e "${YELLOW}Your name (for the author field):${NC}"
read -p "Author: " AUTHOR

if [ -z "$AUTHOR" ]; then
    AUTHOR="Design System Team"
fi

# Show summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}📋 Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "  Name:        ${GREEN}$PROTOTYPE_DISPLAY_NAME${NC}"
echo -e "  Directory:   ${GREEN}apps/$PROTOTYPE_NAME${NC}"
echo -e "  Package:     ${GREEN}@prototypes/$PROTOTYPE_NAME${NC}"
echo -e "  Description: ${GREEN}$DESCRIPTION${NC}"
echo -e "  Port:        ${GREEN}$PORT${NC}"
echo -e "  URL:         ${GREEN}http://localhost:$PORT${NC}"
echo -e "  Author:      ${GREEN}$AUTHOR${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# Confirm
read -p "Create this prototype? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}🚀 Creating your prototype...${NC}"
echo ""

# Step 1: Copy template
echo -e "${BLUE}📁 Copying template...${NC}"
cp -r "apps/prototype-template" "apps/$PROTOTYPE_NAME"

# Step 2: Replace placeholders in files
echo -e "${BLUE}⚙️  Configuring files...${NC}"

# Get current date
CURRENT_DATE=$(date +%Y-%m-%d)

# Replace in package.json
sed -i '' "s/PROTOTYPE_NAME/$PROTOTYPE_NAME/g" "apps/$PROTOTYPE_NAME/package.json"
sed -i '' "s/PROTOTYPE_PORT/$PORT/g" "apps/$PROTOTYPE_NAME/package.json"

# Replace in angular.json
sed -i '' "s/PROTOTYPE_NAME/$PROTOTYPE_NAME/g" "apps/$PROTOTYPE_NAME/angular.json"

# Replace in index.html
sed -i '' "s/PROTOTYPE_TITLE/$PROTOTYPE_DISPLAY_NAME/g" "apps/$PROTOTYPE_NAME/src/index.html"

# Replace in README.md
sed -i '' "s/PROTOTYPE_TITLE/$PROTOTYPE_DISPLAY_NAME/g" "apps/$PROTOTYPE_NAME/README.md"
sed -i '' "s/PROTOTYPE_NAME/$PROTOTYPE_NAME/g" "apps/$PROTOTYPE_NAME/README.md"
sed -i '' "s/PROTOTYPE_PORT/$PORT/g" "apps/$PROTOTYPE_NAME/README.md"

# Step 3: Add to gallery prototypes.json
echo -e "${BLUE}🖼️  Adding to gallery...${NC}"

# Read the current prototypes.json
PROTOTYPES_FILE="apps/gallery/prototypes.json"

# Create the new prototype entry
NEW_PROTOTYPE=$(cat <<EOF
    {
      "id": "$PROTOTYPE_NAME",
      "name": "$PROTOTYPE_DISPLAY_NAME",
      "icon": "$ICON",
      "framework": "$FRAMEWORK",
      "description": "$DESCRIPTION",
      "url": "http://localhost:$PORT",
      "port": $PORT,
      "status": "active",
      "author": "$AUTHOR",
      "lastUpdated": "$CURRENT_DATE",
      "features": [
        "Design Tokens Integration",
        "Responsive Design"
      ]
    }
EOF
)

# Use Python to properly update the JSON
python3 - <<PYTHON_SCRIPT
import json
import sys

# Read the current file
with open('$PROTOTYPES_FILE', 'r') as f:
    data = json.load(f)

# Create new prototype entry
new_prototype = {
    "id": "$PROTOTYPE_NAME",
    "name": "$PROTOTYPE_DISPLAY_NAME",
    "icon": "$ICON",
    "framework": "$FRAMEWORK",
    "description": "$DESCRIPTION",
    "url": "http://localhost:$PORT",
    "port": $PORT,
    "status": "active",
    "author": "$AUTHOR",
    "lastUpdated": "$CURRENT_DATE",
    "features": [
        "Design Tokens Integration",
        "Responsive Design"
    ]
}

# Add to prototypes array
data['prototypes'].append(new_prototype)

# Update metadata
data['metadata']['totalPrototypes'] = len(data['prototypes'])
data['metadata']['lastUpdated'] = "$CURRENT_DATE"

# Write back
with open('$PROTOTYPES_FILE', 'w') as f:
    json.dump(data, f, indent=2)

print("Gallery updated successfully")
PYTHON_SCRIPT

# Step 4: Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
echo -e "${YELLOW}(This registers the new workspace)${NC}"

# Install at root level - this registers the new workspace and installs all dependencies
npm install

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Prototype created successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📍 Your new prototype is at:${NC}"
echo -e "   ${GREEN}apps/$PROTOTYPE_NAME/${NC}"
echo ""
echo -e "${BLUE}🚀 To start developing:${NC}"
echo -e "   ${YELLOW}npm run dev -w @prototypes/$PROTOTYPE_NAME${NC}"
echo ""
echo -e "${BLUE}🌐 Your app will be available at:${NC}"
echo -e "   ${GREEN}http://localhost:$PORT${NC}"
echo ""
echo -e "${BLUE}🎨 View in the gallery:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "   1. Start your prototype with the command above"
echo -e "   2. Edit ${YELLOW}apps/$PROTOTYPE_NAME/src/app/app.html${NC}"
echo -e "   3. Add your custom styles and logic"
echo -e "   4. Use Supernova design tokens from ${YELLOW}@prototypes/supernova-sdk${NC}"
echo ""
echo -e "${GREEN}Happy prototyping! 🎉${NC}"
echo ""

