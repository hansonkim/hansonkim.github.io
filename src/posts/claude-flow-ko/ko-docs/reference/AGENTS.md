# 🤖 Claude-Flow Agent 참조

## 65개 이상의 특화된 AI Agent에 대한 완벽한 가이드

Claude-Flow는 엔터프라이즈급 소프트웨어 개발, 조정 및 자동화를 위해 설계된 특화된 AI agent의 포괄적인 생태계를 제공합니다. 각 agent는 특정 작업과 도메인에 최적화되어 지능형 swarm 조정 및 자율 workflow 실행을 가능하게 합니다.

---

## 📊 Agent 개요

| **카테고리** | **수량** | **설명** |
|--------------|-----------|-----------------|
| Core Development | 5 | 필수 개발 agent (coder, planner, researcher, reviewer, tester) |
| Swarm Coordination | 5 | Swarm topology 및 조정 관리 |
| Consensus & Fault Tolerance | 7 | 분산 consensus 및 Byzantine fault tolerance |
| GitHub Integration | 12 | 완벽한 GitHub workflow 자동화 |
| Specialized Domain | 8 | 도메인별 개발 (mobile, ML, backend) |
| Analysis & Code Quality | 6 | 코드 분석, 리뷰 및 품질 보증 |
| Testing & Validation | 4 | 종합 테스팅 및 검증 |
| Infrastructure & DevOps | 5 | CI/CD, 배포 및 인프라 |
| SPARC Methodology | 4 | Specification, Pseudocode, Architecture, Refinement, Code |
| Template & Automation | 9+ | Template 생성 및 자동화 agent |

**총 Agent 수**: 65+

---

## 🏗️ 1. Core Development Agent

### `coder`
**타입**: Implementation Specialist
**목적**: 코드 생성, 리팩토링 및 구현
**주요 기능**:
- TypeScript/JavaScript 코드 생성
- API 구현 및 통합
- Database schema 설계 및 구현
- 코드 리팩토링 및 최적화
- 버그 수정 및 기능 구현

**사용 예제**:
```bash
npx claude-flow@alpha agent spawn coder --name "API-Builder"
npx claude-flow@alpha task assign coder "implement REST API endpoints"
```

### `planner`
**타입**: Strategic Planning
**목적**: 프로젝트 계획, 작업 분해 및 로드맵 작성
**주요 기능**:
- 전략적 프로젝트 계획
- 작업 분해 및 우선순위 지정
- 타임라인 추정 및 마일스톤 계획
- 리소스 할당 계획
- 위험 평가 및 완화 계획

**사용 예제**:
```bash
npx claude-flow@alpha agent spawn planner --name "Project-Strategist"
npx claude-flow@alpha sparc run planner "create microservices architecture plan"
```

### `researcher`
**타입**: Information Gathering
**목적**: 연구, 분석 및 지식 발견
**주요 기능**:
- 기술 연구 및 평가
- 모범 사례 발견
- 시장 및 경쟁사 분석
- 문서 연구
- 문제 공간 탐색

**사용 예제**:
```bash
npx claude-flow@alpha agent spawn researcher --name "Tech-Scout"
npx claude-flow@alpha task assign researcher "research GraphQL best practices"
```

### `reviewer`
**타입**: Quality Assurance
**목적**: 코드 리뷰, 모범 사례 적용
**주요 기능**:
- 코드 품질 평가
- 보안 취약점 탐지
- 모범 사례 적용
- Architecture 리뷰
- 성능 최적화 권장사항

**사용 예제**:
```bash
npx claude-flow@alpha agent spawn reviewer --name "Quality-Guardian"
npx claude-flow@alpha task assign reviewer "review authentication implementation"
```

### `tester`
**타입**: Test Creation
**목적**: Unit test, integration test 및 검증
**주요 기능**:
- Unit test 생성 (Jest, Mocha)
- Integration test 구현
- E2E test 자동화
- Test coverage 분석
- 성능 테스팅

**사용 예제**:
```bash
npx claude-flow@alpha agent spawn tester --name "Test-Master"
npx claude-flow@alpha sparc tdd "user authentication system"
```

---

## 🐝 2. Swarm Coordination Agent

