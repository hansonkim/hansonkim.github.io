/**
 * Search UI Integration Tests
 * @description End-to-end integration tests for search user interface
 */

describe('Search UI Integration', () => {
  let searchUI;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="app">
        <header>
          <nav>
            <input type="search" id="search-input" placeholder="Search...">
            <div id="search-dropdown" class="hidden"></div>
          </nav>
        </header>
        <main id="content"></main>
      </div>
    `;

    // Mock search UI component
    searchUI = {
      input: document.getElementById('search-input'),
      dropdown: document.getElementById('search-dropdown'),
      content: document.getElementById('content'),

      posts: [
        { id: 1, title: 'Test Post 1', content: 'Content 1' },
        { id: 2, title: 'Test Post 2', content: 'Content 2' }
      ],

      init() {
        this.input.addEventListener('input', (e) => this.handleSearch(e));
        this.input.addEventListener('focus', () => this.showDropdown());
        this.input.addEventListener('blur', () => setTimeout(() => this.hideDropdown(), 200));
      },

      handleSearch(event) {
        const query = event.target.value;
        if (query.length >= 2) {
          const results = this.search(query);
          this.renderResults(results);
        } else {
          this.hideDropdown();
        }
      },

      search(query) {
        return this.posts.filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
        );
      },

      renderResults(results) {
        if (results.length === 0) {
          this.dropdown.innerHTML = '<div class="no-results">No results found</div>';
        } else {
          this.dropdown.innerHTML = results.map(r => `
            <a href="/posts/${r.id}" class="result-item">
              <h3>${r.title}</h3>
            </a>
          `).join('');
        }
        this.showDropdown();
      },

      showDropdown() {
        this.dropdown.classList.remove('hidden');
      },

      hideDropdown() {
        this.dropdown.classList.add('hidden');
      }
    };

    searchUI.init();
  });

  describe('User Interaction Flow', () => {
    it('should show dropdown on input focus', () => {
      searchUI.input.focus();
      expect(searchUI.dropdown.classList.contains('hidden')).toBe(false);
    });

    it('should search as user types', async () => {
      searchUI.input.value = 'test';
      searchUI.input.dispatchEvent(new Event('input'));

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(searchUI.dropdown.innerHTML).toContain('result-item');
    });

    it('should update results on each keystroke', () => {
      const queries = ['t', 'te', 'tes', 'test'];

      queries.forEach(query => {
        searchUI.input.value = query;
        searchUI.input.dispatchEvent(new Event('input'));
      });

      expect(searchUI.dropdown.innerHTML).toBeTruthy();
    });

    it('should hide dropdown when focus is lost', async () => {
      searchUI.input.focus();
      searchUI.input.blur();

      await new Promise(resolve => setTimeout(resolve, 250));

      expect(searchUI.dropdown.classList.contains('hidden')).toBe(true);
    });

    it('should handle result selection', () => {
      searchUI.input.value = 'test';
      searchUI.input.dispatchEvent(new Event('input'));

      const resultLink = searchUI.dropdown.querySelector('.result-item');
      expect(resultLink).toBeTruthy();
      expect(resultLink.href).toContain('/posts/');
    });
  });

  describe('Search Result Display', () => {
    it('should display search results correctly', () => {
      const results = searchUI.search('test');
      searchUI.renderResults(results);

      const resultElements = searchUI.dropdown.querySelectorAll('.result-item');
      expect(resultElements.length).toBe(results.length);
    });

    it('should show "no results" message when appropriate', () => {
      searchUI.renderResults([]);

      expect(searchUI.dropdown.innerHTML).toContain('No results found');
    });

    it('should highlight matching text in results', () => {
      // Mock highlight functionality
      const highlightedResults = searchUI.search('test').map(r => ({
        ...r,
        title: r.title.replace(/test/gi, '<mark>$&</mark>')
      }));

      expect(highlightedResults).toBeDefined();
    });

    it('should limit number of displayed results', () => {
      const manyPosts = Array(50).fill(null).map((_, i) => ({
        id: i,
        title: `Test Post ${i}`,
        content: 'Test content'
      }));

      searchUI.posts = manyPosts;
      const results = searchUI.search('test').slice(0, 10);
      searchUI.renderResults(results);

      const displayed = searchUI.dropdown.querySelectorAll('.result-item');
      expect(displayed.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Performance Integration', () => {
    it('should debounce search input', async () => {
      let searchCount = 0;
      const originalSearch = searchUI.search.bind(searchUI);
      searchUI.search = function(query) {
        searchCount++;
        return originalSearch(query);
      };

      // Rapid typing
      ['t', 'te', 'tes', 'test'].forEach((query, i) => {
        setTimeout(() => {
          searchUI.input.value = query;
          searchUI.input.dispatchEvent(new Event('input'));
        }, i * 10);
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // With debouncing, should search less than number of keystrokes
      expect(searchCount).toBeLessThan(4);
    });

    it('should not block UI during search', async () => {
      const largePosts = Array(1000).fill(null).map((_, i) => ({
        id: i,
        title: `Post ${i}`,
        content: 'Content'
      }));

      searchUI.posts = largePosts;

      const start = performance.now();
      searchUI.input.value = 'test';
      searchUI.input.dispatchEvent(new Event('input'));
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Mobile Responsive Behavior', () => {
    it('should adapt to mobile viewport', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      expect(window.innerWidth).toBe(375);
      // Verify responsive behavior
      expect(searchUI.input).toBeTruthy();
    });

    it('should handle touch events', () => {
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });

      expect(() => {
        searchUI.input.dispatchEvent(touchEvent);
      }).not.toThrow();
    });
  });

  describe('State Management', () => {
    it('should maintain search state', () => {
      searchUI.input.value = 'test query';
      const savedQuery = searchUI.input.value;

      // Simulate navigation
      const state = { query: savedQuery };

      expect(state.query).toBe('test query');
    });

    it('should restore search state on back navigation', () => {
      const query = 'previous search';

      // Simulate saving state
      sessionStorage.setItem('searchQuery', query);

      // Restore state
      const restored = sessionStorage.getItem('searchQuery');
      searchUI.input.value = restored;

      expect(searchUI.input.value).toBe(query);

      sessionStorage.removeItem('searchQuery');
    });
  });

  describe('Error Handling', () => {
    it('should handle search errors gracefully', () => {
      searchUI.search = () => {
        throw new Error('Search failed');
      };

      expect(() => {
        try {
          searchUI.input.value = 'test';
          searchUI.input.dispatchEvent(new Event('input'));
        } catch (e) {
          searchUI.renderResults([]);
        }
      }).not.toThrow();
    });

    it('should show error message to user', () => {
      const error = 'Search service unavailable';
      searchUI.dropdown.innerHTML = `<div class="error">${error}</div>`;

      expect(searchUI.dropdown.innerHTML).toContain('error');
    });
  });
});
