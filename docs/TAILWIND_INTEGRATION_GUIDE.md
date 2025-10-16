# Tailwind CSS + Eleventy 3.1.2 Integration Guide

**Research Date:** 2025-10-16
**Target Version:** Eleventy 3.1.2 + Tailwind CSS 4.x

## Executive Summary

The recommended approach for integrating Tailwind CSS 4.x with Eleventy 3.1.2 is using the **eleventy.before hook with PostCSS pipeline**. This method provides:

- Zero-configuration setup with Tailwind v4
- Single process (no parallel builds needed)
- Automatic CSS compilation before HTML generation
- Built-in Eleventy watch support

## Package Recommendations

### Required Packages
```json
{
  "tailwindcss": "^4.1.14",
  "postcss": "^8.5.6",
  "@tailwindcss/postcss": "latest",
  "cssnano": "latest"
}
```

### Optional Packages
```json
{
  "autoprefixer": "^10.4.21",
  "@tailwindcss/typography": "^0.5.19",
  "postcss-cli": "^11.0.1"
}
```

### Build Tools (for legacy parallel approach)
```json
{
  "npm-run-all": "latest",
  "concurrently": "^9.2.1"
}
```

## Integration Methods Comparison

### Method 1: Eleventy.before Hook (RECOMMENDED)

**Best for:** Eleventy 3.x + Tailwind 4.x

**Pros:**
- Cleanest solution
- No parallel process management
- Built-in Eleventy commands work
- Automatic CSS compilation
- Excellent hot reload

**Cons:**
- Requires Eleventy 2.0+
- More complex initial setup

**Commands:**
```bash
# Development
eleventy --serve

# Production
NODE_ENV=production eleventy
```

### Method 2: Concurrent Processes

**Best for:** All versions, when you need separation of concerns

**Pros:**
- Works with all versions
- Clear separation of concerns
- Well-documented approach

**Cons:**
- Two processes to manage
- Custom scripts needed
- Potential race conditions

**Commands:**
```bash
# Development
npm-run-all --parallel eleventy:dev css:dev

# Production
npm-run-all css:build eleventy:build
```

### Method 3: Tailwind CLI

**Best for:** Quick prototyping, learning

**Pros:**
- Simplest to understand
- No build tools needed

**Cons:**
- Manual command management
- No build automation
- Not suitable for CI/CD

### Method 4: Eleventy Plugins

**Best for:** Simple projects, minimal configuration

**Pros:**
- Plugin handles configuration
- Minimal setup code

**Cons:**
- Third-party dependency
- May lag behind Tailwind versions
- Less control over build

## Build Script Setup

### Modern Approach (Hook-based)

```javascript
// .eleventy.js
const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');
const cssnano = require('cssnano');
const fs = require('fs/promises');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Add CSS watch target
  eleventyConfig.addWatchTarget("./src/css/**/*.css");

  // Compile CSS before build
  eleventyConfig.on("eleventy.before", async () => {
    const cssInput = await fs.readFile('./src/css/tailwind.css', 'utf8');

    const result = await postcss([
      tailwindcss(),
      ...(process.env.NODE_ENV === 'production' ? [cssnano()] : [])
    ]).process(cssInput, {
      from: './src/css/tailwind.css',
      to: './_site/css/style.css'
    });

    await fs.mkdir('./_site/css', { recursive: true });
    await fs.writeFile('./_site/css/style.css', result.css);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
```

### Legacy Approach (Parallel Scripts)

```json
{
  "scripts": {
    "eleventy:dev": "eleventy --serve",
    "css:dev": "postcss src/css/tailwind.css -o _site/css/style.css --watch",
    "dev": "npm-run-all --parallel eleventy:dev css:dev",

    "eleventy:build": "eleventy",
    "css:build": "NODE_ENV=production postcss src/css/tailwind.css -o _site/css/style.css",
    "build": "npm-run-all css:build eleventy:build"
  }
}
```

## File Watching & Hot Reload

### Watch Targets Configuration

```javascript
// .eleventy.js
module.exports = function(eleventyConfig) {
  // Watch CSS source files
  eleventyConfig.addWatchTarget("./src/css/**/*.css");
  eleventyConfig.addWatchTarget("./tailwind.config.js");
  eleventyConfig.addWatchTarget("./postcss.config.js");
};
```

### Hot Reload Notes

- Eleventy dev server automatically reloads on template changes
- CSS changes trigger rebuild via watch targets
- **Best Practice:** Use `eleventy.before` instead of `eleventy.after` to ensure CSS is ready before page reload
- Known issue: Browser may reload before CSS write completes in `eleventy.after`

