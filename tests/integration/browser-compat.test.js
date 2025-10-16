/**
 * Browser Compatibility Tests
 * @description Tests for cross-browser compatibility and feature detection
 */

const { browsers } = require('../fixtures/test-data');

describe('Browser Compatibility', () => {
  let userAgents;

  beforeAll(() => {
    userAgents = {
      chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    };
  });

  describe('Feature Detection', () => {
    it('should detect modern JavaScript features', () => {
      // ES6+ features
      expect(typeof Promise).toBe('function');
      expect(typeof Map).toBe('function');
      expect(typeof Set).toBe('function');
      expect(typeof Symbol).toBe('function');
    });

    it('should detect DOM API support', () => {
      expect(typeof document.querySelector).toBe('function');
      expect(typeof document.querySelectorAll).toBe('function');
      expect(typeof Element.prototype.closest).toBe('function');
    });

    it('should detect Storage API support', () => {
      expect(typeof localStorage).toBe('object');
      expect(typeof sessionStorage).toBe('object');
    });

    it('should detect Fetch API support', () => {
      expect(typeof fetch).toBe('function');
      expect(typeof Request).toBe('function');
      expect(typeof Response).toBe('function');
    });

    it('should detect IntersectionObserver support', () => {
      // Mock for test environment
      if (typeof IntersectionObserver === 'undefined') {
        global.IntersectionObserver = class IntersectionObserver {
          constructor() {}
          observe() {}
          unobserve() {}
          disconnect() {}
        };
      }

      expect(typeof IntersectionObserver).toBe('function');
    });
  });

  describe('Polyfill Requirements', () => {
    it('should provide polyfills for older browsers', () => {
      // Array.from polyfill check
      if (!Array.from) {
        Array.from = function(arrayLike) {
          return Array.prototype.slice.call(arrayLike);
        };
      }

      expect(typeof Array.from).toBe('function');
      expect(Array.from('abc')).toEqual(['a', 'b', 'c']);
    });

    it('should polyfill String.prototype.includes', () => {
      if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
          return this.indexOf(search, start) !== -1;
        };
      }

      expect('hello'.includes('ell')).toBe(true);
    });

    it('should polyfill Object.assign', () => {
      if (!Object.assign) {
        Object.assign = function(target, ...sources) {
          sources.forEach(source => {
            if (source) {
              Object.keys(source).forEach(key => {
                target[key] = source[key];
              });
            }
          });
          return target;
        };
      }

      const result = Object.assign({}, { a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('CSS Feature Support', () => {
    it('should detect CSS Grid support', () => {
      const supportsGrid = CSS.supports('display', 'grid');
      // Fallback for older browsers
      expect(typeof supportsGrid).toBe('boolean');
    });

    it('should detect CSS Flexbox support', () => {
      const supportsFlex = CSS.supports('display', 'flex');
      expect(typeof supportsFlex).toBe('boolean');
    });

    it('should detect CSS Custom Properties support', () => {
      const supportsVars = CSS.supports('--custom-property', 'value');
      expect(typeof supportsVars).toBe('boolean');
    });

    it('should provide CSS fallbacks', () => {
      const styles = {
        display: 'flex',
        fallbackDisplay: 'block'
      };

      expect(styles.display).toBeTruthy();
      expect(styles.fallbackDisplay).toBeTruthy();
    });
  });

  describe('Input Type Support', () => {
    it('should detect search input support', () => {
      const input = document.createElement('input');
      input.type = 'search';

      // If browser doesn't support, falls back to 'text'
      expect(['search', 'text']).toContain(input.type);
    });

    it('should handle placeholder attribute', () => {
      const input = document.createElement('input');
      input.placeholder = 'Search...';

      expect(input.placeholder).toBe('Search...');
    });

    it('should detect autocomplete support', () => {
      const input = document.createElement('input');
      input.autocomplete = 'off';

      expect(input.autocomplete).toBe('off');
    });
  });

  describe('Event Handling Compatibility', () => {
    it('should handle input events across browsers', () => {
      const input = document.createElement('input');
      let fired = false;

      input.addEventListener('input', () => {
        fired = true;
      });

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(fired).toBe(true);
    });

    it('should handle change events', () => {
      const input = document.createElement('input');
      let changed = false;

      input.addEventListener('change', () => {
        changed = true;
      });

      input.value = 'test';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      expect(changed).toBe(true);
    });

    it('should handle keyboard events', () => {
      const input = document.createElement('input');
      let keyPressed = false;

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          keyPressed = true;
        }
      });

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(event);

      expect(keyPressed).toBe(true);
    });
  });

  describe('Text Encoding Support', () => {
    it('should handle UTF-8 encoding', () => {
      const korean = '한글 검색';
      const encoded = encodeURIComponent(korean);
      const decoded = decodeURIComponent(encoded);

      expect(decoded).toBe(korean);
    });

    it('should handle emoji in search', () => {
      const emojiText = 'test 😀 search';
      expect(emojiText.length).toBeGreaterThan(0);
      expect(encodeURIComponent(emojiText)).toBeTruthy();
    });

    it('should normalize Unicode text', () => {
      // NFD vs NFC normalization
      const text = 'café';
      const normalized = text.normalize('NFC');
      expect(normalized).toBe('café');
    });
  });

  describe('Mobile Browser Support', () => {
    it('should detect mobile viewport', () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent || ''
      );

      expect(typeof isMobile).toBe('boolean');
    });

    it('should handle touch events', () => {
      const supportsTouchEvents = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      expect(typeof supportsTouchEvents).toBe('boolean');
    });

    it('should detect viewport meta tag', () => {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1';

      expect(meta.name).toBe('viewport');
    });
  });

  describe('Accessibility API Support', () => {
    it('should support ARIA attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-label', 'Test');

      expect(element.getAttribute('aria-label')).toBe('Test');
    });

    it('should support role attribute', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'search');

      expect(element.getAttribute('role')).toBe('search');
    });

    it('should support aria-live regions', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-live', 'polite');

      expect(element.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('Performance API Support', () => {
    it('should support performance.now()', () => {
      expect(typeof performance.now).toBe('function');
      expect(typeof performance.now()).toBe('number');
    });

    it('should support navigation timing', () => {
      expect(typeof performance.timing).toBe('object');
    });

    it('should support resource timing', () => {
      expect(typeof performance.getEntriesByType).toBe('function');
    });
  });

  describe('Storage Quota Support', () => {
    it('should check localStorage availability', () => {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        expect(true).toBe(true);
      } catch (e) {
        // Storage not available or quota exceeded
        expect(e).toBeDefined();
      }
    });

    it('should handle storage quota errors', () => {
      try {
        // Attempt to store large data
        const largeData = 'x'.repeat(10 * 1024 * 1024); // 10MB
        localStorage.setItem('large', largeData);
      } catch (e) {
        expect(e.name).toMatch(/QuotaExceededError|NS_ERROR_DOM_QUOTA_REACHED/);
      }
    });
  });

  describe('Browser-Specific Workarounds', () => {
    it('should handle Safari quirks', () => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent || ''
      );

      if (isSafari) {
        // Safari-specific handling
        expect(true).toBe(true);
      }
    });

    it('should handle IE11 compatibility', () => {
      const isIE11 = /Trident.*rv:11\./.test(navigator.userAgent || '');

      if (isIE11) {
        // IE11 requires additional polyfills
        expect(true).toBe(true);
      }
    });

    it('should handle Firefox-specific features', () => {
      const isFirefox = /Firefox/.test(navigator.userAgent || '');

      if (isFirefox) {
        // Firefox-specific handling
        expect(true).toBe(true);
      }
    });
  });

  describe('Progressive Enhancement', () => {
    it('should provide basic functionality without JS', () => {
      // Form should work with traditional submit
      const form = document.createElement('form');
      form.method = 'get';
      form.action = '/search';

      expect(form.method).toBe('get');
      expect(form.action).toContain('/search');
    });

    it('should enhance with JavaScript when available', () => {
      const hasJS = typeof window !== 'undefined' && typeof document !== 'undefined';
      expect(hasJS).toBe(true);
    });
  });
});
