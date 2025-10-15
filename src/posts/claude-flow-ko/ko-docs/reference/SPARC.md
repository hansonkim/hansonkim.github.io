# SPARC 방법론 문서

## 개요

SPARC (Specification → Pseudocode → Architecture → Refinement → Code)는 다양한 소프트웨어 개발 작업을 위한 구조화된 모드 기반 개발 환경을 제공하는 체계적인 개발 방법론입니다. 이 종합적인 접근 방식은 모든 개발 단계에서 일관되고 고품질의 결과를 보장합니다.

### 핵심 철학

SPARC는 개발을 임시적인 코딩에서 체계적인 엔지니어링으로 전환합니다:

1. **Specification 우선**: 구축하기 전에 무엇을 구축해야 하는지 정의
2. **Pseudocode 계획**: 구현 전에 로직 사고
3. **Architecture 설계**: 시스템 구조 및 관계 계획
4. **Refinement 프로세스**: 설계 및 구현의 반복적 개선
5. **Code 구현**: 명확한 방향 및 검증된 접근 방식으로 실행

### 주요 이점

- **체계적 접근**: 구조화된 방법론을 통한 오류 감소
- **모드 특화**: 각 개발 작업에 최적화된 실행 환경
- **메모리 통합**: 개발 세션 간 지속적인 컨텍스트
- **병렬 실행**: BatchTool을 사용한 여러 모드의 동시 작업
- **품질 보증**: 내장된 모범 사례 및 검증 단계

## SPARC 모드 참조

### 핵심 개발 모드

#### 1. **orchestrator** - 다중 Agent 작업 오케스트레이션
- **목적**: 여러 agent 간 복잡한 개발 작업 조정
- **적합 대상**: 여러 전문가가 필요한 대규모 프로젝트
- **도구**: TodoWrite, TodoRead, Task, Memory, Bash
- **사용 패턴**: 분산 실행을 통한 중앙 조정
- **모범 사례**:
  - 여러 파일 작업에 batch 작업 사용
  - 팀 조정을 위해 Memory에 중간 결과 저장
  - 독립적인 작업에 병렬 실행 활성화
  - 집약적인 작업 중 리소스 사용량 모니터링
  - 팀 관리를 위한 중앙 집중식 조정 활용

#### 2. **coder** - 자율 코드 생성
- **목적**: 모범 사례를 통한 구현 및 코드 생성
- **적합 대상**: 기능 개발, 버그 수정, 코드 리팩토링
- **도구**: Read, Write, Edit, MultiEdit, Bash, TodoWrite
- **사용 패턴**: 테스팅 검증을 통한 직접 구현
- **모범 사례**:
  - 기존 코드 패턴 및 규칙 따르기
  - 새 코드에 대한 종합 테스트 작성
  - 효율성을 위해 batch 파일 작업 사용
  - 적절한 오류 처리 구현
  - 의미 있는 주석 및 문서 추가

#### 3. **architect** - 시스템 설계 및 Architecture
- **목적**: 고수준 시스템 설계 및 architecture 계획
- **적합 대상**: 시스템 architecture, 기술 결정, 디자인 패턴
- **도구**: Write, Memory, TodoWrite, Read
- **사용 패턴**: 분석 → 설계 → 문서화 → 검증
- **모범 사례**:
  - 확장성 및 유지보수성을 위한 설계
  - Architecture 결정 문서화
  - 명확한 구성 요소 경계 생성
  - 미래 확장성 계획
  - 성능 영향 고려

#### 4. **tdd** - Test-Driven Development
- **목적**: London School TDD 방법론 구현
- **적합 대상**: 종합 테스트 커버리지를 통한 기능 개발
- **도구**: Write, Edit, Bash, TodoWrite, Read
- **사용 패턴**: Red → Green → Refactor 사이클
- **모범 사례**:
  - 구현 전에 테스트 작성
  - Red-green-refactor 사이클 따르기
  - 종합 테스트 커버리지 목표
  - Edge case 및 오류 조건 테스트
  - 테스트를 간단하고 집중적으로 유지

### 분석 및 연구 모드

