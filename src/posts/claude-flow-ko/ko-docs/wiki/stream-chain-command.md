# Stream Chain 명령

## 개요

`stream-chain` 명령은 stream-json 형식을 통해 여러 Claude 인스턴스를 연결하여 문맥을 끊김 없이 유지하는 강력한 다중 에이전트 워크플로우를 구성합니다. 이 명령은 포그라운드와 백그라운드 실행을 모두 지원하므로, 다른 작업을 진행하면서도 복잡한 체인을 실행할 수 있습니다.

## 설치

stream-chain 명령은 Claude Flow에 포함되어 있으며 명령 레지스트리에 등록되어 있습니다:

```bash
# stream-chain 명령에 접근합니다
npx claude-flow stream-chain help

# 로컬 CLI로 실행합니다
./claude-flow stream-chain help
```

## 명령 구조

stream-chain 명령은 다음과 같은 구조를 따릅니다:

```bash
stream-chain <subcommand> [options]
```

## 하위 명령

### `run` - 사용자 지정 Stream Chain 실행

연결된 Claude 인스턴스를 통해 일련의 프롬프트를 실행합니다:

```bash
stream-chain run "prompt1" "prompt2" "prompt3" [...]
```

**요구 사항:**
- 최소 두 개의 프롬프트가 필요합니다
- 각 프롬프트는 순차적으로 실행됩니다
- 각 단계의 출력은 다음 단계의 입력으로 전달됩니다

**예시:**
```bash
./claude-flow stream-chain run \
  "Analyze the user authentication system" \
  "Identify security vulnerabilities" \
  "Generate fixes for the vulnerabilities"
```

### `demo` - 데모 체인 실행

미리 구성된 3단계 데모를 실행합니다:

```bash
stream-chain demo [options]
```

데모 체인은 다음을 수행합니다:
1. todo 리스트 애플리케이션 요구 사항 분석
2. 데이터 모델 및 API 엔드포인트 설계
3. 핵심 기능 구현

**예시:**
```bash
# 포그라운드에서 데모를 실행합니다
./claude-flow stream-chain demo

# 백그라운드에서 데모를 실행합니다
./claude-flow stream-chain demo --background
```

### `pipeline` - 사전 정의된 파이프라인 실행

일반적인 개발 작업을 위한 특화 파이프라인을 실행합니다:

```bash
stream-chain pipeline <type> [options]
```

**사용 가능한 파이프라인 유형:**

| 파이프라인 | 설명 | 단계 |
|------------|------|------|
| `analysis` | 코드 분석 파이프라인 | 1. 코드베이스를 읽고 분석합니다<br>2. 개선 사항을 식별합니다<br>3. 보고서를 생성합니다 |
| `refactor` | 리팩터링 파이프라인 | 1. 리팩터링 기회를 분석합니다<br>2. 리팩터링 계획을 수립합니다<br>3. 변경 사항을 적용합니다 |
| `test` | 테스트 생성 파이프라인 | 1. 코드 커버리지를 분석합니다<br>2. 누락된 테스트를 식별합니다<br>3. 테스트를 생성합니다 |
| `optimize` | 성능 최적화 | 1. 성능을 프로파일링합니다<br>2. 병목을 식별합니다<br>3. 최적화를 적용합니다 |

**예시:**
```bash
# 분석 파이프라인을 실행합니다
./claude-flow stream-chain pipeline analysis

# 백그라운드에서 리팩터링 파이프라인을 실행합니다
./claude-flow stream-chain pipeline refactor --bg

# 자세한 출력과 함께 테스트 생성을 실행합니다
./claude-flow stream-chain pipeline test --verbose
```

### `test` - 스트림 연결 테스트

스트림 체인이 올바르게 동작하는지 확인합니다:

```bash
stream-chain test [options]
```

두 가지 테스트를 수행합니다:
1. 단순 에코 테스트
2. 스트림 체인 테스트

**예시:**
```bash
./claude-flow stream-chain test --verbose
```

### `monitor` - 백그라운드 체인 모니터링

모든 백그라운드 stream chain과 상태를 확인합니다:

```bash
stream-chain monitor
```

**출력 항목:**
- 프로세스 ID(예: `stream_1234567890`)
- 원본 명령
- 시스템 PID
- 시작 시간
- 현재 상태 (🟢 Running / 🔴 Stopped)

