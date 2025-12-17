#!/usr/bin/env bash
# Unlink local waha-node and restore published version

set -e

echo "🔓 Unlinking local waha-node package..."

# Remove the local link and reinstall from npm
bun remove @muhammedaksam/waha-node
bun add @muhammedaksam/waha-node

echo "✅ Restored published @muhammedaksam/waha-node package"