## Production Optimization

### Content Purging

**Configuration in tailwind.config.js:**
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,md,njk,ejs,pug,js}",
    "./.eleventy.js"
  ]
};
```

**Impact:**
- Unpurged: 3MB+
- Purged: 5-15KB (typical)
- Real example: Netflix Top 10 site = 6.5KB CSS total

### Minification

**Tool:** cssnano
**Integration:** PostCSS plugin in production pipeline

```javascript
// PostCSS config
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    ...(process.env.NODE_ENV === 'production'
      ? [require('cssnano')]
      : [])
  ]
};
```

**Alternative:** Use Tailwind CLI with `--minify` flag

**Additional Compression:** Enable Brotli/gzip on web server for additional 70-80% reduction

### JIT Mode

**Status:** Default in Tailwind v3+

**Benefits:**
- Generates only used utilities
- Faster build times
- Smaller dev builds
- No manual purge configuration needed

### Safelist

**Purpose:** Preserve dynamically generated class names

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  safelist: [
    'bg-red-500',
    'text-center',
    {
      pattern: /bg-(red|green|blue)-(100|500|900)/
    }
  ]
};
```

**Use Cases:**
- Classes generated by plugins
- Dynamic class names from CMS
- Template literals with variable classes

## Tailwind Config Best Practices

### Content Scanning
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,md,njk,ejs,pug,js}",
    "./.eleventy.js",  // Include if using utilities in config
    "./src/_includes/**/*.njk"
  ]
};
```

### Theme Customization
```javascript
module.exports = {
  theme: {
    extend: {  // Use extend rather than replacing
      colors: {
        primary: 'var(--color-primary)',  // CSS custom properties
        secondary: 'var(--color-secondary)'
      }
    }
  }
};
```

### Recommended Plugins
```javascript
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),  // Better prose styling
    require('@tailwindcss/forms'),       // Form elements
    require('@tailwindcss/aspect-ratio'), // Aspect ratios
    require('@tailwindcss/container-queries') // Container queries
  ]
};
```

## Common Pitfalls & Solutions

### Issue: Classes purged in production
**Solution:** Add to safelist or use complete class names (not string concatenation)

```javascript
// ❌ BAD - Will be purged
const color = 'red';
className = `bg-${color}-500`;

// ✅ GOOD - Won't be purged
className = color === 'red' ? 'bg-red-500' : 'bg-blue-500';
```

### Issue: Hot reload not working
**Solution:** Add CSS files to Eleventy watch targets

```javascript
eleventyConfig.addWatchTarget("./src/css/**/*.css");
```

### Issue: Large development builds
**Solution:** Ensure JIT mode is enabled (default in v3+)

### Issue: Browser reload before CSS ready
**Solution:** Use `eleventy.before` instead of `eleventy.after` hook

## Migration Notes

### From Tailwind v3 to v4
1. Install `@tailwindcss/postcss` plugin
2. Update PostCSS config to use new plugin
3. Review breaking changes in Tailwind v4 docs
4. Test all custom utilities and plugins

### From Eleventy 2 to 3
1. Update Node.js to v18+
2. Review breaking changes in Eleventy v3
3. Test all custom filters and shortcodes
4. Update plugins to compatible versions

## Recommended File Structure

```
project/
├── src/
│   ├── css/
│   │   └── tailwind.css          # Source CSS
│   ├── _includes/
│   │   └── layouts/
│   └── index.njk
├── _site/
│   └── css/
│       └── style.css              # Generated CSS
├── .eleventy.js                   # Eleventy config
├── tailwind.config.js             # Tailwind config
├── postcss.config.js              # PostCSS config
└── package.json
```

### Template Include
```html
<link rel="stylesheet" href="/css/style.css">
```

## Performance Targets

- **Typical production size:** 5-15KB gzipped
- **Benchmark:** Netflix Top 10 site = 6.5KB CSS total
- **Build time:** Sub-second with JIT mode

## Resources

- [Tailwind 4 + Eleventy 3 Guide](https://www.humankode.com/eleventy/how-to-set-up-tailwind-4-with-eleventy-3/)
- [Tailwind PostCSS Installation](https://tailwindcss.com/docs/installation/using-postcss)
- [Eleventy Watch/Serve Documentation](https://www.11ty.dev/docs/watch-serve/)
- [GitHub Example Repository](https://github.com/thecarlo/tailwind-4-with-eleventy-3)

---

**Note:** This guide was compiled from current (2024-2025) best practices and official documentation. Always check official docs for the latest updates.