### `hierarchical-coordinator`
**타입**: Queen-Led Coordination
**목적**: 중앙 집중식 지휘 및 통제 구조
**주요 기능**:
- 중앙 집중식 의사 결정
- 작업 위임 및 감독
- 리소스 할당 관리
- 품질 관리 및 검증
- 전략적 방향 설정

**사용 예제**:
```bash
npx claude-flow@alpha swarm init --topology hierarchical --coordinator queen-coordinator
npx claude-flow@alpha agent spawn hierarchical-coordinator --name "Queen-Genesis"
```

### `mesh-coordinator`
**타입**: Peer-to-Peer Coordination
**목적**: 중앙 권한 없는 분산 조정
**주요 기능**:
- Peer-to-peer 작업 조정
- 분산 의사 결정
- Agent 간 부하 분산
- 중복성을 통한 fault tolerance
- 적응형 작업 재분배

**사용 예제**:
```bash
npx claude-flow@alpha swarm init --topology mesh --max-agents 8
npx claude-flow@alpha agent spawn mesh-coordinator --name "Mesh-Alpha"
```

### `adaptive-coordinator`
**타입**: Dynamic Topology Management
**목적**: 작업량 및 조건에 따른 적응형 조정
**주요 기능**:
- 동적 topology 조정
- 실시간 부하 분산
- 성능 기반 agent 선택
- 자동 확장 결정
- 컨텍스트 인식 조정

**사용 예제**:
```bash
npx claude-flow@alpha swarm init --topology adaptive --auto-scale
npx claude-flow@alpha agent spawn adaptive-coordinator --name "Adaptive-Prime"
```

### `collective-intelligence-coordinator`
**타입**: Hive-Mind Coordination
**목적**: 집단 지능 및 공유 지식
**주요 기능**:
- 공유 지식 베이스 관리
- 집단 의사 결정
- 분산 학습 및 적응
- Consensus 기반 계획
- 창발적 지능 조정

**사용 예제**:
```bash
npx claude-flow@alpha hive-mind spawn --collective-intelligence
npx claude-flow@alpha agent spawn collective-intelligence-coordinator --name "Hive-Mind"
```

### `swarm-memory-manager`
**타입**: Distributed Memory Coordination
**목적**: 영구 메모리 및 지식 관리
**주요 기능**:
- 분산 메모리 조정
- 지식 지속성 및 검색
- Agent 간 정보 공유
- 메모리 일관성 관리
- 과거 데이터 관리

**사용 예제**:
```bash
npx claude-flow@alpha agent spawn swarm-memory-manager --name "Memory-Keeper"
npx claude-flow@alpha memory distributed init --coordinator swarm-memory-manager
```

---

## ⚖️ 3. Consensus & Fault Tolerance Agent

### `byzantine-coordinator`
**타입**: Byzantine Fault Tolerance
**목적**: 적대적 조건에서의 fault tolerance
**주요 기능**:
- Byzantine fault tolerance 구현
- 악의적인 agent 탐지
- 보안 consensus protocol
- 네트워크 파티션 처리
- 보안 위협 완화

### `raft-manager`
**타입**: Leader Election
**목적**: Raft consensus 알고리즘 구현
**주요 기능**:
- Leader election 관리
- Log replication 조정
- Consensus 상태 관리
- 장애 탐지 및 복구
- Cluster membership 관리

### `consensus-builder`
**타입**: Decision-Making Coordination
**목적**: 다중 agent consensus 및 의사 결정
**주요 기능**:
- Voting protocol 조정
- Quorum 관리
- 충돌 해결
- 의사 결정 집계
- Consensus 임계값 관리

### `quorum-manager`
**타입**: Quorum Management
**목적**: Quorum 기반 의사 결정
**주요 기능**:
- Quorum 크기 결정
- Voting 조정
- 다수 결정 적용
- 구성원 가용성 추적
- Quorum 복구 관리

### `gossip-coordinator`
**타입**: Gossip Protocol Management
**목적**: 정보 전파 및 조정
**주요 기능**:
- Gossip protocol 구현
- 정보 확산 조정
- 네트워크 topology 유지
- 소문 추적 및 검증
- 전염병 스타일 통신

### `crdt-synchronizer`
**타입**: Conflict-Free Replicated Data Types
**목적**: 분산 데이터 동기화
**주요 기능**:
- CRDT 구현 및 관리
- 충돌 없는 데이터 동기화
- Eventual consistency 조정
- 병합 작업 관리
- 분산 상태 조정

