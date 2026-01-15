#!/bin/bash
# Fix macOS Gatekeeper issues with native node_modules binaries
# Run this after npm install on a new Mac

echo "🔧 Fixing macOS permissions for node_modules..."
echo ""

# Remove quarantine attributes recursively from node_modules
if [ -d "node_modules" ]; then
  echo "Removing quarantine flags from root node_modules..."
  xattr -cr node_modules 2>/dev/null || true
fi

# Fix workspace node_modules too
for workspace in apps/* packages/*; do
  if [ -d "$workspace/node_modules" ]; then
    echo "Fixing $workspace/node_modules..."
    xattr -cr "$workspace/node_modules" 2>/dev/null || true
  fi
done

echo ""
echo "✅ Done! Native binaries should now work correctly."
echo ""
echo "💡 If you still see issues, you may need to allow the app in:"
echo "   System Settings > Privacy & Security > Security"