#### 5. **researcher** - 심층 연구 및 분석
- **목적**: 종합 연구 및 정보 수집
- **적합 대상**: 기술 평가, 시장 조사, 요구사항 수집
- **도구**: WebSearch, WebFetch, Read, Memory, TodoWrite
- **사용 패턴**: 검색 → 분석 → 문서화 → 종합
- **모범 사례**:
  - 여러 출처에서 정보 검증
  - 나중에 참조하기 위해 Memory에 발견 사항 저장
  - 구조화된 연구 보고서 작성
  - 데이터 교차 참조 및 검증
  - 출처 및 방법론 문서화

#### 6. **analyst** - 코드 및 데이터 분석
- **목적**: 코드베이스, 성능 및 패턴의 심층 분석
- **적합 대상**: 코드 리뷰, 성능 분석, 기술 부채 평가
- **도구**: Read, Grep, Glob, Memory, TodoWrite
- **사용 패턴**: 발견 → 분석 → 인사이트 → 권장사항
- **모범 사례**:
  - 효율적인 검색 패턴 사용
  - 코드 metrics 분석
  - 패턴 및 이상 현상 식별
  - 분석 결과 저장
  - 실행 가능한 인사이트 생성

### 품질 보증 모드

#### 7. **reviewer** - 코드 리뷰 및 품질 최적화
- **목적**: 종합 코드 리뷰 및 품질 개선
- **적합 대상**: Pull request 리뷰, 코드 품질 감사
- **도구**: Read, Edit, TodoWrite, Memory
- **사용 패턴**: 리뷰 → 분석 → 피드백 → 검증
- **모범 사례**:
  - 보안 취약점 확인
  - 코드가 규칙을 따르는지 검증
  - 성능 개선 제안
  - 적절한 오류 처리 보장
  - 테스트 커버리지 검증

#### 8. **tester** - 종합 테스팅 및 검증
- **목적**: 테스트 생성, 실행 및 검증
- **적합 대상**: 테스트 suite 개발, QA 검증, 회귀 테스팅
- **도구**: Write, Bash, Read, TodoWrite
- **사용 패턴**: 계획 → 구현 → 실행 → 보고
- **모범 사례**:
  - 모든 코드 경로 테스트
  - Edge case 포함
  - 오류 처리 검증
  - 성능 특성 테스트
  - 테스트 실행 자동화

#### 9. **security-review** - 보안 분석 및 강화
- **목적**: 보안 취약점 분석 및 remediation
- **적합 대상**: 보안 감사, 침투 테스팅, 규정 준수 검증
- **도구**: Read, Grep, Bash, Write, TodoWrite
- **사용 패턴**: 평가 → 분석 → Remediation → 검증
- **모범 사례**:
  - OWASP 가이드라인 따르기
  - 일반적인 취약점 확인
  - 입력 sanitization 검증
  - 인증 메커니즘 리뷰
  - 권한 부여 제어 테스트

### 개발 지원 모드

#### 10. **debugger** - 체계적 디버깅
- **목적**: 체계적 접근 방식으로 문제 디버그 및 수정
- **적합 대상**: 버그 조사, 오류 해결, 성능 문제
- **도구**: Read, Edit, Bash, TodoWrite
- **사용 패턴**: 재현 → 분석 → 해결 → 검증
- **모범 사례**:
  - 문제를 일관되게 재현
  - 체계적 디버깅 접근 방식 사용
  - 진단 로깅 추가
  - 증상이 아닌 근본 원인 수정
  - 회귀 방지 테스트 작성

#### 11. **optimizer** - 성능 최적화
- **목적**: 성능 분석 및 최적화
- **적합 대상**: 성능 병목 현상, 리소스 최적화, 확장성
- **도구**: Read, Edit, Bash, Memory, TodoWrite
- **사용 패턴**: 프로파일링 → 분석 → 최적화 → 검증
- **모범 사례**:
  - 최적화 전 프로파일링
  - 병목 현상에 집중
  - 개선 사항 측정
  - 가독성과 성능 균형
  - 최적화 근거 문서화