### `security-manager`
**타입**: Security Coordination
**목적**: 보안 및 접근 제어 관리
**주요 기능**:
- 접근 제어 적용
- 보안 정책 관리
- 위협 탐지 및 대응
- 암호화 키 관리
- 감사 추적 유지

---

## 🐙 4. GitHub Integration Agent

### `github-modes`
**타입**: Comprehensive GitHub Integration
**목적**: 완벽한 GitHub workflow 오케스트레이션
**주요 기능**:
- GitHub workflow 오케스트레이션
- 다중 repository 조정
- Branch 관리 및 전략
- Webhook 처리 및 자동화
- GitHub API 통합

### `pr-manager`
**타입**: Pull Request Management
**목적**: 자동화된 PR 관리 및 리뷰
**주요 기능**:
- 자동화된 PR 생성 및 업데이트
- 다중 reviewer 조정
- 충돌 해결 지원
- 리뷰 할당 최적화
- 병합 전략 적용

### `code-review-swarm`
**타입**: Multi-Agent Code Review
**목적**: 분산 코드 리뷰 조정
**주요 기능**:
- 다중 agent 리뷰 조정
- 특화된 리뷰 할당
- 코드 품질 평가
- 보안 취약점 스캔
- 리뷰 consensus 구축

### `issue-tracker`
**타입**: Issue Management
**목적**: 지능형 이슈 추적 및 관리
**주요 기능**:
- 이슈 분류 및 우선순위 지정
- 자동화된 이슈 할당
- 진행 상황 추적 및 보고
- 이슈 관계 매핑
- 해결 조정

### `release-manager`
**타입**: Release Coordination
**목적**: 릴리스 계획 및 배포 조정
**주요 기능**:
- 릴리스 계획 및 일정 수립
- Changelog 생성
- 배포 조정
- Rollback 관리
- 버전 관리

### `repo-architect`
**타입**: Repository Architecture
**목적**: Repository 구조 및 조직
**주요 기능**:
- Repository 구조 설계
- Branching 전략 최적화
- Workflow template 작성
- CI/CD pipeline 설계
- Repository 거버넌스

### `project-board-sync`
**타입**: Project Board Management
**목적**: GitHub project board 동기화
**주요 기능**:
- Project board 자동화
- 카드 이동 조정
- 진행 상황 시각화
- Milestone 추적
- 팀 조정

### `workflow-automation`
**타입**: GitHub Actions Automation
**목적**: GitHub Actions workflow 관리
**주요 기능**:
- Workflow 설계 및 최적화
- Action marketplace 통합
- CI/CD pipeline 관리
- Secret 관리
- Workflow 디버깅

### `sync-coordinator`
**타입**: Multi-Repository Synchronization
**목적**: Repository 간 조정
**주요 기능**:
- Multi-repo 동기화
- Dependency 추적
- Repository 간 이슈 연결
- 통합 릴리스 조정
- Repository 관계 관리

### `swarm-issue`
**타입**: Swarm-Based Issue Resolution
**목적**: 다중 agent 이슈 해결
**주요 기능**:
- Swarm 기반 문제 해결
- 이슈 분해
- 병렬 해결 전략
- 리소스 조정
- 솔루션 통합

### `swarm-pr`
**타입**: Swarm-Based PR Management
**목적**: 다중 agent PR 처리
**주요 기능**:
- 분산 PR 리뷰
- 병렬 개발 조정
- 병합 충돌 해결
- 품질 보증 조정
- Integration 테스팅

### `multi-repo-swarm`
**타입**: Multi-Repository Swarm Coordination
**목적**: 대규모 repository 관리
**주요 기능**:
- Multi-repository 조정
- 분산 개발 관리
- Repository 간 dependency 추적
- 통합 빌드 조정
- 릴리스 동기화

---

## 💻 5. Specialized Domain Agent

### `backend-dev`
**타입**: Server Development
**목적**: API 개발, database 및 서버 측 서비스
**주요 기능**:
- REST/GraphQL API 개발
- Database 설계 및 최적화
- Microservices architecture
- 인증 및 권한 부여
- 서버 측 최적화

