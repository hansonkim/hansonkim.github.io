/**
 * Test Data Fixtures
 * @description Sample data for testing search functionality
 */

module.exports = {
  // Sample posts with mixed Korean/English content
  samplePosts: [
    {
      id: 'post-1',
      title: 'Claude Flow 시작하기',
      content: 'Claude Flow는 AI 에이전트 오케스트레이션 도구입니다. Getting started with swarm coordination.',
      tags: ['AI', 'Claude', '개발'],
      date: '2025-10-15',
      language: 'ko'
    },
    {
      id: 'post-2',
      title: 'JavaScript Testing Best Practices',
      content: 'Learn about Jest, unit testing, and integration testing strategies.',
      tags: ['JavaScript', 'Testing', 'Jest'],
      date: '2025-10-14',
      language: 'en'
    },
    {
      id: 'post-3',
      title: '한글 검색 테스트',
      content: '한글로 작성된 블로그 포스트입니다. 초성 검색과 완성형 한글을 모두 지원합니다.',
      tags: ['한글', '검색', '테스트'],
      date: '2025-10-13',
      language: 'ko'
    },
    {
      id: 'post-4',
      title: 'Performance Optimization Tips',
      content: 'Improve your web application performance with these proven techniques.',
      tags: ['Performance', 'Optimization', 'Web'],
      date: '2025-10-12',
      language: 'en'
    },
    {
      id: 'post-5',
      title: '데이터베이스 최적화 전략',
      content: 'Database performance optimization strategies using indexes and query optimization.',
      tags: ['Database', '최적화', 'SQL'],
      date: '2025-10-11',
      language: 'ko'
    }
  ],

  // Search queries for testing
  searchQueries: {
    korean: [
      'Claude',
      '한글',
      '검색',
      '최적화',
      '개발',
      'ㅋㅌㄹㄹㄷ', // 초성 for 'Claude'
      'ㅎㄱ', // 초성 for '한글'
    ],
    english: [
      'testing',
      'performance',
      'javascript',
      'optimization',
      'best practices'
    ],
    mixed: [
      'claude flow',
      'ai 에이전트',
      'database 최적화',
      'web performance'
    ],
    edgeCases: [
      '', // Empty query
      ' ', // Whitespace only
      '!@#$%', // Special characters
      'a', // Single character
      'x'.repeat(1000), // Very long query
      '<script>alert("xss")</script>', // XSS attempt
      '../../../../etc/passwd', // Path traversal
      'SELECT * FROM posts', // SQL injection attempt
    ]
  },

  // Expected results for validation
  expectedResults: {
    'claude': ['post-1'],
    '한글': ['post-3'],
    'testing': ['post-2'],
    'performance': ['post-4'],
    '최적화': ['post-5'],
    'ai': ['post-1']
  },

  // Performance benchmarks
  performanceBenchmarks: {
    maxSearchTime: 100, // milliseconds
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    minResultsPerSecond: 1000
  },

  // Accessibility test data
  accessibilityTests: {
    requiredAttributes: [
      'aria-label',
      'role',
      'aria-describedby'
    ],
    keyboardNavigation: [
      'Enter',
      'ArrowUp',
      'ArrowDown',
      'Escape'
    ]
  },

  // Browser compatibility data
  browsers: [
    { name: 'Chrome', version: '120' },
    { name: 'Firefox', version: '120' },
    { name: 'Safari', version: '17' },
    { name: 'Edge', version: '120' }
  ]
};
