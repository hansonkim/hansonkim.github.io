# 🛠️ Development Workflow 가이드

## 📋 목차

- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [Git Workflow](#git-workflow)
- [SPARC 개발 모드](#sparc-개발-모드)
- [Swarm Development](#swarm-development)
- [테스트 전략](#테스트-전략)
- [코드 표준](#코드-표준)
- [CI/CD Pipeline](#cicd-pipeline)
- [릴리스 프로세스](#릴리스-프로세스)
- [모범 사례](#모범-사례)
- [문제 해결](#문제-해결)

---

## 개발 환경 설정

### 필수 요구사항

- **Node.js**: 18.x LTS 이상
- **npm**: 9.x 이상
- **Git**: 2.x 이상
- **Claude Code**: 최신 버전
- **VS Code** (권장) 또는 다른 코드 편집기

### 초기 설정

```bash
# Repository clone
git clone https://github.com/ruvnet/claude-flow.git
cd claude-flow

# Dependencies 설치
npm install

# Claude Code 설치 (전역)
npm install -g @anthropic-ai/claude-code

# MCP 서버 추가
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add ruv-swarm npx ruv-swarm mcp start

# 개발 환경 초기화
npx claude-flow@alpha init --force

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 API key 설정
```

### VS Code 설정

**.vscode/settings.json**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.swarm": true
  }
}
```

**.vscode/extensions.json**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "yoavbls.pretty-ts-errors",
    "streetsidesoftware.code-spell-checker",
    "github.copilot"
  ]
}
```

### 환경 변수

**.env.development**:
```bash
# Development environment
NODE_ENV=development
LOG_LEVEL=debug

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Development features
ENABLE_HOT_RELOAD=true
ENABLE_DEBUG_MODE=true
ENABLE_TELEMETRY=true

# Local services
DATABASE_URL=postgresql://localhost:5432/claude_flow_dev
REDIS_URL=redis://localhost:6379

# Testing
TEST_TIMEOUT=30000
JEST_WORKERS=4
```

---

## 프로젝트 구조

```
claude-flow/
├── src/                      # Source code
│   ├── commands/            # CLI commands
│   ├── core/                # Core functionality
│   ├── agents/              # Agent implementations
│   ├── swarm/               # Swarm coordination
│   ├── memory/              # Memory system
│   ├── neural/              # Neural features
│   └── utils/               # Utilities
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   ├── e2e/                # End-to-end tests
│   └── performance/        # Performance tests
├── docs/                    # Documentation
│   ├── api/                # API documentation
│   ├── guides/             # User guides
│   ├── architecture/       # Architecture docs
│   └── reference/          # Reference docs
├── examples/               # Example projects
├── scripts/                # Build and utility scripts
├── .claude/                # Claude Code configuration
│   ├── agents/             # Agent definitions
│   ├── commands/           # Slash commands
│   └── hooks/              # Workflow hooks
├── .swarm/                 # Swarm runtime data
│   └── memory.db           # ReasoningBank database
└── dist/                   # Compiled output
```

### 주요 디렉토리 설명

- **src/commands/**: CLI 명령어 구현 (swarm, hive-mind, memory, analysis 등)
- **src/core/**: 핵심 기능 (orchestration, coordination, scheduling)
- **src/agents/**: 54+ agent 구현 (coder, researcher, tester 등)
- **src/swarm/**: Swarm topology 관리 (mesh, hierarchical, adaptive 등)
- **src/memory/**: ReasoningBank 통합 및 영구 storage
- **src/neural/**: Neural pattern recognition 및 training
- **tests/**: 모든 테스트 파일 (각 src/ 파일과 대응)

---

## Git Workflow

### Branch 전략

```
main                    # Stable production code
├── develop             # Active development
├── feature/*          # Feature branches
├── bugfix/*           # Bug fixes
├── hotfix/*           # Production hotfixes
└── release/*          # Release preparation
```

### Branch 명명 규칙

```bash
# Feature development
feature/add-neural-patterns
feature/improve-swarm-coordination

# Bug fixes
bugfix/fix-memory-leak
bugfix/resolve-agent-timeout

# Hotfixes (production)
hotfix/critical-security-fix

# Releases
release/v2.7.0
```

### Commit 메시지 규칙

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Code style (formatting, no logic change)
refactor: # Code refactoring
perf:     # Performance improvement
test:     # Adding/updating tests
chore:    # Build process, dependencies, etc.
ci:       # CI/CD changes

# Examples:
feat(swarm): add adaptive topology optimization
fix(memory): resolve semantic search bug
docs(api): update MCP tools documentation
perf(neural): optimize pattern recognition speed
test(agents): add integration tests for coordinators
```

### 개발 워크플로

```bash
# 1. Feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# 2. 변경사항 커밋
git add .
git commit -m "feat(scope): description"

# 3. 최신 develop와 rebase
git fetch origin
git rebase origin/develop

# 4. Push 및 Pull Request 생성
git push origin feature/my-new-feature
# GitHub에서 PR 생성

# 5. Code review 및 approval 후 merge
# PR이 main 또는 develop으로 merge됨

# 6. Local 브랜치 정리
git checkout develop
git pull origin develop
git branch -d feature/my-new-feature
```

---

## SPARC 개발 모드

### 사용 가능한 모드 (16개)

```bash
# 모든 모드 나열
npx claude-flow@alpha sparc modes

# 모드 카테고리:
# 1. 전체 워크플로 (5)
- spec-pseudocode    # Specification + Pseudocode
- dev                # Complete development flow
- api                # API development
- ui                 # UI development
- refactor           # Refactoring

# 2. 개별 단계 (8)
- spec               # Specification only
- pseudo             # Pseudocode only
- architect          # Architecture design
- code               # Implementation
- test               # Testing
- review             # Code review
- integration        # Integration
- completion         # Final completion

# 3. TDD 워크플로 (3)
- tdd                # Test-Driven Development
- tdd-london         # London School TDD (mocking)
- tdd-detroit        # Detroit School TDD (state)
```

### SPARC 워크플로 예제

```bash
# 1. Full Development Flow
npx claude-flow@alpha sparc run dev "Build REST API for user management"

# 2. API Development
npx claude-flow@alpha sparc run api "Create authentication endpoints"

# 3. TDD Workflow
npx claude-flow@alpha sparc tdd "Implement token validation"

# 4. Individual Steps
npx claude-flow@alpha sparc run spec "Define user story requirements"
npx claude-flow@alpha sparc run pseudo "Design authentication algorithm"
npx claude-flow@alpha sparc run architect "Design microservices architecture"
npx claude-flow@alpha sparc run code "Implement user service"
npx claude-flow@alpha sparc run test "Create comprehensive test suite"

# 5. Batch Execution (parallel)
npx claude-flow@alpha sparc batch spec,pseudo,architect "Multi-tenant system"

# 6. Pipeline (sequential)
npx claude-flow@alpha sparc pipeline "E-commerce checkout flow"
```

### SPARC Mode 상세

#### 1. **dev** (Complete Development)
```bash
npx claude-flow@alpha sparc run dev "Feature description"

# 실행 단계:
# 1. Specification analysis
# 2. Pseudocode design
# 3. Architecture design
# 4. TDD implementation
# 5. Code review
# 6. Integration
# 7. Documentation
```

#### 2. **api** (API Development)
```bash
npx claude-flow@alpha sparc run api "REST API description"

# 포함사항:
# - OpenAPI/Swagger schema
# - Endpoint implementation
# - Request/response validation
# - Authentication/authorization
# - Error handling
# - API documentation
```

#### 3. **tdd** (Test-Driven Development)
```bash
npx claude-flow@alpha sparc tdd "Feature with tests"

# TDD 사이클:
# 1. Red: Write failing test
# 2. Green: Make test pass
# 3. Refactor: Improve code quality
# 4. Repeat
```

---

## Swarm Development

### Swarm 초기화

```bash
# Topology 옵션: mesh, hierarchical, ring, star, adaptive
npx claude-flow@alpha swarm init --topology mesh --max-agents 8

# Agent 생성
npx claude-flow@alpha swarm spawn coder "Implement feature X"
npx claude-flow@alpha swarm spawn tester "Create test suite"
npx claude-flow@alpha swarm spawn reviewer "Review implementation"

# 상태 확인
npx claude-flow@alpha swarm status
```

### Hive-Mind Development

```bash
# Interactive wizard
npx claude-flow@alpha hive-mind wizard

# Quick spawn
npx claude-flow@alpha hive-mind spawn "Build full-stack app" --claude

# Session 관리
npx claude-flow@alpha hive-mind status
npx claude-flow@alpha hive-mind resume session-xxxxx
npx claude-flow@alpha hive-mind sessions --list
```

### Memory 활용

```bash
# Store development decisions
npx claude-flow@alpha memory store architecture "Using microservices pattern" \
  --namespace project --reasoningbank

# Query past decisions
npx claude-flow@alpha memory query "architecture" \
  --namespace project --reasoningbank

# Export session memory
npx claude-flow@alpha memory export session-xxxxx --format json
```

---

## 테스트 전략

### 테스트 유형

#### 1. Unit Tests
```javascript
// tests/unit/agents/coder.test.js
import { describe, it, expect } from '@jest/globals';
import { CoderAgent } from '../../../src/agents/coder.js';

describe('CoderAgent', () => {
  it('should generate code from specification', async () => {
    const agent = new CoderAgent();
    const spec = {
      type: 'function',
      name: 'calculateTotal',
      params: ['items'],
      returns: 'number'
    };

    const code = await agent.generateCode(spec);

    expect(code).toContain('function calculateTotal');
    expect(code).toContain('return');
  });

  it('should validate generated code syntax', async () => {
    const agent = new CoderAgent();
    const code = 'function test() { return 42; }';

    const isValid = await agent.validateSyntax(code);

    expect(isValid).toBe(true);
  });
});
```

#### 2. Integration Tests
```javascript
// tests/integration/swarm-coordination.test.js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { SwarmOrchestrator } from '../../src/swarm/orchestrator.js';
import { MemoryManager } from '../../src/memory/manager.js';

describe('Swarm Coordination', () => {
  let swarm;
  let memory;

  beforeAll(async () => {
    swarm = new SwarmOrchestrator({ topology: 'mesh' });
    memory = new MemoryManager({ persistToDisk: true });
    await swarm.initialize();
  });

  afterAll(async () => {
    await swarm.destroy();
    await memory.close();
  });

  it('should coordinate multiple agents', async () => {
    const agents = [
      await swarm.spawnAgent('coder'),
      await swarm.spawnAgent('tester'),
      await swarm.spawnAgent('reviewer')
    ];

    const task = {
      description: 'Build feature X',
      steps: ['design', 'implement', 'test', 'review']
    };

    const result = await swarm.orchestrate(task);

    expect(result.status).toBe('completed');
    expect(result.stepsCompleted).toBe(4);
  });

  it('should share memory between agents', async () => {
    const coder = await swarm.spawnAgent('coder');
    const tester = await swarm.spawnAgent('tester');

    await memory.store('design-decisions', {
      architecture: 'microservices',
      database: 'postgresql'
    });

    const decisions = await memory.retrieve('design-decisions');

    expect(decisions.architecture).toBe('microservices');
  });
});
```

#### 3. E2E Tests
```javascript
// tests/e2e/full-workflow.test.js
import { describe, it, expect } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('End-to-End Workflow', () => {
  it('should complete full SPARC development cycle', async () => {
    const { stdout } = await execAsync(
      'npx claude-flow@alpha sparc run dev "Simple calculator"'
    );

    expect(stdout).toContain('✅ Specification');
    expect(stdout).toContain('✅ Pseudocode');
    expect(stdout).toContain('✅ Architecture');
    expect(stdout).toContain('✅ Implementation');
    expect(stdout).toContain('✅ Tests');
  }, 120000); // 2 minute timeout

  it('should persist memory across sessions', async () => {
    // Session 1: Store data
    await execAsync(
      'npx claude-flow@alpha memory store test "value" --reasoningbank'
    );

    // Session 2: Retrieve data
    const { stdout } = await execAsync(
      'npx claude-flow@alpha memory query "test" --reasoningbank'
    );

    expect(stdout).toContain('value');
  });
});
```

#### 4. Performance Tests
```javascript
// tests/performance/swarm-scaling.test.js
import { describe, it, expect } from '@jest/globals';
import { SwarmOrchestrator } from '../../src/swarm/orchestrator.js';

describe('Swarm Scaling Performance', () => {
  it('should handle 10 concurrent agents', async () => {
    const swarm = new SwarmOrchestrator({ topology: 'mesh' });
    const startTime = Date.now();

    const agents = await Promise.all(
      Array(10).fill(0).map(() => swarm.spawnAgent('coder'))
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(agents).toHaveLength(10);
    expect(duration).toBeLessThan(5000); // Under 5 seconds
  });

  it('should maintain low latency under load', async () => {
    const swarm = new SwarmOrchestrator({ topology: 'mesh' });
    const iterations = 100;
    const latencies = [];

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await swarm.orchestrate({ description: 'Simple task' });
      latencies.push(Date.now() - start);
    }

    const avgLatency = latencies.reduce((a, b) => a + b) / latencies.length;
    const p95 = latencies.sort((a, b) => a - b)[Math.floor(iterations * 0.95)];

    expect(avgLatency).toBeLessThan(100); // Under 100ms average
    expect(p95).toBeLessThan(200); // Under 200ms p95
  });
});
```

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# Unit tests만
npm run test:unit

# Integration tests만
npm run test:integration

# E2E tests만
npm run test:e2e

# Performance tests만
npm run test:performance

# Coverage 리포트
npm run test:coverage

# Watch mode (개발 중)
npm run test:watch

# 특정 파일
npm test -- tests/unit/agents/coder.test.js

# 특정 describe block
npm test -- --testNamePattern="CoderAgent"
```

### Jest 구성

**jest.config.js**:
```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 30000,
  maxWorkers: '50%',
};
```

---

## 코드 표준

### TypeScript/JavaScript 표준

**.eslintrc.json**:
```json
{
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": [
    "eslint:recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "brace-style": ["error", "1tbs"],
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"]
  }
}
```

**.prettierrc.json**:
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 코드 스타일 가이드

```javascript
// ✅ Good
async function processTask(task) {
  try {
    const result = await executor.run(task);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Task processing failed:', error);
    return { success: false, error: error.message };
  }
}

// ❌ Bad
function processTask(task) {
  return executor.run(task)
    .then(result => ({ success: true, data: result }))
    .catch(error => {
      console.log(error);
      return { success: false, error };
    });
}

// ✅ Good - Named exports
export class CoderAgent {
  constructor(options) {
    this.options = options;
  }

  async generateCode(spec) {
    // Implementation
  }
}

// ❌ Bad - Default export
export default class {
  // Anonymous class
}

// ✅ Good - Descriptive variable names
const userAuthentication = new AuthService();
const taskExecutionResults = await processAllTasks();

// ❌ Bad - Abbreviated names
const auth = new AuthService();
const results = await process();
```

### Documentation 표준

```javascript
/**
 * Orchestrates a swarm of AI agents to complete a complex task.
 *
 * @param {Object} config - Swarm configuration
 * @param {string} config.topology - Swarm topology (mesh, hierarchical, adaptive)
 * @param {number} config.maxAgents - Maximum number of concurrent agents
 * @param {Object} task - Task to orchestrate
 * @param {string} task.description - Task description
 * @param {Array<string>} task.requirements - Task requirements
 *
 * @returns {Promise<Object>} Orchestration result
 * @returns {string} result.status - Completion status (completed, failed, partial)
 * @returns {Array<Object>} result.agentResults - Individual agent results
 * @returns {Object} result.metrics - Performance metrics
 *
 * @throws {SwarmInitializationError} If swarm cannot be initialized
 * @throws {TaskExecutionError} If task execution fails
 *
 * @example
 * const result = await orchestrateSwarm(
 *   { topology: 'mesh', maxAgents: 5 },
 *   { description: 'Build REST API', requirements: ['auth', 'validation'] }
 * );
 */
export async function orchestrateSwarm(config, task) {
  // Implementation
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/ci.yml**:
```yaml
name: 🔄 CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: 📝 Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    name: 🧪 Run Tests
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: ['18', '20']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    name: 🏗️ Build Package
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

### Pre-commit Hooks

**.husky/pre-commit**:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run linting
npm run lint-staged

# Run type checking
npm run typecheck

# Run affected tests
npm run test:changed
```

**lint-staged.config.js**:
```javascript
export default {
  '*.js': [
    'eslint --fix',
    'prettier --write',
    'jest --bail --findRelatedTests'
  ],
  '*.{json,md}': [
    'prettier --write'
  ]
};
```

---

## 릴리스 프로세스

### Alpha 릴리스

```bash
# 1. Version bump
npm version prerelease --preid=alpha

# 2. Build package
npm run build

# 3. Publish to npm
npm publish --tag alpha

# 4. Create GitHub release
gh release create v2.7.0-alpha.11 \
  --title "v2.7.0-alpha.11" \
  --notes "Release notes here" \
  --prerelease
```

### Production 릴리스

```bash
# 1. Merge release branch to main
git checkout main
git merge release/v2.7.0

# 2. Version bump
npm version minor  # or major/patch

# 3. Build and test
npm run build
npm run test:all

# 4. Publish
npm publish

# 5. Create GitHub release
gh release create v2.7.0 \
  --title "v2.7.0 - Feature Release" \
  --notes-file RELEASE_NOTES.md
```

---

## 모범 사례

### 1. 코드 구성
- Small, focused functions (< 50 lines)
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Clear naming conventions

### 2. 에러 처리
```javascript
// ✅ Good
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed:', { error, context });
  throw new CustomError('Descriptive message', { cause: error });
}

// ❌ Bad
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.log(error);
  return null;
}
```

### 3. Async/Await
```javascript
// ✅ Good - Parallel execution
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);

// ❌ Bad - Sequential execution
const users = await fetchUsers();
const posts = await fetchPosts();
const comments = await fetchComments();
```

### 4. Memory 관리
```javascript
// ✅ Good - Cleanup resources
async function processLargeDataset(data) {
  const processor = new DataProcessor();

  try {
    return await processor.process(data);
  } finally {
    await processor.cleanup();
  }
}

// ❌ Bad - Resource leak
async function processLargeDataset(data) {
  const processor = new DataProcessor();
  return await processor.process(data);
  // processor never cleaned up
}
```

---

## 문제 해결

### 일반적인 개발 문제

#### 1. Module Resolution Errors
```bash
# 증상: Cannot find module errors
# 해결:
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Jest ESM Issues
```bash
# 증상: Jest fails with ESM syntax
# 해결: jest.config.js 확인
{
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  }
}
```

#### 3. Memory Leaks
```bash
# 증상: Node process memory grows over time
# 해결: Memory profiling
node --expose-gc --inspect src/index.js

# Chrome DevTools에서 heap snapshot 분석
```

#### 4. Slow Tests
```bash
# 증상: Tests take too long
# 해결:
# - Parallel execution
npm test -- --maxWorkers=50%

# - Mock external dependencies
# - Reduce test data size
# - Use test.concurrent for independent tests
```

---

## 추가 리소스

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**문서 버전**: 2.7.0
**마지막 업데이트**: 2025-01-15