### `mobile-dev`
**타입**: Mobile Application Development
**목적**: React Native, iOS 및 Android 개발
**주요 기능**:
- React Native 개발
- Native iOS/Android 통합
- Mobile UI/UX 최적화
- 성능 최적화
- App store 배포

### `ml-developer`
**타입**: Machine Learning
**목적**: 모델 훈련, 배포 및 ML pipeline
**주요 기능**:
- Machine learning 모델 개발
- Data pipeline 작성
- 모델 훈련 및 최적화
- ML 배포 전략
- 성능 모니터링

### `system-architect`
**타입**: High-Level System Design
**목적**: Architecture 설계 및 시스템 계획
**주요 기능**:
- 시스템 architecture 설계
- 확장성 계획
- 기술 스택 선택
- Integration pattern 설계
- 성능 architecture

### `sparc-coder`
**타입**: SPARC TDD Implementation
**목적**: SPARC 방법론을 사용한 test-driven development
**주요 기능**:
- SPARC 방법론 구현
- Test-driven development
- Specification 기반 코딩
- 반복적 개선
- 품질 중심 개발

### `production-validator`
**타입**: Production Validation
**목적**: 실제 환경 검증 및 테스팅
**주요 기능**:
- Production 환경 검증
- 실제 테스팅 시나리오
- 성능 검증
- 보안 평가
- 배포 확인

### `api-docs`
**타입**: API Documentation
**목적**: OpenAPI 및 API 문서 생성
**주요 기능**:
- OpenAPI specification 생성
- API 문서 작성
- Interactive 문서
- 코드 예제 생성
- 문서 유지보수

### `cicd-engineer`
**타입**: CI/CD Pipeline Management
**목적**: 지속적 통합 및 배포
**주요 기능**:
- CI/CD pipeline 설계
- 빌드 자동화
- 배포 전략
- Pipeline 최적화
- Quality gate 구현

---

## 🔍 6. Analysis & Code Quality Agent

### `code-analyzer`
**타입**: Code Analysis
**목적**: 정적 코드 분석 및 품질 평가
**주요 기능**:
- 정적 코드 분석
- 코드 복잡도 평가
- Technical debt 식별
- 리팩토링 권장사항
- 코드 패턴 인식

### `perf-analyzer`
**타입**: Performance Analysis
**목적**: 병목 현상 식별 및 최적화
**주요 기능**:
- 성능 병목 현상 식별
- 리소스 사용량 분석
- 최적화 권장사항
- Load testing 조정
- 성능 모니터링

### `performance-benchmarker`
**타입**: Performance Testing
**목적**: 종합 성능 벤치마킹
**주요 기능**:
- 성능 benchmark 작성
- Load testing 실행
- Stress testing 조정
- 성능 회귀 탐지
- Benchmark 보고

### `analyze-code-quality`
**타입**: Code Quality Assessment
**목적**: 종합 코드 품질 분석
**주요 기능**:
- 코드 품질 metrics
- 유지보수성 평가
- 디자인 패턴 분석
- Code smell 탐지
- 품질 개선 권장사항

### `refactoring-specialist`
**타입**: Code Refactoring
**목적**: 코드 리팩토링 및 개선
**주요 기능**:
- 코드 리팩토링 전략
- 디자인 패턴 구현
- Legacy 코드 현대화
- 성능 최적화
- Architecture 개선

### `security-analyzer`
**타입**: Security Analysis
**목적**: 보안 취약점 평가
**주요 기능**:
- 보안 취약점 스캔
- 위협 모델링
- 보안 모범 사례 적용
- 규정 준수 평가
- 보안 remediation

---

## 🧪 7. Testing & Validation Agent

### `tdd-london-swarm`
**타입**: London-Style TDD
**목적**: London school test-driven development
**주요 기능**:
- Outside-in TDD 접근
- Mock 기반 테스팅
- 행동 specification
- Test isolation
- 설계 창발

### `unit-test-specialist`
**타입**: Unit Testing
**목적**: 종합 unit test 작성
**주요 기능**:
- Unit test 생성
- Test coverage 최적화
- Test 유지보수성
- Assertion 전략
- Test 성능

### `integration-tester`
**타입**: Integration Testing
**목적**: 시스템 integration 검증
**주요 기능**:
- Integration test 설계
- API 테스팅
- Database integration 테스팅
- Service integration 검증
- End-to-end 테스팅

