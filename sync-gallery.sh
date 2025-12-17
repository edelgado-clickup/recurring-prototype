#!/bin/bash

# Sync Gallery - Remove deleted prototypes from gallery
# This script checks which prototypes still exist and updates prototypes.json

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

echo ""
echo -e "${BLUE}🔄 Syncing Gallery with Filesystem...${NC}"
echo ""

# Use Python to update the JSON
python3 - <<PYTHON_SCRIPT
import json
import os
from datetime import datetime

prototypes_file = 'apps/gallery/prototypes.json'
apps_dir = 'apps'

# Read current prototypes.json
with open(prototypes_file, 'r') as f:
    data = json.load(f)

original_count = len(data['prototypes'])
filtered_prototypes = []
removed_prototypes = []

# Check each prototype
for prototype in data['prototypes']:
    prototype_id = prototype['id']
    prototype_dir = os.path.join(apps_dir, prototype_id)
    
    # Check if directory exists
    if os.path.exists(prototype_dir) and os.path.isdir(prototype_dir):
        filtered_prototypes.append(prototype)
        print(f"✓ {prototype['name']} - Found")
    else:
        removed_prototypes.append(prototype['name'])
        print(f"✗ {prototype['name']} - Not found (will be removed from gallery)")

# Update the data
data['prototypes'] = filtered_prototypes
data['metadata']['totalPrototypes'] = len(filtered_prototypes)
data['metadata']['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
data['metadata']['projectPath'] = os.getcwd()

# Write back
with open(prototypes_file, 'w') as f:
    json.dump(data, f, indent=2)

print("")
print(f"Gallery synced successfully!")
print(f"Prototypes found: {len(filtered_prototypes)}")
if removed_prototypes:
    print(f"Removed from gallery: {', '.join(removed_prototypes)}")
else:
    print("No changes needed - all prototypes exist")
PYTHON_SCRIPT

echo ""
echo -e "${GREEN}✅ Gallery sync complete!${NC}"
echo ""


