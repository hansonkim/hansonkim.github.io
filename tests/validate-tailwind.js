/**
 * Tailwind CSS Integration Validation Script
 *
 * This script validates that Tailwind CSS is properly integrated
 * and doesn't conflict with existing styles.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class TailwindValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.projectRoot = path.resolve(__dirname, '..');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log('\n' + '='.repeat(60));
    this.log(`  ${title}`, 'cyan');
    console.log('='.repeat(60) + '\n');
  }

  checkFileExists(filePath, description) {
    const fullPath = path.join(this.projectRoot, filePath);
    if (fs.existsSync(fullPath)) {
      this.passed.push(`✓ ${description}`);
      return true;
    } else {
      this.errors.push(`✗ ${description} - File not found: ${filePath}`);
      return false;
    }
  }

  checkFileContent(filePath, searchPattern, description) {
    const fullPath = path.join(this.projectRoot, filePath);
    if (!fs.existsSync(fullPath)) {
      this.errors.push(`✗ ${description} - File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const found = typeof searchPattern === 'string'
      ? content.includes(searchPattern)
      : searchPattern.test(content);

    if (found) {
      this.passed.push(`✓ ${description}`);
      return true;
    } else {
      this.errors.push(`✗ ${description} - Pattern not found in ${filePath}`);
      return false;
    }
  }

  checkCSSSize() {
    const cssPath = path.join(this.projectRoot, '_site/css/styles.css');

    if (!fs.existsSync(cssPath)) {
      this.warnings.push(`⚠ CSS file not found - run build first: ${cssPath}`);
      return;
    }

    const stats = fs.statSync(cssPath);
    const sizeInKB = (stats.size / 1024).toFixed(2);

    if (stats.size > 100 * 1024) { // > 100KB
      this.warnings.push(`⚠ CSS file is large (${sizeInKB}KB) - consider purging unused styles`);
    } else {
      this.passed.push(`✓ CSS file size is acceptable (${sizeInKB}KB)`);
    }

    return sizeInKB;
  }

  checkTailwindClasses() {
    const cssPath = path.join(this.projectRoot, '_site/css/styles.css');

    if (!fs.existsSync(cssPath)) {
      this.errors.push('✗ Generated CSS file not found - run build first');
      return false;
    }

    const content = fs.readFileSync(cssPath, 'utf8');

    // Check for common Tailwind utility classes
    const tailwindPatterns = [
      { pattern: /\.flex\s*{/, name: 'Flexbox utilities' },
      { pattern: /\.grid\s*{/, name: 'Grid utilities' },
      { pattern: /\.text-/, name: 'Text utilities' },
      { pattern: /\.bg-/, name: 'Background utilities' },
      { pattern: /\.p-\d+/, name: 'Padding utilities' },
      { pattern: /\.m-\d+/, name: 'Margin utilities' },
      { pattern: /@media \(min-width:/, name: 'Responsive breakpoints' }
    ];

    let foundCount = 0;
    tailwindPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(content)) {
        this.passed.push(`✓ ${name} are present`);
        foundCount++;
      } else {
        this.warnings.push(`⚠ ${name} not detected (may not be used yet)`);
      }
    });

    return foundCount > 0;
  }

  checkResponsiveBreakpoints() {
    const cssPath = path.join(this.projectRoot, '_site/css/styles.css');

    if (!fs.existsSync(cssPath)) {
      return false;
    }

    const content = fs.readFileSync(cssPath, 'utf8');

    // Check for Tailwind's default breakpoints
    const breakpoints = [
      { min: '640px', name: 'sm' },
      { min: '768px', name: 'md' },
      { min: '1024px', name: 'lg' },
      { min: '1280px', name: 'xl' }
    ];

    breakpoints.forEach(({ min, name }) => {
      const pattern = new RegExp(`@media.*min-width:.*${min}`);
      if (pattern.test(content)) {
        this.passed.push(`✓ Breakpoint ${name} (${min}) is available`);
      }
    });
  }

  checkProductionOptimization() {
    const tailwindConfigPath = path.join(this.projectRoot, 'tailwind.config.js');

    if (!fs.existsSync(tailwindConfigPath)) {
      this.errors.push('✗ tailwind.config.js not found');
      return false;
    }

    const content = fs.readFileSync(tailwindConfigPath, 'utf8');

    // Check for content/purge configuration
    if (content.includes('content:') || content.includes('purge:')) {
      this.passed.push('✓ Content purge configuration is present');
    } else {
      this.warnings.push('⚠ Content purge configuration not found - may result in large CSS files');
    }

    // Check if source files are specified
    const hasSourcePaths = /['"]\.\/src\/\*\*\/\*\.{njk,html,js}['"]/.test(content) ||
                          /['"]\.\/\*\*\/\*\.{njk,html,js}['"]/.test(content);

    if (hasSourcePaths) {
      this.passed.push('✓ Source file paths configured for purging');
    } else {
      this.warnings.push('⚠ Source file paths may not be properly configured');
    }
  }

  checkNoStyleConflicts() {
    const existingCSSPath = path.join(this.projectRoot, 'src/css');

    if (!fs.existsSync(existingCSSPath)) {
      this.passed.push('✓ No existing CSS directory to conflict with');
      return;
    }

    const cssFiles = fs.readdirSync(existingCSSPath)
      .filter(f => f.endsWith('.css') && f !== 'styles.css' && f !== 'tailwind.css');

    if (cssFiles.length === 0) {
      this.passed.push('✓ No conflicting CSS files detected');
    } else {
      this.warnings.push(`⚠ Found ${cssFiles.length} other CSS file(s): ${cssFiles.join(', ')}`);
      this.log('  Consider reviewing these files for potential conflicts', 'yellow');
    }
  }

  async runAllTests() {
    this.log('🧪 Tailwind CSS Integration Validation', 'blue');
    this.log('Starting comprehensive validation suite...', 'blue');

    // Test 1: Required Files
    this.logSection('1. Required Files Check');
    this.checkFileExists('tailwind.config.js', 'Tailwind config file exists');
    this.checkFileExists('src/css/tailwind.css', 'Tailwind source CSS exists');
    this.checkFileExists('.eleventy.js', 'Eleventy config exists');

    // Test 2: Configuration
    this.logSection('2. Configuration Check');
    this.checkFileContent(
      'tailwind.config.js',
      'content:',
      'Tailwind config has content paths'
    );
    this.checkFileContent(
      '.eleventy.js',
      /addPassthroughCopy.*css/,
      'Eleventy config includes CSS passthrough'
    );

    // Test 3: Build Output
    this.logSection('3. Build Output Check');
    const cssExists = this.checkFileExists('_site/css/styles.css', 'Generated CSS file exists');

    if (cssExists) {
      const size = this.checkCSSSize();
      this.log(`  Generated CSS size: ${size}KB`, 'cyan');
    }

    // Test 4: Tailwind Classes
    this.logSection('4. Tailwind Classes Check');
    this.checkTailwindClasses();

    // Test 5: Responsive Design
    this.logSection('5. Responsive Breakpoints Check');
    this.checkResponsiveBreakpoints();

    // Test 6: Production Optimization
    this.logSection('6. Production Optimization Check');
    this.checkProductionOptimization();

    // Test 7: Style Conflicts
    this.logSection('7. Style Conflicts Check');
    this.checkNoStyleConflicts();

    // Test 8: Package.json Scripts
    this.logSection('8. Build Scripts Check');
    this.checkFileContent(
      'package.json',
      'css:build',
      'CSS build script defined'
    );
    this.checkFileContent(
      'package.json',
      'css:watch',
      'CSS watch script defined'
    );

    // Results Summary
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    this.log('  📊 VALIDATION RESULTS', 'cyan');
    console.log('='.repeat(60) + '\n');

    // Passed tests
    if (this.passed.length > 0) {
      this.log('✅ PASSED CHECKS:', 'green');
      this.passed.forEach(msg => this.log(`  ${msg}`, 'green'));
      console.log();
    }

    // Warnings
    if (this.warnings.length > 0) {
      this.log('⚠️  WARNINGS:', 'yellow');
      this.warnings.forEach(msg => this.log(`  ${msg}`, 'yellow'));
      console.log();
    }

    // Errors
    if (this.errors.length > 0) {
      this.log('❌ ERRORS:', 'red');
      this.errors.forEach(msg => this.log(`  ${msg}`, 'red'));
      console.log();
    }

    // Summary
    const total = this.passed.length + this.warnings.length + this.errors.length;
    const passRate = total > 0 ? ((this.passed.length / total) * 100).toFixed(1) : 0;

    console.log('='.repeat(60));
    this.log(`  📈 Summary: ${this.passed.length}/${total} checks passed (${passRate}%)`, 'cyan');
    console.log('='.repeat(60) + '\n');

    // Exit code
    if (this.errors.length > 0) {
      this.log('❌ Validation FAILED - Please fix the errors above', 'red');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      this.log('⚠️  Validation passed with warnings', 'yellow');
      process.exit(0);
    } else {
      this.log('✅ All validations PASSED!', 'green');
      process.exit(0);
    }
  }
}

// Run validation
const validator = new TailwindValidator();
validator.runAllTests().catch(error => {
  console.error('❌ Validation script error:', error);
  process.exit(1);
});
