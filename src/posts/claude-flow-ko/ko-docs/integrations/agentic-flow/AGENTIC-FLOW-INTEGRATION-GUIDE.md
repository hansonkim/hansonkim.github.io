# Claude-Flow를 위한 Agentic-Flow 통합 가이드

## 🎯 개요

Claude-Flow v2.6.0+는 agentic-flow와의 깊은 통합을 포함하여, 66개 이상의 전문 AI agent, 멀티 프로바이더 지원, ReasoningBank 메모리, 지능형 모델 최적화 기능을 제공합니다.

## 🚀 빠른 시작

```bash
# 학습 agent를 위해 ReasoningBank를 초기화합니다
claude-flow agent memory init

# 첫 번째 agent를 실행합니다
claude-flow agent run coder "인증 기능이 있는 REST API를 구축하세요"

# 메모리를 활성화하여 실행합니다 (경험으로부터 학습)
claude-flow agent run coder "사용자 관리 API를 추가하세요" --enable-memory

# agent가 무엇을 학습했는지 확인합니다
claude-flow agent memory status
```

## 📚 전체 명령어 참조

### 1. Agent 실행

#### 기본 Agent 실행

```bash
# 66개 이상의 사용 가능한 agent 중 하나를 실행합니다
claude-flow agent run <agent-type> "<task>" [options]

# 예시
claude-flow agent run coder "Express.js REST API를 생성하세요"
claude-flow agent run researcher "GraphQL أفضل الممارسات을 연구하세요"
claude-flow agent run security-auditor "인증 코드를 감사합니다"
claude-flow agent run full-stack-developer "Next.js 앱을 구축하세요"
claude-flow agent run tester "Jest 테스트 스위트를 생성하세요"
```

#### 멀티 프로바이더 지원

```bash
# 다른 LLM 프로바이더를 사용합니다
claude-flow agent run coder "API 구축" --provider anthropic
claude-flow agent run coder "API 구축" --provider openrouter
claude-flow agent run coder "API 구축" --provider onnx        # 로컬
claude-flow agent run coder "API 구축" --provider gemini

# 특정 모델 지정
claude-flow agent run coder "API 구축" --provider anthropic --model claude-3-5-sonnet-20241022
claude-flow agent run coder "API 구축" --provider openrouter --model meta-llama/llama-3.1-70b-instruct
```

#### 실행 옵션

```bash
# Temperature 제어 (창의성 vs 일관성)
claude-flow agent run coder "코드 작성" --temperature 0.3

# 최대 토큰 (출력 길이)
claude-flow agent run researcher "주제 연구" --max-tokens 4096

# 출력 형식
claude-flow agent run analyst "데이터 분석" --format json
claude-flow agent run researcher "연구" --format markdown

# 스트리밍 출력
claude-flow agent run coder "API 구축" --stream

# 상세 로깅
claude-flow agent run coder "API 구축" --verbose

# 오류 시 재시도
claude-flow agent run coder "API 구축" --retry

# 사용자 지정 타임아웃
claude-flow agent run coder "복잡한 작업" --timeout 600000  # 10분
```

### 2. 모델 최적화 (85-98% 비용 절감)

```bash
# 작업에 따라 최적의 모델을 자동 선택합니다
claude-flow agent run coder "간단한 버그 수정" --optimize

# 비용 최적화 (작동하는 가장 저렴한 모델)
claude-flow agent run coder "로깅 추가" --optimize --priority cost

# 품질 최적화 (최고의 모델)
claude-flow agent run coder "중요한 보안 수정" --optimize --priority quality

# 속도 최적화 (가장 빠른 모델)
claude-flow agent run coder "빠른 리팩토링" --optimize --priority speed

# 개인정보 보호 최적화 (로컬 모델만)
claude-flow agent run coder "민감한 코드" --optimize --priority privacy

# 균형 잡힌 최적화 (비용 + 품질)
claude-flow agent run coder "기능 구현" --optimize --priority balanced

# 예산 한도 설정
claude-flow agent run coder "API 구축" --optimize --max-cost 0.10  # 최대 $0.10
```

