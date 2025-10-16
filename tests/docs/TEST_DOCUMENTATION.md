# Search Functionality Test Documentation

## Overview

Comprehensive test suite for the blog search functionality, including support for Korean/English bilingual search, accessibility, performance, and security.

## Test Structure

```
tests/
├── jest.config.js           # Jest configuration
├── setup.js                 # Global test setup
├── fixtures/
│   └── test-data.js         # Test fixtures and mock data
├── unit/
│   ├── search-algorithm.test.js    # Core search algorithm tests
│   ├── korean-text.test.js         # Korean text handling tests
│   ├── edge-cases.test.js          # Edge cases and security tests
│   ├── performance.test.js         # Performance benchmark tests
│   └── accessibility.test.js       # Accessibility (A11y) tests
├── integration/
│   ├── search-ui.test.js           # UI integration tests
│   ├── search-api.test.js          # API integration tests
│   └── browser-compat.test.js      # Browser compatibility tests
├── e2e/                            # (To be added) End-to-end tests
└── docs/
    └── TEST_DOCUMENTATION.md       # This file
```

## Test Categories

### 1. Unit Tests

#### Search Algorithm Tests (`search-algorithm.test.js`)
- **Basic Search Functionality**: Case-insensitive search, multi-word queries, relevance scoring
- **Korean Text Search**: Hangul support, syllable decomposition, initial consonant (초성) search
- **Index Management**: Index building, updates, empty index handling
- **Performance**: Sub-100ms search times, large dataset handling, no performance degradation
- **Relevance Scoring**: Title/content/tag weighting, recency boosting
- **Query Processing**: Whitespace normalization, stop word removal

**Coverage Target**: 90%+

#### Korean Text Handling Tests (`korean-text.test.js`)
- **Hangul Decomposition**: Syllable to jamo (자모) decomposition
- **Initial Consonant Search**: 초성 pattern matching (e.g., "ㅎㄱ" matches "한글")
- **Text Normalization**: Whitespace handling, case normalization
- **Character Detection**: Hangul syllable and jamo identification
- **Mixed Language Support**: Korean-English bilingual content
- **Edge Cases**: Single characters, special punctuation, Korean numbers
- **Performance**: Efficient processing of Korean text

**Coverage Target**: 95%+

#### Edge Cases and Security Tests (`edge-cases.test.js`)
- **Empty/Null Inputs**: Graceful handling of empty strings, null, undefined
- **Special Characters**: Unicode, emoji, special symbols
- **XSS Prevention**: Script injection, event handlers, javascript: protocol
- **SQL Injection Prevention**: Parameterized queries, input sanitization
- **Path Traversal Prevention**: Directory traversal attempts
- **Query Length Limits**: Maximum query length enforcement
- **Type Safety**: Non-string input handling
- **ReDoS Protection**: Regular expression safety
- **Unicode Handling**: Multi-language support, RTL text, zero-width characters
- **Memory Safety**: No memory leaks, concurrent request handling
- **Error Recovery**: Graceful error handling

**Coverage Target**: 85%+

#### Performance Tests (`performance.test.js`)
- **Index Building**: <10ms for small datasets, <1s for 10k posts, linear scaling
- **Search Performance**: <100ms per query, <10ms average for 100 searches
- **Memory Efficiency**: <50MB for large datasets, no memory leaks
- **Throughput**: >1000 results/second
- **Caching**: Cache hit improvements, efficient invalidation
- **Optimization**: Efficient data structures (Map for O(1) lookup)
- **Scalability**: 100k+ post handling

**Coverage Target**: 80%+

**Benchmarks**:
- Maximum search time: 100ms
- Maximum memory usage: 50MB
- Minimum throughput: 1000 results/second

#### Accessibility Tests (`accessibility.test.js`)
- **ARIA Attributes**: role, aria-label, aria-describedby, aria-expanded, aria-controls, aria-live
- **Keyboard Navigation**: Tab, Enter, ArrowUp, ArrowDown, Escape, Home, End
- **Screen Reader Support**: Announcements, result counts, instructions
- **Focus Management**: Focus trap, focus restoration
- **Color Contrast**: WCAG 2.1 AA compliance
- **Form Labels**: Explicit labels, accessible buttons
- **Error Handling**: Accessible error messages
- **Mobile**: Touch-friendly targets, voice input support
- **WCAG 2.1 AA**: Perceivable, Operable, Understandable, Robust

**Coverage Target**: 90%+

### 2. Integration Tests

#### Search UI Integration (`search-ui.test.js`)
- **User Interaction**: Dropdown display, search-as-you-type, result selection
- **Result Display**: Correct rendering, "no results" message, result limiting
- **Performance**: Input debouncing, non-blocking UI
- **Mobile**: Responsive behavior, touch events
- **State Management**: Search state persistence, back navigation
- **Error Handling**: Graceful error display

**Coverage Target**: 85%+