**예시:**
```bash
$ ./claude-flow stream-chain monitor

📊 Background Stream Chains
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 stream_1755021020133
   Command: npx claude-flow stream-chain demo
   PID: 366567
   Started: 2025-08-12T17:50:20.135Z
   Status: 🟢 Running
```

### `kill` - 백그라운드 체인 종료

특정 백그라운드 stream chain을 중지합니다:

```bash
stream-chain kill <process_id>
```

**예시:**
```bash
./claude-flow stream-chain kill stream_1755021020133
```

## 옵션

### 전역 옵션

| 옵션 | 단축 | 설명 |
|------|------|------|
| `--background` | `--bg` | stream chain을 백그라운드에서 실행합니다 |
| `--verbose` | | 실행 중 상세 출력을 표시합니다 |
| `--json` | | 최종 출력을 JSON 형식으로 유지합니다 |
| `--timeout <sec>` | | 각 단계의 타임아웃(초)을 설정합니다 |

### 백그라운드 실행

`--background` 또는 `--bg` 플래그를 사용하면 모든 stream chain을 백그라운드에서 실행할 수 있습니다:

```bash
# 모든 명령을 백그라운드에서 실행합니다
stream-chain run "task1" "task2" --background
stream-chain demo --bg
stream-chain pipeline analysis --background
```

**백그라운드 기능:**
- 프로세스가 터미널과 분리되어 실행됩니다
- 고유한 프로세스 ID가 생성됩니다(예: `stream_1234567890`)
- 프로세스 정보가 `.claude-flow/stream-chains.json`에 저장됩니다
- 터미널을 닫은 뒤에도 계속 실행됩니다
- `stream-chain monitor`로 모니터링합니다
- `stream-chain kill <id>`로 종료합니다

## Stream-JSON 형식

stream chain은 통신에 줄 단위 JSON(NDJSON)을 사용합니다:

```json
{"type":"init","session_id":"abc123","timestamp":"2024-01-01T00:00:00Z"}
{"type":"message","role":"assistant","content":[{"type":"text","text":"Processing..."}]}
{"type":"tool_use","name":"Bash","input":{"command":"ls -la"}}
{"type":"tool_result","output":"total 64\ndrwxr-xr-x  10 user  staff   320"}
{"type":"result","status":"success","duration_ms":1234}
```

**메시지 유형:**
- `init` - 세션 초기화
- `message` - 어시스턴트/사용자 메시지
- `tool_use` - 도구 호출
- `tool_result` - 도구 실행 결과
- `result` - 최종 완료 상태

## 성능 특성

| 지표 | 값 | 설명 |
|------|-----|------|
| **Latency** | <100ms | 에이전트 간 핸드오프 지연 |
| **Context Preservation** | 100% | 전체 대화 기록 유지 |
| **Memory Usage** | O(1) | 스트리밍을 통한 일정 메모리 사용 |
| **Speed Improvement** | 40-60% | 파일 기반 접근 방식 대비 향상 |

## 백그라운드 명령과 통합

stream-chain 명령은 Claude Code의 백그라운드 명령 시스템과 완전히 통합됩니다:

### /bashes 명령과 함께 사용

백그라운드 stream chain은 `/bashes` 대화형 메뉴에 표시됩니다:

```bash
# Claude Code 대화형 모드에서
/bashes

# stream chain을 포함한 모든 백그라운드 프로세스를 표시합니다
Background Bash Shells
Select a shell to view details

1. npm run dev (running)
2. stream_1234567890: stream-chain demo (running)
3. docker-compose up (running)
```

### 프로그래밍 방식 제어

Claude를 통해 프로그래밍 방식으로 stream chain을 제어할 수 있습니다:

```markdown
# 백그라운드에서 stream chain 분석 파이프라인을 실행해 달라고 요청합니다
"Run a stream chain analysis pipeline in the background"

# Claude가 실행합니다:
./claude-flow stream-chain pipeline analysis --background

# 백그라운드 stream chain 상태를 확인해 달라고 요청합니다
"Check the status of background stream chains"

# Claude가 실행합니다:
./claude-flow stream-chain monitor
```

## 실전 예시

### 예시 1: 전체 개발 파이프라인

```bash
# 완전한 개발 워크플로우를 생성합니다
./claude-flow stream-chain run \
  "Analyze the requirements in docs/requirements.md" \
  "Design the system architecture based on requirements" \
  "Generate the API specification" \
  "Create implementation plan" \
  "Write the initial code structure" \
  --background

# 진행 상황을 모니터링합니다
./claude-flow stream-chain monitor
```

