# 📖 Claude-Flow 사용자 가이드

## Claude-Flow v2.0.0 완전 실용 가이드

Claude-Flow 종합 사용자 가이드에 오신 것을 환영합니다! 이 문서는 기본 설치부터 고급 swarm 협업까지, 플랫폼을 시작하고 마스터하는 데 필요한 모든 것을 제공합니다.

---

## 📋 목차

1. [시작하기](#-시작하기)
2. [기본 개념](#-기본-개념)
3. [일반적인 워크플로](#-일반적인-워크플로)
4. [단계별 튜토리얼](#-단계별-튜토리얼)
5. [구성 가이드](#-구성-가이드)
6. [문제 해결](#-문제-해결)
7. [성능 최적화](#-성능-최적화)
8. [통합](#-통합)
9. [FAQ](#-faq)

---

## 🚀 시작하기

### 사전 요구사항

Claude-Flow를 시작하기 전에 다음을 준비하세요:

- **Node.js** ≥ 20.0.0 ([다운로드](https://nodejs.org/))
- **npm** ≥ 9.0.0 (Node.js와 함께 제공됨)
- **Claude Code** ([설정 가이드](https://claude.ai/code))
- 선호하는 AI provider의 **API 키**

### 빠른 설치

```bash
# 옵션 1: npx 사용 (처음 사용자에게 권장)
npx claude-flow@alpha --help

# 옵션 2: 전역 설치
npm install -g claude-flow@alpha

# 옵션 3: 프로젝트별 설치
npm install claude-flow@alpha
```

### 초기 설정

```bash
# 프로젝트에서 Claude-Flow 초기화
npx claude-flow@alpha init --force

# 설치 확인
npx claude-flow@alpha version

# 상태 확인 실행
npx claude-flow@alpha health
```

### 첫 번째 명령어

첫 번째 Claude-Flow 명령어를 시도해보세요:

```bash
# 간단한 작업 실행
npx claude-flow@alpha swarm "create a simple Hello World application"
```

---

## 🧠 기본 개념

### 핵심 구성요소

#### 1. Agent
특정 작업을 수행하는 AI 기반 worker:
- **54개 이상의 전문화된 agent** 사용 가능
- 각 agent는 고유한 능력을 보유
- 독립적으로 또는 협업하여 작업 가능

#### 2. Swarm
함께 작업하는 agent 그룹:
- **다양한 협업 topology**
- 분산 의사결정
- 장애 허용 작업

#### 3. 메모리 시스템
영구 지식 스토리지:
- agent 간 공유
- 다양한 스토리지 backend
- 자동 동기화

#### 4. MCP 통합
Model Context Protocol 도구:
- **87개의 사용 가능한 도구**
- 원활한 Claude Code 통합
- 실시간 협업

### Agent 유형 개요

| 카테고리 | 예시 | 사용 사례 |
|----------|----------|-----------|
| **Development** | `coder`, `reviewer`, `tester` | 코드 구현, 품질 보증 |
| **Architecture** | `architect`, `planner` | 시스템 설계, 프로젝트 계획 |
| **Specialized** | `backend-dev`, `mobile-dev`, `ml-developer` | 도메인별 개발 |
| **Coordination** | `coordinator`, `monitor` | 작업 관리, 진행 추적 |
| **Analysis** | `researcher`, `analyzer` | 정보 수집, 코드 분석 |

### Swarm Topology

#### Centralized (Queen 주도)
```
      👑 Queen
    /   |   \
   🐝  🐝   🐝
```
- 단일 협업 지점
- 간단한 통신
- 순차 작업에 최적

#### Distributed (Multi-Leader)
```
   👑 --- 👑
   /\     /\
  🐝 🐝  🐝 🐝
```
- 다중 협업 지점
- 부하 분산
- 장애 허용

#### Mesh (Peer-to-Peer)
```
   🐝 ─── 🐝
   │ ╲   ╱ │
   │   ╳   │
   │ ╱   ╲ │
   🐝 ─── 🐝
```
- 직접 agent 통신
- 창의적 협업
- 단일 장애 지점 없음

#### Hierarchical (Tree)
```
       👑
      /  \
     🐝   🐝
    / \   / \
   🐝 🐝 🐝 🐝
```
- 다중 레벨 구조
- 확장 가능한 조직
- 복잡한 프로젝트 협업

---

## 💼 일반적인 워크플로

### 개발 워크플로

#### 1. 간단한 작업 실행
단순한 개발 작업을 위해:

```bash
# 코드 생성
npx claude-flow@alpha swarm "create a REST API for user management"

# 버그 수정
npx claude-flow@alpha swarm "fix all TypeScript errors in the project"

# 문서화
npx claude-flow@alpha swarm "generate comprehensive API documentation"

# 테스트
npx claude-flow@alpha swarm "create unit tests for all service classes"
```

#### 2. 프로젝트 기반 개발
협업이 필요한 대규모 프로젝트를 위해:

```bash
# 프로젝트 swarm 초기화
npx claude-flow@alpha hive-mind spawn "e-commerce platform" \
  --agents architect,backend-dev,frontend-dev,tester \
  --topology hierarchical

# 동일 세션에서 개발 계속
npx claude-flow@alpha swarm "implement user authentication" --continue-session

# 새 기능 추가
npx claude-flow@alpha swarm "add payment processing integration"

# 진행상황 모니터링
npx claude-flow@alpha swarm status --watch
```

#### 3. SPARC 개발 방법론
Specification → Pseudocode → Architecture → Refinement → Code를 사용한 구조화된 개발:

```bash
# 전체 SPARC pipeline
npx claude-flow@alpha sparc pipeline "user management system"

# 개별 SPARC 단계
npx claude-flow@alpha sparc spec "define requirements for authentication"
npx claude-flow@alpha sparc architecture "design microservices structure"
npx claude-flow@alpha sparc code "implement user service"

# 테스트 주도 개발
npx claude-flow@alpha sparc tdd "payment processing module"
```

### 운영 워크플로

#### 1. 코드 리뷰 및 품질
```bash
# 종합 코드 리뷰
npx claude-flow@alpha swarm "perform security audit and code review" \
  --agents security-analyst,reviewer,code-quality-checker

# 성능 최적화
npx claude-flow@alpha swarm "analyze and optimize application performance" \
  --agents performance-analyst,optimizer
```

#### 2. DevOps 및 배포
```bash
# CI/CD 설정
npx claude-flow@alpha swarm "setup complete CI/CD pipeline" \
  --agents devops-engineer,cicd-specialist

# 컨테이너 배포
npx claude-flow@alpha swarm "containerize application with Docker" \
  --agents docker-specialist,devops-engineer

# Kubernetes 배포
npx claude-flow@alpha swarm "deploy to Kubernetes cluster" \
  --agents k8s-specialist,devops-engineer
```

#### 3. 문서화 및 유지보수
```bash
# 문서 생성
npx claude-flow@alpha swarm "create comprehensive project documentation" \
  --agents technical-writer,api-docs-generator

# 코드 유지보수
npx claude-flow@alpha swarm "refactor legacy code and improve maintainability" \
  --agents refactoring-specialist,code-quality-checker
```

---

## 📚 단계별 튜토리얼

### 튜토리얼 1: 첫 번째 API 구축

#### 단계 1: 프로젝트 초기화
```bash
# 새 디렉토리 생성
mkdir my-api-project
cd my-api-project

# Claude-Flow 초기화
npx claude-flow@alpha init --force

# npm 프로젝트 초기화
npm init -y
```

#### 단계 2: 요구사항 정의
```bash
# SPARC specification 모드 사용
npx claude-flow@alpha sparc spec "REST API for task management with CRUD operations, authentication, and data validation"
```

#### 단계 3: 아키텍처 생성
```bash
# 시스템 아키텍처 생성
npx claude-flow@alpha sparc architecture "Node.js Express API with PostgreSQL database, JWT authentication, and comprehensive error handling"
```

#### 단계 4: 코드 구현
```bash
# 구현 생성
npx claude-flow@alpha sparc code "implement the complete task management API based on the architecture"
```

#### 단계 5: 테스트 추가
```bash
# 종합 테스트 생성
npx claude-flow@alpha swarm "create unit tests, integration tests, and API endpoint tests" \
  --agents tester,test-automation-specialist
```

#### 단계 6: DevOps 설정
```bash
# CI/CD 및 배포 추가
npx claude-flow@alpha swarm "setup GitHub Actions CI/CD and Docker deployment" \
  --agents devops-engineer,cicd-specialist
```

### 튜토리얼 2: 다중 Agent를 사용한 복잡한 프로젝트

#### 단계 1: 프로젝트 계획
```bash
# 대규모 프로젝트 swarm 초기화
npx claude-flow@alpha hive-mind spawn "full-stack social media application" \
  --agents architect,planner,backend-dev,frontend-dev,mobile-dev,tester,devops-engineer \
  --topology hierarchical \
  --max-agents 12
```

#### 단계 2: 아키텍처 설계
```bash
# 종합 아키텍처 생성
npx claude-flow@alpha swarm "design microservices architecture with event-driven communication" \
  --agents system-architect,backend-architect,frontend-architect
```

#### 단계 3: Backend 개발
```bash
# backend 서비스 개발
npx claude-flow@alpha swarm "implement user service, post service, and notification service" \
  --agents backend-dev,api-developer,database-specialist
```

#### 단계 4: Frontend 개발
```bash
# frontend 애플리케이션 생성
npx claude-flow@alpha swarm "build React web app and React Native mobile app" \
  --agents frontend-dev,mobile-dev,ui-ux-specialist
```

#### 단계 5: 테스트 및 품질 보증
```bash
# 종합 테스트
npx claude-flow@alpha swarm "create automated test suites and perform security audit" \
  --agents tester,security-analyst,qa-specialist
```

#### 단계 6: 배포 및 모니터링
```bash
# 배포 및 모니터링
npx claude-flow@alpha swarm "deploy to cloud and setup monitoring" \
  --agents devops-engineer,cloud-specialist,monitoring-specialist
```

### 튜토리얼 3: SPARC 테스트 주도 개발

#### 단계 1: 기능 요구사항 정의
```bash
# TDD 사이클 시작
npx claude-flow@alpha sparc tdd "user authentication with email verification" \
  --test-framework jest \
  --coverage 95
```

#### 단계 2: 테스트 먼저 작성
```bash
# 테스트 사양 생성
npx claude-flow@alpha swarm "write comprehensive test cases for authentication flow" \
  --agents test-architect,tdd-specialist
```

#### 단계 3: 최소 코드 구현
```bash
# 테스트를 통과하기 위한 최소 구현
npx claude-flow@alpha sparc code "implement minimal authentication logic to pass tests"
```

#### 단계 4: 리팩토링 및 최적화
```bash
# 구현 개선
npx claude-flow@alpha sparc refinement "optimize authentication performance and security"
```

#### 단계 5: 통합 테스트 추가
```bash
# 통합 테스트 생성
npx claude-flow@alpha swarm "add integration tests for complete authentication flow" \
  --agents integration-tester,api-tester
```

---

## ⚙️ 구성 가이드

### 기본 구성

#### 환경 변수
```bash
# 핵심 설정
export CLAUDE_FLOW_DEBUG=true
export CLAUDE_FLOW_LOG_LEVEL=info
export CLAUDE_FLOW_DATA_DIR=./data
export CLAUDE_FLOW_MAX_AGENTS=50

# API 구성
export CLAUDE_API_KEY="your_claude_api_key"
export OPENAI_API_KEY="your_openai_api_key"
export ANTHROPIC_API_KEY="your_anthropic_api_key"

# 성능 튜닝
export CLAUDE_FLOW_MEMORY_LIMIT=1024
export CLAUDE_FLOW_TIMEOUT=300000
export CLAUDE_FLOW_CONCURRENT_TASKS=10
```

#### 구성 파일
프로젝트 루트에 `.claude-flow.json` 생성:

```json
{
  "orchestrator": {
    "maxConcurrentAgents": 100,
    "taskQueueSize": 1000,
    "defaultTopology": "mesh",
    "autoScaling": true,
    "timeoutMs": 300000
  },
  "memory": {
    "backend": "sqlite",
    "cacheSizeMB": 512,
    "compressionEnabled": true,
    "retentionDays": 30,
    "indexingEnabled": true
  },
  "providers": {
    "anthropic": {
      "apiKey": "${CLAUDE_API_KEY}",
      "model": "claude-3-sonnet",
      "temperature": 0.7,
      "maxTokens": 4096
    },
    "openai": {
      "apiKey": "${OPENAI_API_KEY}",
      "model": "gpt-4",
      "temperature": 0.7,
      "maxTokens": 4096
    }
  },
  "agents": {
    "defaultAgent": "coder",
    "agentProfiles": {
      "development": ["coder", "reviewer", "tester"],
      "architecture": ["architect", "planner", "system-designer"],
      "devops": ["devops-engineer", "docker-specialist", "k8s-specialist"]
    }
  },
  "swarm": {
    "defaultTopology": "mesh",
    "coordinationStrategy": "democratic",
    "faultTolerance": true,
    "loadBalancing": true
  },
  "hooks": {
    "enabled": true,
    "autoFormat": true,
    "notifications": true,
    "preTaskHooks": ["backup", "validation"],
    "postTaskHooks": ["cleanup", "metrics"]
  },
  "security": {
    "validateInputs": true,
    "sanitizeOutputs": true,
    "encryptMemory": true,
    "auditLogging": true
  },
  "performance": {
    "cacheEnabled": true,
    "compressionEnabled": true,
    "parallelExecution": true,
    "resourceLimits": {
      "maxMemoryMB": 2048,
      "maxCpuPercent": 80
    }
  }
}
```

### 고급 구성

#### Agent 프로필
특정 사용 사례를 위한 사용자 정의 agent 조합 정의:

```json
{
  "agentProfiles": {
    "web-development": {
      "agents": ["frontend-dev", "backend-dev", "fullstack-dev"],
      "topology": "hierarchical",
      "coordination": "leader-follower"
    },
    "data-science": {
      "agents": ["ml-developer", "data-analyst", "python-specialist"],
      "topology": "mesh",
      "coordination": "collaborative"
    },
    "enterprise-security": {
      "agents": ["security-analyst", "penetration-tester", "compliance-checker"],
      "topology": "centralized",
      "coordination": "expert-led"
    }
  }
}
```

#### 사용자 정의 메모리 구성
```json
{
  "memory": {
    "backends": {
      "primary": {
        "type": "sqlite",
        "path": "./data/memory.db",
        "compression": true
      },
      "cache": {
        "type": "redis",
        "host": "localhost",
        "port": 6379,
        "ttl": 3600
      },
      "backup": {
        "type": "s3",
        "bucket": "claude-flow-backup",
        "region": "us-east-1"
      }
    },
    "synchronization": {
      "strategy": "eventual-consistency",
      "conflictResolution": "last-write-wins",
      "replicationFactor": 3
    }
  }
}
```

#### 성능 최적화 설정
```json
{
  "performance": {
    "optimization": {
      "agentPooling": true,
      "connectionReuse": true,
      "batchProcessing": true,
      "asyncExecution": true
    },
    "monitoring": {
      "metricsEnabled": true,
      "tracingEnabled": true,
      "profilingEnabled": false,
      "alerting": {
        "cpu": 90,
        "memory": 85,
        "diskSpace": 80
      }
    },
    "scaling": {
      "autoScale": true,
      "minAgents": 2,
      "maxAgents": 50,
      "scaleUpThreshold": 80,
      "scaleDownThreshold": 30
    }
  }
}
```

### MCP Server 구성

#### 기본 MCP 설정
```bash
# MCP server 시작
npx claude-flow@alpha mcp start --port 3000

# MCP 도구 구성
npx claude-flow@alpha mcp config --tools all

# 사용자 정의 MCP server 추가
npx claude-flow@alpha mcp add-server \
  --name "custom-tools" \
  --command "node custom-mcp-server.js"
```

#### Claude Code와 MCP 통합
```bash
# Claude Code에 Claude-Flow MCP server 추가
claude mcp add claude-flow npx claude-flow@alpha mcp start

# 사용 가능한 MCP 도구 나열
npx claude-flow@alpha mcp tools --list

# MCP 연결 테스트
npx claude-flow@alpha mcp test --tool swarm_init
```

---

## 🔧 문제 해결

### 일반적인 문제 및 해결방법

#### 설치 문제

**문제: npm install이 권한 오류로 실패**
```bash
# 해결방법 1: 대신 npx 사용
npx claude-flow@alpha --help

# 해결방법 2: npm 권한 수정
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# 해결방법 3: node version manager 사용
nvm install 20
nvm use 20
```

**문제: SQLite 컴파일 실패**
```bash
# 해결방법 1: 빌드 도구 설치
# Ubuntu/Debian에서:
sudo apt-get install build-essential python3

# macOS에서:
xcode-select --install

# Windows에서:
npm install --global windows-build-tools

# 해결방법 2: 미리 빌드된 바이너리 사용
npm install --no-optional
```

#### 런타임 문제

**문제: "Agent not found" 오류**
```bash
# 사용 가능한 agent 확인
npx claude-flow@alpha agents list

# agent 철자 확인
npx claude-flow@alpha agents info coder

# 불확실한 경우 기본 agent 사용
npx claude-flow@alpha swarm "your task" --agent coder
```

**문제: 메모리 관련 오류**
```bash
# 메모리 사용량 확인
npx claude-flow@alpha memory stats

# 메모리 캐시 정리
npx claude-flow@alpha memory clear --cache

# 메모리 설정 최적화
npx claude-flow@alpha config set memory.cacheSizeMB 256
```

**문제: API rate limiting**
```bash
# API 상태 확인
npx claude-flow@alpha health --api

# rate limiting 구성
npx claude-flow@alpha config set providers.anthropic.rateLimit 60

# 다중 provider 사용
npx claude-flow@alpha config set providers.fallback openai
```

#### 성능 문제

**문제: 느린 작업 실행**
```bash
# 진단 실행
npx claude-flow@alpha diagnostics --performance

# 구성 최적화
npx claude-flow@alpha optimize --auto

# 실시간 성능 모니터링
npx claude-flow@alpha monitor --interval 5s
```

**문제: 높은 메모리 사용량**
```bash
# 메모리 분석
npx claude-flow@alpha memory analyze

# 압축 활성화
npx claude-flow@alpha config set memory.compressionEnabled true

# 캐시 크기 축소
npx claude-flow@alpha config set memory.cacheSizeMB 128
```

### Debug 모드

문제 해결을 위한 상세 로깅 활성화:

```bash
# debug 모드 활성화
export CLAUDE_FLOW_DEBUG=true
export CLAUDE_FLOW_LOG_LEVEL=debug

# verbose 출력으로 실행
npx claude-flow@alpha swarm "your task" --verbose

# 진단 리포트 생성
npx claude-flow@alpha diagnostics --full --output debug-report.json
```

### 로그 분석

```bash
# 최근 로그 보기
npx claude-flow@alpha logs --tail 100

# 레벨별 로그 필터링
npx claude-flow@alpha logs --level error

# 로그 검색
npx claude-flow@alpha logs --grep "swarm"

# 로그 내보내기
npx claude-flow@alpha logs --export logs.json
```

### 상태 확인

```bash
# 종합 상태 확인
npx claude-flow@alpha health --comprehensive

# 특정 구성요소 확인
npx claude-flow@alpha health --component memory
npx claude-flow@alpha health --component agents
npx claude-flow@alpha health --component mcp

# 자동 상태 모니터링
npx claude-flow@alpha health --monitor --interval 60s
```

---

## 🚀 성능 최적화

### 시스템 최적화

#### 하드웨어 권장사항

| 구성요소 | 최소 | 권장 | 최적 |
|-----------|---------|-------------|---------|
| **CPU** | 2 cores | 4 cores | 8+ cores |
| **RAM** | 4 GB | 8 GB | 16+ GB |
| **Storage** | 1 GB 여유 | 5 GB 여유 | 20+ GB SSD |
| **Network** | 1 Mbps | 10 Mbps | 100+ Mbps |

#### 메모리 최적화

```bash
# 메모리 제한 구성
npx claude-flow@alpha config set memory.cacheSizeMB 512
npx claude-flow@alpha config set memory.maxMemoryMB 2048

# 압축 활성화
npx claude-flow@alpha config set memory.compressionEnabled true
npx claude-flow@alpha config set memory.indexingEnabled true

# 보존 정책 설정
npx claude-flow@alpha config set memory.retentionDays 30
npx claude-flow@alpha config set memory.autoCleanup true
```

#### Agent Pool 최적화

```bash
# agent pool 구성
npx claude-flow@alpha config set orchestrator.maxConcurrentAgents 50
npx claude-flow@alpha config set orchestrator.agentPoolSize 20

# auto-scaling 활성화
npx claude-flow@alpha config set swarm.autoScaling true
npx claude-flow@alpha config set swarm.minAgents 2
npx claude-flow@alpha config set swarm.maxAgents 100
```

### 작업 최적화

#### 배치 처리
```bash
# 다중 작업 병렬 처리
npx claude-flow@alpha swarm batch \
  "create user service" \
  "create product service" \
  "create order service" \
  --parallel

# 효율성을 위한 agent 프로필 사용
npx claude-flow@alpha swarm "build microservices" \
  --profile backend-development \
  --optimize-for speed
```

#### 캐싱 전략
```bash
# 적극적인 캐싱 활성화
npx claude-flow@alpha config set performance.cacheEnabled true
npx claude-flow@alpha config set performance.cacheStrategy aggressive

# 캐시 사전 준비
npx claude-flow@alpha cache warm --agents common
npx claude-flow@alpha cache warm --tools frequent
```

### 네트워크 최적화

```bash
# 연결 풀링 구성
npx claude-flow@alpha config set network.connectionPooling true
npx claude-flow@alpha config set network.maxConnections 100

# 압축 활성화
npx claude-flow@alpha config set network.compressionEnabled true
npx claude-flow@alpha config set network.timeout 30000
```

### 모니터링 및 지표

```bash
# 실시간 성능 모니터링
npx claude-flow@alpha monitor --dashboard

# 성능 리포트 생성
npx claude-flow@alpha performance report --period 7d

# 성능 알림 설정
npx claude-flow@alpha alerts configure \
  --cpu-threshold 80 \
  --memory-threshold 85 \
  --response-time-threshold 5000
```

---

## 🔗 통합

### GitHub 통합

#### 설정
```bash
# GitHub 통합 초기화
npx claude-flow@alpha github init --token YOUR_GITHUB_TOKEN

# 저장소 구성
npx claude-flow@alpha github config \
  --repo "username/repository" \
  --default-branch main
```

#### 일반적인 GitHub 워크플로
```bash
# Pull Request 관리
npx claude-flow@alpha github pr-manager \
  "review and merge pending PRs" \
  --auto-merge \
  --require-reviews 2

# Issue 관리
npx claude-flow@alpha github issue-tracker \
  "analyze and categorize open issues" \
  --auto-label \
  --assign-to-team

# Release 관리
npx claude-flow@alpha github release-manager \
  "prepare v2.1.0 release" \
  --generate-changelog \
  --create-release-notes
```

#### 고급 GitHub 기능
```bash
# 자동화된 코드 리뷰
npx claude-flow@alpha github code-review \
  --pr-number 123 \
  --agents security-analyst,code-reviewer \
  --auto-comment

# 저장소 분석
npx claude-flow@alpha github analyze-repo \
  --metrics code-quality,security,performance \
  --generate-report
```

### Docker 통합

#### 컨테이너 관리
```bash
# 애플리케이션 컨테이너화
npx claude-flow@alpha docker containerize \
  --app-type node \
  --multi-stage \
  --optimize-size

# 이미지 빌드 및 푸시
npx claude-flow@alpha docker build-push \
  --registry docker.io \
  --tags latest,v2.0.0

# 컨테이너 오케스트레이션
npx claude-flow@alpha docker compose \
  --services api,database,redis \
  --environment production
```

### Kubernetes 통합

#### 클러스터 관리
```bash
# Kubernetes에 배포
npx claude-flow@alpha k8s deploy \
  --cluster production \
  --namespace default \
  --replicas 3

# 서비스 관리
npx claude-flow@alpha k8s services \
  "setup load balancer and ingress" \
  --ssl-enabled \
  --auto-scaling

# 클러스터 모니터링
npx claude-flow@alpha k8s monitor \
  --real-time \
  --alerts \
  --dashboard
```

### CI/CD 통합

#### GitHub Actions
```bash
# CI/CD pipeline 설정
npx claude-flow@alpha cicd github-actions \
  "create complete CI/CD workflow" \
  --tests \
  --security-scan \
  --deploy-staging

# 사용자 정의 워크플로
npx claude-flow@alpha cicd custom \
  --provider github-actions \
  --stages "lint,test,build,deploy" \
  --environments "staging,production"
```

#### Jenkins 통합
```bash
# Jenkins pipeline
npx claude-flow@alpha cicd jenkins \
  "setup Jenkins pipeline with parallel stages" \
  --agents 4 \
  --parallel-tests
```

### 클라우드 플랫폼 통합

#### AWS 통합
```bash
# AWS에 배포
npx claude-flow@alpha aws deploy \
  --service ecs \
  --region us-east-1 \
  --auto-scaling

# Infrastructure as Code
npx claude-flow@alpha aws infrastructure \
  "create complete AWS infrastructure" \
  --terraform \
  --best-practices
```

#### Azure 통합
```bash
# Azure 배포
npx claude-flow@alpha azure deploy \
  --service app-service \
  --resource-group production \
  --scaling-rules
```

#### Google Cloud 통합
```bash
# GCP 배포
npx claude-flow@alpha gcp deploy \
  --service cloud-run \
  --region us-central1 \
  --auto-scaling
```

---

## ❓ FAQ

### 일반 질문

**Q: Claude-Flow란 무엇인가요?**
A: Claude-Flow는 swarm 지능을 통한 분산 AI 개발을 가능하게 하는 엔터프라이즈급 AI agent 오케스트레이션 플랫폼으로, 54개 이상의 전문화된 agent와 87개의 MCP 도구를 제공합니다.

**Q: Claude-Flow는 다른 AI 도구와 어떻게 다른가요?**
A: Claude-Flow는 swarm 지능을 갖춘 진정한 다중 agent 협업, 영구 메모리 관리, 보안, 모니터링, 확장성과 같은 엔터프라이즈급 기능을 제공합니다.

**Q: Claude-Flow를 사용하려면 Claude Code가 필요한가요?**
A: Claude-Flow는 독립적으로 작동할 수 있지만, Claude Code 통합은 완전한 MCP protocol 지원과 원활한 agent 협업으로 최상의 경험을 제공합니다.

### 설치 및 설정

**Q: 어떤 Node.js 버전을 사용해야 하나요?**
A: Claude-Flow는 Node.js ≥ 20.0.0이 필요합니다. 최상의 성능과 보안을 위해 최신 LTS 버전을 권장합니다.

**Q: 전역 설치 없이 Claude-Flow를 사용할 수 있나요?**
A: 네! `npx claude-flow@alpha` 사용이 실제로 권장됩니다. 전역 설치 없이 항상 최신 버전을 사용할 수 있습니다.

**Q: API 키 구성은 어떻게 처리하나요?**
A: API 키를 환경 변수 또는 `.claude-flow.json` 구성 파일에 설정하세요. API 키를 버전 관리에 커밋하지 마세요.

### 사용 및 기능

**Q: 동시에 몇 개의 agent를 실행할 수 있나요?**
A: 기본적으로 Claude-Flow는 최대 100개의 동시 agent를 처리할 수 있습니다. 시스템 리소스와 API 제한에 따라 구성할 수 있습니다.

**Q: 사용자 정의 agent를 만들 수 있나요?**
A: 현재 Claude-Flow는 54개 이상의 사전 구축된 agent를 제공합니다. 사용자 정의 agent 생성은 향후 릴리스에서 계획되어 있습니다.

**Q: 메모리 시스템은 어떻게 작동하나요?**
A: Claude-Flow는 기본적으로 SQLite backend를 사용하는 분산 메모리 시스템을 사용합니다. 메모리는 agent 간에 자동으로 동기화되며 세션 간에 지속됩니다.

**Q: 어떤 swarm topology를 선택해야 하나요?**
A:
- **Mesh**: 창의적 협업과 장애 허용에 최적
- **Hierarchical**: 대규모 구조화된 프로젝트에 이상적
- **Centralized**: 간단한 순차 작업에 적합
- **Distributed**: 부하 분산을 통한 병렬 처리에 완벽

### 성능 및 최적화

**Q: 작업 실행 속도를 어떻게 향상시킬 수 있나요?**
A: 병렬 처리 활성화, 적절한 swarm topology 사용, 캐싱 구성, 충분한 시스템 리소스 확보를 통해 향상시킬 수 있습니다.

**Q: API rate limit에 도달하면 어떻게 해야 하나요?**
A: 다중 provider 구성, rate limiting 설정 조정, 요청 배치 처리 및 큐잉 구현을 통해 해결할 수 있습니다.

**Q: Claude-Flow는 얼마나 많은 디스크 공간을 사용하나요?**
A: 기본 설치에는 약 100MB가 필요합니다. 메모리 데이터베이스와 캐시는 사용량에 따라 증가하며, 대부분의 프로젝트에서는 일반적으로 10-100MB입니다.

### 통합 및 호환성

**Q: Claude-Flow가 기존 CI/CD pipeline과 작동할 수 있나요?**
A: 네, Claude-Flow는 GitHub Actions, Jenkins 및 기타 CI/CD 플랫폼과의 통합을 제공합니다.

**Q: Claude-Flow는 Docker 및 Kubernetes와 호환되나요?**
A: 물론입니다! Claude-Flow는 Docker 컨테이너화 및 Kubernetes 오케스트레이션을 위한 전문화된 agent를 포함합니다.

**Q: 엔터프라이즈 환경에서 Claude-Flow를 사용할 수 있나요?**
A: 네, Claude-Flow는 보안 기능, 감사 로깅, 확장 가능한 아키텍처를 갖춘 엔터프라이즈용으로 설계되었습니다.

### 문제 해결

**Q: agent가 실패하면 어떻게 해야 하나요?**
A: Claude-Flow는 자동 장애 복구를 포함합니다. `npx claude-flow@alpha logs`로 로그를 확인하고 실패한 작업을 재시작할 수도 있습니다.

**Q: 성능 문제를 어떻게 디버그하나요?**
A: 내장 진단을 사용하세요: `npx claude-flow@alpha diagnostics --performance` 및 실시간 지표를 모니터링하세요.

**Q: 막혔을 때 어디서 도움을 받을 수 있나요?**
A: 이 가이드를 확인하고, 종합 문서를 검토하고, GitHub issue를 검색하거나, Discord 커뮤니티에 참여하세요.

### 고급 기능

**Q: SPARC 방법론은 어떻게 작동하나요?**
A: SPARC (Specification → Pseudocode → Architecture → Refinement → Code)는 철저한 계획과 고품질 구현을 보장하는 구조화된 개발 방법론입니다.

**Q: 머신러닝 프로젝트에 Claude-Flow를 사용할 수 있나요?**
A: 네! Claude-Flow는 모델 개발, 학습, 배포를 위한 전문화된 ML agent를 포함합니다.

**Q: Claude-Flow는 얼마나 안전한가요?**
A: Claude-Flow는 입력 검증, 데이터 암호화, 감사 로깅, 역할 기반 액세스 제어를 포함한 엔터프라이즈급 보안 기능을 포함합니다.

---

## 📞 지원 및 커뮤니티

### 도움 받기

- **📖 문서**: [완전한 문서](https://github.com/ruvnet/claude-flow/docs)
- **💬 Discord 커뮤니티**: [Discord 참여](https://discord.gg/claude-flow)
- **🐛 Issue Tracker**: [GitHub Issues](https://github.com/ruvnet/claude-flow/issues)
- **📧 이메일 지원**: support@claude-flow.ai

### 기여하기

기여를 환영합니다! 다음에 대한 자세한 내용은 [기여 가이드](../CONTRIBUTING.md)를 참조하세요:

- 🐛 버그 보고 및 수정
- ✨ 기능 요청 및 구현
- 📚 문서 개선
- 🧪 테스트 커버리지 향상
- 🎨 UI/UX 개선

### 최신 정보 유지

- 🐦 **Twitter/X**: [@claudeflow](https://twitter.com/claudeflow)
- 📰 **Blog**: [blog.claude-flow.ai](https://blog.claude-flow.ai)
- 📺 **YouTube**: [Claude-Flow Channel](https://youtube.com/@claudeflow)
- 🌟 **GitHub**: [저장소에 Star](https://github.com/ruvnet/claude-flow)

---

<div align="center">

## 🎉 시작할 준비가 되셨나요?

이제 Claude-Flow를 마스터하는 데 필요한 모든 것을 갖추셨습니다!

[🚀 구축 시작](../README.ko.md#-quick-start) | [📖 API 참조](../api/API_DOCUMENTATION.md) | [🏗️ 아키텍처 가이드](../architecture/ARCHITECTURE.md)

---

**Claude-Flow 사용자 가이드 v2.0.0**

*Claude-Flow 커뮤니티가 ❤️로 제작*

</div>