#### Search API Integration (`search-api.test.js`)
- **API Endpoints**: Correct parameter passing, response handling
- **Request Parameters**: URL encoding, special characters, pagination
- **Response Handling**: JSON parsing, empty results, malformed responses
- **Caching**: Result caching, cache invalidation, TTL
- **Rate Limiting**: 429 handling, client-side rate limiting
- **Authentication**: Token inclusion, 401 handling
- **Data Transformation**: API to UI format conversion
- **Timeout Handling**: Long-running request timeouts

**Coverage Target**: 80%+

#### Browser Compatibility (`browser-compat.test.js`)
- **Feature Detection**: ES6+, DOM APIs, Storage API, Fetch API, IntersectionObserver
- **Polyfills**: Array.from, String.includes, Object.assign
- **CSS Support**: Grid, Flexbox, Custom Properties, fallbacks
- **Input Types**: Search input, placeholder, autocomplete
- **Event Handling**: Input, change, keyboard events
- **Text Encoding**: UTF-8, emoji, Unicode normalization
- **Mobile**: Viewport detection, touch events
- **Accessibility APIs**: ARIA attributes, roles, live regions
- **Performance APIs**: performance.now(), navigation timing
- **Storage**: localStorage availability, quota errors
- **Browser-Specific**: Safari/IE11/Firefox workarounds
- **Progressive Enhancement**: Basic functionality without JS

**Coverage Target**: 75%+

**Supported Browsers**:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+
- iOS Safari 15+
- Chrome Mobile

### 3. End-to-End Tests

(To be implemented)
- Full user workflows
- Cross-page navigation
- Real browser testing (Playwright/Cypress)

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Unit tests only
npm test -- tests/unit

# Integration tests only
npm test -- tests/integration

# Specific file
npm test -- tests/unit/search-algorithm.test.js
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Run in Watch Mode
```bash
npm test -- --watch
```

### Run Performance Tests
```bash
npm test -- tests/unit/performance.test.js
```

## Coverage Requirements

| Metric       | Target | Current |
|-------------|--------|---------|
| Statements  | >80%   | TBD     |
| Branches    | >75%   | TBD     |
| Functions   | >80%   | TBD     |
| Lines       | >80%   | TBD     |

## Custom Matchers

### `toBeWithinRange(floor, ceiling)`
Tests if a number is within specified range.

```javascript
expect(duration).toBeWithinRange(0, 100);
```

### `toContainKoreanText()`
Tests if string contains Korean characters.

```javascript
expect(text).toContainKoreanText();
```

### `toBeAccessible()`
Tests if element has accessibility attributes.

```javascript
expect(element).toBeAccessible();
```

## Test Data

### Sample Posts
- 5 bilingual posts (Korean/English)
- Mix of technical and general content
- Various tags and dates

### Search Queries
- **Korean**: Claude, 한글, 검색, 최적화, 개발, 초성 (ㅋㅌㄹㄹㄷ, ㅎㄱ)
- **English**: testing, performance, javascript, optimization
- **Mixed**: claude flow, ai 에이전트, database 최적화
- **Edge Cases**: empty, whitespace, special chars, XSS, SQL injection, path traversal

### Performance Benchmarks
- Maximum search time: 100ms
- Maximum memory usage: 50MB
- Minimum throughput: 1000 results/second

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on others
2. **Descriptive Names**: Use clear, descriptive test names
3. **AAA Pattern**: Arrange, Act, Assert structure
4. **Mock External Dependencies**: Isolate unit tests from external systems
5. **Performance Testing**: Regular performance regression testing
6. **Accessibility Testing**: Test with screen readers and keyboard-only navigation
7. **Security Testing**: Regular security audit tests
8. **Korean Text Testing**: Comprehensive Hangul support testing

## Known Issues

1. **Performance Tests**: May be flaky on slow CI environments
2. **Browser Tests**: jsdom doesn't fully replicate browser behavior
3. **Korean IME**: Input method editor behavior needs real browser testing

## Future Improvements

1. Add E2E tests with Playwright
2. Add visual regression tests
3. Add performance monitoring integration
4. Add mutation testing
5. Add fuzzy testing for search algorithms
6. Add load testing for concurrent users
7. Add real device testing for mobile
8. Add Korean IME integration tests

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Korean Text Processing](https://en.wikipedia.org/wiki/Hangul)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

## Maintenance

### Regular Tasks
- Update test data quarterly
- Review and update performance benchmarks
- Audit security tests against latest OWASP guidelines
- Test against latest browser versions
- Review and update accessibility tests for WCAG updates

### Test Review Checklist
- [ ] All tests passing
- [ ] Coverage meets targets
- [ ] No console errors/warnings
- [ ] Performance benchmarks met
- [ ] Accessibility tests passing
- [ ] Security tests passing
- [ ] Korean text tests passing
- [ ] Browser compatibility verified

## Contact

For questions or issues with tests, please contact the development team or open an issue on GitHub.

---

*Last Updated: 2025-10-16*
*Test Suite Version: 1.0.0*