### 예시 2: 자동화된 코드 리뷰

```bash
# 백그라운드에서 코드 리뷰 파이프라인을 실행합니다
./claude-flow stream-chain run \
  "Analyze code quality in src/" \
  "Identify code smells and anti-patterns" \
  "Suggest refactoring improvements" \
  "Generate code review report" \
  --bg --verbose

# 완료되면 확인합니다
./claude-flow stream-chain monitor
```

### 예시 3: 테스트 주도 개발

```bash
# TDD 워크플로우
./claude-flow stream-chain run \
  "Write test specifications for user authentication" \
  "Generate unit tests based on specifications" \
  "Implement code to pass the tests" \
  "Refactor for code quality" \
  --timeout 60
```

### 예시 4: 문서 생성

```bash
# 포괄적인 문서를 생성합니다
./claude-flow stream-chain pipeline analysis --background

# 분석이 완료된 후 문서를 생성합니다
./claude-flow stream-chain run \
  "Based on the codebase analysis, create API documentation" \
  "Generate user guide based on features" \
  "Create developer setup guide" \
  --bg
```

## 파일 및 저장소

### 프로세스 추적 파일

백그라운드 프로세스는 다음 파일에 기록됩니다:
```
.claude-flow/stream-chains.json
```

**파일 구조:**
```json
{
  "stream_1234567890": {
    "command": "npx claude-flow stream-chain demo",
    "pid": 12345,
    "startTime": "2025-08-12T17:50:20.135Z",
    "status": "running"
  },
  "stream_9876543210": {
    "command": "npx claude-flow stream-chain pipeline analysis",
    "pid": 67890,
    "startTime": "2025-08-12T18:00:00.000Z",
    "status": "killed",
    "endTime": "2025-08-12T18:05:00.000Z"
  }
}
```

## 오류 처리

stream-chain 명령은 포괄적인 오류 처리를 제공합니다:

### 일반 오류와 해결책

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| "Stream chain requires at least 2 prompts" | `run`을 프롬프트 2개 미만으로 실행함 | 최소 두 개의 프롬프트를 제공합니다 |
| "Unknown pipeline: [type]" | 잘못된 파이프라인 유형 | analysis, refactor, test, optimize 중 하나를 사용합니다 |
| "Process [id] not found" | 존재하지 않는 프로세스를 종료하려 함 | `monitor`로 올바른 ID를 확인합니다 |
| "Failed to kill process: kill ESRCH" | 프로세스가 이미 중지됨 | 추가 조치가 필요 없습니다 |
| Command timeout | Claude CLI가 없거나 느림 | Claude CLI를 설치하거나 더 짧은 타임아웃을 사용합니다 |

## 모범 사례

### 1. 긴 체인은 백그라운드로 실행

3단계 이상이거나 실행 시간이 30초를 넘길 것으로 예상되는 체인에는 다음과 같이 백그라운드를 사용하세요:
```bash
stream-chain run "step1" "step2" "step3" "step4" --background
```

### 2. 중요 체인 모니터링

중요한 워크플로우는 적극적으로 모니터링합니다:
```bash
# 중요 체인을 시작합니다
stream-chain pipeline refactor --bg

# 다른 터미널에서 모니터링합니다
watch -n 5 './claude-flow stream-chain monitor'
```

### 3. 적절한 타임아웃 설정

타임아웃으로 체인이 멈추지 않도록 방지합니다:
```bash
# 단계별 30초 타임아웃
stream-chain run "analyze" "implement" --timeout 30
```

### 4. 오래된 프로세스 정리

정기적으로 중지된 프로세스를 확인하고 정리합니다:
```bash
# 모든 프로세스를 확인합니다
stream-chain monitor

# 중지된 프로세스를 종료합니다
stream-chain kill stream_xxx
```

### 5. 디버깅에는 verbose 사용

체인이 실패할 때는 verbose 모드로 원인을 파악합니다:
```bash
stream-chain test --verbose
stream-chain run "task1" "task2" --verbose
```

## 고급 사용법

### 다른 Claude Flow 기능과 결합

#### Hive Mind와 함께 사용
```bash
# hive mind 조정을 시작합니다
npx claude-flow hive-mind spawn "coordinator"

# hive가 관리하는 stream chain을 실행합니다
./claude-flow stream-chain run \
  "Coordinate with hive mind for task distribution" \
  "Execute distributed tasks" \
  "Aggregate results" \
  --background
```

