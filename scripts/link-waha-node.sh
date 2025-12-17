#!/usr/bin/env bash
# Link local waha-node package for development

set -e

echo "🔗 Linking local waha-node package..."

# Remove existing dependency first to avoid dependency loop
echo "Removing existing @muhammedaksam/waha-node..."
bun remove @muhammedaksam/waha-node 2>/dev/null || true

# Add the local package
echo "Adding local package from ../waha-node..."
bun add ../waha-node

echo "✅ Linked @muhammedaksam/waha-node from ../waha-node"
echo ""
echo "💡 To rebuild waha-node and see changes:"
echo "   cd ../waha-node && bun run build && cd -"
echo ""
echo "🔄 To unlink and use published version:"
echo "   bun remove @muhammedaksam/waha-node && bun add @muhammedaksam/waha-node"

