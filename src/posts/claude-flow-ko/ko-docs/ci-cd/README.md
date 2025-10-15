# 🚀 CI/CD Pipeline 문서

이 문서는 Claude Flow를 위한 GitHub Actions CI/CD pipeline에 대한 종합 정보를 제공합니다.

## 📊 Pipeline 개요

우리의 CI/CD pipeline은 코드 품질, 안정성, 자동화된 배포 관리를 보장하기 위해 설계된 4가지 주요 workflow로 구성됩니다:

1. **🔍 Verification Pipeline** - 종합 코드 검증 및 품질 확인
2. **🎯 Truth Scoring Pipeline** - Pull request에 대한 자동화된 truth scoring
3. **🔗 Cross-Agent Integration Tests** - 다중 agent 시스템 통합 테스트
4. **🔄 Automated Rollback Manager** - 지능형 rollback 관리

## 🔍 Verification Pipeline

**파일:** `.github/workflows/verification-pipeline.yml`

### 목적
보안, 품질, 테스트, 빌드 검증을 포함한 코드 변경 사항의 종합 검증.

### Trigger
- `main`, `develop`, `alpha-*` 브랜치로 push
- `main`, `develop`로의 pull request
- 수동 dispatch

### Job

#### 🚀 Setup Verification
- 고유한 verification ID 생성
- 다중 플랫폼 테스트를 위한 테스트 matrix 설정
- 더 빠른 실행을 위한 종속성 캐싱

#### 🛡️ Security Verification
- `npm audit`을 사용한 보안 감사
- 라이선스 준수 확인
- 종속성 취약점 스캔
- 보안 리포트 생성

#### 📝 Code Quality
- JSON 리포팅을 사용한 ESLint 분석
- TypeScript 타입 검사
- 코드 포맷팅 검증
- 복잡도 분석

#### 🧪 Test Verification
- 다중 플랫폼 테스트 (Ubuntu, macOS, Windows)
- 다중 Node.js 버전 (18, 20)
- Unit, integration, performance 테스트
- 커버리지 리포팅

#### 🏗️ Build Verification
- TypeScript 컴파일
- Binary 빌드 (선택사항)
- CLI 기능 테스트
- Package 생성

#### 📚 Documentation Verification
- 문서 파일 존재 확인
- markdown 파일의 링크 검증
- Package.json 검증

#### ⚡ Performance Verification
- 성능 벤치마킹
- 메모리 누수 감지
- 리소스 사용량 모니터링

#### 📊 Verification Report
- 모든 검증 결과 집계
- 종합 리포트 생성
- 상태 배지 업데이트
- 결과와 함께 PR 코멘트 게시

### Artifact
- 보안 리포트 (30일 보존)
- 품질 리포트 (30일 보존)
- 테스트 결과 (30일 보존)
- 빌드 artifact (30일 보존)
- 성능 리포트 (30일 보존)
- Verification 요약 (90일 보존)

## 🎯 Truth Scoring Pipeline

**파일:** `.github/workflows/truth-scoring.yml`

### 목적
다중 지표를 사용하여 코드 변경 사항의 "정확성"과 품질을 평가하는 자동화된 점수 시스템.

### 점수 구성요소

#### 📝 Code Accuracy Scoring (35% 가중치)
- ESLint 오류 및 경고 분석
- TypeScript 컴파일 오류
- 정적 분석 결과
- **페널티 시스템:**
  - 오류: 각 -2점 (최대 -20)
  - 경고: 각 -0.5점
  - TypeScript 오류: 각 -3점 (최대 -15)

#### 🧪 Test Coverage Scoring (25% 가중치)
- Line 커버리지 (점수의 40%)
- Branch 커버리지 (점수의 30%)
- Function 커버리지 (점수의 20%)
- Statement 커버리지 (점수의 10%)

#### ⚡ Performance Regression Scoring (25% 가중치)
- Baseline vs 현재 성능 비교
- **Regression 페널티:**
  - 성능 저하: -2x 저하 백분율 (최대 -50)
- **개선 보너스:**
  - 성능 개선: +개선 백분율 (최대 +10)

#### 📚 Documentation Scoring (15% 가중치)
- 기본 점수: 70점
- **보너스:**
  - README.md 존재: +10
  - CHANGELOG.md 존재: +10
  - LICENSE 존재: +5
  - 문서 파일 업데이트: 파일당 +2 (최대 +10)

### 점수 임계값
- **합격 임계값:** 85/100
- **실패 조치:** 임계값 미만 시 pipeline 실패
- **PR 코멘트:** PR에 자동 점수 결과 게시