#### Training Pipeline과 함께 사용
```bash
# 먼저 에이전트를 학습합니다
./claude-flow train-pipeline run

# 학습한 에이전트를 stream chain에서 사용합니다
./claude-flow stream-chain run \
  "Apply conservative strategy from training" \
  "Apply balanced strategy from training" \
  "Apply aggressive optimization" \
  --bg
```

#### MCP 도구와 함께 사용
```bash
# MCP로 스웜을 초기화합니다
npx claude-flow swarm init --topology mesh

# 스웜 조정을 사용하여 stream chain을 실행합니다
./claude-flow stream-chain run \
  "Initialize swarm agents" \
  "Distribute tasks across swarm" \
  "Collect and synthesize results" \
  --background
```

## 문제 해결

### 체인이 시작되지 않음

**증상:** 명령이 멈추거나 바로 타임아웃됩니다

**점검 사항:**
1. Claude CLI가 설치되어 있는지 확인합니다: `which claude`
2. Claude가 인증되었는지 확인합니다: `claude --version`
3. 더 짧은 타임아웃으로 시도합니다: `--timeout 5`
4. 테스트 명령을 실행합니다: `stream-chain test`

### 백그라운드 프로세스를 찾을 수 없음

**증상:** `monitor`에 예상한 프로세스가 표시되지 않습니다

**점검 사항:**
1. 프로세스 파일이 존재하는지 확인합니다: `ls -la .claude-flow/stream-chains.json`
2. 프로세스가 시작되었는지 확인합니다: 터미널 출력에서 프로세스 ID를 확인합니다
3. 시스템 프로세스를 확인합니다: `ps aux | grep claude-flow`

### 체인이 예기치 않게 중지됨

**증상:** 체인이 조기에 "Stopped"로 표시됩니다

**점검 사항:**
1. 시스템 리소스를 확인합니다: `top` 또는 `htop`
2. 타임아웃 설정을 검토합니다
3. Claude CLI 로그를 확인합니다
4. 자세한 정보를 위해 verbose 플래그로 실행합니다

## 성능 최적화

### 더 빠른 체인을 위한 팁

1. **컨텍스트 최소화:** 프롬프트를 간결하게 유지합니다
2. **구체적인 지시 사용:** 모호한 프롬프트를 피합니다
3. **가능하면 병렬화:** 독립적인 체인은 동시에 실행합니다
4. **결과 캐싱:** 중간 결과를 저장해 재사용합니다
5. **성능 프로파일링:** 느린 단계를 파악하려면 `--verbose`를 사용합니다

### 리소스 관리

```bash
# 동시에 실행할 체인 수를 제한합니다
MAX_CHAINS=3
CURRENT=$(./claude-flow stream-chain monitor | grep "🟢 Running" | wc -l)

if [ $CURRENT -lt $MAX_CHAINS ]; then
  ./claude-flow stream-chain demo --background
else
  echo "Maximum chains running, waiting..."
fi
```

## 관련 문서

- [Stream-JSON 체이닝 가이드](./stream-chaining.md)
- [백그라운드 명령](./background-commands.md)
- [Training Pipeline](./training-pipeline.md)
- [Hive Mind 연동](./hive-mind.md)
- [MCP 도구 레퍼런스](./mcp-tools.md)

## 버전 기록

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| 1.0.0 | 2025-08-12 | 초기 구현 |
| 1.1.0 | 2025-08-12 | 백그라운드 실행 지원 추가 |
| 1.2.0 | 2025-08-12 | monitor 및 kill 명령 추가 |

## 기여 방법

stream-chain 명령에 기여하려면 다음을 수행합니다:

1. 리포지토리를 포크합니다
2. 기능 브랜치를 생성합니다: `git checkout -b feature/stream-chain-enhancement`
3. `/src/cli/simple-commands/stream-chain.js`를 수정합니다
4. 테스트와 문서를 업데이트합니다
5. Pull Request를 제출합니다

## 지원

문제나 질문이 있다면 다음을 참고하세요:
- GitHub Issues: [claude-flow/issues](https://github.com/ruvnet/claude-flow/issues)
- Documentation: [Stream Chaining Docs](https://github.com/ruvnet/claude-flow/docs/stream-chaining.md)
- Wiki: [Claude Flow Wiki](https://github.com/ruvnet/claude-flow/wiki)

---

*마지막 업데이트: 2025년 8월*
*Claude Flow 버전: Alpha 89*
