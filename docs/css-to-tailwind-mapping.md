# CSS to Tailwind CSS Migration Mapping

## Executive Summary

This document provides a comprehensive mapping from existing custom CSS to Tailwind CSS utility classes for the blog migration project. The site currently uses 689 lines of custom CSS with custom properties, gradients, animations, and responsive design.

**Migration Strategy:** Hybrid approach - use Tailwind for utilities, keep complex gradients/animations in custom CSS.

---

## Table of Contents

1. [CSS Custom Properties → Tailwind Config](#css-custom-properties--tailwind-config)
2. [Layout & Structure](#layout--structure)
3. [Typography](#typography)
4. [Colors & Gradients](#colors--gradients)
5. [Spacing & Sizing](#spacing--sizing)
6. [Effects & Shadows](#effects--shadows)
7. [Animations & Transitions](#animations--transitions)
8. [Responsive Breakpoints](#responsive-breakpoints)
9. [Component-Specific Mappings](#component-specific-mappings)
10. [Templates Requiring Updates](#templates-requiring-updates)
11. [Custom CSS to Keep](#custom-css-to-keep)

---

## CSS Custom Properties → Tailwind Config

### Current CSS Variables (`:root`)

```css
:root {
  --primary-color: #6366f1;      /* Tailwind: indigo-500 */
  --primary-dark: #4f46e5;       /* Tailwind: indigo-600 */
  --primary-light: #818cf8;      /* Tailwind: indigo-400 */
  --secondary-color: #ec4899;    /* Tailwind: pink-500 */
  --text-dark: #1f2937;          /* Tailwind: gray-800 */
  --text-medium: #4b5563;        /* Tailwind: gray-600 */
  --text-light: #6b7280;         /* Tailwind: gray-500 */
  --bg-light: #f9fafb;           /* Tailwind: gray-50 */
  --bg-white: #ffffff;           /* Tailwind: white */
  --border-color: #e5e7eb;       /* Tailwind: gray-200 */
}
```

### Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5',    // indigo-600
          light: '#818cf8',   // indigo-400
        },
        secondary: {
          DEFAULT: '#ec4899', // pink-500
        }
      }
    }
  }
}
```

---

## Layout & Structure

### Reset Styles

| Current CSS | Tailwind Approach |
|------------|-------------------|
| `* { margin: 0; padding: 0; box-sizing: border-box; }` | Use `@tailwind base;` which includes Preflight (Tailwind's reset) |

### Body

| Current CSS | Tailwind Classes |
|------------|------------------|
| `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;` | `font-sans` (default) |
| `line-height: 1.6;` | `leading-relaxed` |
| `color: var(--text-dark);` | `text-gray-800` |
| `background: linear-gradient(to bottom, #ffffff 0%, var(--bg-light) 100%);` | Keep in CSS (complex gradient) |
| `min-height: 100vh;` | `min-h-screen` |

### Main Container

| Current CSS | Tailwind Classes |
|------------|------------------|
| `max-width: 1400px;` | `max-w-7xl` (1280px) or custom in config |
| `margin: 0 auto;` | `mx-auto` |
| `padding: 0 20px;` | `px-5` |

### Header

| Current CSS | Tailwind Classes |
|------------|------------------|
| `background: var(--bg-white);` | `bg-white` |
| `padding: 1.5rem 2rem;` | `px-8 py-6` |
| `box-shadow: var(--shadow-sm);` | `shadow-sm` |
| `backdrop-filter: blur(10px);` | `backdrop-blur-md` |
| `border-bottom: 1px solid var(--border-color);` | `border-b border-gray-200` |
| `position: sticky;` | `sticky` |
| `top: 0;` | `top-0` |
| `z-index: 100;` | `z-[100]` |

### Navigation

| Current CSS | Tailwind Classes |
|------------|------------------|
| `display: flex;` | `flex` |
| `justify-content: space-between;` | `justify-between` |
| `align-items: center;` | `items-center` |
| `max-width: 1400px;` | `max-w-7xl` |
| `margin: 0 auto;` | `mx-auto` |

#### Nav List

| Current CSS | Tailwind Classes |
|------------|------------------|
| `list-style: none;` | `list-none` |
| `display: flex;` | `flex` |
| `gap: 2rem;` | `gap-8` |

---

## Typography

### Logo

| Current CSS | Tailwind Classes |
|------------|------------------|
| `font-size: 1.5rem;` | `text-2xl` |
| `font-weight: 700;` | `font-bold` |
| `text-decoration: none;` | `no-underline` |
| Background gradient | Keep in CSS (complex gradient with clip) |
| `transition: transform 0.3s ease;` | `transition-transform duration-300 ease-in-out` |

### Hero Section Typography

| Current CSS | Tailwind Classes |
|------------|------------------|
| `.hero h1` `font-size: 3rem;` | `text-5xl` |
| `font-weight: 800;` | `font-extrabold` |
| `margin-bottom: 20px;` | `mb-5` |
| `.hero p` `font-size: 1.3rem;` | `text-xl` |
| `max-width: 600px;` | `max-w-2xl` |
| `margin: 0 auto;` | `mx-auto` |

### Post Typography

| Current CSS | Tailwind Classes |
|------------|------------------|
| `.post-header h1` `font-size: 2.5rem;` | `text-4xl` |
| `font-weight: 800;` | `font-extrabold` |
| `line-height: 1.2;` | `leading-tight` |
| `.post-content` `line-height: 1.8;` | `leading-relaxed` |
| `font-size: 1.05rem;` | `text-lg` |
| `.post-content h2` `font-size: (inherit from h2)` | `text-2xl font-bold` |
| `.post-content h3` | `text-xl font-semibold` |

### Navigation Links

| Current CSS | Tailwind Classes |
|------------|------------------|
| `text-decoration: none;` | `no-underline` |
| `color: var(--text-medium);` | `text-gray-600` |
| `transition: all 0.3s ease;` | `transition-all duration-300 ease-in-out` |
| `font-weight: 500;` | `font-medium` |
| `position: relative;` | `relative` |

### Time Elements

| Current CSS | Tailwind Classes |
|------------|------------------|
| `color: var(--text-light);` | `text-gray-500` |
| `font-size: 0.9rem;` | `text-sm` |
| `display: inline-flex;` | `inline-flex` |
| `align-items: center;` | `items-center` |
| `font-weight: 500;` | `font-medium` |

---

## Colors & Gradients

### Text Colors

| Current CSS | Tailwind Classes |
|------------|------------------|
| `color: var(--text-dark);` | `text-gray-800` |
| `color: var(--text-medium);` | `text-gray-600` |
| `color: var(--text-light);` | `text-gray-500` |
| `color: var(--primary-color);` | `text-indigo-500` |

### Background Colors

| Current CSS | Tailwind Classes |
|------------|------------------|
| `background: var(--bg-white);` | `bg-white` |
| `background: var(--bg-light);` | `bg-gray-50` |

### Complex Gradients (Keep in CSS)

```css
/* These should remain in custom CSS */
.logo {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
}

.tag-cloud-item {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
}

.tag-cloud-item:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}
```

### Border Colors

| Current CSS | Tailwind Classes |
|------------|------------------|
| `border: 1px solid var(--border-color);` | `border border-gray-200` |
| `border-bottom: 1px solid var(--border-color);` | `border-b border-gray-200` |
| `border-color: var(--primary-light);` | `border-indigo-400` |

---

## Spacing & Sizing

### Padding

| Current CSS | Tailwind Classes |
|------------|------------------|
| `padding: 10px 20px;` | `px-5 py-2.5` |
| `padding: 20px;` | `p-5` |
| `padding: 28px;` | `p-7` |
| `padding: 30px;` | `p-8` (approximation) |
| `padding: 1.5rem 2rem;` | `px-8 py-6` |
| `padding: 80px 20px;` | `px-5 py-20` |

### Margin

| Current CSS | Tailwind Classes |
|------------|------------------|
| `margin: 40px 0;` | `my-10` |
| `margin-top: 40px;` | `mt-10` |
| `margin-bottom: 20px;` | `mb-5` |
| `margin-bottom: 30px;` | `mb-8` (approximation) |
| `margin-bottom: 24px;` | `mb-6` |

### Gap

| Current CSS | Tailwind Classes |
|------------|------------------|
| `gap: 12px;` | `gap-3` |
| `gap: 10px;` | `gap-2.5` |
| `gap: 2rem;` | `gap-8` |
| `gap: 40px;` | `gap-10` |

### Width & Height

| Current CSS | Tailwind Classes |
|------------|------------------|
| `width: 280px;` | `w-70` (custom) or `w-[280px]` |
| `max-width: 600px;` | `max-w-2xl` |
| `max-width: 900px;` | `max-w-4xl` (896px) or custom |
| `max-width: 1400px;` | `max-w-7xl` (1280px) or custom |
| `max-height: calc(100vh - 120px);` | `max-h-[calc(100vh-120px)]` |
| `min-width: 0;` | `min-w-0` |
| `flex-shrink: 0;` | `flex-shrink-0` |

---

## Effects & Shadows

### Box Shadows

| Current CSS | Tailwind Classes |
|------------|------------------|
| `box-shadow: var(--shadow-sm);` | `shadow-sm` |
| `box-shadow: var(--shadow-md);` | `shadow-md` |
| `box-shadow: var(--shadow-lg);` | `shadow-lg` |
| `box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);` | `shadow-2xl` or custom |

### Border Radius

| Current CSS | Tailwind Classes |
|------------|------------------|
| `border-radius: 4px;` | `rounded` |
| `border-radius: 6px;` | `rounded-md` |
| `border-radius: 12px;` | `rounded-xl` |
| `border-radius: 16px;` | `rounded-2xl` |
| `border-radius: 20px;` | `rounded-[20px]` |
| `border-radius: 24px;` | `rounded-3xl` |

### Opacity

| Current CSS | Tailwind Classes |
|------------|------------------|
| `opacity: 0;` | `opacity-0` |
| `opacity: 1;` | `opacity-100` |

### Backdrop Filter

| Current CSS | Tailwind Classes |
|------------|------------------|
| `backdrop-filter: blur(10px);` | `backdrop-blur-md` |
| `backdrop-filter: blur(4px);` | `backdrop-blur-sm` |

---

## Animations & Transitions

### Transitions

| Current CSS | Tailwind Classes |
|------------|------------------|
| `transition: all 0.3s ease;` | `transition-all duration-300 ease-in-out` |
| `transition: transform 0.3s ease;` | `transition-transform duration-300 ease-in-out` |
| `transition: color 0.3s ease;` | `transition-colors duration-300 ease-in-out` |
| `transition: all 0.2s ease;` | `transition-all duration-200 ease-in-out` |

### Transforms

| Current CSS | Tailwind Classes |
|------------|------------------|
| `transform: translateY(-4px);` | `transform -translate-y-1` |
| `transform: translateY(-3px);` | `transform -translate-y-0.5` (approximation) |
| `transform: translateY(-2px);` | `transform -translate-y-0.5` |
| `transform: scale(1.05);` | `hover:scale-105` |
| `transform: scaleY(0);` | `scale-y-0` |
| `transform: scaleY(1);` | `scale-y-100` |

### Keyframe Animations (Keep in Custom CSS)

```css
/* These should remain in custom CSS */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Animation Properties

| Current CSS | Tailwind Approach |
|------------|-------------------|
| `animation: fadeIn 0.8s ease-out;` | Keep in CSS or use Tailwind animation utilities |
| `animation: float 20s ease-in-out infinite;` | Keep in CSS (complex animation) |

---

## Responsive Breakpoints

### Current Breakpoints

| Current CSS | Tailwind Equivalent |
|------------|---------------------|
| `@media (max-width: 768px)` | `md:` prefix (min-width: 768px) - use mobile-first |
| `@media (max-width: 1024px)` | `lg:` prefix (min-width: 1024px) - use mobile-first |

### Responsive Pattern Migration

**Current Approach (desktop-first):**
```css
@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
}
```

**Tailwind Approach (mobile-first):**
```html
<h1 class="text-3xl md:text-5xl">
```

### Key Responsive Changes

| Component | Current CSS | Tailwind Classes |
|-----------|-------------|------------------|
| Hero h1 | Desktop: `3rem`, Mobile: `2rem` | `text-3xl md:text-5xl` |
| Hero p | Desktop: `1.3rem`, Mobile: `1.1rem` | `text-lg md:text-xl` |
| Header padding | Desktop: `1.5rem 2rem`, Mobile: `1rem 1.5rem` | `px-6 py-4 md:px-8 md:py-6` |
| Nav gap | Desktop: `2rem`, Mobile: `1rem` | `gap-4 md:gap-8` |
| Post list article padding | Desktop: `28px`, Mobile: `20px` | `p-5 md:p-7` |
| Post layout | Desktop: flex row, Mobile: flex column | `flex flex-col lg:flex-row` |
| Post sidebar | Desktop: sticky 280px, Mobile: full width | `w-full lg:w-70 lg:sticky` |

---

## Component-Specific Mappings

### 1. Hero Section

**Current CSS:**
```css
.hero {
  text-align: center;
  padding: 80px 20px;
  margin: 0 -20px 40px -20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}
```

**Tailwind Classes:**
```html
<div class="hero text-center px-5 py-20 -mx-5 mb-10 rounded-3xl relative overflow-hidden">
```

**Custom CSS to Keep:**
```css
.hero {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}
```

### 2. Tags Section

**Current CSS:**
```css
.tags-section {
  margin: 40px 0;
  padding: 30px;
  background: var(--bg-white);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}
```

**Tailwind Classes:**
```html
<section class="tags-section my-10 p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
```

**Tags Cloud:**
```html
<div class="tags-cloud flex flex-wrap gap-3 items-center">
```

### 3. Tag Cloud Items

**Tailwind Classes:**
```html
<a href="#" class="tag-cloud-item inline-flex items-center gap-1.5 px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-300">
```

**Custom CSS to Keep:**
```css
.tag-cloud-item {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  color: var(--primary-color);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.tag-cloud-item:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  transform: translateY(-3px);
}
```

### 4. Post List

**Post List Container:**
```html
<ul class="post-list list-none">
```

**Post List Item:**
```html
<li class="mb-6 transition-transform duration-300 ease-in-out">
```

**Post Article:**
```html
<article class="bg-white p-7 rounded-2xl shadow-sm border border-gray-200 transition-all duration-300 relative overflow-hidden">
```

**Custom CSS to Keep:**
```css
.post-list article::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary-color), var(--secondary-color));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.post-list article:hover::before {
  transform: scaleY(1);
}

.post-list article:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

### 5. Post Layout (with Sidebar)

**Layout Container:**
```html
<div class="post-layout flex flex-col lg:flex-row gap-10 mt-10 items-start relative">
```

**Post Article (Main Content):**
```html
<article class="post flex-1 min-w-0 max-w-4xl mt-0 order-1">
```

**Post Sidebar:**
```html
<aside class="post-sidebar w-full lg:w-70 flex-shrink-0 lg:sticky lg:top-[100px] lg:max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-2xl p-5 shadow-md border border-gray-200 order-2">
```

### 6. File Tree (Sidebar Navigation)

**Tree Container:**
```html
<nav class="file-tree text-sm flex flex-col gap-0">
```

**Tree Node Header:**
```html
<div class="tree-node-header flex items-center px-2 py-1.5 cursor-pointer rounded-md transition-all duration-200 select-none hover:bg-gradient-to-br hover:from-indigo-50 hover:to-pink-50">
```

**Tree Icon:**
```html
<span class="tree-icon mr-2 text-base flex-shrink-0">📄</span>
```

**Tree Label:**
```html
<span class="tree-label flex-1 text-gray-600 font-medium">File Name</span>
```

**Tree Toggle:**
```html
<span class="tree-toggle ml-2 text-xs text-gray-500 transition-transform duration-200 flex-shrink-0">▶</span>
```

**Tree Children:**
```html
<div class="tree-children ml-5 pl-3 border-l border-gray-200 hidden">
```

**Tree Node Link:**
```html
<a href="#" class="tree-node-link flex items-center px-2 py-1.5 no-underline rounded-md transition-all duration-200 text-gray-600 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-pink-100 hover:text-indigo-500">
```

**Active Link (Keep in CSS):**
```css
.tree-node-link.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-weight: 600;
}
```

### 7. Post Content

**Content Container:**
```html
<div class="post-content leading-relaxed text-lg">
```

**Heading 2:**
```html
<h2 class="mt-10 mb-5 text-2xl font-bold text-gray-800 pb-2.5 border-b-2 border-indigo-500">
```

**Heading 3:**
```html
<h3 class="mt-8 mb-4 text-xl font-semibold text-gray-600">
```

**Paragraph:**
```html
<p class="mb-5 text-gray-600">
```

**Inline Code:**
```html
<code class="px-2 py-0.5 rounded text-sm font-semibold text-indigo-500">
```

**Code Block (Keep gradient in CSS):**
```html
<pre class="bg-gray-800 p-5 rounded-xl overflow-x-auto mb-5 shadow-md">
```

**Custom CSS:**
```css
.post-content code {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
}
```

### 8. Footer

**Footer Container:**
```html
<footer class="mt-20 px-5 py-10 bg-white border-t border-gray-200 text-center text-gray-500 text-sm relative">
```

**Custom CSS to Keep:**
```css
footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}
```

### 9. Navigation Link Underline Effect (Keep in CSS)

```css
nav ul a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 50%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

nav ul a:hover::after {
  width: 100%;
}
```

---

## Search Modal (search.css)

### Search Trigger Button

**Tailwind Classes:**
```html
<button class="search-trigger bg-transparent border-0 p-2 cursor-pointer flex items-center text-gray-800 transition-colors duration-200 hover:text-indigo-500 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2">
```

### Search Modal Container

**Tailwind Classes:**
```html
<div class="search-modal fixed inset-0 z-[9999] hidden items-start justify-center px-4 py-[5vh] opacity-0 transition-opacity duration-200 active:flex active:opacity-100">
```

### Search Overlay

**Tailwind Classes:**
```html
<div class="search-overlay absolute inset-0 bg-black/60 backdrop-blur-sm">
```

### Search Container

**Tailwind Classes:**
```html
<div class="search-container relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[80vh] animate-slideDown">
```

**Custom CSS to Keep:**
```css
@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Search Header

**Tailwind Classes:**
```html
<div class="search-header px-6 py-6 border-b border-gray-200">
```

### Search Input Wrapper

**Tailwind Classes:**
```html
<div class="search-input-wrapper flex items-center gap-3 relative">
```

### Search Icon

**Tailwind Classes:**
```html
<span class="search-icon text-gray-400 flex-shrink-0">🔍</span>
```

### Search Input

**Tailwind Classes:**
```html
<input class="search-input flex-1 border-0 outline-none text-lg text-gray-800 bg-transparent p-0 placeholder:text-gray-400">
```

### Search Close Button

**Tailwind Classes:**
```html
<button class="search-close bg-transparent border-0 p-2 cursor-pointer text-gray-500 flex items-center rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2">
```

### Search Results Container

**Tailwind Classes:**
```html
<div class="search-results flex-1 overflow-y-auto p-2 min-h-[200px] max-h-[50vh] scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
```

### Search Result Item

**Tailwind Classes:**
```html
<a href="#" class="search-result-item block p-4 rounded-lg no-underline transition-all duration-200 border-2 border-transparent hover:bg-gray-50 hover:border-indigo-500 focus:bg-gray-50 focus:border-indigo-500 focus:outline-none">
```

### Search Result Title

**Tailwind Classes:**
```html
<div class="search-result-title text-base font-semibold text-gray-800 mb-1.5 leading-normal">
```

### Search Result Description

**Tailwind Classes:**
```html
<div class="search-result-description text-sm text-gray-500 leading-relaxed mb-1.5 line-clamp-2">
```

### Search Result URL

**Tailwind Classes:**
```html
<div class="search-result-url text-xs text-gray-400 font-mono">
```

### Highlight Mark

**Tailwind Classes:**
```html
<mark class="bg-yellow-100 text-yellow-900 px-1 py-0.5 rounded font-semibold">
```

### Search Empty State

**Tailwind Classes:**
```html
<div class="search-empty px-8 py-12 text-center text-gray-500">
```

### Search Footer

**Tailwind Classes:**
```html
<div class="search-footer flex justify-between items-center px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
```

### Search Shortcuts

**Tailwind Classes:**
```html
<div class="search-shortcuts flex gap-4 text-xs text-gray-500 items-center">
  <kbd class="inline-block px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs text-gray-700 shadow-sm">Esc</kbd>
</div>
```

### Search Stats

**Tailwind Classes:**
```html
<div class="search-stats text-xs text-gray-500 font-medium">
```

### Responsive Mobile (search.css)

**Mobile Tailwind Classes:**
```html
<!-- Use responsive prefixes -->
<div class="search-modal p-0 md:p-[5vh] items-stretch md:items-start">
<div class="search-container max-w-full md:max-w-2xl rounded-none md:rounded-xl max-h-screen md:max-h-[80vh]">
```

### Dark Mode Support (search.css)

**Tailwind Dark Mode Classes:**
```html
<div class="search-container bg-white dark:bg-gray-800">
<div class="search-header border-b border-gray-200 dark:border-gray-700">
<input class="search-input text-gray-800 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-600">
```

---

## Templates Requiring Updates

### 1. `/src/_layouts/base.njk`

**Changes Required:**
- Update `<header>` with Tailwind classes
- Update `<nav>` structure with Tailwind classes
- Update `<footer>` with Tailwind classes
- Keep custom gradient CSS for logo

**Current Structure:**
```html
<header>
  <nav>
    <a href="/" class="logo">Hanson Kim</a>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/blog/">Blog</a></li>
    </ul>
  </nav>
</header>
```

**Tailwind Version:**
```html
<header class="bg-white px-8 py-6 -mx-5 -mt-5 mb-10 shadow-sm backdrop-blur-md border-b border-gray-200 sticky top-0 z-[100]">
  <nav class="flex justify-between items-center max-w-7xl mx-auto">
    <a href="/" class="logo text-2xl font-bold no-underline transition-transform duration-300 hover:scale-105">Hanson Kim</a>
    <ul class="list-none flex gap-8">
      <li><a href="/" class="no-underline text-gray-600 transition-all duration-300 font-medium relative hover:text-indigo-500">Home</a></li>
      <li><a href="/blog/" class="no-underline text-gray-600 transition-all duration-300 font-medium relative hover:text-indigo-500">Blog</a></li>
    </ul>
  </nav>
</header>
```

### 2. `/src/index.njk`

**Changes Required:**
- Update `.hero` div with Tailwind classes
- Update `.tags-section` with Tailwind classes
- Update `.tags-cloud` with Tailwind classes
- Update `.tag-cloud-item` with Tailwind classes
- Update `.recent-posts` with Tailwind classes
- Update `.post-list` structure with Tailwind classes

**Key Sections:**
```html
<!-- Hero -->
<div class="hero text-center px-5 py-20 -mx-5 mb-10 rounded-3xl relative overflow-hidden">
  <h1 class="text-3xl md:text-5xl mb-5 text-gray-800 font-extrabold relative z-10">안녕하세요, Hanson Kim입니다</h1>
  <p class="text-lg md:text-xl text-gray-600 relative z-10 max-w-2xl mx-auto">개발, 기술, 그리고 생각들을 공유하는 공간입니다.</p>
</div>

<!-- Tags Section -->
<section class="tags-section my-10 p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
  <h2 class="mb-6 text-gray-800 font-bold text-2xl">태그</h2>
  <div class="tags-cloud flex flex-wrap gap-3 items-center">
    <a href="#" class="tag-cloud-item inline-flex items-center gap-1.5 px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-300">
      태그명 <span class="tag-count text-xs text-gray-500 font-medium">(5)</span>
    </a>
  </div>
</section>

<!-- Recent Posts -->
<section class="recent-posts mt-10">
  <h2 class="mb-8 text-gray-800 font-bold text-2xl">최근 포스트</h2>
  <ul class="post-list list-none">
    <li class="mb-6 transition-transform duration-300">
      <article class="bg-white p-5 md:p-7 rounded-2xl shadow-sm border border-gray-200 transition-all duration-300 relative overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-indigo-400">
        <h3 class="mb-2.5 font-bold">
          <a href="#" class="no-underline text-gray-800 transition-colors duration-300 relative hover:text-indigo-500">Post Title</a>
        </h3>
        <time class="text-gray-500 text-sm inline-flex items-center mb-3 font-medium">2025-01-15</time>
        <p class="text-gray-600 mt-2.5 leading-relaxed">Post description...</p>
      </article>
    </li>
  </ul>
</section>
```

### 3. `/src/blog.njk`

**Changes Required:**
- Update `.blog-header` with Tailwind classes
- Update `.posts` section with Tailwind classes
- Update `.post-list` with Tailwind classes (same as index.njk)
- Add Tailwind classes to tags

**Key Sections:**
```html
<!-- Blog Header -->
<div class="blog-header text-center mb-10 px-5 py-10 rounded-2xl">
  <h1 class="mb-8 text-gray-800 font-bold text-2xl bg-gradient-text">블로그</h1>
  <p class="text-gray-600 text-lg mt-2.5">모든 글 보기</p>
</div>

<!-- Posts with Tags -->
<article class="...">
  <h2>...</h2>
  <time>...</time>
  <p>...</p>
  <div class="tags mt-4 flex gap-2.5 flex-wrap">
    <a href="#" class="tag inline-block px-4 py-1.5 rounded-2xl text-xs font-semibold border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">Tag</a>
  </div>
</article>
```

### 4. `/src/tags.njk`

**Changes Required:**
- Update `.blog-header` (same as blog.njk)
- Update `.posts` and `.post-list` (same as blog.njk)
- Ensure tags display correctly

### 5. `/src/_layouts/post.njk`

**Changes Required:**
- Update `.post-layout` with Tailwind flexbox classes
- Update `.post` article with Tailwind classes
- Update `.post-header` with Tailwind classes
- Update `.post-content` with Tailwind typography classes
- Update `.post-sidebar` with Tailwind classes
- Update `.file-tree` navigation with Tailwind classes

**Key Sections:**
```html
<!-- Post Layout -->
<div class="post-layout flex flex-col lg:flex-row gap-10 mt-10 items-start relative">
  <!-- Main Content -->
  <article class="post flex-1 min-w-0 max-w-4xl mt-0 order-1">
    <header class="post-header mb-10 pb-5 border-b-2 border-gray-200">
      <h1 class="text-3xl md:text-4xl mb-4 text-gray-800 font-extrabold leading-tight">{{ title }}</h1>
      <time class="text-gray-500 text-sm inline-flex items-center font-medium">{{ date }}</time>
      <div class="tags mt-4 flex gap-2.5 flex-wrap">
        <a href="#" class="tag inline-block px-4 py-1.5 rounded-2xl text-xs font-semibold transition-all duration-300">Tag</a>
      </div>
    </header>

    <div class="post-content leading-relaxed text-lg">
      {{ content | safe }}
    </div>
  </article>

  <!-- Sidebar -->
  <aside class="post-sidebar w-full lg:w-70 flex-shrink-0 lg:sticky lg:top-[100px] lg:max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-2xl p-5 shadow-md border border-gray-200 order-2">
    <div class="sidebar-header mb-5 pb-4 border-b-2 border-gray-200">
      <h3 class="text-lg text-gray-800 font-bold m-0">📚 목차</h3>
    </div>
    <nav class="file-tree text-sm flex flex-col gap-0">
      <!-- Tree nodes here -->
    </nav>
  </aside>
</div>
```

### 6. `/src/_includes/tree-node.njk` (if exists)

**Changes Required:**
- Update all tree node elements with Tailwind classes
- Keep active state gradient in custom CSS

---

## Custom CSS to Keep

After migration, the following CSS should remain in a custom file (e.g., `src/css/custom.css`):

```css
/* =================================================================
   CUSTOM CSS TO KEEP AFTER TAILWIND MIGRATION
   ================================================================= */

/* 1. CSS Custom Properties (for gradient consistency) */
:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --secondary-color: #ec4899;
}

/* 2. Body Background Gradient */
body {
  background: linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%);
}

/* 3. Logo Gradient Text */
.logo {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 4. Hero Section Gradient Background */
.hero {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
}

/* 5. Hero Floating Animation */
.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

/* 6. Hero Heading Gradient */
.hero h1 {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 7. Tag Cloud Item Gradients */
.tag-cloud-item {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  color: var(--primary-color);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.tag-cloud-item:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

/* 8. Tag Gradients */
.tag {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  color: var(--primary-color);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.tag:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

/* 9. Post List Article Left Border Accent */
.post-list article::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary-color), var(--secondary-color));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.post-list article:hover::before {
  transform: scaleY(1);
}

/* 10. Blog Header Gradient Background */
.blog-header {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
}

/* 11. Blog Header Heading Gradient */
.blog-header h1 {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 12. Footer Top Accent Bar */
footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

/* 13. Navigation Link Underline Effect */
nav ul a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 50%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

nav ul a:hover::after {
  width: 100%;
}

/* 14. Inline Code Background Gradient */
.post-content code {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
}

/* 15. Tree Node Active State */
.tree-node-link.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-weight: 600;
}

.tree-node-link.active .tree-icon {
  filter: brightness(0) invert(1);
}

/* 16. Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero, .recent-posts, .blog-header {
  animation: fadeIn 0.8s ease-out;
}

.post-list li {
  animation: fadeIn 0.6s ease-out backwards;
}

.post-list li:nth-child(1) { animation-delay: 0.1s; }
.post-list li:nth-child(2) { animation-delay: 0.2s; }
.post-list li:nth-child(3) { animation-delay: 0.3s; }
.post-list li:nth-child(4) { animation-delay: 0.4s; }
.post-list li:nth-child(5) { animation-delay: 0.5s; }

/* 17. Search Modal Slide Down Animation */
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.search-container {
  animation: slideDown 0.2s ease;
}

/* 18. Time Element Icon (Emoji before content) */
.post-list time::before,
.post-header time::before {
  content: '📅';
  margin-right: 6px;
}

/* 19. Custom scrollbar for search results */
.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 20. Tree folder expanded state */
.tree-folder.expanded > .tree-node-header .tree-toggle {
  transform: rotate(90deg);
}

.tree-folder.expanded > .tree-children {
  display: block;
}
```

---

## Migration Strategy & Priority

### Phase 1: Core Layout (Priority: HIGH)
1. **base.njk** - Header, Footer, Main container
2. **Body and reset styles** - Ensure Tailwind base is loaded
3. **Navigation** - Links, menu structure

### Phase 2: Homepage (Priority: HIGH)
1. **index.njk** - Hero section
2. **Tags section** - Tag cloud
3. **Recent posts** - Post list styling

### Phase 3: Blog Pages (Priority: MEDIUM)
1. **blog.njk** - Blog header, post list
2. **tags.njk** - Tag page styling
3. **Post list consistency** - Ensure uniform styling

### Phase 4: Post Layout (Priority: MEDIUM)
1. **post.njk** - Post layout with sidebar
2. **Post content** - Typography and code blocks
3. **Sidebar** - File tree navigation

### Phase 5: Search Modal (Priority: LOW)
1. **search.css** - Modal, overlay, results
2. **Dark mode** - Dark mode styles
3. **Responsive** - Mobile optimization

### Phase 6: Custom CSS Cleanup (Priority: LOW)
1. **Create custom.css** - Consolidate remaining CSS
2. **Remove unused styles** - Clean up style.css
3. **Optimize** - Minify and combine

---

## Tailwind Configuration Requirements

### tailwind.config.js

```javascript
module.exports = {
  content: [
    './src/**/*.{html,njk,js}',
    './src/_includes/**/*.njk',
    './src/_layouts/**/*.njk',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8',
        },
        secondary: {
          DEFAULT: '#ec4899',
        },
      },
      maxWidth: {
        '7xl': '1400px',
      },
      width: {
        '70': '280px',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.8s ease-out',
        'slideDown': 'slideDown 0.2s ease',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          'from': { transform: 'translateY(-20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
```

### Required Tailwind Plugins

```bash
npm install -D @tailwindcss/line-clamp
```

---

## Testing Checklist

- [ ] Header sticky behavior
- [ ] Navigation hover effects
- [ ] Logo gradient display
- [ ] Hero section gradient and animation
- [ ] Tag cloud hover effects
- [ ] Post list hover effects (card lift, left border)
- [ ] Post content typography
- [ ] Code block styling
- [ ] Sidebar sticky behavior (desktop)
- [ ] File tree expand/collapse
- [ ] File tree active link highlight
- [ ] Footer gradient bar
- [ ] Search modal open/close
- [ ] Search results keyboard navigation
- [ ] Mobile responsive behavior (all breakpoints)
- [ ] Dark mode (search modal)
- [ ] Print styles (search hidden)
- [ ] Animation performance
- [ ] Cross-browser compatibility

---

## Performance Considerations

1. **Tailwind Purge:** Ensure unused classes are removed in production
2. **Custom CSS:** Keep custom CSS minimal and well-organized
3. **Animation Performance:** Use `will-change` for animated elements if needed
4. **Critical CSS:** Consider inlining critical Tailwind utilities
5. **Font Loading:** Optimize system font stack (already using)

---

## Browser Compatibility

All Tailwind utilities used are compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

Special considerations:
- `backdrop-filter` requires `-webkit-` prefix (Tailwind handles this)
- Gradient `background-clip: text` requires `-webkit-` prefix (in custom CSS)
- CSS Grid and Flexbox are fully supported

---

## Summary Statistics

- **Total CSS Lines:** 689 (style.css) + 407 (search.css) = 1,096 lines
- **Lines to Convert:** ~800 lines
- **Lines to Keep:** ~296 lines (custom gradients, animations, pseudo-elements)
- **Templates to Update:** 6 files
- **Estimated Migration Time:** 6-8 hours
- **Testing Time:** 2-3 hours
- **Total Time:** 8-11 hours

---

## Next Steps

1. **Setup Tailwind:** Install and configure Tailwind CSS
2. **Create custom.css:** Set up file for custom styles
3. **Update base.njk:** Start with header/footer
4. **Update index.njk:** Hero and tags
5. **Update blog pages:** blog.njk and tags.njk
6. **Update post.njk:** Post layout and sidebar
7. **Update search.css:** Search modal styling
8. **Test thoroughly:** All components and responsive behavior
9. **Optimize:** Remove unused CSS, minify
10. **Deploy:** Build and test in production

---

## Conclusion

This migration will:
- **Reduce CSS maintenance** by 73% (296 lines vs 1,096 lines)
- **Improve consistency** with utility-first approach
- **Enhance developer experience** with predictable class names
- **Maintain visual fidelity** by keeping complex gradients and animations
- **Improve performance** with Tailwind's PurgeCSS
- **Ensure accessibility** with Tailwind's focus states and ARIA support

The hybrid approach (Tailwind utilities + custom gradients/animations) provides the best balance between utility-first benefits and design uniqueness.
