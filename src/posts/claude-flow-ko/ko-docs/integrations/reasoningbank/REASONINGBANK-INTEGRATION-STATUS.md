# ReasoningBank 통합 상태 (v2.7.0-alpha)

## 현재 상태: ⚠️ 부분 구현됨

### ✅ 정상 동작하는 항목

1. **초기화**: `memory init --reasoningbank`
   - `.swarm/memory.db` 데이터베이스를 생성합니다
   - 마이그레이션으로 스키마를 초기화합니다
   - 완전히 동작합니다

2. **상태 확인**: `memory status --reasoningbank`
   - 데이터베이스 통계를 표시합니다
   - 메모리 개수를 보여줍니다
   - 완전히 동작합니다

3. **모드 감지**: `memory detect`
   - 사용 가능한 메모리 모드를 감지합니다
   - 구성 정보를 보여줍니다
   - 완전히 동작합니다

### ❌ 동작하지 않는 항목 (v2.7.0)

**직접 CLI 메모리 작업:**
- `memory store key "value" --reasoningbank` ❌
- `memory query "search" --reasoningbank` ❌

**근본 원인:** agentic-flow의 ReasoningBank는 `store/query`를 CLI 명령으로 제공하지 않습니다. 이는 독립 실행형 메모리 저장소가 아니라 **에이전트가 작업을 수행하는 동안** 사용하도록 설계되었습니다.

## ReasoningBank가 실제로 동작하는 방식

ReasoningBank는 **에이전트 중심 메모리 시스템**입니다:

```bash
# ✅ 올바른 사용: 에이전트 실행을 통해 사용합니다
npx agentic-flow --agent coder --task "Build REST API using best practices"

# 실행 중 에이전트는 다음을 수행합니다:
# 1. ReasoningBank에서 관련 메모리를 가져옵니다
# 2. 해당 메모리를 활용해 작업을 진행합니다
# 3. 새로운 학습 내용을 ReasoningBank에 다시 저장합니다
# 4. 성공/실패에 따라 신뢰도 점수를 업데이트합니다
```

```bash
# ❌ 잘못된 사용: CLI에서 직접 메모리 작업을 수행합니다
npx claude-flow memory store pattern "..." --reasoningbank
# ReasoningBank에 store/query CLI 명령이 없기 때문에 동작하지 않습니다
```

## 사용 가능한 해결책 (v2.7.0)

### 해결책 1: 기본 메모리 모드 사용 (기본값)

```bash
# 표준 키-값 메모리 (항상 동작합니다)
claude-flow memory store api_pattern "Use environment variables for config"
claude-flow memory query "API"
claude-flow memory stats
```

### 해결책 2: 에이전트를 통해 ReasoningBank 사용

```bash
# ReasoningBank를 초기화합니다
claude-flow memory init --reasoningbank

# agentic-flow 에이전트를 사용합니다 (ReasoningBank를 자동으로 사용합니다)
npx agentic-flow --agent coder --task "Implement user authentication"

# 에이전트는 다음을 수행합니다:
# - ReasoningBank에서 관련 패턴을 조회합니다
# - 과거 성공/실패 사례에서 학습합니다
# - 새로운 학습 내용을 자동으로 저장합니다
```

### 해결책 3: ReasoningBank 도구를 직접 사용

```bash
# 사용 가능한 도구를 확인합니다
npx agentic-flow reasoningbank --help

# 사용 가능한 명령:
npx agentic-flow reasoningbank demo          # 대화형 데모
npx agentic-flow reasoningbank test          # 검증 테스트
npx agentic-flow reasoningbank status        # 통계
npx agentic-flow reasoningbank benchmark     # 성능 테스트
npx agentic-flow reasoningbank consolidate   # 메모리 정리
npx agentic-flow reasoningbank list          # 메모리 목록
```

## v2.7.1 계획

**완전한 CLI 통합:**
- 직접 `store/query` 작업을 구현합니다
- claude-flow 메모리 명령을 ReasoningBank SDK와 연결합니다
- 마이그레이션 도구를 추가합니다: `memory migrate --to reasoningbank`

**구현 계획:**
1. agentic-flow의 ReasoningBank SDK를 직접 가져옵니다
2. SDK 메서드를 claude-flow 메모리 명령으로 래핑합니다
3. 두 모드에서 끊김 없는 경험을 제공합니다

## 현재 우회 방법

ReasoningBank를 초기화한 뒤 학습 기능을 활용하려면:

```bash
# 1. 초기화 (한 번만 수행)
claude-flow memory init --reasoningbank

# 2. 수동 저장을 위해 기본 메모리를 사용합니다
claude-flow memory store api_best_practice "Always validate input"

# 3. AI 학습을 위해 agentic-flow 에이전트를 사용합니다
npx agentic-flow --agent coder --task "Build secure API endpoints"

# 에이전트는 다음을 수행합니다:
# - ReasoningBank에 자동으로 접근합니다
# - 기본 메모리 항목에서 학습합니다
# - 새로운 학습 내용을 신뢰도 점수와 함께 저장합니다
```

##
 아키텍처

```
┌─────────────────────────────────────┐
│      claude-flow memory             │
├─────────────────────────────────────┤
│                                     │
│  Basic Mode (default)               │
│  ├─ store/query/stats ✅            │
│  ├─ JSON file storage               │
│  └─ Fast, simple KV store           │
│                                     │
│  ReasoningBank Mode                 │
│  ├─ init ✅                          │
│  ├─ status ✅                        │
│  ├─ detect ✅                        │
│  ├─ store ❌ (v2.7.1)               │
│  └─ query ❌ (v2.7.1)               │
│                                     │
└─────────────────────────────────────┘
           │
           ├─ Used by ─┐
           │           │
           ▼           ▼
┌────────────────┐  ┌────────────────────┐
│ Basic Memory   │  │  agentic-flow      │
│ (JSON file)    │  │  agents            │
└────────────────┘  │                    │
                    │ ├─ coder           │
                    │ ├─ researcher      │
                    │ ├─ reviewer        │
                    │ └─ etc.            │
                    │                    │
                    │ Uses ReasoningBank │
                    │ automatically ✅    │
                    └────────────────────┘
```

## 요약

**v2.7.0-alpha 상태:**
- ✅ ReasoningBank 초기화는 동작합니다
- ✅ 상태 확인과 모니터링이 동작합니다
- ❌ 직접 store/query CLI는 구현되지 않았습니다
- ✅ 에이전트 기반 사용은 완전히 동작합니다

**권장 접근 방식:**
1. **기본 모드**를 수동 메모리 작업에 사용하세요
2. ReasoningBank로 AI 학습을 수행하려면 **agentic-flow 에이전트**를 사용하세요
3. 완전한 CLI 통합을 위해 **v2.7.1**을 기다리세요

**버그가 아닙니다:**
이는 **구조적 제한**이며 버그가 아닙니다. ReasoningBank는 에이전트 사용을 위해 설계되었고, v2.7.0은 agentic-flow 에이전트를 통해 해당 기능을 올바르게 제공합니다.

v2.7.1 릴리스는 직접 메모리 작업을 위한 편의 CLI 래퍼를 추가할 예정입니다.