### `e2e-automation`
**타입**: End-to-End Testing
**목적**: 전체 시스템 검증
**주요 기능**:
- E2E test 자동화
- User journey 테스팅
- Cross-browser 테스팅
- Mobile 테스팅
- Visual regression 테스팅

---

## 🏗️ 8. Infrastructure & DevOps Agent

### `ops-cicd-github`
**타입**: GitHub CI/CD Operations
**목적**: GitHub Actions 및 CI/CD 관리
**주요 기능**:
- GitHub Actions workflow 작성
- CI/CD pipeline 최적화
- 배포 자동화
- Environment 관리
- Release 자동화

### `infrastructure-specialist`
**타입**: Infrastructure Management
**목적**: Cloud infrastructure 및 배포
**주요 기능**:
- Infrastructure as Code
- Cloud 리소스 관리
- Container 오케스트레이션
- Networking 구성
- Monitoring 설정

### `deployment-coordinator`
**타입**: Deployment Management
**목적**: Application 배포 조정
**주요 기능**:
- 배포 전략 구현
- Blue-green 배포
- Canary 릴리스
- Rollback 관리
- Environment promotion

### `monitoring-specialist`
**타입**: System Monitoring
**목적**: Application 및 infrastructure 모니터링
**주요 기능**:
- Monitoring 설정 및 구성
- Alert 관리
- 성능 추적
- Log 집계
- Dashboard 작성

### `cloud-architect`
**타입**: Cloud Architecture
**목적**: Cloud-native architecture 설계
**주요 기능**:
- Cloud architecture 설계
- Multi-cloud 전략
- 비용 최적화
- 보안 architecture
- 재해 복구 계획

---

## 📋 9. SPARC Methodology Agent

### `specification`
**타입**: SPARC Specification Phase
**목적**: 요구사항 specification 및 분석
**주요 기능**:
- 요구사항 수집 및 분석
- User story 작성
- Acceptance criteria 정의
- Specification 문서화
- Stakeholder 커뮤니케이션

### `pseudocode`
**타입**: SPARC Pseudocode Phase
**목적**: 알고리즘 설계 및 pseudocode 작성
**주요 기능**:
- 알고리즘 설계
- Pseudocode 생성
- Logic flow 문서화
- 복잡도 분석
- 구현 계획

### `architecture`
**타입**: SPARC Architecture Phase
**목적**: 시스템 architecture 및 설계
**주요 기능**:
- 시스템 architecture 설계
- 구성 요소 상호 작용 설계
- Interface 정의
- 기술 선택
- Architecture 문서화

### `refinement`
**타입**: SPARC Refinement Phase
**목적**: 설계 개선 및 최적화
**주요 기능**:
- 설계 개선
- 성능 최적화
- 보안 강화
- 확장성 개선
- 품질 검증

---

## 🔧 10. Template & Automation Agent

### `base-template-generator`
**타입**: Template Generation
**목적**: Base template 및 scaffold 작성
**주요 기능**:
- 프로젝트 template 생성
- Scaffold 작성
- Boilerplate 코드 생성
- 구성 template 작성
- 문서 template

### `automation-smart-agent`
**타입**: Smart Automation
**목적**: 지능형 자동화 및 workflow 작성
**주요 기능**:
- Workflow 자동화
- 작업 자동화
- 프로세스 최적화
- Rule 기반 자동화
- 지능형 스케줄링

### `coordinator-swarm-init`
**타입**: Swarm Initialization
**목적**: Swarm 설정 및 초기화
**주요 기능**:
- Swarm topology 설정
- Agent 구성
- 통신 채널 설정
- 리소스 할당
- 초기 작업 배분

### `implementer-sparc-coder`
**타입**: SPARC Implementation
**목적**: SPARC 기반 코드 구현
**주요 기능**:
- SPARC 방법론 구현
- Specification에서 코드 생성
- 반복 개발
- 품질 보증
- 문서 생성

### `memory-coordinator`
**타입**: Memory Management
**목적**: 분산 메모리 조정
**주요 기능**:
- 메모리 풀 관리
- 데이터 일관성 조정
- Cache 관리
- 지속성 전략
- 메모리 최적화

