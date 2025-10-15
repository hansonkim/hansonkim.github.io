module.exports = {
  layout: "post.njk",
  eleventyComputed: {
    tags: (data) => {
      const baseTags = ["Claude-Flow", "문서", "AI"];

      // 제외할 디렉토리 (너무 세부적인 문서들)
      const excludedPaths = [
        '/experimental/',
        '/reports/',
        '/validation/',
        '/sdk/',
        '/wiki/',
        '/technical/',
        '/integrations/',
        '/development/',
        '/ci-cd/',
        '/api/',
        '/architecture/',
        '/guides/'
      ];

      const filePath = data.page.inputPath;
      const shouldExclude = excludedPaths.some(path => filePath.includes(path));

      // 제외 경로가 아니고, ko-docs 내의 파일이면 posts에 포함
      if (!shouldExclude && filePath.includes('/ko-docs/')) {
        return ["posts", ...baseTags];
      }
      return baseTags;
    },
    title: (data) => {
      if (data.title) return data.title;

      // 파일명에서 제목 생성
      const fileName = data.page.fileSlug;
      return fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    },
    date: (data) => {
      if (data.date) return data.date;

      // 파일별로 다른 날짜 할당 (블로그 포스트보다 과거)
      const fileName = data.page.fileSlug;
      const dateMap = {
        'README': '2025-10-15T08:50:00+09:00',
        'CLI-MEMORY-COMMANDS-WORKING': '2025-10-15T08:40:00+09:00',
        'INDEX': '2025-10-15T08:30:00+09:00',
        'PERFORMANCE-METRICS-GUIDE': '2025-10-15T08:20:00+09:00',
        'PERFORMANCE-JSON-IMPROVEMENTS': '2025-10-15T08:10:00+09:00',
        'RELEASE-NOTES-v2.7.0-alpha.10': '2025-10-15T08:00:00+09:00',
        'RELEASE-NOTES-v2.7.0-alpha.9': '2025-10-15T07:50:00+09:00',
        'MCP-SETUP-GUIDE': '2025-10-15T07:40:00+09:00',
        'ENV-SETUP-GUIDE': '2025-10-15T07:30:00+09:00',
        'remote-setup': '2025-10-15T07:20:00+09:00',
        'MCP_TOOLS': '2025-10-15T07:10:00+09:00',
        'AGENTS': '2025-10-15T07:00:00+09:00',
        'SWARM': '2025-10-15T06:50:00+09:00',
        'SPARC': '2025-10-15T06:40:00+09:00'
      };

      return dateMap[fileName] || '2025-01-01T00:00:00+09:00';
    },
    description: (data) => {
      if (data.description) return data.description;
      // 파일 경로에서 설명 생성
      const pathParts = data.page.filePathStem.split('/').filter(p => p && p !== 'posts' && p !== 'claude-flow-ko' && p !== 'ko-docs');
      return `Claude-Flow ${pathParts.join(' > ')} 문서`;
    }
  }
};