### 3. ReasoningBank 메모리 시스템

#### 메모리 초기화

```bash
# 처음 설정
claude-flow agent memory init

# 사용자 지정 데이터베이스 위치
claude-flow agent memory init --db /path/to/memory.db
```

#### 메모리를 사용하여 Agent 실행

```bash
# 경험으로부터 학습 활성화
claude-flow agent run coder "인증 API 구축" --enable-memory

# 도메인 필터링 사용 (메모리 정리)
claude-flow agent run coder "JWT 인증 추가" --enable-memory --memory-domain authentication

# 메모리 검색 사용자 지정
claude-flow agent run coder "OAuth 추가" --enable-memory \
  --memory-k 5 \
  --memory-min-confidence 0.7 \
  --memory-domain authentication

# 추적을 위한 사용자 지정 작업 ID
claude-flow agent run coder "앱 배포" --enable-memory \
  --memory-task-id deploy-v1.0.0

# 새 메모리를 생성하지 않고 메모리 읽기
claude-flow agent run researcher "패턴 확인" --enable-memory --no-memory-learning

# 사용자 지정 메모리 데이터베이스
claude-flow agent run coder "API 구축" --enable-memory --memory-db .swarm/custom.db
```

#### 메모리 관리

```bash
# 메모리 통계 확인
claude-flow agent memory status

# 저장된 메모리 목록
claude-flow agent memory list
claude-flow agent memory list --domain authentication
claude-flow agent memory list --limit 20

# 통합 (중복 제거 및 정리)
claude-flow agent memory consolidate

# 대화형 데모 실행 (0% → 100% 학습 과정 확인)
claude-flow agent memory demo

# 유효성 검사 테스트 실행
claude-flow agent memory test

# 성능 벤치마크 실행
claude-flow agent memory benchmark
```

### 4. Agent 탐색 및 관리

```bash
# 66개 이상의 사용 가능한 모든 agent 목록
claude-flow agent agents

# 상세 agent 정보 얻기
claude-flow agent info coder
claude-flow agent info security-auditor
claude-flow agent info full-stack-developer

# 사용자 지정 agent 생성
claude-flow agent create \
  --name "api-specialist" \
  --description "REST API 설계 전문가" \
  --category "backend" \
  --prompt "당신은 REST API 설계 전문가입니다..." \
  --tools "web-search,code-execution"

# agent 충돌 확인 (패키지 vs 로컬)
claude-flow agent conflicts
```

### 5. 구성 관리

```bash
# 대화형 설정 마법사
claude-flow agent config wizard

# API 키 설정
claude-flow agent config set ANTHROPIC_API_KEY sk-ant-xxx
claude-flow agent config set OPENROUTER_API_KEY sk-or-xxx
claude-flow agent config set GOOGLE_GEMINI_API_KEY xxx

# 기본 프로바이더/모델 설정
claude-flow agent config set DEFAULT_PROVIDER anthropic
claude-flow agent config set DEFAULT_MODEL claude-3-5-sonnet-20241022

# 구성 가져오기
claude-flow agent config get ANTHROPIC_API_KEY
claude-flow agent config get DEFAULT_PROVIDER

# 모든 구성 목록
claude-flow agent config list
claude-flow agent config list --show-secrets

# 구성 삭제
claude-flow agent config delete OPENROUTER_API_KEY

# 기본값으로 재설정
claude-flow agent config reset --force
```

### 6. MCP 서버 관리

```bash
# MCP 서버 시작
claude-flow agent mcp start
claude-flow agent mcp start --port 3000
claude-flow agent mcp start --daemon  # 백그라운드에서 실행

# 서버 상태 확인
claude-flow agent mcp status
claude-flow agent mcp status --detailed

# 사용 가능한 MCP 도구 목록
claude-flow agent mcp list
claude-flow agent mcp list --server agent-booster
claude-flow agent mcp list --category "code-editing"

# 로그 보기
claude-flow agent mcp logs
claude-flow agent mcp logs --lines 100
claude-flow agent mcp logs --follow

# 서버 중지/재시작
claude-flow agent mcp stop
claude-flow agent mcp restart
```

