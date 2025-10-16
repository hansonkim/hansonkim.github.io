/**
 * Jest Configuration for Search Functionality Tests
 * @description Comprehensive test configuration supporting unit, integration, and performance tests
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Root directory
  rootDir: '..',

  // Test match patterns
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js'
  ],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/tests/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!**/node_modules/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module paths
  modulePaths: ['<rootDir>'],

  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Performance monitoring
  maxWorkers: '50%',

  // Reporter configuration
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Search Functionality Test Report',
      outputPath: 'tests/coverage/test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true
    }]
  ]
};