#### 12. **documenter** - 문서 생성
- **목적**: 기술 문서 작성 및 유지보수
- **적합 대상**: API 문서, 사용자 가이드, 기술 사양
- **도구**: Write, Read, TodoWrite
- **사용 패턴**: 분석 → 구조 → 내용 → 리뷰
- **모범 사례**:
  - 문서를 최신 상태로 유지
  - 예제 포함
  - API를 철저하게 문서화
  - 명확한 언어 사용
  - 논리적으로 구성

### 특화 모드

#### 13. **devops** - DevOps 및 Infrastructure
- **목적**: Infrastructure, CI/CD, 배포 자동화
- **적합 대상**: Pipeline 설정, 컨테이너화, Infrastructure as Code
- **도구**: Write, Bash, Read, TodoWrite
- **사용 패턴**: 계획 → 구성 → 자동화 → 모니터링
- **모범 사례**:
  - 반복 작업 자동화
  - Infrastructure as Code 사용
  - 적절한 모니터링 구현
  - 보안 모범 사례 보장
  - 배포 절차 문서화

#### 14. **integration** - 시스템 통합
- **목적**: API 통합, 서비스 통신, 데이터 흐름
- **적합 대상**: Third-party 통합, microservices 통신
- **도구**: Read, Write, Bash, WebFetch, TodoWrite
- **사용 패턴**: 분석 → 설계 → 구현 → 테스팅
- **모범 사례**:
  - 통합 실패를 우아하게 처리
  - 적절한 재시도 메커니즘 구현
  - 통합 상태 모니터링
  - API contract 문서화
  - 통합 시나리오 테스트

#### 15. **mcp** - MCP Tool 개발
- **목적**: Model Context Protocol tool 개발 및 통합
- **적합 대상**: Claude 통합, tool 개발, protocol 구현
- **도구**: Write, Read, Bash, TodoWrite
- **사용 패턴**: Specification → 구현 → 테스팅 → 통합
- **모범 사례**:
  - MCP specification 따르기
  - 적절한 오류 처리 구현
  - Tool 상호작용 테스트
  - Tool 기능 문서화
  - Protocol 준수 검증

#### 16. **ask** - 요구사항 분석
- **목적**: 요구사항 수집 및 명확화
- **적합 대상**: 프로젝트 범위 지정, 이해관계자 커뮤니케이션, 요구사항 검증
- **도구**: WebSearch, Memory, TodoWrite, Read
- **사용 패턴**: 발견 → 분석 → 명확화 → 문서화
- **모범 사례**:
  - 명확화 질문하기
  - 가정 문서화
  - 이해 검증
  - Edge case 식별
  - 요구사항 우선순위 지정

#### 17. **tutorial** - 교육 콘텐츠 작성
- **목적**: Tutorial 및 학습 콘텐츠 개발
- **적합 대상**: 문서, 교육 자료, 교육 리소스
- **도구**: Write, Read, TodoWrite, WebSearch
- **사용 패턴**: 계획 → 내용 → 예제 → 리뷰
- **모범 사례**:
  - 내용을 논리적으로 구조화
  - 실용적인 예제 포함
  - 모든 코드 예제 테스트
  - 다양한 기술 수준 고려
  - 명확한 다음 단계 제공

## 명령어 구문 및 옵션

### 기본 명령어

```bash
# 사용 가능한 모든 SPARC 모드 목록
npx claude-flow@alpha sparc modes [--verbose]

# 특정 모드에 대한 상세 정보 가져오기
npx claude-flow@alpha sparc info <mode-slug>

# 특정 SPARC 모드에서 작업 실행
npx claude-flow@alpha sparc run <mode> "<task-description>"

# Test-Driven Development workflow 실행
npx claude-flow@alpha sparc tdd "<feature-description>"
```

### 명령어 옵션

#### 전역 Flag
- `--help, -h` - 도움말 정보 표시
- `--verbose, -v` - 상세 출력 활성화
- `--dry-run, -d` - 실행 없이 구성 표시
- `--non-interactive, -n` - 사용자 프롬프트 없이 실행
- `--namespace <name>` - 사용자 정의 메모리 namespace 사용

#### 권한 제어
- `--enable-permissions` - 권한 프롬프트 활성화 (기본값: auto-skip)
- `--dangerously-skip-permissions` - 모든 권한 프롬프트 건너뛰기 (자동 적용)

