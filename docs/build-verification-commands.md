# Build Verification Commands

Quick reference for testing and verifying the Tailwind CSS integration.

## 🚀 Quick Start Testing

```bash
# Run complete validation suite
node tests/validate-tailwind.js

# Clean build test
npm run clean && npm run build

# Check if everything works
npm start
# Then visit: http://localhost:8080
```

---

## 🔨 Build Commands

### Development Build
```bash
# Full development build
npm run dev

# Build CSS only
npm run css:build

# Watch CSS changes
npm run css:watch

# Build everything
npm run build
```

### Production Build
```bash
# Production build with optimizations
NODE_ENV=production npm run build

# Check CSS size after production build
ls -lh _site/css/styles.css
```

### Clean Build
```bash
# Remove build artifacts and rebuild
npm run clean
npm run build

# Or in one command
npm run clean && npm run build
```

---

## 🧪 Testing Commands

### Automated Testing
```bash
# Run validation script
node tests/validate-tailwind.js

# Expected exit codes:
# 0 = All tests passed
# 1 = Errors found (must fix)
# 0 with warnings = Passed but review warnings
```

### Manual Testing
```bash
# Start local server for manual testing
npm start

# Server will run at: http://localhost:8080
# Press Ctrl+C to stop
```

---

## 📊 Performance Analysis

### CSS Size Check
```bash
# Development build size
npm run css:build
ls -lh _site/css/styles.css

# Production build size (should be much smaller)
NODE_ENV=production npm run css:build
ls -lh _site/css/styles.css

# Compare sizes
du -h _site/css/styles.css
```

### Lighthouse Audit
```bash
# Install Lighthouse (if not installed)
npm install -g lighthouse

# Run performance audit
npm start  # Start server first
# In another terminal:
lighthouse http://localhost:8080 --view

# Performance only
lighthouse http://localhost:8080 --only-categories=performance

# Save report
lighthouse http://localhost:8080 --output=html --output-path=./lighthouse-report.html
```

### Bundle Analysis
```bash
# Check what's in your CSS
grep -o "\.text-" _site/css/styles.css | sort | uniq | wc -l
grep -o "\.bg-" _site/css/styles.css | sort | uniq | wc -l
grep -o "\.p-" _site/css/styles.css | sort | uniq | wc -l
```

---

## 🔍 Debugging Commands

### Check Configuration
```bash
# Verify Tailwind config exists
cat tailwind.config.js

# Check package.json scripts
cat package.json | grep -A 5 "scripts"

# Verify Eleventy config
cat .eleventy.js | grep -A 10 "addPassthrough"
```

### File Structure Check
```bash
# Check source files exist
ls -la src/css/
ls -la src/_layouts/

# Check build output
ls -la _site/css/

# Check templates
find src -name "*.njk" -o -name "*.html"
```

### CSS Content Analysis
```bash
# Check if Tailwind utilities are present
grep -c "\.flex" _site/css/styles.css
grep -c "\.grid" _site/css/styles.css
grep -c "@media" _site/css/styles.css

# Check for responsive breakpoints
grep "@media" _site/css/styles.css | grep "min-width"
```

---

## 🔄 Watch Mode Testing

### Live Development
```bash
# Terminal 1: Watch CSS changes
npm run css:watch

# Terminal 2: Watch Eleventy changes
npm start

# Make changes to templates and see live updates
```

### Hot Reload Verification
```bash
# 1. Start dev server
npm run dev

# 2. Edit a template file (e.g., src/index.njk)
# 3. Add or change Tailwind classes
# 4. Save file
# 5. Browser should auto-reload
```

---

## 🌐 Browser Testing

### Local Testing URLs
```bash
# After running `npm start`, test these:
open http://localhost:8080                    # Homepage
open http://localhost:8080/posts/             # Blog listing
open http://localhost:8080/posts/post-name/   # Individual post
```

### Cross-Browser Testing
```bash
# Open in multiple browsers (Mac)
open -a "Google Chrome" http://localhost:8080
open -a "Firefox" http://localhost:8080
open -a "Safari" http://localhost:8080

# Windows (PowerShell)
Start-Process chrome http://localhost:8080
Start-Process firefox http://localhost:8080
```

---

## 📱 Responsive Testing

### Responsive Mode (Chrome DevTools)
```bash
# Mac: Cmd + Option + M
# Windows: Ctrl + Shift + M

# Or use curl to check mobile viewport
curl http://localhost:8080 -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
```

### Viewport Testing Script
```bash
# Create viewport test
cat > test-viewports.sh << 'EOF'
#!/bin/bash
echo "Testing responsive breakpoints..."
widths=(375 640 768 1024 1280 1536)
for width in "${widths[@]}"; do
  echo "Testing width: ${width}px"
  # Add your testing logic here
done
EOF
chmod +x test-viewports.sh
./test-viewports.sh
```

---

## 🚨 Common Issues & Fixes

### Issue: CSS Not Generated
```bash
# Fix: Check if PostCSS/Tailwind is installed
npm list tailwindcss postcss autoprefixer

# Reinstall if needed
npm install -D tailwindcss postcss autoprefixer

# Rebuild
npm run css:build
```

### Issue: Changes Not Reflecting
```bash
# Fix: Clear cache and rebuild
npm run clean
rm -rf node_modules/.cache
npm run build
```

### Issue: CSS Too Large
```bash
# Fix: Check if purge is configured
cat tailwind.config.js | grep -A 5 "content"

# Verify production build
NODE_ENV=production npm run build
ls -lh _site/css/styles.css
```

### Issue: Styles Not Applying
```bash
# Fix: Check class names are correct
# View generated CSS
less _site/css/styles.css
# Search for your class: /text-blue-500

# Check if class exists in content files
grep -r "text-blue-500" src/
```

---

## 📦 Dependency Verification

### Check Installed Versions
```bash
# Check Node/NPM versions
node --version
npm --version

# Check Tailwind installation
npm list tailwindcss

# Check all CSS-related dependencies
npm list | grep -E "tailwind|postcss|autoprefixer"
```

### Update Dependencies
```bash
# Update Tailwind (if needed)
npm update tailwindcss

# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

---

## 💡 Tips & Tricks

### Quick CSS Size Comparison
```bash
# Create comparison script
cat > compare-css.sh << 'EOF'
#!/bin/bash
echo "=== Development Build ==="
npm run css:build
DEV_SIZE=$(stat -f%z _site/css/styles.css)
echo "Dev size: $((DEV_SIZE / 1024))KB"

echo "=== Production Build ==="
NODE_ENV=production npm run css:build
PROD_SIZE=$(stat -f%z _site/css/styles.css)
echo "Prod size: $((PROD_SIZE / 1024))KB"

REDUCTION=$((100 - (PROD_SIZE * 100 / DEV_SIZE)))
echo "Reduction: ${REDUCTION}%"
EOF
chmod +x compare-css.sh
./compare-css.sh
```

### Continuous Testing
```bash
# Watch tests while developing
npm run css:watch & npm start & watch -n 5 node tests/validate-tailwind.js
```

---

## 📚 Reference

### Important Files
- `/tests/validate-tailwind.js` - Automated validation script
- `/docs/tailwind-testing-checklist.md` - Manual testing guide
- `/tailwind.config.js` - Tailwind configuration
- `/.eleventy.js` - Eleventy configuration
- `/src/css/tailwind.css` - Tailwind source

### Documentation Links
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Eleventy Docs](https://www.11ty.dev/docs/)
- [PostCSS Docs](https://postcss.org/)

---

*Quick Reference Version 1.0 - Last Updated: 2025-10-16*
