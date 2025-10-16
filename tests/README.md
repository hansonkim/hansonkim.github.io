# Search Functionality Test Suite

Comprehensive test suite for the blog search functionality with Korean/English bilingual support.

## Quick Start

```bash
# Install dependencies
cd tests
npm install

# Run all tests
npm test

# Run with coverage
npm test:coverage

# Run in watch mode
npm test:watch
```

## Test Structure

```
tests/
├── unit/                       # Unit tests (200+ tests)
│   ├── search-algorithm.test.js    # Core search logic
│   ├── korean-text.test.js         # Korean text handling
│   ├── edge-cases.test.js          # Security & edge cases
│   ├── performance.test.js         # Performance benchmarks
│   └── accessibility.test.js       # A11y compliance
├── integration/                # Integration tests
│   ├── search-ui.test.js          # UI integration
│   ├── search-api.test.js         # API integration
│   └── browser-compat.test.js     # Browser compatibility
├── fixtures/                   # Test data
├── docs/                       # Documentation
│   ├── TEST_DOCUMENTATION.md      # Full documentation
│   └── TEST_COVERAGE_REPORT.md    # Coverage report
└── package.json               # Test dependencies
```

## Test Scripts

```bash
npm test              # Run all tests
npm test:unit         # Unit tests only
npm test:integration  # Integration tests only
npm test:watch        # Watch mode
npm test:coverage     # Generate coverage report
npm test:perf         # Performance tests
npm test:a11y         # Accessibility tests
npm test:korean       # Korean text tests
npm test:security     # Security/edge case tests
npm test:debug        # Debug mode
npm coverage:open     # Open coverage report
```

## Key Features

### ✅ Comprehensive Coverage
- 200+ test cases
- Unit, integration, and compatibility tests
- Security, performance, and accessibility validation

### ✅ Korean Language Support
- Hangul syllable decomposition
- Initial consonant (초성) search
- Bilingual Korean/English content
- Korean text normalization

### ✅ Security Testing
- XSS prevention
- SQL injection protection
- Path traversal blocking
- Input sanitization
- ReDoS protection

### ✅ Performance Benchmarks
- <100ms search time
- <50MB memory usage
- >1000 results/second throughput
- Scalable to 100k+ posts

### ✅ Accessibility (WCAG 2.1 AA)
- Full keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management
- Color contrast compliance

### ✅ Browser Compatibility
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+
- iOS Safari 15+
- Progressive enhancement

## Coverage Targets

| Metric | Target |
|--------|--------|
| Statements | >80% |
| Branches | >75% |
| Functions | >80% |
| Lines | >80% |

## Custom Matchers

```javascript
expect(duration).toBeWithinRange(0, 100);
expect(text).toContainKoreanText();
expect(element).toBeAccessible();
```

## Documentation

- [Full Test Documentation](docs/TEST_DOCUMENTATION.md)
- [Coverage Report](docs/TEST_COVERAGE_REPORT.md)

## Requirements

- Node.js 16+
- npm 7+
- Jest 29+

## Dependencies

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/dom": "^9.3.0",
    "@testing-library/jest-dom": "^6.1.0",
    "babel-jest": "^29.7.0",
    "jest-html-reporter": "^3.10.0"
  }
}
```

## Contributing

1. Write tests first (TDD)
2. Maintain coverage targets
3. Update documentation
4. Run all tests before committing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Status**: ✅ Complete
**Version**: 1.0.0
**Last Updated**: 2025-10-16