#### 구성
- `--config <path>` - 사용자 정의 MCP 구성 파일 사용
- `--interactive, -i` - Interactive 모드 활성화 (TDD workflow용)

### 고급 사용 예제

#### 단일 모드 실행
```bash
# 사용자 정의 namespace로 코드 구현
npx claude-flow@alpha sparc run code "implement user authentication" --namespace auth_system

# Verbose 출력으로 architecture 계획
npx claude-flow@alpha sparc run architect "design microservices architecture" --verbose

# 결제 시스템을 위한 test-driven development
npx claude-flow@alpha sparc run tdd "payment processing with validation" --namespace payments

# 기존 코드베이스의 보안 리뷰
npx claude-flow@alpha sparc run security-review "audit authentication system" --verbose

# Non-interactive 모드로 성능 최적화
npx claude-flow@alpha sparc run optimizer "optimize database queries" --non-interactive
```

#### TDD Workflow
```bash
# Interactive TDD workflow (단계별)
npx claude-flow@alpha sparc tdd "user registration system" --interactive

# 자동화된 TDD workflow
npx claude-flow@alpha sparc tdd "shopping cart functionality" --namespace ecommerce

# 사용자 정의 구성으로 TDD
npx claude-flow@alpha sparc tdd "payment gateway integration" --config ./custom-mcp.json
```

## Pipeline 및 Batch 실행

### BatchTool 통합

SPARC 모드는 병렬 및 순차 실행을 위해 BatchTool을 사용하여 오케스트레이션할 수 있습니다:

#### 병렬 실행
```bash
# 여러 모드를 동시에 실행
batchtool run --parallel \
  "npx claude-flow@alpha sparc run architect 'system design' --non-interactive" \
  "npx claude-flow@alpha sparc run security-review 'security requirements' --non-interactive" \
  "npx claude-flow@alpha sparc run researcher 'technology evaluation' --non-interactive"
```

#### 순차 Pipeline
```bash
# 결과 chaining을 통한 순차 실행
batchtool pipeline \
  --stage1 "npx claude-flow@alpha sparc run ask 'gather requirements' --non-interactive" \
  --stage2 "npx claude-flow@alpha sparc run architect 'design system' --non-interactive" \
  --stage3 "npx claude-flow@alpha sparc run code 'implement features' --non-interactive" \
  --stage4 "npx claude-flow@alpha sparc run tdd 'create test suite' --non-interactive"
```

#### Boomerang 패턴
```bash
# 피드백 루프를 통한 반복적 개발
batchtool orchestrate --boomerang \
  --research "npx claude-flow@alpha sparc run researcher 'best practices' --non-interactive" \
  --design "npx claude-flow@alpha sparc run architect 'system design' --non-interactive" \
  --implement "npx claude-flow@alpha sparc run code 'feature implementation' --non-interactive" \
  --test "npx claude-flow@alpha sparc run tdd 'validation suite' --non-interactive" \
  --refine "npx claude-flow@alpha sparc run optimizer 'performance tuning' --non-interactive"
```

### 전체 개발 Pipeline

#### 완전한 기능 개발
```bash
# End-to-end 기능 개발 pipeline
npx claude-flow@alpha sparc pipeline "user authentication system" \
  --phases "ask,architect,security-review,code,tdd,optimizer,documenter" \
  --namespace "auth_feature" \
  --parallel-compatible "ask,security-review,documenter"
```

#### Microservices 개발
```bash
# 병렬 microservices 개발
batchtool run --max-parallel 3 \
  "npx claude-flow@alpha sparc run code 'user service' --namespace users --non-interactive" \
  "npx claude-flow@alpha sparc run code 'order service' --namespace orders --non-interactive" \
  "npx claude-flow@alpha sparc run code 'payment service' --namespace payments --non-interactive" \
  "npx claude-flow@alpha sparc run integration 'service communication' --namespace integration --non-interactive"
```

## TDD Workflow 통합

### London School TDD 방법론

SPARC TDD 모드는 다음 단계로 London School TDD를 구현합니다:

#### 1. 테스트 계획 및 분석 (10분)
- 요구사항 및 기존 architecture 분석
- 테스트 경계 및 acceptance criteria 정의
- 테스트 구조 계획 (unit, integration, e2e)
- 필요한 test double 식별 (mock, stub, spy)

