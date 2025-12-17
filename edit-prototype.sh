#!/bin/bash

# Edit Prototype - Update description and author in gallery
# Usage: ./edit-prototype.sh prototype-name [--description "desc"] [--author "name"]

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if prototype ID is provided
if [ -z "$1" ]; then
    echo ""
    echo -e "${RED}❌ Error: Prototype ID required${NC}"
    echo ""
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  ./edit-prototype.sh <prototype-id> [--description \"New description\"] [--author \"Author name\"]"
    echo ""
    echo -e "${BLUE}Example:${NC}"
    echo -e "  ./edit-prototype.sh my-prototype --description \"Updated description\" --author \"John Doe\""
    echo ""
    exit 1
fi

PROTOTYPE_ID="$1"
shift

# Parse arguments
NEW_DESCRIPTION=""
NEW_AUTHOR=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --description)
            NEW_DESCRIPTION="$2"
            shift 2
            ;;
        --author)
            NEW_AUTHOR="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Check if at least one field is being updated
if [ -z "$NEW_DESCRIPTION" ] && [ -z "$NEW_AUTHOR" ]; then
    echo ""
    echo -e "${RED}❌ Error: Please provide at least one field to update${NC}"
    echo -e "${BLUE}Use --description and/or --author${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${BLUE}📝 Updating prototype: ${GREEN}$PROTOTYPE_ID${NC}"
echo ""

# Use Python to update the JSON
python3 - <<PYTHON_SCRIPT
import json
import sys
from datetime import datetime

prototype_id = "$PROTOTYPE_ID"
new_description = "$NEW_DESCRIPTION"
new_author = "$NEW_AUTHOR"
prototypes_file = 'apps/gallery/prototypes.json'

try:
    # Read current prototypes.json
    with open(prototypes_file, 'r') as f:
        data = json.load(f)
    
    # Find the prototype
    prototype_found = False
    for prototype in data['prototypes']:
        if prototype['id'] == prototype_id:
            prototype_found = True
            
            # Show what's being updated
            if new_description:
                print(f"Description:")
                print(f"  Old: {prototype.get('description', 'N/A')}")
                print(f"  New: {new_description}")
                prototype['description'] = new_description
            
            if new_author:
                print(f"Author:")
                print(f"  Old: {prototype.get('author', 'N/A')}")
                print(f"  New: {new_author}")
                prototype['author'] = new_author
            
            # Update lastUpdated
            prototype['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
            break
    
    if not prototype_found:
        print(f"Error: Prototype '{prototype_id}' not found in gallery")
        sys.exit(1)
    
    # Update metadata
    data['metadata']['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
    
    # Write back
    with open(prototypes_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print("")
    print("✅ Prototype updated successfully!")

except FileNotFoundError:
    print(f"Error: {prototypes_file} not found")
    sys.exit(1)
except json.JSONDecodeError:
    print(f"Error: Invalid JSON in {prototypes_file}")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
PYTHON_SCRIPT

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════${NC}"
    echo -e "${GREEN}✨ Done!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}💡 Tip: Refresh the gallery to see changes${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}Failed to update prototype${NC}"
    echo ""
    exit 1
fi



