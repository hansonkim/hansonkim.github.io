module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");

  // Add date filter for blog posts
  eleventyConfig.addFilter("dateDisplay", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Add humanize filter for text formatting
  eleventyConfig.addFilter("humanize", (str) => {
    if (!str) return "";
    return str
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .trim();
  });

  // Add slugify filter for URL-safe strings
  eleventyConfig.addFilter("slugify", (str) => {
    if (!str) return "";
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-가-힣]+/g, '')
      .replace(/\-\-+/g, '-');
  });

  // Create posts collection sorted by date (newest first)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    const posts = collectionApi.getFilteredByTag("posts");
    // getFilteredByTag returns posts sorted by date ascending (oldest first)
    // So we just need to reverse it to get newest first
    return posts.slice().reverse();
  });

  // Create a collection of all tags with post counts
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") {
          tags = [tags];
        }
        tags.forEach(tag => {
          if (tag !== "posts") {
            tagSet.add(tag);
          }
        });
      }
    });
    return Array.from(tagSet).sort();
  });

  // Add buildFileTree filter to generate navigation tree from collections
  eleventyConfig.addFilter("buildFileTree", (currentPage, collections) => {
    if (!currentPage || !currentPage.inputPath || !collections.all) {
      return [];
    }

    const path = require('path');

    // Get current page's post directory (e.g., "claude-flow-ko")
    const inputPath = currentPage.inputPath;
    const match = inputPath.match(/src\/posts\/([^\/]+)\//);

    if (!match) {
      return [];
    }

    const postSlug = match[1];
    const postPrefix = `./src/posts/${postSlug}/`;

    // Filter all pages that belong to this post (including main file and subdirectories)
    const postPages = collections.all.filter(page => {
      const pagePath = page.inputPath;
      // Must be in the same post directory
      return pagePath.startsWith(postPrefix) &&
             pagePath.endsWith('.md');
    });

    if (postPages.length === 0) {
      return [];
    }

    // Build tree structure from page paths
    function buildTreeFromPages(pages, postSlug, currentPagePath) {
      const tree = {};

      pages.forEach(page => {
        const relativePath = page.inputPath.replace(`./src/posts/${postSlug}/`, '');
        const parts = relativePath.split('/');

        // Check if this is the main post file (directly in post directory)
        const isMainFile = parts.length === 1 && parts[0].endsWith('.md');

        let current = tree;

        // Build nested structure
        parts.forEach((part, index) => {
          const isFile = index === parts.length - 1 && part.endsWith('.md');
          const key = isFile ? part.replace(/\.md$/, '') : part;

          if (isFile) {
            // It's a file
            if (!current._files) {
              current._files = [];
            }
            current._files.push({
              name: key,
              title: page.data.title || key.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              type: 'file',
              path: page.url,
              children: [],
              isMainFile: isMainFile,
              isCurrentPage: page.inputPath === currentPagePath
            });
          } else {
            // It's a folder
            if (!current[key]) {
              current[key] = {};
            }
            current = current[key];
          }
        });
      });

      // Convert tree object to array format
      function convertToArray(obj, folderName = null) {
        const items = [];

        // Add files first
        if (obj._files) {
          items.push(...obj._files);
        }

        // Then add folders
        Object.keys(obj).forEach(key => {
          if (key !== '_files') {
            const children = convertToArray(obj[key], key);
            if (children.length > 0) {
              items.push({
                name: key,
                title: key.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                type: 'folder',
                children: children,
                path: null
              });
            }
          }
        });

        // Sort: main post file first, then folders, then other files
        return items.sort((a, b) => {
          // Highest priority: main post file
          if (a.isMainFile && !b.isMainFile) return -1;
          if (!a.isMainFile && b.isMainFile) return 1;

          // Second priority: folders before regular files
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          }

          // Within files (excluding main file), prioritize README and INDEX
          if (a.type === 'file' && !a.isMainFile && !b.isMainFile) {
            const aIsSpecial = a.name.toUpperCase().startsWith('README') || a.name.toUpperCase().startsWith('INDEX');
            const bIsSpecial = b.name.toUpperCase().startsWith('README') || b.name.toUpperCase().startsWith('INDEX');

            if (aIsSpecial && !bIsSpecial) return -1;
            if (!aIsSpecial && bIsSpecial) return 1;
          }

          // Otherwise, sort alphabetically
          return a.name.localeCompare(b.name);
        });
      }

      return convertToArray(tree);
    }

    return buildTreeFromPages(postPages, postSlug, inputPath);
  });

  // Transform to fix relative markdown links in all posts
  eleventyConfig.addTransform("fixMarkdownLinks", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html") && outputPath.includes('/posts/')) {
      // Extract the post root directory (e.g., /posts/claude-flow-ko/)
      const postsMatch = outputPath.match(/\/posts\/([^\/]+)/);
      if (!postsMatch) return content;

      const postRoot = `/posts/${postsMatch[1]}`;

      // Get current directory path relative to post root
      const afterPostRoot = outputPath.split(postRoot)[1];
      if (!afterPostRoot) return content;

      const pathParts = afterPostRoot.split('/').filter(p => p && p !== 'index.html');
      if (pathParts.length > 0) {
        pathParts.pop(); // Remove the last part (current file/directory)
      }
      const currentRelativePath = pathParts.join('/');
      const currentDir = currentRelativePath ? `${postRoot}/${currentRelativePath}` : postRoot;

      // 1. Convert ./path/file.md links (relative to current directory)
      content = content.replace(/href="\.\/([^"]+)\.md"/g, (match, path) => {
        return `href="${currentDir}/${path}/"`;
      });

      // 2. Convert ../path/file.md links (go up one directory)
      content = content.replace(/href="\.\.\/([^"]+)\.md"/g, (match, path) => {
        const parentParts = currentDir.split('/').filter(p => p);
        parentParts.pop(); // Go up one level
        const parentDir = '/' + parentParts.join('/');
        return `href="${parentDir}/${path}/"`;
      });

      // 3. Convert relative paths like "subdir/file.md" (no ./ or ../)
      content = content.replace(/href="([a-zA-Z][^":/]*\/[^"]+)\.md"/g, (match, path) => {
        return `href="${currentDir}/${path}/"`;
      });

      // 4. Convert simple filename links in same directory (e.g., FILE.md)
      content = content.replace(/href="([A-Z][A-Z0-9_-]+)\.md"/g, (match, filename) => {
        return `href="${currentDir}/${filename}/"`;
      });
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"]
  };
};
