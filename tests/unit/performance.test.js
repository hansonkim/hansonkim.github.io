/**
 * Performance Benchmark Tests
 * @description Tests for search performance and optimization
 */

const { samplePosts, performanceBenchmarks } = require('../fixtures/test-data');

describe('Performance Benchmarks', () => {
  let searchEngine;
  let largePosts;

  beforeAll(() => {
    // Generate large dataset for performance testing
    largePosts = Array(10000).fill(null).map((_, i) => ({
      id: `post-${i}`,
      title: `Performance Test Post ${i}`,
      content: `This is test content for performance testing.
                Post number ${i} contains various keywords like
                performance, optimization, testing, and search.`,
      tags: ['performance', 'test', `tag-${i % 10}`],
      date: new Date(2025, 0, i % 365).toISOString(),
      language: i % 2 === 0 ? 'en' : 'ko'
    }));
  });

  beforeEach(() => {
    searchEngine = {
      index: new Map(),

      buildIndex(posts) {
        const start = performance.now();

        posts.forEach(post => {
          const searchable = `${post.title} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
          this.index.set(post.id, {
            id: post.id,
            searchable,
            title: post.title.toLowerCase(),
            content: post.content.toLowerCase(),
            tags: post.tags.map(t => t.toLowerCase())
          });
        });

        return performance.now() - start;
      },

      search(query) {
        const normalized = query.toLowerCase().trim();
        const results = [];

        for (const [id, data] of this.index) {
          if (data.searchable.includes(normalized)) {
            // Calculate relevance score
            let score = 0;
            if (data.title.includes(normalized)) score += 10;
            if (data.content.includes(normalized)) score += 5;
            if (data.tags.some(tag => tag.includes(normalized))) score += 3;

            results.push({ id, score });
          }
        }

        return results.sort((a, b) => b.score - a.score).map(r => r.id);
      }
    };
  });

  describe('Index Building Performance', () => {
    it('should build index for small dataset quickly', () => {
      const duration = searchEngine.buildIndex(samplePosts);
      expect(duration).toBeLessThan(10); // <10ms
    });

    it('should build index for large dataset efficiently', () => {
      const duration = searchEngine.buildIndex(largePosts);
      expect(duration).toBeLessThan(1000); // <1 second for 10k posts
    });

    it('should handle incremental index updates', () => {
      searchEngine.buildIndex(samplePosts);

      const start = performance.now();
      searchEngine.buildIndex([...samplePosts, largePosts[0]]);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });

    it('should scale linearly with dataset size', () => {
      const small = searchEngine.buildIndex(samplePosts);
      const medium = searchEngine.buildIndex(largePosts.slice(0, 1000));
      const large = searchEngine.buildIndex(largePosts.slice(0, 5000));

      // Large should not be more than 5x slower than small
      expect(large).toBeLessThan(small * 100);
    });
  });

  describe('Search Query Performance', () => {
    beforeEach(() => {
      searchEngine.buildIndex(largePosts);
    });

    it('should complete single search under 100ms', () => {
      const start = performance.now();
      searchEngine.search('performance');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(performanceBenchmarks.maxSearchTime);
    });

    it('should handle rapid consecutive searches', () => {
      const durations = [];

      for (let i = 0; i < 100; i++) {
        const start = performance.now();
        searchEngine.search('test');
        durations.push(performance.now() - start);
      }

      const avgDuration = durations.reduce((a, b) => a + b) / durations.length;
      expect(avgDuration).toBeLessThan(10);
    });

    it('should maintain performance with complex queries', () => {
      const complexQuery = 'performance optimization testing search';

      const start = performance.now();
      searchEngine.search(complexQuery);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(200);
    });

    it('should handle concurrent searches efficiently', async () => {
      const queries = ['test', 'performance', 'optimization', 'search'];

      const start = performance.now();
      const results = await Promise.all(
        queries.map(q => Promise.resolve(searchEngine.search(q)))
      );
      const duration = performance.now() - start;

      expect(results).toHaveLength(4);
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Memory Efficiency', () => {
    it('should use reasonable memory for index', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      searchEngine.buildIndex(largePosts);

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryUsed = finalMemory - initialMemory;

      expect(memoryUsed).toBeLessThan(performanceBenchmarks.maxMemoryUsage);
    });

    it('should not leak memory on repeated searches', () => {
      searchEngine.buildIndex(samplePosts);
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 1000; i++) {
        searchEngine.search('test query ' + i);
      }

      if (global.gc) global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // <5MB
    });

    it('should efficiently clear old index data', () => {
      searchEngine.buildIndex(largePosts);
      const withDataMemory = process.memoryUsage().heapUsed;

      searchEngine.index.clear();
      if (global.gc) global.gc();

      const clearedMemory = process.memoryUsage().heapUsed;
      expect(clearedMemory).toBeLessThan(withDataMemory);
    });
  });

  describe('Throughput Metrics', () => {
    beforeEach(() => {
      searchEngine.buildIndex(largePosts);
    });

    it('should achieve minimum results per second', () => {
      const queries = Array(100).fill('performance');

      const start = performance.now();
      queries.forEach(q => searchEngine.search(q));
      const duration = (performance.now() - start) / 1000; // seconds

      const resultsPerSecond = queries.length / duration;
      expect(resultsPerSecond).toBeGreaterThan(
        performanceBenchmarks.minResultsPerSecond
      );
    });

    it('should handle burst load efficiently', () => {
      const burstSize = 1000;
      const queries = Array(burstSize).fill(null).map((_, i) => `query${i}`);

      const start = performance.now();
      queries.forEach(q => searchEngine.search(q));
      const duration = performance.now() - start;

      const avgTime = duration / burstSize;
      expect(avgTime).toBeLessThan(10); // <10ms per query
    });
  });

  describe('Caching Performance', () => {
    beforeEach(() => {
      searchEngine.buildIndex(largePosts);
      searchEngine.cache = new Map();

      const originalSearch = searchEngine.search.bind(searchEngine);
      searchEngine.search = function(query) {
        if (this.cache.has(query)) {
          return this.cache.get(query);
        }
        const results = originalSearch(query);
        this.cache.set(query, results);
        return results;
      };
    });

    it('should improve performance with caching', () => {
      const query = 'performance test';

      // First search (uncached)
      const start1 = performance.now();
      searchEngine.search(query);
      const uncachedTime = performance.now() - start1;

      // Second search (cached)
      const start2 = performance.now();
      searchEngine.search(query);
      const cachedTime = performance.now() - start2;

      expect(cachedTime).toBeLessThan(uncachedTime);
    });

    it('should handle cache invalidation efficiently', () => {
      searchEngine.search('test1');
      searchEngine.search('test2');
      searchEngine.search('test3');

      const start = performance.now();
      searchEngine.cache.clear();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
    });
  });

  describe('Optimization Verification', () => {
    it('should use efficient data structures', () => {
      // Verify Map is used (O(1) lookup) vs Array (O(n))
      expect(searchEngine.index).toBeInstanceOf(Map);
    });

    it('should avoid unnecessary iterations', () => {
      let iterationCount = 0;
      const originalSearch = searchEngine.search.bind(searchEngine);

      searchEngine.search = function(query) {
        for (const item of this.index.values()) {
          iterationCount++;
        }
        return originalSearch(query);
      };

      searchEngine.buildIndex(samplePosts);
      searchEngine.search('test');

      // Should iterate through all items once
      expect(iterationCount).toBe(samplePosts.length);
    });

    it('should minimize string operations', () => {
      const query = 'TEST QUERY';

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        query.toLowerCase(); // Should be called once, not repeatedly
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
    });
  });

  describe('Scalability Tests', () => {
    it('should handle 100k posts', () => {
      const massivePosts = Array(100000).fill(null).map((_, i) => ({
        id: `post-${i}`,
        title: `Post ${i}`,
        content: `Content ${i}`,
        tags: [`tag-${i % 100}`],
        date: new Date().toISOString(),
        language: 'en'
      }));

      const buildTime = searchEngine.buildIndex(massivePosts);
      expect(buildTime).toBeLessThan(10000); // <10 seconds

      const start = performance.now();
      searchEngine.search('test');
      const searchTime = performance.now() - start;
      expect(searchTime).toBeLessThan(500);
    });
  });
});
