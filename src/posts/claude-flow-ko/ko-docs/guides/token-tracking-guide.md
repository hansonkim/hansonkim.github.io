# Claude Token 추적 가이드

## 개요

Claude Flow는 이제 시뮬레이션 데이터가 아닌 실제 Claude API 사용량을 캡처하는 **실제** token 추적 기능을 포함합니다. 이 가이드는 Claude Code CLI로 token 추적을 활성화하고 사용하는 방법을 보여줍니다.

## 빠른 시작

### 단계 1: Telemetry 활성화

먼저 token 추적을 위한 telemetry를 활성화하세요:

```bash
./claude-flow analysis setup-telemetry
```

이 명령은 다음을 수행합니다:
- `CLAUDE_CODE_ENABLE_TELEMETRY=1` 환경 변수 설정
- telemetry 설정으로 `.env` 파일 생성
- token 추적 디렉토리 초기화 (`.claude-flow/metrics/`)

### 단계 2: Token 추적으로 Claude 실행

telemetry가 활성화된 `--claude` 플래그 사용:

```bash
# 옵션 1: 환경 변수를 인라인으로 설정
CLAUDE_CODE_ENABLE_TELEMETRY=1 ./claude-flow swarm "your task" --claude

# 옵션 2: 환경 변수 내보내기
export CLAUDE_CODE_ENABLE_TELEMETRY=1
./claude-flow swarm "your task" --claude

# 옵션 3: wrapper 직접 사용
./claude-flow analysis claude-monitor  # 한 터미널에서 모니터링 시작
./claude-flow swarm "your task" --claude  # 다른 터미널에서 Claude 실행
```

### 단계 3: Token 사용량 보기

Claude 명령어 실행 후:

```bash
# 종합 token 사용량 리포트 보기
./claude-flow analysis token-usage --breakdown --cost-analysis

# 현재 세션 비용 확인
./claude-flow analysis claude-cost

# 실시간 세션 모니터링
./claude-flow analysis claude-monitor [session-id]
```

## 아키텍처

### 작동 방식

1. **Claude Telemetry 통합**: 시스템이 Claude의 기본 OpenTelemetry 지원과 통합됨
2. **프로세스 래핑**: telemetry가 활성화되면 Claude 명령어가 출력을 캡처하도록 래핑됨
3. **Token 추출**: Token 사용량이 다음에서 추출됨:
   - Claude CLI 출력 패턴
   - 세션 JSONL 파일 (접근 가능한 경우)
   - `/cost` 명령어 출력
4. **영구 스토리지**: Token 데이터가 `.claude-flow/metrics/token-usage.json`에 저장됨

### 주요 구성요소

- **`claude-telemetry.js`**: 핵심 telemetry wrapper 모듈
- **`token-tracker.js`**: Token 추적 및 비용 계산
- **`analysis.js`**: 분석 명령어 및 리포트

## 기능

### 실시간 모니터링

Claude 세션을 실행 중에 모니터링:

```bash
# 기본 5초 간격으로 모니터링
./claude-flow analysis claude-monitor

# 사용자 정의 간격(3초)으로 모니터링
./claude-flow analysis claude-monitor current --interval 3000
```

### 비용 분석

Claude 3 가격 기반 비용 추적:

| Model  | Input (100만 token당) | Output (100만 token당) |
|--------|----------------------|------------------------|
| Opus   | $15.00              | $75.00                 |
| Sonnet | $3.00               | $15.00                 |
| Haiku  | $0.25               | $1.25                  |

### Token 분석

다음별 token 사용량 보기:
- Agent 유형
- 명령어
- 세션
- 기간

```bash
# 상세 분석
./claude-flow analysis token-usage --breakdown

# Agent별 분석
./claude-flow analysis token-usage --agent coordinator --cost-analysis
```

## 고급 사용법

### 프로그래밍 방식 Token 추적

telemetry wrapper를 프로그래밍 방식으로도 사용할 수 있습니다:

```javascript
import { runClaudeWithTelemetry } from './claude-telemetry.js';

const result = await runClaudeWithTelemetry(
  ['chat', 'Hello, Claude!'],
  {
    sessionId: 'my-session-123',
    agentType: 'custom-agent'
  }
);
```

### 세션 모니터링

특정 세션 모니터링:

```javascript
import { monitorClaudeSession } from './claude-telemetry.js';

const stopMonitor = await monitorClaudeSession('session-id', 5000);

// 완료되면 모니터링 중지
stopMonitor();
```

## 문제 해결

### Token 데이터가 표시되지 않음

1. telemetry가 활성화되었는지 확인:
   ```bash
   echo $CLAUDE_CODE_ENABLE_TELEMETRY  # 출력: 1
   ```

