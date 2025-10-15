module.exports = {
  layout: "post.njk",
  tags: ["Claude-Flow", "문서", "AI"],
  eleventyComputed: {
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
      // 기본 날짜 설정
      return "2025-10-15";
    },
    description: (data) => {
      if (data.description) return data.description;
      // 파일 경로에서 설명 생성
      const pathParts = data.page.filePathStem.split('/').filter(p => p && p !== 'posts' && p !== 'claude-flow-ko' && p !== 'ko-docs');
      return `Claude-Flow ${pathParts.join(' > ')} 문서`;
    }
  }
};