#### 2. Red 단계 - 실패하는 테스트 작성 (20분)
- 종합 테스트 구조 생성
- London School TDD 원칙에 따라 테스트 작성
- Test double을 사용한 행동/계약 테스트에 집중
- 의미 있는 메시지와 함께 모든 테스트 실패 보장

#### 3. Green 단계 - 최소 구현 (20분)
- 테스트를 통과하기에 충분한 코드만 구현
- 한 번에 하나의 테스트 통과
- 모듈성 및 적절한 오류 처리 유지
- 진행하면서 커버리지 추적

#### 4. Refactor 단계 - 최적화 및 정리 (15분)
- 테스트를 green 상태로 유지하면서 리팩토링
- 공통 패턴 추출 및 명확성 개선
- 알고리즘 최적화 및 중복 감소
- 테스트 유지보수성 개선

#### 5. 문서화 및 검증 (10분)
- 커버리지 보고서 생성
- 테스트 시나리오 및 실행 가이드 문서화
- CI/CD 테스트 구성 설정
- Acceptance criteria에 대해 검증

### TDD 명령어 예제

```bash
# Interactive TDD workflow 시작
npx claude-flow@alpha sparc tdd "shopping cart with discounts" --interactive

# 사용자 정의 namespace로 자동화된 TDD
npx claude-flow@alpha sparc tdd "payment validation system" --namespace payments

# Integration testing에 집중한 TDD
npx claude-flow@alpha sparc run tdd "API endpoint with database" --namespace api_tests
```

## Memory Namespace 사용

### Namespace 전략

Memory namespace는 컨텍스트를 구성하고 모드 간 조정을 가능하게 합니다:

#### Namespace 패턴
- `feature_<name>` - 기능 개발 컨텍스트
- `bug_<id>` - 버그 수정 추적
- `arch_<system>` - Architecture 계획
- `test_<suite>` - 테스트 개발
- `integration_<service>` - 통합 작업

#### Memory 작업
```bash
# 진행 상황 및 컨텍스트 저장
npx claude-flow@alpha memory store <namespace>_progress "Current implementation status"
npx claude-flow@alpha memory store <namespace>_decisions "Key architectural decisions"
npx claude-flow@alpha memory store <namespace>_blockers "Current impediments"

# 이전 작업 및 컨텍스트 쿼리
npx claude-flow@alpha memory query <namespace>
npx claude-flow@alpha memory query <namespace>_architecture
npx claude-flow@alpha memory query <namespace>_requirements

# 모든 namespace 목록
npx claude-flow@alpha memory list
```

### 크로스 모드 조정

#### 공유 컨텍스트 예제
```bash
# Architect가 시스템 설계 저장
npx claude-flow@alpha sparc run architect "design user system" --namespace user_feature

# Coder가 architect의 설계를 기반으로 구현
npx claude-flow@alpha sparc run code "implement user CRUD" --namespace user_feature

# Tester가 구현 검증
npx claude-flow@alpha sparc run tdd "test user operations" --namespace user_feature

# 모든 모드가 컨텍스트를 위해 user_feature namespace 공유
```

## 실용적 예제

### 웹 Application 개발

#### Full-Stack 개발 Pipeline
```bash
# 1. 요구사항 및 연구
npx claude-flow@alpha sparc run ask "e-commerce requirements" --namespace ecommerce

# 2. 시스템 architecture
npx claude-flow@alpha sparc run architect "microservices design" --namespace ecommerce

# 3. 병렬 서비스 개발
batchtool run --parallel \
  "npx claude-flow@alpha sparc run code 'user service API' --namespace ecommerce_users --non-interactive" \
  "npx claude-flow@alpha sparc run code 'product catalog API' --namespace ecommerce_products --non-interactive" \
  "npx claude-flow@alpha sparc run code 'order processing API' --namespace ecommerce_orders --non-interactive"

# 4. 통합 및 테스팅
npx claude-flow@alpha sparc run integration "service communication" --namespace ecommerce
npx claude-flow@alpha sparc run tdd "end-to-end testing" --namespace ecommerce

# 5. 보안 및 최적화
batchtool run --parallel \
  "npx claude-flow@alpha sparc run security-review 'security audit' --namespace ecommerce --non-interactive" \
  "npx claude-flow@alpha sparc run optimizer 'performance tuning' --namespace ecommerce --non-interactive"
```

