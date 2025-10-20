#!/bin/bash

# 🚀 HTML to Figma Extension - Quick Setup Helper
# This script helps you verify everything is ready

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   HTML to Figma Extension - Setup Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found"
    echo "   Please run this script from the project root directory:"
    echo "   /Users/tzoharlary/FigmaFirstTryChromeExtention"
    exit 1
fi

echo "✅ Project directory verified"
echo ""

# Check Node.js
echo "📦 Checking dependencies..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "⚠️  Node.js not found (only needed for plugin build)"
fi

# Check npm packages
if [ -d "node_modules" ]; then
    echo "✅ npm packages installed"
else
    echo "⚠️  npm packages not found"
    echo "   Run: npm install"
fi

echo ""
echo "📄 Checking files..."

# Check extension files
REQUIRED_FILES=(
    "manifest.json"
    "src/popup/popup.html"
    "src/popup/popup.js"
    "src/background/background.js"
    "src/content/content.js"
)

ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        ALL_PRESENT=false
    fi
done

echo ""

# Check Figma plugin files
echo "🎨 Checking Figma plugin..."
if [ -f "figma-plugin/manifest.json" ]; then
    echo "✅ figma-plugin/manifest.json"
else
    echo "❌ figma-plugin/manifest.json - MISSING"
    ALL_PRESENT=false
fi

if [ -f "figma-plugin/code.ts" ]; then
    echo "✅ figma-plugin/code.ts"
else
    echo "❌ figma-plugin/code.ts - MISSING"
    ALL_PRESENT=false
fi

echo ""

# Check documentation
echo "📚 Checking documentation..."
DOC_FILES=(
    "QUICK_START.md"
    "docs/QUICK_START_VISUAL_GUIDE.md"
    "docs/USER_MANUAL.md"
    "README.md"
)

for doc in "${DOC_FILES[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc"
    else
        echo "❌ $doc - MISSING"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$ALL_PRESENT" = true ]; then
    echo "🎉 All files present! You're ready to go!"
    echo ""
    echo "📖 Next steps:"
    echo ""
    echo "1️⃣  Read the quick start guide:"
    echo "    cat QUICK_START.md"
    echo "    OR open in your browser/editor"
    echo ""
    echo "2️⃣  Load extension in Chrome:"
    echo "    • Go to: chrome://extensions/"
    echo "    • Enable 'Developer mode'"
    echo "    • Click 'Load unpacked'"
    echo "    • Select this directory: $PWD"
    echo ""
    echo "3️⃣  Install Figma plugin:"
    echo "    • Open Figma Desktop"
    echo "    • Plugins → Development → Import plugin from manifest..."
    echo "    • Select: $PWD/figma-plugin/manifest.json"
    echo ""
    echo "4️⃣  Test it!"
    echo "    • Go to: https://example.com"
    echo "    • Click extension icon → Extract Page"
    echo "    • Open Figma → Run plugin → Create Design"
    echo ""
    echo "📖 Full visual guide: docs/QUICK_START_VISUAL_GUIDE.md"
    echo ""
else
    echo "⚠️  Some files are missing. Please check the errors above."
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