### Truth Score 계산
```
최종 점수 = (Code Accuracy × 0.35) + (Test Coverage × 0.25) + (Performance × 0.25) + (Documentation × 0.15)
```

## 🔗 Cross-Agent Integration Tests

**파일:** `.github/workflows/integration-tests.yml`

### 목적
다양한 조건에서 다중 agent 시스템 통합, 협업, 성능에 대한 종합 테스트.

### 테스트 시나리오

#### 🤝 Agent Coordination Tests
- **테스트된 Agent 유형:** coder, tester, reviewer, planner, researcher, backend-dev, performance-benchmarker
- **Test Matrix:** 범위에 따라 구성 가능한 agent 수
- **지표:**
  - Agent 간 통신 지연시간
  - 메시지 성공률
  - 작업 분배 효율성
  - 부하 분산 효과

#### 🧠 Memory Sharing Integration
- 공유 메모리 작업 (store, retrieve, update, delete, search)
- Agent 간 메모리 동기화
- 충돌 해결 테스트
- 데이터 일관성 검증

#### 🛡️ Fault Tolerance Tests
- **장애 시나리오:**
  - Agent 충돌
  - 네트워크 timeout
  - 메모리 overflow
  - 작업 timeout
  - 통신 장애
- **복구 지표:**
  - 감지 시간
  - 복구 시간
  - 성공률 (목표: 90%+)

#### ⚡ Performance Integration Tests
- 부하 하에서 다중 agent 성능
- 확장성 제한 테스트 (1-15 agent)
- Throughput 및 latency 측정
- 리소스 사용률 모니터링

### 테스트 범위
- **Smoke:** 기본 기능 (2 coder, 1 tester)
- **Core:** 표준 테스트 (총 7 agent)
- **Full:** 종합 테스트 (14+ agent)
- **Stress:** 최대 부하 테스트 (15+ agent)

### 성공 기준
- 모든 협업 테스트 통과
- 메모리 동기화가 올바르게 작동
- 90%+ 장애 복구 성공률
- 허용 가능한 범위 내의 성능
- 부하 하에서 시스템이 안정적으로 유지

## 🔄 Automated Rollback Manager

**파일:** `.github/workflows/rollback-manager.yml`

### 목적
장애를 감지하고 알려진 정상 상태로 자동 복원할 수 있는 지능형 자동화된 rollback 시스템.

### Trigger 조건

#### 자동 Trigger
- Verification Pipeline 실패
- Truth Scoring Pipeline 실패
- Integration Tests 실패
- main 브랜치로 push (모니터링)

#### 수동 Trigger
- 매개변수가 있는 workflow dispatch:
  - Rollback 대상 (commit SHA/tag)
  - Rollback 이유
  - 비상 모드 플래그
  - Rollback 범위 (application/database/infrastructure/full)

### Rollback 프로세스

#### 🚨 Failure Detection
- Workflow 실행 결과 분석
- 장애 심각도 결정:
  - **High:** Verification Pipeline, Integration Tests
  - **Medium:** Truth Scoring, 기타 workflow
  - **Low:** 사소한 문제
- 안전한 rollback 대상 식별

#### 🔍 Pre-Rollback Validation
- Rollback 대상 commit 존재 검증
- 대상이 현재 HEAD의 조상인지 확인
- 현재 상태 백업 생성
- Rollback 대상 실행 가능성 테스트

#### 🔄 Execute Rollback
- 메타데이터가 포함된 rollback commit 생성
- **Emergency Mode:** lease와 함께 강제 push
- **Normal Mode:** 표준 push
- 추적을 위한 rollback tag 생성

#### ✅ Post-Rollback Verification
- 빌드 기능 검증
- Smoke 테스트 실행
- CLI 기능 테스트
- 시스템 상태 확인

#### 📊 Rollback Monitoring
- 시스템 안정성 모니터링 (기본 15분)
- 성능 모니터링
- 오류율 추적
- 자동화된 리포팅

### 승인 요구사항
- **High Severity:** 자동 실행
- **Emergency Mode:** 자동 실행
- **Medium/Low Severity:** 수동 승인 필요

### Artifact 및 리포팅
- 장애 감지 리포트 (90일)
- Pre-rollback 검증 (90일)
- Rollback 실행 로그 (90일)
- Post-rollback 모니터링 (90일)
- 이해관계자 알림 (GitHub issue)

## 📊 Status Badge

**파일:** `.github/workflows/status-badges.yml`

Workflow 결과에 따라 업데이트되는 동적 상태 배지:

```markdown
[![Verification Pipeline](https://img.shields.io/github/actions/workflow/status/ruvnet/claude-code-flow/verification-pipeline.yml?branch=main&label=verification&style=flat-square)](https://github.com/ruvnet/claude-code-flow/actions/workflows/verification-pipeline.yml)
[![Truth Scoring](https://img.shields.io/github/actions/workflow/status/ruvnet/claude-code-flow/truth-scoring.yml?branch=main&label=truth%20score&style=flat-square)](https://github.com/ruvnet/claude-code-flow/actions/workflows/truth-scoring.yml)
[![Integration Tests](https://img.shields.io/github/actions/workflow/status/ruvnet/claude-code-flow/integration-tests.yml?branch=main&label=integration&style=flat-square)](https://github.com/ruvnet/claude-code-flow/actions/workflows/integration-tests.yml)
[![Rollback Manager](https://img.shields.io/github/actions/workflow/status/ruvnet/claude-code-flow/rollback-manager.yml?branch=main&label=rollback&style=flat-square)](https://github.com/ruvnet/claude-code-flow/actions/workflows/rollback-manager.yml)
```

## ⚙️ 구성 파일

### `.audit-ci.json`
자동화된 취약점 스캔을 위한 보안 감사 구성.

### GitHub Issue Template
- **Rollback Incident Report:** 사고 문서화를 위한 구조화된 template

## 🔧 Workflow 통합

### Artifact 공유
모든 workflow는 job 간에 공유될 수 있는 artifact를 생성합니다:
- 테스트 결과 및 커버리지 리포트
- 보안 및 품질 분석
- 성능 벤치마크
- Rollback 실행 로그

### 환경 변수
Workflow 전체에서 사용되는 주요 환경 변수:
- `NODE_VERSION`: '20'
- `TRUTH_SCORE_THRESHOLD`: 85
- `REGRESSION_THRESHOLD`: 10
- `MAX_PARALLEL_AGENTS`: 8
- `ROLLBACK_RETENTION_DAYS`: 90

### 필요한 Secret
- `GITHUB_TOKEN`: 저장소 액세스를 위한 자동 token
- 외부 통합에는 추가 secret이 필요할 수 있음

## 📈 성능 모니터링

### 수집되는 지표
- 빌드 시간 및 성공률
- 테스트 실행 시간 및 커버리지
- 시간 경과에 따른 truth score 추세
- Integration 테스트 성능
- Rollback 빈도 및 성공률

### 모니터링 기간
- **실시간:** Workflow 실행 중
- **Post-deployment:** 15분 안정성 기간
- **장기:** 일일/주간 추세 분석

## 🛠️ 유지보수 및 업데이트

### 정기 유지보수 작업
1. Workflow에서 Node.js 버전 업데이트
2. Truth scoring 임계값 검토 및 업데이트
3. Integration 테스트 agent matrix 조정
4. 오래된 artifact 및 로그 정리
5. Rollback 대상 및 절차 검토

### Workflow 업데이트
Workflow 업데이트 시:
1. Feature 브랜치에서 변경 사항 테스트
2. 검증을 위해 workflow dispatch 사용
3. 배포 후 지표 모니터링
4. 그에 따라 문서 업데이트

## 🔍 문제 해결

### 일반적인 문제

#### Verification Pipeline 실패
- 보안 감사 결과 확인
- ESLint 및 TypeScript 오류 검토
- 테스트 실패 검증
- 빌드 로그 검사

#### Truth Scoring이 임계값 미만
- 코드 품질 개선 (ESLint 오류 감소)
- 테스트 커버리지 증가
- 성능 최적화
- 문서 업데이트

#### Integration Test 실패
- Agent 협업 로그 확인
- 메모리 동기화 문제 검토
- Fault tolerance 테스트 결과 분석
- 시스템 성능 모니터링

#### Rollback 문제
- Rollback 대상이 존재하는지 검증
- 백업 무결성 확인
- 승인 요구사항 검토
- Post-rollback 안정성 모니터링

### 도움 받기
1. GitHub Actions에서 workflow 로그 확인
2. Artifact 리포트 검토
3. 이 문서 참조
4. Rollback incident template으로 issue 생성

## 📚 추가 리소스

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Claude Flow Wiki](https://github.com/ruvnet/claude-code-flow/wiki)
- [Agent System 문서](../reference/AGENTS.md)

---

*이 문서는 CI/CD pipeline에 의해 자동으로 업데이트됩니다. 마지막 업데이트: $(date -u +%Y-%m-%d)*