### `orchestrator-task`
**타입**: Task Orchestration
**목적**: 복잡한 작업 조정 및 관리
**주요 기능**:
- 작업 분해
- Dependency 관리
- 리소스 스케줄링
- 진행 상황 추적
- 결과 집계

### `performance-analyzer`
**타입**: Performance Analysis
**목적**: 시스템 및 application 성능 분석
**주요 기능**:
- 성능 프로파일링
- 병목 현상 식별
- 리소스 사용률 분석
- 최적화 권장사항
- 성능 보고

### `sparc-coordinator`
**타입**: SPARC Coordination
**목적**: SPARC 방법론 조정
**주요 기능**:
- SPARC 단계 조정
- 프로세스 오케스트레이션
- Quality gate 관리
- Milestone 추적
- Deliverable 조정

### `migration-plan`
**타입**: Migration Planning
**목적**: 시스템 및 데이터 migration 계획
**주요 기능**:
- Migration 전략 개발
- 위험 평가
- 타임라인 계획
- 리소스 할당
- Rollback 계획

---

## 🚀 사용 패턴

### 단일 Agent 사용
```bash
# 개별 agent 생성
npx claude-flow@alpha agent spawn coder --name "API-Builder"
npx claude-flow@alpha agent spawn reviewer --name "Code-Guardian"

# 특정 agent에 작업 할당
npx claude-flow@alpha task assign coder "implement user authentication"
npx claude-flow@alpha task assign tester "create unit tests for auth module"
```

### Swarm Coordination
```bash
# 다양한 swarm topology 초기화
npx claude-flow@alpha swarm init --topology hierarchical --max-agents 8
npx claude-flow@alpha swarm init --topology mesh --agents researcher,coder,tester
npx claude-flow@alpha swarm init --topology adaptive --auto-scale

# 복잡한 프로젝트를 위한 batch agent 생성
npx claude-flow@alpha swarm spawn \
  --agents system-architect,backend-dev,frontend-dev,tester,reviewer \
  --task "build e-commerce platform"
```

### SPARC Development Workflow
```bash
# 전체 SPARC 방법론 실행
npx claude-flow@alpha sparc pipeline "user authentication system"
npx claude-flow@alpha sparc run specification "define user management requirements"
npx claude-flow@alpha sparc run architecture "design auth system architecture"
npx claude-flow@alpha sparc run code "implement authentication module"
```

### GitHub Integration
```bash
# GitHub workflow 자동화
npx claude-flow@alpha github pr-manager "review and merge feature branch"
npx claude-flow@alpha github issue-tracker "manage project issues"
npx claude-flow@alpha github release-manager "prepare v2.0.0 release"
```

---

## 🔗 Agent Coordination Pattern

### Hierarchical Pattern (Queen-Led)
```
Queen (hierarchical-coordinator)
├── Architect (system-architect)
├── Workers (coder, backend-dev, mobile-dev)
├── Quality (reviewer, tester)
└── Guardian (security-analyzer)
```

### Mesh Pattern (Peer-to-Peer)
```
모든 agent가 직접 조정:
coder ↔ reviewer ↔ tester ↔ planner
  ↕       ↕       ↕       ↕
researcher ↔ backend-dev ↔ mobile-dev
```

### Adaptive Pattern (Dynamic)
```
Coordinator (adaptive-coordinator)
├── Dynamic Agent Pool
├── Load Balancer (load-balancer)
├── Performance Monitor (performance-benchmarker)
└── Auto-scaling Logic
```

---

## 📊 Agent 선택 가이드라인

### 프로젝트 타입 → 권장 Agent

**Web Application**:
- Core: `planner`, `system-architect`, `backend-dev`, `coder`, `tester`
- Quality: `reviewer`, `security-analyzer`
- DevOps: `cicd-engineer`, `deployment-coordinator`

**Mobile Application**:
- Core: `planner`, `mobile-dev`, `backend-dev`, `api-docs`
- Quality: `tester`, `performance-benchmarker`
- DevOps: `release-manager`

**Machine Learning Project**:
- Core: `researcher`, `ml-developer`, `data-analyst`
- Quality: `performance-benchmarker`, `production-validator`
- Infrastructure: `cloud-architect`, `monitoring-specialist`