## 🧠 ReasoningBank 학습 워크플로우

### 전체 예시: 인증 시스템 구축

```bash
# 1단계: 메모리 시스템 초기화
claude-flow agent memory init

# 2단계: JWT 인증 구축 (첫 시도)
claude-flow agent run coder "Express.js로 JWT 인증 구축" \
  --enable-memory \
  --memory-domain authentication/jwt \
  --memory-task-id auth-v1 \
  --format markdown

# 3단계: OAuth2 추가 (JWT 경험에서 학습)
claude-flow agent run coder "OAuth2 인증 추가" \
  --enable-memory \
  --memory-domain authentication/oauth \
  --memory-k 5

# 4단계: 학습 내용 확인
claude-flow agent memory list --domain authentication

# 출력은 다음과 같은 메모리를 보여줍니다:
# 1. JWT 토큰 유효성 검사 패턴
#    신뢰도: 0.85 | 사용 횟수: 2 | 생성일: 2025-10-12
#    도메인: authentication/jwt
#    데이터베이스 쿼리 전에 항상 JWT 만료를 확인하세요
#
# 2. OAuth2 토큰 갱신 전략
#    신뢰도: 0.80 | 사용 횟수: 1 | 생성일: 2025-10-12
#    도메인: authentication/oauth
#    갱신 토큰을 안전하게 저장하고 순환을 구현하세요

# 5단계: 새 인증 방법 추가 (JWT 및 OAuth 메모리 모두 활용)
claude-flow agent run coder "SAML SSO 인증 추가" \
  --enable-memory \
  --memory-domain authentication/saml \
  --memory-k 5 \
  --memory-min-confidence 0.7

# 6단계: 메모리 통합 (중복 제거, 오래된 메모리 정리)
claude-flow agent memory consolidate

# 7단계: 개선된 통계 확인
claude-flow agent memory status
```

## 🔥 고급 사용 패턴

### 패턴 1: 메모리를 사용한 점진적 향상

```bash
# 1일차: 초기 기능 구축
claude-flow agent run full-stack-developer "사용자 프로필 페이지 구축" \
  --enable-memory \
  --memory-domain profiles \
  --provider anthropic

# 2일차: 관련 기능 추가 (1일차에서 학습)
claude-flow agent run full-stack-developer "프로필 사진 업로드 추가" \
  --enable-memory \
  --memory-domain profiles \
  --memory-k 5

# 3일차: 또 다른 관련 기능 추가 (1-2일차에서 학습)
claude-flow agent run full-stack-developer "프로필 설정 페이지 추가" \
  --enable-memory \
  --memory-domain profiles \
  --memory-k 5

# 결과: 각 반복이 더 빠르고 일관성 있게 됩니다
```

### 패턴 2: 비용 최적화 개발

```bash
# 간단한 작업에는 저렴한 모델 사용
claude-flow agent run coder "콘솔 로깅 추가" \
  --optimize --priority cost \
  --enable-memory

# 복잡한 작업에는 고품질 모델 사용
claude-flow agent run coder "분산 캐싱 구현" \
  --optimize --priority quality \
  --max-cost 0.50 \
  --enable-memory

# 작업에 따라 최적화 프로그램이 결정하도록 함
claude-flow agent run coder "인증 모듈 리팩토링" \
  --optimize --priority balanced \
  --enable-memory
```

### 패턴 3: 멀티 에이전트 워크플로우

