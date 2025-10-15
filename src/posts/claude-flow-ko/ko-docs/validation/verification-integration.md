# 검증 시스템 통합 가이드

## 개요

검증 시스템은 에이전트 작업과 작업 실행을 실시간으로 검증합니다. 이 시스템은 swarm 명령, 비대화형 모드, 학습 시스템과 통합됩니다.

## 실제 동작 방식

### 1. **작업 전 검증**
작업을 실행하기 전에 시스템은 다음을 확인합니다:
- Git 저장소 상태(정상/변경됨)
- 의존성이 설치되어 있는지
- 환경이 준비되어 있는지

### 2. **작업 후 검증**
작업이 완료된 후 다음을 검증합니다:
- 코드가 컴파일되는지(TypeScript/JavaScript)
- 테스트가 통과하는지
- Lint가 성공하는지
- 문서가 존재하는지(architect 에이전트의 경우)

### 3. **자동 롤백**
검증이 실패하고 롤백이 활성화된 경우:
- 마지막 Git 커밋으로 되돌립니다
- 검증 기록을 유지합니다
- 실패 데이터를 학습 시스템에 제공합니다

## 명령과의 통합

### 검증이 포함된 Swarm 명령

```bash
# swarm 실행에서 검증을 활성화합니다
export VERIFICATION_MODE=strict
export VERIFICATION_ROLLBACK=true

# 검증 훅을 포함해 swarm을 실행합니다
claude-flow swarm "Build REST API" --verify

# swarm은 다음을 수행합니다:
# 1. 사전 작업 검증을 실행합니다
# 2. 목표를 수행합니다
# 3. 사후 작업 검증을 실행합니다
# 4. 검증이 실패하면 롤백합니다
```

### 비대화형 모드에서의 검증

```bash
# 검증이 포함된 비대화형 실행
claude-flow swarm "Build feature" \
  -p \
  --output-format stream-json \
  --verify \
  --threshold 0.95

# 검증 결과는 JSON 출력에 포함됩니다
```

### 수동 검증

```bash
# 사전 작업 점검
node src/cli/simple-commands/verification-hooks.js pre task-123 coder

# 사후 작업 점검
node src/cli/simple-commands/verification-hooks.js post task-123 coder

# 학습 시스템으로 전달
node src/cli/simple-commands/verification-hooks.js train task-123 coder

# 상태 확인
node src/cli/simple-commands/verification-hooks.js status
```

## 학습 시스템과의 통합

검증 결과는 자동으로 학습 시스템에 전달됩니다:

```bash
# 학습 데이터를 확인합니다
cat .claude-flow/training/verification-data.jsonl

# 샘플 출력:
{"taskId":"task-123","agentType":"coder","preScore":1,"postScore":0.75,"success":false,"timestamp":"2025-01-12T15:00:00Z"}
```

## 검증 점수

| 에이전트 유형 | 수행하는 점검 | 임계값 |
|---------------|---------------|--------|
| coder | typecheck, tests, lint | 0.85 |
| researcher | output completeness | 0.85 |
| tester | coverage threshold | 0.85 |
| architect | documentation exists | 0.85 |

## 환경 변수

```bash
# 검증 모드(strict/moderate/development)를 설정합니다
export VERIFICATION_MODE=strict

# 실패 시 자동 롤백을 활성화합니다
export VERIFICATION_ROLLBACK=true

# 사용자 정의 임계값(0.0-1.0)
export VERIFICATION_THRESHOLD=0.95
```

## 실제 예시: coder 에이전트 검증

```bash
# 1. 검증을 초기화합니다
./claude-flow verify init strict

# 2. 검증과 함께 coder 작업을 실행합니다
./claude-flow swarm "Implement user authentication" --verify

# 출력:
🔍 사전 작업 검증: swarm-123 (coder)
  ✅ git-status: 1.00
  ✅ npm-deps: 1.00
✅ 사전 작업 검증 통과(1.00)

[... 작업 실행 ...]

🔍 사후 작업 검증: swarm-123 (coder)
  ✅ typecheck: 1.00
  ❌ tests: 0.40
  ✅ lint: 0.80
❌ 사후 작업 검증 실패(0.73 < 0.95)
🔄 롤백을 시도합니다...
✅ 롤백 완료
```

## 검증 메모리

검증 결과는 `.swarm/verification-memory.json`에 저장됩니다:

```json
{
  "history": [
    {
      "taskId": "swarm-123",
      "phase": "post",
      "passed": false,
      "score": 0.73,
      "checks": [
        {"name": "typecheck", "passed": true, "score": 1.0},
        {"name": "tests", "passed": false, "score": 0.4},
        {"name": "lint", "passed": true, "score": 0.8}
      ],
      "agentType": "coder",
      "timestamp": "2025-01-12T15:30:00Z"
    }
  ],
  "tasks": {
    "swarm-123": {
      "pre": {"passed": true, "score": 1.0},
      "post": {"passed": false, "score": 0.73}
    }
  }
}
```

## 현재 한계

1. **아직 완전하게 통합되지 않음**: 검증 훅은 존재하지만 아직 모든 명령에서 자동으로 호출되지는 않습니다
2. **기본 점검**: 현재는 간단한 npm 스크립트만 실행하며, 심층 코드 분석은 수행하지 않습니다
3. **수동 설정 필요**: 환경 변수를 수동으로 설정해야 합니다
4. **제한된 에이전트 유형**: 네 가지 에이전트 유형만 전용 검증 로직을 사용합니다

## 향후 개선 사항

1. **깊은 통합**: 모든 에이전트 작업에 대한 자동 검증
2. **스마트 롤백**: 실패한 변경 사항만 선별적으로 롤백
3. **학습 시스템 연계**: 검증 기록을 활용해 에이전트 선택을 개선
4. **맞춤형 점검**: 프로젝트별 검증 규칙을 지원
5. **실시간 모니터링**: 검증 지표를 보여주는 대시보드

## 지금 검증을 사용하는 방법

아직 완전하게 통합되지는 않았지만, 다음과 같은 방식으로 지금 바로 검증을 사용할 수 있습니다:

1. 작업 전후에 검증 훅을 수동으로 실행합니다
2. 환경 변수를 설정하여 자동 점검을 활성화합니다
3. swarm 명령에서 `--verify` 플래그를 사용합니다(구현된 경우)
4. `truth` 명령으로 검증 기록을 확인합니다

검증 시스템은 아직 완전히 자동화되지는 않았지만, AI가 생성한 코드의 품질을 보장하기 위한 기반을 제공합니다.