2. token 사용량 파일이 존재하는지 확인:
   ```bash
   cat .claude-flow/metrics/token-usage.json
   ```

3. Claude가 설치되었는지 확인:
   ```bash
   which claude  # Claude 경로를 표시해야 함
   ```

### Token 추적이 작동하지 않음

1. 기존 지표 정리:
   ```bash
   rm -rf .claude-flow/metrics/token-usage.json
   ```

2. telemetry 재활성화:
   ```bash
   ./claude-flow analysis setup-telemetry
   ```

3. 명시적 telemetry로 실행:
   ```bash
   CLAUDE_CODE_ENABLE_TELEMETRY=1 ./claude-flow swarm "test" --claude
   ```

## CI/CD 통합

자동화된 환경을 위해:

```yaml
# GitHub Actions 예제
env:
  CLAUDE_CODE_ENABLE_TELEMETRY: '1'

steps:
  - name: Setup telemetry
    run: ./claude-flow analysis setup-telemetry

  - name: Run Claude task
    run: ./claude-flow swarm "${{ inputs.task }}" --claude

  - name: Report costs
    run: ./claude-flow analysis claude-cost
```

## 개인정보 보호 및 보안

- **민감한 데이터 없음**: token 수와 비용만 추적됨
- **로컬 스토리지**: 모든 데이터가 로컬 `.claude-flow/metrics/`에 저장됨
- **선택 사항**: Telemetry는 명시적으로 활성화해야 함
- **외부 전송 없음**: 데이터가 외부 서버로 전송되지 않음

## 모범 사례

1. **한 번만 telemetry 활성화**: 지속성을 위해 `.env` 파일에 설정
2. **긴 작업 모니터링**: 5분 이상 작업에는 `claude-monitor` 사용
3. **정기적인 비용 확인**: 비용이 많이 드는 작업 후 `claude-cost` 실행
4. **배치 작업**: token 사용량을 최적화하기 위해 Claude 호출을 그룹화
5. **적절한 모델 사용**: 간단한 작업에는 Haiku, 복잡한 작업에는 Opus 선택

## API 참조

### 명령어

| 명령어 | 설명 |
|---------|-------------|
| `analysis setup-telemetry` | token 추적 구성 |
| `analysis token-usage` | token 사용량 리포트 보기 |
| `analysis claude-monitor` | 실시간 세션 모니터링 |
| `analysis claude-cost` | 현재 세션 비용 확인 |

### 환경 변수

| 변수 | 설명 | 기본값 |
|----------|-------------|---------|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | token 추적 활성화 | `0` |
| `OTEL_METRICS_EXPORTER` | OpenTelemetry exporter | `console` |
| `OTEL_LOGS_EXPORTER` | Log exporter 유형 | `console` |

### 파일

| 파일 | 목적 |
|------|---------|
| `.claude-flow/metrics/token-usage.json` | Token 사용량 데이터 |
| `.claude-flow/metrics/sessions/*.json` | 세션 지표 |
| `.env` | 환경 구성 |

## 예제

### 완전한 워크플로

```bash
# 1. 설정
./claude-flow analysis setup-telemetry

# 2. 추적과 함께 작업 실행
export CLAUDE_CODE_ENABLE_TELEMETRY=1
./claude-flow swarm "Create a REST API with authentication" --claude

# 3. 사용량 확인
./claude-flow analysis token-usage --breakdown --cost-analysis

# 4. 다음 세션 모니터링
./claude-flow analysis claude-monitor &  # 백그라운드에서 실행
./claude-flow swarm "Add tests to the API" --claude

# 5. 최종 비용 리포트
./claude-flow analysis claude-cost
```

### 최적화 예제

```bash
# token 사용량 패턴 분석
./claude-flow analysis token-usage --breakdown

# 높은 소비 agent 식별
./claude-flow analysis token-usage --agent coordinator

# 최적화 제안 받기
./claude-flow analysis bottleneck-detect --scope agent
```

## 지원

문제 또는 질문이 있는 경우:
- GitHub Issues: https://github.com/ruvnet/claude-flow/issues
- 문서: https://github.com/ruvnet/claude-flow/docs

## 결론

Claude Flow의 실제 token 추적은 API 사용량과 비용에 대한 투명성을 제공합니다. 이 가이드를 따르면 다음을 수행할 수 있습니다:
- 실제 Claude API token 소비 추적
- 실시간 비용 모니터링
- token 사용 패턴 최적화
- 모델 선택에 대한 정보에 입각한 결정

기억하세요: 이것은 시뮬레이션 데이터가 아닌 **실제** 사용량을 추적합니다!