```bash
# 연구 단계
claude-flow agent run researcher "인증을 위한 GraphQL أفضل الممارسات 연구" \
  --enable-memory \
  --memory-domain research/graphql \
  --format markdown

# 설계 단계
claude-flow agent run system-architect "인증을 위한 GraphQL API 스키마 설계" \
  --enable-memory \
  --memory-domain design/graphql \
  --memory-k 5

# 구현 단계
claude-flow agent run coder "GraphQL 인증 API 구현" \
  --enable-memory \
  --memory-domain implementation/graphql \
  --memory-k 10

# 테스트 단계
claude-flow agent run tester "포괄적인 GraphQL API 테스트 생성" \
  --enable-memory \
  --memory-domain testing/graphql \
  --memory-k 5

# 검토 단계
claude-flow agent run security-auditor "GraphQL 인증 보안 감사" \
  --enable-memory \
  --memory-domain security/graphql \
  --memory-k 10

# 축적된 지식 확인
claude-flow agent memory list --domain graphql
```

### 패턴 4: 도메인 특정 지식 구축

```bash
# 보안 지식 기반 구축
for task in \
  "입력 유효성 검사 구현" \
  "SQL 인젝션 방지 추가" \
  "CSRF 보호 구현" \
  "XSS 방지 추가" \
  "속도 제한 구현"
do
  claude-flow agent run security-auditor "$task" \
    --enable-memory \
    --memory-domain security \
    --memory-k 10
done

# 이제 보안 agent는 포괄적인 보안 지식을 갖게 됩니다
claude-flow agent memory list --domain security
```

### 패턴 5: ONNX를 사용한 로컬 개발

```bash
# 완전히 로컬에서 실행 (API 호출 없음)
claude-flow agent run coder "함수에 로깅 추가" \
  --provider onnx \
  --enable-memory

# 장점:
# - 비용 $0
# - 개인정보 보호 (코드가 머신을 떠나지 않음)
# - API 키 필요 없음
# - 간단한 작업에 좋음
```

## 🔗 Claude-Flow Swarm과의 통합

agentic-flow agent를 claude-flow swarm 조정과 결합합니다:

```bash
# agentic-flow agent로 swarm 초기화
claude-flow swarm init --topology mesh --agents 5

# 각 agent는 메모리와 함께 agentic-flow를 통해 실행됩니다
claude-flow agent run coder "API 엔드포인트 구축" --enable-memory &
claude-flow agent run tester "테스트 생성" --enable-memory &
claude-flow agent run security-auditor "보안 검토" --enable-memory &

# swarm 상태 확인
claude-flow swarm status
```

## 📊 ReasoningBank 성능 이해

### 메모리 점수 공식

```
score = α·similarity + β·recency + γ·reliability + δ·diversity

기본 가중치:
- α (유사성)  = 0.7  // 의미적 관련성
- β (최신성)     = 0.2  // 얼마나 최근인가
- γ (신뢰성) = 0.1  // 과거 사용으로부터의 신뢰도
- δ (다양성)   = 0.3  // MMR 다양성 선택
```

### 점수 사용자 지정 (환경 변수)

```bash
# 가중치 조정
export REASONINGBANK_ALPHA=0.8    # 유사성 우선
export REASONINGBANK_BETA=0.1     # 최신성에 가중치 낮춤
export REASONINGBANK_GAMMA=0.1    # 신뢰성 가중치 유지
export REASONINGBANK_DELTA=0.2    # 다양성 낮춤

# 기타 설정
export REASONINGBANK_K=5                      # 상위 5개 메모리 검색
export REASONINGBANK_MIN_CONFIDENCE=0.7       # 더 높은 품질 임계값
export REASONINGBANK_RECENCY_HALFLIFE=14      # 2주 반감기

# 데이터베이스 위치
export CLAUDE_FLOW_DB_PATH=.swarm/team-memory.db
```

### 성능 지표

메모리와 함께 agent를 실행한 후 개선 사항을 확인합니다:

```bash
claude-flow agent memory status
```

예상 지표:
- **성공률**: 70% → 88% (+26%)
- **토큰 사용량**: -25% 감소
- **학습 속도**: 3.2배 빠름
- **작업 완료**: 5회 반복 후 0% → 95%

## 🎯 실제 예시

### 예시 1: 완전한 REST API 구축

