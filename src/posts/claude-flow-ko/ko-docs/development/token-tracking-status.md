# Token 추적 구현 상태

## 요약

Claude API 호출에 대한 실제 token 추적 기능을 연구하고 구현했습니다. 구현은 Claude Code CLI에서 실제 token 사용량을 캡처하기 위한 인프라를 제공하지만, Claude Code가 interactive 모드에서 telemetry를 처리하는 방식으로 인한 제한사항이 있습니다.

## 구현된 사항

### 1. 연구 결과
- Claude Code는 telemetry를 위한 기본 OpenTelemetry 지원 보유
- Token 사용량은 `CLAUDE_CODE_ENABLE_TELEMETRY=1`을 통해 추적됨
- Claude는 `input_tokens`, `output_tokens`, `cache_read_tokens`, `cache_creation_tokens` 등의 metrics 방출
- JSONL 파일을 파싱하는 오픈 소스 도구 존재 (ccusage, Claude-Code-Usage-Monitor, claude-code-otel)

### 2. 생성된 구성요소

#### `claude-telemetry.js`
- Telemetry를 사용한 Claude CLI 실행을 위한 wrapper 모듈
- Claude 출력에서 token 사용량을 파싱하는 함수
- 세션 모니터링 기능
- `/cost` 명령어에서 비용 추출

#### `claude-track.js`
- Claude 세션을 위한 백그라운드 token tracker
- Token 정보를 위한 telemetry stream 파싱
- `.claude-flow/metrics/token-usage.json`에 데이터 저장

#### Analysis 명령어
- `analysis setup-telemetry` - Token 추적 구성
- `analysis claude-monitor` - 실시간으로 Claude 세션 모니터링
- `analysis claude-cost` - 현재 세션 비용 확인

### 3. 통합 업데이트
- Telemetry를 올바르게 처리하도록 `swarm.js` 수정
- 새 명령어로 `analysis.js` 업데이트
- 종합 문서 작성

## 현재 상태

### ✅ 작동 중
- Token 추적 인프라 구축됨
- Analysis 명령어 기능 작동
- 문서 포괄적
- Telemetry 간섭 없이 Claude CLI가 올바르게 시작됨

### ⚠️ 제한사항
- Interactive 모드에 `--claude` flag 사용 시, 콘솔 출력 간섭 방지를 위해 telemetry 비활성화 필요
- Claude의 OpenTelemetry 콘솔 출력이 interactive 사용 차단
- Token 추적은 non-interactive Claude 명령어에서 가장 잘 작동

## 핵심 과제

근본적인 문제는 Claude Code의 telemetry 시스템이 `OTEL_METRICS_EXPORTER=console` (또는 유효한 exporter) 사용 시 콘솔에 출력하여 interactive CLI 경험을 방해한다는 것입니다. "none"과 같은 잘못된 값으로 설정하면 Claude가 오류를 발생시킵니다.

## 사용 가능한 솔루션

### 옵션 1: Non-Interactive 명령어
콘솔 출력이 방해하지 않는 non-interactive Claude 명령어에서 token 추적이 완벽하게 작동합니다.

### 옵션 2: 세션 파일 파싱
실행 후 Claude의 JSONL 세션 파일 파싱 (Claude의 데이터 디렉토리 액세스 필요).

### 옵션 3: 별도 모니터링 프로세스
Telemetry 데이터를 캡처하는 모니터링 프로세스를 Claude와 함께 실행.

### 옵션 4: 사용자 정의 OpenTelemetry Collector
콘솔 출력 없이 telemetry 데이터를 수신하도록 로컬 OTLP collector 설정.

## 권장사항

1. **Interactive 사용**: 원활한 작동을 위해 telemetry 없이 Claude 계속 사용
2. **배치 작업**: 정확한 token 추적을 위해 telemetry 활성화
3. **비용 추적**: Claude 세션 내에서 `/cost` 명령어 사용
4. **분석**: 자동 telemetry 수집을 위한 로컬 OTLP collector 구현 고려

## 다음 단계

실제 token 추적을 완전히 활성화하려면 다음을 고려:

1. **OTLP Collector 구현**: 경량 로컬 collector 설정
   ```bash
   OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
   OTEL_METRICS_EXPORTER=otlp
   ```

2. **세션 파일 파싱**: Claude의 세션 JSONL 파일 직접 액세스
   - 위치는 OS에 따라 다름
   - 완전한 token 사용량 데이터 포함

3. **Hook 통합**: Claude의 세션 hook을 사용하여 실행 후 데이터 캡처

## 생성/수정된 파일

- `/src/cli/simple-commands/claude-telemetry.js` - 핵심 telemetry 모듈
- `/src/cli/simple-commands/claude-track.js` - 백그라운드 tracker
- `/src/cli/simple-commands/analysis.js` - 새 명령어로 업데이트
- `/src/cli/simple-commands/swarm.js` - Telemetry 처리 수정
- `/docs/token-tracking-guide.md` - 종합 가이드
- `/docs/token-tracking-status.md` - 이 상태 문서

## 결론

실제 token 추적 인프라가 구현되고 기능적입니다. 주요 제약은 Claude Code의 telemetry 시스템이 interactive 모드에서 콘솔에 출력한다는 것입니다. 현재 솔루션은 적절한 Claude 작동을 보장하기 위해 interactive 세션에서 telemetry를 비활성화합니다. Production token 추적을 위해서는 로컬 OTLP collector 구현이 이상적인 솔루션입니다.
