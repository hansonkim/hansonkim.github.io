/**
 * Jest Test Setup
 * @description Global test setup and utilities
 */

// Polyfills for jsdom
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Performance API mock
if (!global.performance) {
  global.performance = {
    now: () => Date.now()
  };
}

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass
    };
  },

  toContainKoreanText(received) {
    const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/;
    const pass = koreanRegex.test(received);
    return {
      message: () => `expected ${received} to contain Korean characters`,
      pass
    };
  },

  toBeAccessible(received) {
    const hasAriaLabel = received.hasAttribute('aria-label') ||
                         received.hasAttribute('aria-labelledby');
    const hasRole = received.hasAttribute('role');
    const pass = hasAriaLabel || hasRole;
    return {
      message: () => `expected element to have accessibility attributes`,
      pass
    };
  }
});

// Console error/warning tracking
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn((...args) => {
    originalConsoleError.apply(console, args);
  });

  console.warn = jest.fn((...args) => {
    originalConsoleWarn.apply(console, args);
  });
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllTimers();
});
