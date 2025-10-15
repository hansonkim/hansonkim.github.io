# 🔗 Claude-Flow v2.0.0 API 문서

## 목차

- [개요](#개요)
- [인증](#인증)
- [Command 구문](#command-구문)
- [MCP Tools 참조](#mcp-tools-참조)
  - [Claude-Flow Tools (87개)](#claude-flow-tools)
  - [Ruv-Swarm Tools (25개)](#ruv-swarm-tools)
- [Agent 타입](#agent-타입)
- [WebSocket 통합](#websocket-통합)
- [Command 예제](#command-예제)
- [에러 처리](#에러-처리)
- [모범 사례](#모범-사례)

---

## 개요

Claude-Flow v2.0.0은 112개의 MCP tool, 54개 이상의 전문 agent 타입, 고급 swarm intelligence 기능을 제공하여 포괄적인 AI agent orchestration을 지원합니다. 이 문서는 모든 기능에 대한 프로그래밍 방식 접근을 위한 완전한 API 표면을 다룹니다.

### 주요 기능

- **112 MCP Tools** - 87개 Claude-Flow + 25개 Ruv-Swarm 통합 tool
- **54+ Agent 타입** - 모든 개발 요구에 대한 전문 agent
- **Swarm Intelligence** - 다중 topology 조정 (hierarchical, mesh, ring, star)
- **Neural Network** - WASM 가속 AI pattern 및 학습
- **Memory System** - 압축 기능을 갖춘 영구 분산 memory
- **실시간 조정** - WebSocket 기반 agent 통신
- **GitHub 통합** - 네이티브 CI/CD 및 repository 관리
- **Auto-scaling** - 동적 agent provisioning 및 resource 관리

## 인증

### CLI 인증

```bash
# GitHub 인증으로 초기화 (권장)
npx claude-flow@alpha github init

# 또는 API key 사용
export CLAUDE_FLOW_API_KEY="your-api-key"
npx claude-flow@alpha config set --api-key $CLAUDE_FLOW_API_KEY
```

### MCP 통합

```javascript
// Claude-Flow를 MCP server로 추가
claude mcp add claude-flow npx claude-flow@alpha mcp start

// 사용 가능한 MCP server:
// - claude-flow: 87개 네이티브 tool
// - ruv-swarm: 25개 고급 조정 tool
```

### Token 기반 접근

```bash
# Session token 생성
npx claude-flow@alpha auth login

# API 호출에 token 사용
curl -H "Authorization: Bearer $(npx claude-flow@alpha auth token)" \
  https://api.claude-flow.ai/v2/agents
```

## Command 구문

### 올바른 Command 형식

**중요**: 항상 `npx claude-flow@alpha` 사용 (`npx claude-flow` 아님)

```bash
# ✅ 올바름 - 업데이트된 구문
npx claude-flow@alpha [command] [options]

# ❌ 구식 - 사용하지 마세요
npx claude-flow [command] [options]
```

### 핵심 Command

```bash
# Swarm 작업
npx claude-flow@alpha coordination swarm-init --topology hierarchical
npx claude-flow@alpha coordination agent-spawn --type coder
npx claude-flow@alpha coordination task-orchestrate --task "Build API"

# Memory 작업
npx claude-flow@alpha memory usage --action store --key project/context
npx claude-flow@alpha memory search --pattern "authentication"

# Performance 분석
npx claude-flow@alpha performance report --timeframe 24h
npx claude-flow@alpha bottleneck analyze --component swarm

# GitHub 통합
npx claude-flow@alpha github repo-analyze --repo owner/repo
npx claude-flow@alpha github pr-manage --action create
```

## MCP Tools 참조

### Claude-Flow Tools (총 87개)

#### 🐝 Swarm Coordination (12개 tool)
- `mcp__claude-flow__swarm_init` - topology로 swarm 초기화
- `mcp__claude-flow__agent_spawn` - 전문 agent 생성
- `mcp__claude-flow__task_orchestrate` - task 실행 조정
- `mcp__claude-flow__swarm_status` - swarm health 모니터링
- `mcp__claude-flow__agent_list` - 활성 agent 목록
- `mcp__claude-flow__agent_metrics` - agent 성능 데이터
- `mcp__claude-flow__swarm_monitor` - 실시간 모니터링
- `mcp__claude-flow__topology_optimize` - 조정 최적화
- `mcp__claude-flow__load_balance` - agent 워크로드 균형
- `mcp__claude-flow__coordination_sync` - agent 동기화
- `mcp__claude-flow__swarm_scale` - agent 수 확장
- `mcp__claude-flow__swarm_destroy` - swarm 종료

#### 🧠 Neural Network (15개 tool)
- `mcp__claude-flow__neural_status` - neural 시스템 상태
- `mcp__claude-flow__neural_train` - AI pattern 학습
- `mcp__claude-flow__neural_predict` - AI 예측 생성
- `mcp__claude-flow__neural_patterns` - cognitive pattern
- `mcp__claude-flow__model_load` - AI model 로드
- `mcp__claude-flow__model_save` - 학습된 model 저장
- `mcp__claude-flow__wasm_optimize` - WASM 성능
- `mcp__claude-flow__inference_run` - AI inference 실행
- `mcp__claude-flow__pattern_recognize` - pattern 감지
- `mcp__claude-flow__cognitive_analyze` - cognitive 분석
- `mcp__claude-flow__learning_adapt` - 적응형 학습
- `mcp__claude-flow__neural_compress` - model 압축
- `mcp__claude-flow__ensemble_create` - ensemble model
- `mcp__claude-flow__transfer_learn` - transfer learning
- `mcp__claude-flow__neural_explain` - AI 설명 가능성

#### 💾 Memory & Persistence (12개 tool)
- `mcp__claude-flow__memory_usage` - 데이터 저장/검색
- `mcp__claude-flow__memory_search` - memory entry 검색
- `mcp__claude-flow__memory_persist` - 영구 storage
- `mcp__claude-flow__memory_namespace` - namespace 관리
- `mcp__claude-flow__memory_backup` - memory 데이터 백업
- `mcp__claude-flow__memory_restore` - 백업에서 복원
- `mcp__claude-flow__memory_compress` - 데이터 압축
- `mcp__claude-flow__memory_sync` - memory 동기화
- `mcp__claude-flow__cache_manage` - cache 작업
- `mcp__claude-flow__state_snapshot` - 상태 snapshot
- `mcp__claude-flow__context_restore` - context 복원
- `mcp__claude-flow__memory_analytics` - memory 분석

#### 📊 Analysis & Monitoring (13개 tool)
- `mcp__claude-flow__performance_report` - 성능 보고서
- `mcp__claude-flow__bottleneck_analyze` - 병목 현상 감지
- `mcp__claude-flow__task_status` - task 모니터링
- `mcp__claude-flow__task_results` - task 결과
- `mcp__claude-flow__benchmark_run` - benchmark 실행
- `mcp__claude-flow__metrics_collect` - metric 수집
- `mcp__claude-flow__trend_analysis` - 추세 분석
- `mcp__claude-flow__cost_analysis` - 비용 추적
- `mcp__claude-flow__quality_assess` - 품질 평가
- `mcp__claude-flow__error_analysis` - 에러 분석
- `mcp__claude-flow__usage_stats` - 사용량 통계
- `mcp__claude-flow__health_check` - 시스템 health
- `mcp__claude-flow__token_usage` - token 추적

#### 🔄 Workflow & Automation (11개 tool)
- `mcp__claude-flow__workflow_create` - workflow 생성
- `mcp__claude-flow__workflow_execute` - workflow 실행
- `mcp__claude-flow__workflow_export` - workflow 내보내기
- `mcp__claude-flow__automation_setup` - automation 설정
- `mcp__claude-flow__pipeline_create` - pipeline 생성
- `mcp__claude-flow__scheduler_manage` - schedule 관리
- `mcp__claude-flow__trigger_setup` - trigger 설정
- `mcp__claude-flow__workflow_template` - workflow template
- `mcp__claude-flow__batch_process` - batch 처리
- `mcp__claude-flow__parallel_execute` - 병렬 실행
- `mcp__claude-flow__sparc_mode` - SPARC workflow

#### 🐙 GitHub Integration (8개 tool)
- `mcp__claude-flow__github_repo_analyze` - repository 분석
- `mcp__claude-flow__github_pr_manage` - pull request 관리
- `mcp__claude-flow__github_issue_track` - issue 추적
- `mcp__claude-flow__github_release_coord` - release 조정
- `mcp__claude-flow__github_workflow_auto` - workflow 자동화
- `mcp__claude-flow__github_code_review` - code 리뷰
- `mcp__claude-flow__github_sync_coord` - 동기화 조정
- `mcp__claude-flow__github_metrics` - GitHub metric

#### 🤖 DAA (Dynamic Agent Architecture) (8개 tool)
- `mcp__claude-flow__daa_agent_create` - 동적 agent 생성
- `mcp__claude-flow__daa_capability_match` - capability 매칭
- `mcp__claude-flow__daa_resource_alloc` - resource 할당
- `mcp__claude-flow__daa_lifecycle_manage` - 라이프사이클 관리
- `mcp__claude-flow__daa_communication` - agent 통신
- `mcp__claude-flow__daa_consensus` - consensus 알고리즘
- `mcp__claude-flow__daa_fault_tolerance` - 장애 허용성
- `mcp__claude-flow__daa_optimization` - agent 최적화

#### 🛠️ System & Utilities (8개 tool)
- `mcp__claude-flow__terminal_execute` - terminal 실행
- `mcp__claude-flow__config_manage` - 구성 관리
- `mcp__claude-flow__features_detect` - feature 감지
- `mcp__claude-flow__security_scan` - 보안 스캔
- `mcp__claude-flow__backup_create` - 백업 생성
- `mcp__claude-flow__restore_system` - 시스템 복원
- `mcp__claude-flow__log_analysis` - log 분석
- `mcp__claude-flow__diagnostic_run` - 진단 실행

### Ruv-Swarm Tools (총 25개)

#### 🌊 Advanced Swarm Operations
- `mcp__ruv-swarm__swarm_init` - 고급 swarm 초기화
- `mcp__ruv-swarm__swarm_status` - 상세 swarm 상태
- `mcp__ruv-swarm__swarm_monitor` - 실시간 모니터링
- `mcp__ruv-swarm__agent_spawn` - ruv-swarm agent 생성
- `mcp__ruv-swarm__agent_list` - ruv-swarm agent 목록
- `mcp__ruv-swarm__agent_metrics` - agent 성능 metric

#### 🎯 Task Coordination
- `mcp__ruv-swarm__task_orchestrate` - 고급 task orchestration
- `mcp__ruv-swarm__task_status` - task 상태 모니터링
- `mcp__ruv-swarm__task_results` - task 결과 검색

#### 🧠 Neural Intelligence
- `mcp__ruv-swarm__neural_status` - neural 시스템 상태
- `mcp__ruv-swarm__neural_train` - neural model 학습
- `mcp__ruv-swarm__neural_patterns` - cognitive pattern

#### 💾 Memory Management
- `mcp__ruv-swarm__memory_usage` - memory 작업

#### ⚡ Performance
- `mcp__ruv-swarm__benchmark_run` - 성능 benchmark
- `mcp__ruv-swarm__features_detect` - feature 감지

#### 🤖 Dynamic Agent Architecture (DAA)
- `mcp__ruv-swarm__daa_init` - DAA 초기화
- `mcp__ruv-swarm__daa_agent_create` - DAA agent 생성
- `mcp__ruv-swarm__daa_agent_adapt` - agent 행동 적응
- `mcp__ruv-swarm__daa_workflow_create` - DAA workflow 생성
- `mcp__ruv-swarm__daa_workflow_execute` - DAA workflow 실행
- `mcp__ruv-swarm__daa_knowledge_share` - 지식 공유
- `mcp__ruv-swarm__daa_learning_status` - 학습 상태
- `mcp__ruv-swarm__daa_cognitive_pattern` - cognitive pattern
- `mcp__ruv-swarm__daa_meta_learning` - meta-learning
- `mcp__ruv-swarm__daa_performance_metrics` - 성능 metric

## Agent 타입

### 핵심 개발 Agent
| Agent | 타입 | 기능 |
|-------|------|------|
| **coder** | 구현 | code 생성, 리팩토링, 디버깅 |
| **reviewer** | 품질 보증 | code 리뷰, 모범 사례, 표준 |
| **tester** | 테스팅 | unit test, integration test, TDD |
| **researcher** | 조사 | 연구, 분석, 문서화 |
| **planner** | 계획 | 프로젝트 계획, 작업 분해 |

### 전문 Agent
| Agent | 타입 | 기능 |
|-------|------|------|
| **code-analyzer** | 분석 | code 품질, 성능, 보안 |
| **system-architect** | Architecture | 시스템 설계, pattern, 확장성 |
| **backend-dev** | 개발 | API 개발, database, service |
| **mobile-dev** | 개발 | React Native, mobile platform |
| **ml-developer** | ML/AI | machine learning, data science |
| **api-docs** | 문서화 | API 문서, OpenAPI spec |
| **cicd-engineer** | DevOps | CI/CD pipeline, automation |
| **performance-benchmarker** | Performance | load testing, 최적화 |
| **production-validator** | 검증 | production 준비, 배포 |
| **task-orchestrator** | 조정 | task 관리, workflow 조정 |

### Swarm Coordination Agent
| Agent | 타입 | 기능 |
|-------|------|------|
| **hierarchical-coordinator** | Coordination | Queen 주도 hierarchical swarm |
| **mesh-coordinator** | Coordination | peer-to-peer mesh network |
| **adaptive-coordinator** | Coordination | 동적 topology 전환 |
| **collective-intelligence-coordinator** | Coordination | hive-mind intelligence |
| **swarm-memory-manager** | Memory | 분산 memory 조정 |
| **consensus-builder** | Consensus | 분산 의사결정 |

### GitHub Integration Agent
| Agent | 타입 | 기능 |
|-------|------|------|
| **github-modes** | 통합 | 종합 GitHub 작업 |
| **pr-manager** | Pull Request | PR 생성, 리뷰, 관리 |
| **issue-tracker** | Issue | issue 관리, 추적 |
| **release-manager** | Release | release 조정, automation |
| **code-review-swarm** | Code Review | 다중 agent code 리뷰 |
| **repo-architect** | Repository | repository 구조, 조직화 |
| **workflow-automation** | Automation | GitHub Actions, CI/CD |
| **sync-coordinator** | Synchronization | 다중 repo 조정 |

### Performance & Consensus Agent
| Agent | 타입 | 기능 |
|-------|------|------|
| **perf-analyzer** | Performance | 병목 현상 식별, 최적화 |
| **byzantine-coordinator** | Consensus | Byzantine fault tolerance |
| **raft-manager** | Consensus | Raft consensus 알고리즘 |
| **gossip-coordinator** | Communication | Gossip protocol 조정 |
| **quorum-manager** | Consensus | quorum 기반 결정 |
| **crdt-synchronizer** | Synchronization | CRDT 기반 데이터 동기화 |
| **security-manager** | Security | 보안 검증, 감사 |

### SPARC Agent
| Agent | 타입 | 기능 |
|-------|------|------|
| **sparc-coder** | SPARC 구현 | TDD 주도 개발 |
| **sparc-coordinator** | SPARC 조정 | SPARC workflow 관리 |

## WebSocket 통합

### 연결 설정

```javascript
const ws = new WebSocket('wss://api.claude-flow.ai/v2/ws');

// 인증
ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your-session-token'
  }));
});

// Agent 이벤트 구독
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['agents', 'swarms', 'tasks', 'memory']
}));
```

### 이벤트 타입

#### Agent 이벤트
```javascript
// Agent 생성됨
{
  "type": "agent.spawned",
  "data": {
    "agentId": "agent_123",
    "type": "coder",
    "name": "Backend Developer",
    "status": "active"
  }
}

// Agent 상태 변경
{
  "type": "agent.status",
  "data": {
    "agentId": "agent_123",
    "status": "busy",
    "currentTask": "implement-auth",
    "progress": 0.65
  }
}
```

#### Swarm 이벤트
```javascript
// Swarm 조정 이벤트
{
  "type": "swarm.coordination",
  "data": {
    "swarmId": "swarm_456",
    "topology": "hierarchical",
    "agentCount": 8,
    "efficiency": 0.94
  }
}

// Task orchestration
{
  "type": "swarm.task",
  "data": {
    "taskId": "task_789",
    "assignedAgents": ["agent_123", "agent_456"],
    "strategy": "parallel",
    "progress": 0.45
  }
}
```

#### Memory 이벤트
```javascript
// Memory 동기화
{
  "type": "memory.sync",
  "data": {
    "namespace": "project-alpha",
    "entriesSync": 1247,
    "compressionRatio": 0.65,
    "latency": "12ms"
  }
}
```

## Command 예제

### 완전한 개발 Workflow

```bash
# 1. GitHub 통합으로 프로젝트 초기화
npx claude-flow@alpha github init

# 2. 개발용 swarm 설정
npx claude-flow@alpha coordination swarm-init \
  --topology hierarchical \
  --max-agents 8 \
  --strategy adaptive

# 3. 개발 팀 생성 (동시 실행)
npx claude-flow@alpha coordination agent-spawn --type system-architect --name "Lead Architect"
npx claude-flow@alpha coordination agent-spawn --type backend-dev --name "API Developer"
npx claude-flow@alpha coordination agent-spawn --type coder --name "Frontend Dev"
npx claude-flow@alpha coordination agent-spawn --type tester --name "QA Engineer"
npx claude-flow@alpha coordination agent-spawn --type code-analyzer --name "Code Reviewer"

# 4. 프로젝트 context를 memory에 저장
npx claude-flow@alpha memory usage \
  --action store \
  --key "project/architecture" \
  --value "Microservices with event sourcing and CQRS" \
  --namespace "development" \
  --ttl 86400

# 5. 개발 task orchestration
npx claude-flow@alpha coordination task-orchestrate \
  --task "Build complete REST API with authentication and testing" \
  --strategy parallel \
  --priority high

# 6. Swarm 성능 모니터링
npx claude-flow@alpha coordination swarm-status
npx claude-flow@alpha performance report --timeframe 24h --format detailed

# 7. GitHub repository 분석
npx claude-flow@alpha github repo-analyze \
  --repo "myorg/my-project" \
  --analysis-type code_quality

# 8. Automation용 workflow 생성
npx claude-flow@alpha workflow create \
  --name "full-stack-pipeline" \
  --steps '[
    {"type": "swarm_init", "topology": "hierarchical"},
    {"type": "agent_spawn", "agents": ["architect", "coder", "tester"]},
    {"type": "task_orchestrate", "strategy": "parallel"},
    {"type": "github_integration", "automate": true}
  ]'
```

### Neural Network Training

```bash
# 1. Neural 시스템 상태 확인
npx claude-flow@alpha neural status

# 2. Coordination pattern 학습
npx claude-flow@alpha neural train \
  --pattern-type coordination \
  --training-data "./data/coordination-patterns.json" \
  --epochs 100

# 3. AI 예측 생성
npx claude-flow@alpha neural predict \
  --model-id coordination_model_v1.2 \
  --input "complex microservices architecture with event sourcing"

# 4. Cognitive pattern 분석
npx claude-flow@alpha neural patterns \
  --pattern convergent \
  --analysis detailed
```

### Memory 및 State 관리

```bash
# 1. 복잡한 프로젝트 데이터 저장
npx claude-flow@alpha memory usage \
  --action store \
  --key "decisions/architecture" \
  --value '{
    "pattern": "microservices",
    "database": "postgres",
    "auth": "jwt",
    "caching": "redis"
  }' \
  --namespace "project-alpha" \
  --ttl 604800

# 2. 관련 정보 검색
npx claude-flow@alpha memory search \
  --pattern "microservices|architecture" \
  --namespace "project-alpha" \
  --limit 10

# 3. Memory 백업 생성
npx claude-flow@alpha memory backup \
  --namespace "project-alpha" \
  --format compressed

# 4. Memory 사용량 분석
npx claude-flow@alpha memory analytics \
  --timeframe 7d \
  --include-compression-stats
```

### Performance 모니터링

```bash
# 1. 종합 성능 보고서 실행
npx claude-flow@alpha performance report \
  --timeframe 24h \
  --format detailed \
  --include-recommendations

# 2. 병목 현상 식별
npx claude-flow@alpha bottleneck analyze \
  --component swarm_coordination \
  --metrics "response_time,throughput,error_rate" \
  --severity all

# 3. Swarm topology 최적화
npx claude-flow@alpha topology optimize \
  --swarm-id "swarm_123" \
  --target-efficiency 0.95

# 4. 모든 시스템 health 체크
npx claude-flow@alpha health-check \
  --components '["swarm", "neural", "memory", "mcp"]' \
  --detailed true
```

## 에러 처리

### 일반적인 에러 코드

```bash
# Agent 생성 실패
{
  "error": "AGENT_SPAWN_FAILED",
  "message": "Maximum agent limit reached",
  "details": {
    "currentAgents": 8,
    "maxAgents": 8,
    "swarmId": "swarm_123"
  }
}

# Memory 작업 실패
{
  "error": "MEMORY_STORAGE_FULL",
  "message": "Memory storage limit exceeded",
  "details": {
    "usedMemory": "512MB",
    "maxMemory": "512MB",
    "namespace": "project-alpha"
  }
}

# Neural training 실패
{
  "error": "NEURAL_TRAINING_FAILED",
  "message": "Insufficient training data",
  "details": {
    "requiredSamples": 100,
    "providedSamples": 45,
    "patternType": "coordination"
  }
}
```

### 에러 복구

```bash
# Backoff를 사용한 재시도
npx claude-flow@alpha coordination agent-spawn \
  --type coder \
  --retry-attempts 3 \
  --retry-delay 1000

# Graceful degradation
npx claude-flow@alpha coordination swarm-init \
  --topology hierarchical \
  --fallback-topology mesh \
  --max-agents 8 \
  --min-agents 3

# 에러 알림
npx claude-flow@alpha hooks post-edit \
  --file "error.log" \
  --memory-key "errors/$(date +%s)" \
  --notify-on-failure true
```

## 모범 사례

### 1. 효율적인 Agent 관리

```bash
# 항상 agent 작업을 일괄 처리
# ✅ 좋음 - 여러 spawn이 포함된 단일 메시지
npx claude-flow@alpha coordination agent-spawn --type architect &
npx claude-flow@alpha coordination agent-spawn --type coder &
npx claude-flow@alpha coordination agent-spawn --type tester &
wait

# ❌ 나쁨 - 순차적 spawning
npx claude-flow@alpha coordination agent-spawn --type architect
npx claude-flow@alpha coordination agent-spawn --type coder
npx claude-flow@alpha coordination agent-spawn --type tester
```

### 2. Memory 관리

```bash
# Namespace를 효과적으로 사용
npx claude-flow@alpha memory usage \
  --action store \
  --key "config/database" \
  --namespace "project-$(date +%Y%m%d)" \
  --ttl 86400

# 정기적인 정리
npx claude-flow@alpha memory compress \
  --namespace "temporary" \
  --threshold 0.8
```

### 3. Performance 최적화

```bash
# 확장 전 모니터링
npx claude-flow@alpha performance report --format summary
npx claude-flow@alpha coordination swarm-scale --target-size 12

# 적절한 topology 사용
# 복잡한 작업 -> hierarchical
# 협업 작업 -> mesh
# 순차 처리 -> ring
# 중앙집중 제어 -> star
```

### 4. 통합 Pattern

```bash
# Automation을 위한 hook 통합
npx claude-flow@alpha hooks pre-task \
  --description "Auto-spawn agents based on task complexity"

npx claude-flow@alpha hooks post-edit \
  --file "src/**/*.js" \
  --memory-key "code-changes/$(date +%s)"

# 재사용성을 위한 workflow template
npx claude-flow@alpha workflow template \
  --name "api-development" \
  --export "./templates/api-dev-workflow.json"
```

### 5. 보안 및 접근 제어

```bash
# 안전한 인증
npx claude-flow@alpha github init --secure-mode
npx claude-flow@alpha config set --api-key-encryption enabled

# Resource 제한
npx claude-flow@alpha coordination swarm-init \
  --max-agents 10 \
  --memory-limit "1GB" \
  --cpu-limit "4 cores"

# 감사 로깅
npx claude-flow@alpha log-analysis \
  --include-security-events \
  --format audit
```

---

## 지원 & 리소스

### 문서 링크
- [GitHub Repository](https://github.com/ruvnet/claude-flow)
- [Agent System Documentation](../reference/AGENTS.md)
- [MCP Tools Reference](../reference/MCP_TOOLS.md)

### CLI 도움말
```bash
# 모든 command에 대한 도움말
npx claude-flow@alpha --help
npx claude-flow@alpha coordination --help
npx claude-flow@alpha github --help

# 버전 정보
npx claude-flow@alpha --version
```

### 커뮤니티
- **Discord**: [커뮤니티 참여](https://discord.gg/claude-flow)
- **GitHub Issues**: [버그 보고](https://github.com/ruvnet/claude-flow/issues)
- **Discussions**: [기능 요청](https://github.com/ruvnet/claude-flow/discussions)

---

<div align="center">

**Claude-Flow v2.0.0-alpha.59**

*지능형 AI Agent Orchestration*

[🚀 시작하기](../README.ko.md) | [🔧 구성](../development/DEPLOYMENT.md) | [🤝 기여](../CONTRIBUTING.md)

</div>