### API 개발

#### TDD를 사용한 RESTful API
```bash
# Test-driven API 개발
npx claude-flow@alpha sparc tdd "RESTful user management API" --namespace user_api

# 인증 layer 추가
npx claude-flow@alpha sparc run security-review "API authentication" --namespace user_api

# 성능 최적화
npx claude-flow@alpha sparc run optimizer "API response times" --namespace user_api

# 문서 생성
npx claude-flow@alpha sparc run documenter "API documentation" --namespace user_api
```

### 버그 수정 Workflow

#### 체계적 버그 해결
```bash
# 1. 연구 및 재현
npx claude-flow@alpha sparc run debugger "investigate login failures" --namespace bug_1234

# 2. 근본 원인 분석
npx claude-flow@alpha sparc run analyst "analyze authentication flow" --namespace bug_1234

# 3. 테스트로 수정 구현
npx claude-flow@alpha sparc run tdd "fix and test authentication" --namespace bug_1234

# 4. 보안 검증
npx claude-flow@alpha sparc run security-review "validate auth fix" --namespace bug_1234
```

### DevOps 및 Infrastructure

#### CI/CD Pipeline 설정
```bash
# Infrastructure 계획
npx claude-flow@alpha sparc run architect "CI/CD architecture" --namespace devops

# Pipeline 구현
npx claude-flow@alpha sparc run devops "GitHub Actions workflow" --namespace devops

# 모니터링 및 alert
npx claude-flow@alpha sparc run devops "application monitoring" --namespace devops

# 문서화
npx claude-flow@alpha sparc run documenter "deployment guide" --namespace devops
```

### 연구 및 분석

#### 기술 평가
```bash
# 연구 단계
npx claude-flow@alpha sparc run researcher "JavaScript framework comparison" --namespace tech_eval

# Architecture 영향
npx claude-flow@alpha sparc run architect "framework integration design" --namespace tech_eval

# Prototype 개발
npx claude-flow@alpha sparc run code "proof of concept" --namespace tech_eval

# 분석 및 권장사항
npx claude-flow@alpha sparc run analyst "framework recommendation" --namespace tech_eval
```

## 모범 사례 및 팁

### 개발 Workflow

#### 1. Specification으로 시작
- 요구사항을 명확히 하기 위해 항상 `ask` 모드로 시작
- 가정 및 제약 조건 문서화
- 구현 전 이해 검증

#### 2. Memory를 효과적으로 사용
- 의미 있는 namespace 계층 구조 생성
- 주요 결정 및 컨텍스트 저장
- 새 작업 시작 전 이전 작업 쿼리

#### 3. 병렬 실행 활용
- 병렬 실행을 위한 독립적인 작업 식별
- 동시 모드 실행을 위해 BatchTool 사용
- 공유 namespace를 통한 결과 조정

#### 4. TDD 원칙 따르기
- 해당되는 경우 구현 전 테스트 작성
- 높은 테스트 커버리지 유지
- 기능 개발을 위해 TDD 모드 사용

#### 5. 성능 최적화
- 최적화 전 프로파일링
- 성능 개선을 위해 optimizer 모드 사용
- 가독성과 성능 균형

### 품질 보증

#### 1. 보안 우선
- 민감한 기능에 대해 항상 security-review 실행
- OWASP 가이드라인 따르기
- 입력 검증 및 출력 sanitization

#### 2. 코드 품질
- 코드 품질 확인을 위해 reviewer 모드 사용
- 확립된 코딩 규칙 따르기
- 코드와 함께 문서 유지

#### 3. 테스팅 전략
- 종합 테스팅 접근 방식 사용 (unit, integration, e2e)
- Edge case 및 오류 조건 테스트
- CI/CD에서 테스트 실행 자동화

### 협업 및 문서화

#### 1. 크로스 모드 조정
- Memory namespace를 통한 컨텍스트 공유
- 일관된 명명 규칙 사용
- 모드 간 dependency 문서화

