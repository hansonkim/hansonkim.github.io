module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");

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

  // Transform to fix relative markdown links
  eleventyConfig.addTransform("fixMarkdownLinks", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      // Fix links in claude-flow-ko posts only
      if (outputPath.includes('/claude-flow-ko/')) {
        // Convert ./ko-docs/ links (from main post)
        content = content.replace(/href="\.\/ko-docs\/([^"]+)\.md"/g, (match, path) => {
          return `href="/posts/claude-flow-ko/ko-docs/${path}/"`;
        });

        // Convert ../ko-docs/ links
        content = content.replace(/href="\.\.\/ko-docs\/([^"]+)\.md"/g, (match, path) => {
          return `href="/posts/claude-flow-ko/ko-docs/${path}/"`;
        });

        // Convert relative paths without ./ or ../ (ko-docs internal links)
        // Example: development/DEPLOYMENT.md or api/API_DOCUMENTATION.md
        content = content.replace(/href="([a-zA-Z][^":/]*\/[^"]+)\.md"/g, (match, path) => {
          return `href="/posts/claude-flow-ko/ko-docs/${path}/"`;
        });

        // Convert simple filename links (same directory)
        // Example: DEPLOYMENT.md → DEPLOYMENT/
        content = content.replace(/href="([A-Z][A-Z0-9_-]+)\.md"/g, (match, filename) => {
          // Get current directory from outputPath
          const pathParts = outputPath.split('/posts/claude-flow-ko/ko-docs/');
          if (pathParts.length > 1) {
            const currentDir = pathParts[1].split('/')[0];
            if (currentDir && currentDir !== filename) {
              return `href="/posts/claude-flow-ko/ko-docs/${currentDir}/${filename}/"`;
            }
          }
          return `href="/posts/claude-flow-ko/ko-docs/${filename}/"`;
        });
      }
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
