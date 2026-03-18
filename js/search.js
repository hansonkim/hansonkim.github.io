/**
 * Blog Search Functionality
 * Supports Korean/English text search with fuzzy matching
 * Features: keyboard shortcuts, highlighting, accessibility
 */

class BlogSearch {
  constructor() {
    this.searchIndex = [];
    this.fuse = null;
    this.isOpen = false;
    this.selectedIndex = -1;

    this.init();
  }

  async init() {
    await this.loadSearchIndex();
    this.setupFuse();
    this.createSearchModal();
    this.attachEventListeners();

    // 단일 live region 초기화 (DOM 누수 방지)
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Load search index from JSON
   */
  async loadSearchIndex() {
    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.searchIndex = await response.json();
      console.log(`🔍 Search index loaded: ${this.searchIndex.length} posts`);
    } catch (error) {
      console.error('Failed to load search index:', error);
      this.searchIndex = [];
    }
  }

  /**
   * Setup Fuse.js for fuzzy search
   * Lightweight alternative: custom implementation
   */
  setupFuse() {
    // Simple fuzzy search implementation (no external dependencies)
    this.search = (query) => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const normalizedQuery = query.toLowerCase().trim();
      const results = [];

      this.searchIndex.forEach(item => {
        const titleLower = item.title.toLowerCase();
        const contentLower = item.fullContent.toLowerCase();
        const descriptionLower = item.description.toLowerCase();

        let score = 0;
        let matchPositions = [];

        // Exact title match (highest priority)
        if (titleLower.includes(normalizedQuery)) {
          score += 100;
          matchPositions.push({ field: 'title', start: titleLower.indexOf(normalizedQuery) });
        }

        // Exact description match
        if (descriptionLower.includes(normalizedQuery)) {
          score += 50;
          matchPositions.push({ field: 'description', start: descriptionLower.indexOf(normalizedQuery) });
        }

        // Content match
        if (contentLower.includes(normalizedQuery)) {
          score += 30;
          const index = contentLower.indexOf(normalizedQuery);
          matchPositions.push({ field: 'content', start: index });
        }

        // Word boundary matches (Korean or English)
        const words = normalizedQuery.split(/\s+/);
        words.forEach(word => {
          if (word.length > 1) {
            if (titleLower.includes(word)) score += 20;
            if (descriptionLower.includes(word)) score += 10;
            if (contentLower.includes(word)) score += 5;
          }
        });

        if (score > 0) {
          results.push({
            item: item,
            score: score,
            matches: matchPositions
          });
        }
      });

      // Sort by score descending
      return results.sort((a, b) => b.score - a.score).slice(0, 10);
    };
  }

  /**
   * Create search modal UI
   */
  createSearchModal() {
    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'search-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'search-modal-title');

    modal.innerHTML = `
      <div class="search-overlay" aria-hidden="true"></div>
      <div class="search-container">
        <div class="search-header">
          <h2 id="search-modal-title" class="sr-only">검색</h2>
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              type="search"
              id="search-input"
              class="search-input"
              placeholder="검색어를 입력하세요... (Ctrl+K)"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              aria-label="블로그 검색"
              aria-describedby="search-help"
            >
            <button
              class="search-close"
              aria-label="검색 닫기"
              title="닫기 (ESC)"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div id="search-help" class="search-help sr-only">
            방향키로 이동, Enter로 선택, ESC로 닫기
          </div>
        </div>

        <div class="search-results" role="listbox" aria-label="검색 결과"></div>

        <div class="search-footer">
          <div class="search-shortcuts">
            <kbd>↑↓</kbd> 이동
            <kbd>Enter</kbd> 선택
            <kbd>ESC</kbd> 닫기
          </div>
          <div class="search-stats">
            <span id="search-count"></span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    this.elements = {
      modal: modal,
      overlay: modal.querySelector('.search-overlay'),
      input: modal.querySelector('#search-input'),
      results: modal.querySelector('.search-results'),
      closeBtn: modal.querySelector('.search-close'),
      stats: modal.querySelector('#search-count')
    };
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Keyboard shortcut: Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });

    // Close on ESC
    this.elements.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectPrevious();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.selectCurrent();
      }
    });

    // Close on overlay click
    this.elements.overlay.addEventListener('click', () => {
      this.close();
    });

    // Close button
    this.elements.closeBtn.addEventListener('click', () => {
      this.close();
    });

    // Search input with debouncing
    let searchTimeout;
    this.elements.input.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 200);
    });

    // Add search button to header
    this.addSearchButton();
  }

  /**
   * Add search button to navigation
   * 이미 정적 HTML에 버튼이 있으면 이벤트만 연결하고, 없으면 동적 생성
   */
  addSearchButton() {
    const existingBtn = document.querySelector('.search-trigger');
    if (existingBtn) {
      existingBtn.addEventListener('click', () => this.open());
      return;
    }

    // 정적 HTML에 버튼이 없을 경우 fallback으로 동적 생성
    const nav = document.querySelector('header nav ul');
    if (nav) {
      const li = document.createElement('li');
      li.innerHTML = `
        <button class="search-trigger" aria-label="검색 열기" title="검색 (Ctrl+K)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;
      nav.appendChild(li);

      li.querySelector('.search-trigger').addEventListener('click', () => {
        this.open();
      });
    }
  }

  /**
   * Open search modal
   */
  open() {
    this.isOpen = true;
    this.elements.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on input
    setTimeout(() => {
      this.elements.input.focus();
    }, 100);

    // Announce to screen readers
    this.announce('검색 모달이 열렸습니다');
  }

  /**
   * Close search modal
   */
  close() {
    this.isOpen = false;
    this.elements.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.elements.input.value = '';
    this.elements.results.innerHTML = '';
    this.selectedIndex = -1;

    this.announce('검색 모달이 닫혔습니다');
  }

  /**
   * Perform search and display results
   */
  performSearch(query) {
    if (!query || query.trim().length < 2) {
      this.elements.results.innerHTML = '<div class="search-empty">검색어를 2자 이상 입력하세요</div>';
      this.elements.stats.textContent = '';
      return;
    }

    const results = this.search(query);
    this.selectedIndex = -1;

    if (results.length === 0) {
      this.elements.results.innerHTML = `
        <div class="search-empty">
          <p>"${this.escapeHtml(query)}"에 대한 검색 결과가 없습니다</p>
        </div>
      `;
      this.elements.stats.textContent = '결과 없음';
      return;
    }

    // Update stats
    this.elements.stats.textContent = `${results.length}개 결과`;

    // Render results
    const resultsHtml = results.map((result, index) => {
      const { item, matches } = result;
      const highlightedTitle = this.highlightText(item.title, query);
      const highlightedDescription = this.highlightText(item.description, query);

      return `
        <a
          href="${this.escapeHtml(item.url)}"
          class="search-result-item"
          role="option"
          aria-selected="${index === this.selectedIndex}"
          data-index="${index}"
        >
          <div class="search-result-title">${highlightedTitle}</div>
          <div class="search-result-description">${highlightedDescription}</div>
          <div class="search-result-url">${this.escapeHtml(item.url)}</div>
        </a>
      `;
    }).join('');

    this.elements.results.innerHTML = resultsHtml;

    // Announce results to screen readers
    this.announce(`${results.length}개의 검색 결과가 있습니다`);
  }

  /**
   * Highlight matching text
   */
  highlightText(text, query) {
    if (!text || !query) return this.escapeHtml(text);

    const escapedText = this.escapeHtml(text);
    const escapedQuery = this.escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');

    return escapedText.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Select next result
   */
  selectNext() {
    const items = this.elements.results.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    this.selectedIndex = (this.selectedIndex + 1) % items.length;
    this.updateSelection(items);
  }

  /**
   * Select previous result
   */
  selectPrevious() {
    const items = this.elements.results.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    this.selectedIndex = this.selectedIndex <= 0 ? items.length - 1 : this.selectedIndex - 1;
    this.updateSelection(items);
  }

  /**
   * Update visual selection
   */
  updateSelection(items) {
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
        item.setAttribute('aria-selected', 'true');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  /**
   * Navigate to selected result
   */
  selectCurrent() {
    const items = this.elements.results.querySelectorAll('.search-result-item');
    if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
      items[this.selectedIndex].click();
    }
  }

  /**
   * 스크린 리더에 메시지 전달 (단일 live region 재사용으로 DOM 누수 방지)
   */
  announce(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
      setTimeout(() => { this.liveRegion.textContent = message; }, 50);
    }
  }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BlogSearch();
  });
} else {
  new BlogSearch();
}