#### 2. 문서 유지보수
- 코드 변경과 함께 문서를 최신 상태로 유지
- 종합 문서를 위해 documenter 모드 사용
- 예제 및 사용 패턴 포함

#### 3. 진행 상황 추적
- Memory에 진행 상황 업데이트 저장
- 의미 있는 commit 메시지 사용
- 차단 요소 및 해결 방법 추적

### 일반 패턴

#### 1. Boomerang 개발
연구 → 설계 → 구현 → 테스트 → 최적화 → 루프 백

#### 2. 병렬 기능 개발
조정과 함께 동시에 개발되는 여러 기능

#### 3. Pipeline 개발
특화된 모드 간 hand-off를 통한 순차 단계

#### 4. 반복적 개선
여러 최적화 사이클을 통한 지속적 개선

### 성능 최적화

#### 1. Batch 작업
- 가능한 경우 batch 파일 작업 사용
- 모드 간 컨텍스트 전환 최소화
- 독립적인 작업에 병렬 실행 활용

#### 2. Memory 관리
- 집중된 memory namespace 사용
- 구식 컨텍스트 정리
- 공통 컨텍스트를 효율적으로 공유

#### 3. 리소스 활용
- 집약적인 작업 중 리소스 사용량 모니터링
- 자동화를 위해 non-interactive 모드 사용
- 병렬성과 리소스 제약 균형

### 문제 해결

#### 일반적인 문제 및 솔루션

1. **모드를 찾을 수 없음**
   - 프로젝트 디렉토리에 `.roomodes` 파일이 있는지 확인
   - SPARC 환경 설정을 위해 `npx claude-flow@alpha init --sparc` 실행

2. **권한 문제**
   - 수동 제어를 위해 `--enable-permissions` 사용
   - 기본 동작은 효율성을 위해 `--dangerously-skip-permissions` 사용

3. **Memory Namespace 충돌**
   - 고유한 namespace 이름 사용
   - `npx claude-flow@alpha memory list`로 기존 namespace 쿼리

4. **BatchTool 통합**
   - BatchTool이 설치 및 구성되었는지 확인
   - 병렬 실행을 위해 `--non-interactive` flag 사용

5. **성능 문제**
   - 디버깅을 위해 `--verbose` flag 사용
   - 리소스 사용량 모니터링
   - 병렬성 감소 고려

### 고급 구성

#### 사용자 정의 모드 개발
`.roomodes` 구성을 확장하여 사용자 정의 SPARC 모드 생성:

```json
{
  "customModes": [
    {
      "name": "Custom Mode",
      "slug": "custom",
      "roleDefinition": "Custom role description",
      "customInstructions": "Specific instructions",
      "groups": ["read", "edit", "command"],
      "source": "custom"
    }
  ]
}
```

#### IDE와의 통합
- SPARC 명령어를 인식하도록 IDE 구성
- 일반 작업을 위한 키보드 단축키 설정
- IDE 작업 runner와 통합

#### CI/CD 통합
- 자동화된 pipeline에서 SPARC 모드 사용
- 빌드 프로세스를 위한 병렬 실행 구성
- 컨텍스트 공유를 위한 memory 지속성 통합

---

## 요약

SPARC는 임시적인 코딩을 체계적인 엔지니어링으로 전환하는 종합적인 모드 기반 개발 방법론을 제공합니다. 특화된 모드, memory 지속성 및 병렬 실행 기능을 활용하여 SPARC는 대규모로 효율적이고 고품질의 소프트웨어 개발을 가능하게 합니다.

주요 장점:
- **체계적 접근**: 구조화된 방법론이 오류를 줄임
- **모드 특화**: 특정 작업에 최적화된 환경
- **병렬 실행**: BatchTool 통합을 통한 동시 개발
- **Memory 지속성**: 개발 세션 간 컨텍스트 공유
- **품질 보증**: 내장된 모범 사례 및 검증

`npx claude-flow@alpha sparc modes`로 사용 가능한 모드를 탐색하고 `npx claude-flow@alpha sparc run <mode> "<task>"`를 사용하여 SPARC로 체계적인 개발을 시작하세요.