```bash
#!/bin/bash

# 메모리 초기화
claude-flow agent memory init

# 연구 단계
claude-flow agent run researcher "2025년 Express.js REST API أفضل الممارسات 연구" \
  --enable-memory \
  --memory-domain api/research \
  --format markdown > research-notes.md

# 아키텍처 단계
claude-flow agent run system-architect "작업 관리를 위한 REST API 아키텍처 설계" \
  --enable-memory \
  --memory-domain api/architecture \
  --memory-k 5

# 구현 단계 - 핵심 API
claude-flow agent run full-stack-developer "PostgreSQL로 Express.js REST API 구현" \
  --enable-memory \
  --memory-domain api/implementation \
  --memory-k 10 \
  --optimize --priority balanced

# 구현 단계 - 인증
claude-flow agent run coder "API에 JWT 인증 추가" \
  --enable-memory \
  --memory-domain api/authentication \
  --memory-k 10

# 구현 단계 - 유효성 검사
claude-flow agent run coder "Joi로 입력 유효성 검사 추가" \
  --enable-memory \
  --memory-domain api/validation \
  --memory-k 10

# 테스트 단계
claude-flow agent run tester "포괄적인 Jest 테스트 스위트 생성" \
  --enable-memory \
  --memory-domain api/testing \
  --memory-k 15

# 보안 감사
claude-flow agent run security-auditor "API 보안 취약점 감사" \
  --enable-memory \
  --memory-domain api/security \
  --memory-k 15

# 성능 최적화
claude-flow agent run performance-optimizer "API 성능 최적화" \
  --enable-memory \
  --memory-domain api/performance \
  --memory-k 10

# 문서화
claude-flow agent run technical-writer "API 문서 생성" \
  --enable-memory \
  --memory-domain api/documentation \
  --format markdown > API-DOCS.md

# 학습 내용 확인
echo "\n📚 축적된 지식:"
claude-flow agent memory list --domain api --limit 20

# 메모리 통합
claude-flow agent memory consolidate
```

### 예시 2: 메모리를 사용한 디버깅

```bash
# 첫 번째 버그: 데이터베이스 연결 시간 초과
claude-flow agent run debugger "PostgreSQL 연결 시간 초과 오류 수정" \
  --enable-memory \
  --memory-domain debugging/database \
  --memory-task-id bug-001

# 두 번째 버그: 유사한 데이터베이스 문제 (첫 번째에서 학습)
claude-flow agent run debugger "트랜잭션에서 데이터베이스 교착 상태 수정" \
  --enable-memory \
  --memory-domain debugging/database \
  --memory-k 10 \
  --memory-task-id bug-002

# 결과: agent가 다음을 기억하기 때문에 두 번째 수정이 더 빠릅니다:
# - 데이터베이스 연결 풀 구성
# - 트랜잭션 격리 수준
# - 일반적인 PostgreSQL 문제
```

### 예시 3: 마이그레이션 프로젝트

```bash
# 1단계: 기존 코드 분석
claude-flow agent run code-analyzer "Express.js v4 API 구조 분석" \
  --enable-memory \
  --memory-domain migration/analysis

# 2단계: 마이그레이션 계획
claude-flow agent run system-architect "Express.js v4에서 v5로 마이그레이션 계획" \
  --enable-memory \
  --memory-domain migration/planning \
  --memory-k 5

# 3단계: 마이그레이션 실행 (1-2단계에서 이점)
claude-flow agent run full-stack-developer "Express.js v4를 v5로 마이그레이션" \
  --enable-memory \
  --memory-domain migration/implementation \
  --memory-k 10

# 4단계: 마이그레이션 검증
claude-flow agent run tester "마이그레이션 검증 테스트 생성" \
  --enable-memory \
  --memory-domain migration/testing \
  --memory-k 10
```

## 🔍 문제 해결

### 문제: Agent 실행 실패