**Enterprise System**:
- Coordination: `hierarchical-coordinator`, `consensus-builder`
- Core: `system-architect`, `backend-dev`, `security-analyzer`
- Quality: `code-review-swarm`, `integration-tester`
- DevOps: `infrastructure-specialist`, `monitoring-specialist`

---

## 🛠️ 고급 구성

### Agent Capabilities Matrix
```yaml
agent_capabilities:
  coder:
    languages: [typescript, javascript, python]
    frameworks: [react, node.js, express]
    tools: [git, npm, docker]
    max_concurrent_tasks: 3

  reviewer:
    analysis_types: [security, performance, quality]
    languages: [typescript, javascript]
    max_review_size: 500_lines

  tester:
    test_types: [unit, integration, e2e]
    frameworks: [jest, cypress, playwright]
    coverage_threshold: 80
```

### 사용자 정의 Agent 생성
```yaml
# .claude/agents/custom/my-specialist.md
---
name: my-specialist
description: 특정 도메인을 위한 사용자 정의 특화 agent
capabilities:
  - domain-specific-capability
  - custom-tool-integration
tools: [custom-tool, domain-api]
priority: high
---

# Custom Agent Implementation
[Agent prompt 및 행동 정의]
```

---

## 🔍 Monitoring & Analytics

### Agent 성능 Metrics
```bash
# Agent 성능 보기
npx claude-flow@alpha metrics agents --detailed
npx claude-flow@alpha performance analyze --agent-type coder
npx claude-flow@alpha swarm status --topology hierarchical
```

### 실시간 Monitoring
```bash
# Swarm coordination 모니터링
npx claude-flow@alpha monitor swarm --real-time
npx claude-flow@alpha dashboard --agents --performance
```

---

## 📚 모범 사례

### 1. Agent 선택
- 작업 요구사항에 맞는 agent 기능 매칭
- Agent 부하 및 가용성 고려
- 도메인별 작업에 특화된 agent 사용
- 복잡한 프로젝트에 swarm coordination 활용

### 2. Swarm Coordination
- 대규모 구조화된 프로젝트에 hierarchical topology 사용
- 협업적 peer-level 작업에 mesh topology 사용
- 동적이고 변화하는 요구사항에 adaptive topology 사용
- 성능 기반 topology 모니터링 및 조정

### 3. 성능 최적화
- Context switching 감소를 위해 유사한 작업 batch 처리
- 지식 공유를 위해 memory coordination 사용
- Agent 리소스 사용량 모니터링 및 할당 최적화
- 적절한 오류 처리 및 복구 구현

### 4. 품질 보증
- Production workflow에 항상 reviewer agent 포함
- 종합 커버리지를 위해 여러 특화 agent 사용
- 중요한 결정에 consensus 메커니즘 구현
- 규정 준수 및 디버깅을 위한 감사 추적 유지

---

## 🚀 향후 로드맵

### 계획된 Agent 타입
- **Quantum Computing Specialist**: Quantum 알고리즘 개발
- **IoT Coordinator**: Internet of Things 장치 관리
- **Blockchain Developer**: Smart contract 및 DApp 개발
- **AI Ethics Auditor**: AI bias 및 윤리 평가
- **Sustainability Analyzer**: 탄소 발자국 및 지속 가능성 평가

### 향상된 기능
- Multi-modal agent 통신
- 고급 학습 및 적응
- 예측적 작업 할당
- 자율 agent 생성
- Cross-platform 통합

---

## 📮 지원 및 리소스

### 문서
- [Agent API Reference](/ko-docs/api/API_DOCUMENTATION.md)
- [Swarm Coordination Guide](/ko-docs/reference/SWARM.md)
- [Architecture Overview](/ko-docs/architecture/ARCHITECTURE.md)

### 커뮤니티
- [GitHub Repository](https://github.com/ruvnet/claude-flow)
- [Discord Community](https://discord.gg/claude-flow)
- [Issue Tracker](https://github.com/ruvnet/claude-flow/issues)

### 연락처
- **Email**: support@claude-flow.ai
- **Documentation**: https://claude-flow.ai/docs
- **Blog**: https://blog.claude-flow.ai

---

<div align="center">

**🤖 65개 이상의 특화된 Agent • 🐝 지능형 Swarm Coordination • 🚀 엔터프라이즈 준비 완료**

[⬆ 맨 위로](#-claude-flow-agent-참조)

</div>
