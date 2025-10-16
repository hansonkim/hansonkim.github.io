# Tailwind CSS v4 Setup - Implementation Summary

## Overview
Successfully integrated Tailwind CSS v4 with the Eleventy static site generator for the Hanson Kim blog.

## Installed Dependencies
- `tailwindcss@4.1.14` - Core Tailwind CSS framework
- `@tailwindcss/postcss@4.1.14` - PostCSS plugin for Tailwind v4
- `@tailwindcss/typography@0.5.19` - Typography plugin for prose content
- `postcss@8.5.6` - CSS transformation tool
- `postcss-cli@11.0.1` - PostCSS command-line interface
- `autoprefixer@10.4.21` - Vendor prefix automation
- `concurrently@9.2.1` - Run multiple commands concurrently

## Configuration Files

### `/config/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,njk,md,js}',
    './src/_includes/**/*.{html,njk}',
    './src/_layouts/**/*.{html,njk}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### `/config/postcss.config.js`
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': { config: './config/tailwind.config.js' },
    autoprefixer: {},
  },
};
```

### `/src/css/tailwind.css`
```css
/* Tailwind CSS v4 Entry Point */
@import "tailwindcss";

/* Custom theme extensions and utilities will be in the tailwind.config.js */
```

## Package.json Scripts

```json
{
  "scripts": {
    "start": "npm run build:css && concurrently \"npm run watch:css\" \"eleventy --serve\"",
    "build": "npm run build:css && eleventy",
    "build:css": "postcss src/css/tailwind.css -o _site/css/tailwind.css --config config/postcss.config.js",
    "watch:css": "postcss src/css/tailwind.css -o _site/css/tailwind.css --config config/postcss.config.js --watch"
  }
}
```

## Layout Integration

Updated `/src/_layouts/base.njk` to include Tailwind CSS:
```html
<link rel="stylesheet" href="/css/tailwind.css">
<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/search.css">
```

## Usage

### Development
```bash
npm start
```
This will:
1. Compile Tailwind CSS
2. Start watching for CSS changes
3. Start Eleventy development server with hot reload

### Production Build
```bash
npm run build
```
This will:
1. Compile Tailwind CSS for production
2. Build the Eleventy site to `_site/` directory

## Output
- Generated CSS file: `_site/css/tailwind.css` (12KB)
- All Tailwind utility classes are available for use in:
  - Nunjucks templates (`.njk`)
  - Markdown files (`.md`)
  - HTML files (`.html`)

## Key Differences from Tailwind v3

1. **Import Syntax**: Use `@import "tailwindcss"` instead of `@tailwind base/components/utilities`
2. **PostCSS Plugin**: Requires separate `@tailwindcss/postcss` package
3. **Config Format**: Uses ES module format (`export default`)
4. **Simplified Setup**: Cleaner configuration with better performance

## Example Usage in Templates

```html
<!-- Use Tailwind utility classes -->
<div class="container mx-auto px-4">
  <h1 class="text-4xl font-bold text-gray-900 mb-4">
    Welcome to Hanson Kim's Blog
  </h1>
  <p class="text-lg text-gray-600 leading-relaxed">
    This blog uses Tailwind CSS v4 for styling.
  </p>
</div>
```

## Next Steps

1. Consider adding custom theme colors in `tailwind.config.js`
2. Add more Tailwind plugins as needed (forms, aspect-ratio, etc.)
3. Optimize for production with PurgeCSS (built-in with Tailwind)
4. Create reusable component classes using `@layer components`

## Troubleshooting

If you encounter build errors:
1. Ensure all dependencies are installed: `npm install`
2. Clear the `_site` directory: `rm -rf _site`
3. Rebuild: `npm run build`

## References
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Eleventy Documentation](https://www.11ty.dev)
- [PostCSS Documentation](https://postcss.org)