```bash
# 구성 확인
claude-flow agent config list

# API 키 설정 확인
claude-flow agent config get ANTHROPIC_API_KEY

# 명시적 프로바이더로 시도
claude-flow agent run coder "테스트 작업" --provider anthropic

# 상세 출력 확인
claude-flow agent run coder "테스트 작업" --verbose
```

### 문제: 메모리가 작동하지 않음

```bash
# 메모리가 초기화되었는지 확인
claude-flow agent memory status

# 필요한 경우 다시 초기화
claude-flow agent memory init

# 데모로 테스트
claude-flow agent memory demo

# 데이터베이스 존재 여부 확인
ls -la .swarm/memory.db
```

### 문제: 느린 성능

```bash
# 모델 최적화 사용
claude-flow agent run coder "작업" --optimize --priority speed

# 메모리 검색 줄이기
claude-flow agent run coder "작업" --enable-memory --memory-k 3

# 오래된 메모리 통합
claude-flow agent memory consolidate
```

### 문제: 메모리 부족 오류

```bash
# 오래된 메모리를 정리하기 위해 통합
claude-flow agent memory consolidate

# 메모리 통계 확인
claude-flow agent memory status

# 너무 크면 새 데이터베이스 사용
claude-flow agent run coder "작업" --enable-memory --memory-db .swarm/new.db
```

## 📈 أفضل الممارسات

### 1. 메모리 구성

```bash
# 계층적 도메인 사용
--memory-domain project/feature/aspect

# 예시:
--memory-domain ecommerce/auth/jwt
--memory-domain ecommerce/cart/checkout
--memory-domain ecommerce/payments/stripe
```

### 2. 점진적 학습

```bash
# 간단하게 시작하여 지식 구축
claude-flow agent run coder "간단한 API 구축" --enable-memory
claude-flow agent run coder "유효성 검사 추가" --enable-memory --memory-k 5
claude-flow agent run coder "인증 추가" --enable-memory --memory-k 10
claude-flow agent run coder "속도 제한 추가" --enable-memory --memory-k 15
```

### 3. 비용 최적화

```bash
# optimize 플래그를 일관되게 사용
alias cf-run='claude-flow agent run --optimize --enable-memory'

# 그런 다음 정상적으로 사용
cf-run coder "기능 구축"
cf-run tester "테스트 생성"
```

### 4. 정기 유지보수

```bash
# 주간: 메모리 통합
claude-flow agent memory consolidate

# 월간: 메모리 상태 확인
claude-flow agent memory status
claude-flow agent memory benchmark
```

## 🚀 직접적인 agentic-flow 사용에서 마이그레이션

현재 `npx agentic-flow`를 직접 사용하고 있다면:

### 이전 (직접 agentic-flow):
```bash
npx agentic-flow --agent coder --task "API 구축" \
  --provider anthropic \
  --enable-memory \
  --memory-domain api
```

### 이후 (claude-flow를 통해):
```bash
claude-flow agent run coder "API 구축" \
  --provider anthropic \
  --enable-memory \
  --memory-domain api
```

### claude-flow 래퍼 사용의 이점:
1. 더 짧은 명령어
2. claude-flow swarm과 통합
3. 더 나은 오류 처리
4. 일관된 로깅
5. claude-flow 훅에 접근
6. 통합된 구성
7. 더 쉬운 MCP 통합

## 🔗 관련 문서

- **ReasoningBank 논문**: https://arxiv.org/html/2509.25140v1
- **Agent 생성 가이드**: `ko-docs/REASONINGBANK-AGENT-CREATION-GUIDE.md`
- **Reasoning Agents**: `.claude/agents/reasoning/README.md`
- **사용 가능한 Agents**: `claude-flow agent agents` 실행

## 🆘 지원

- GitHub Issues: https://github.com/ruvnet/claude-flow/issues
- Agentic-Flow Issues: https://github.com/ruvnet/agentic-flow/issues
- 문서: https://github.com/ruvnet/claude-flow

---

**버전**: 2.6.0+
**마지막 업데이트**: 2025-10-12
**상태**: 프로덕션 준비 완료

```