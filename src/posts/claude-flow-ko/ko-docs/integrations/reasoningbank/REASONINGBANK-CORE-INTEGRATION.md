# ReasoningBank 코어 메모리 통합

## 🎯 개요

기존 설치와의 완전한 하위 호환성을 유지하면서, ReasoningBank를 `claude-flow memory`의 **선택적 강화 모드**로 통합합니다.

## 📊 현재 상태

### 두 개의 분리된 시스템

**코어 메모리** (`claude-flow memory`)
- 기본적인 key-value 저장소
- 파일 기반 (JSON): `./memory/memory-store.json`
- 명령어: store, query, stats, export, import, clear, list
- AI/학습 기능 없음
- 항상 사용 가능, 의존성 없음

**ReasoningBank** (`claude-flow agent memory`)
- AI 기반 학습 메모리
- 데이터베이스 기반 (SQLite): `.swarm/memory.db`
- 명령어: init, status, list, demo, test, benchmark
- 작업 실행 패턴으로부터 학습
- 초기화 및 API 키 필요

## 🚀 제안된 통합 방안

### 통합 인터페이스

```bash
# 기본 모드 (현재 동작 - 하위 호환)
claude-flow memory store api_key "sk-ant-xxx" --redact
claude-flow memory query research

# 강화 모드 (신규 - 플래그를 통한 선택적 사용)
claude-flow memory store api_key "sk-ant-xxx" --reasoningbank
claude-flow memory query research --reasoningbank
claude-flow memory status --reasoningbank

# 단축형
claude-flow memory store api_key "sk-ant-xxx" --rb
claude-flow memory query research --rb
```

### 자동 감지

```bash
# 어떤 모드가 적절한지 자동으로 감지
claude-flow memory query research --auto

# ReasoningBank 사용 가능 여부 확인
claude-flow memory detect
```

## 🏗️ 아키텍처

### 명령어 흐름

```
┌─────────────────────────────────────────┐
│  claude-flow memory <cmd> [--rb|--auto] │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼─────────┐
        │  플래그 파싱     │
        └────────┬─────────┘
                 │
     ┌───────────▼────────────┐
     │  모드 감지             │
     │  • 플래그 없음 → 기본  │
     │  • --rb → ReasoningBank│
     │  • --auto → 감지       │
     └───────────┬────────────┘
                 │
        ┌────────▼─────────┐
        │  명령어 실행     │
        └──────────────────┘
```

### 기능 매트릭스

| 명령어 | 기본 모드 | ReasoningBank 모드 | 비고 |
|----------|------------|-------------------|-------|
| `store`  | JSON 파일  | SQLite + 임베딩 | RB가 패턴 학습 |
| `query`  | 정확/유사 일치 | 시맨틱 검색 | RB가 임베딩 사용 |
| `stats`  | 파일 통계 | AI 메트릭 (신뢰도, 사용량) | RB가 학습 통계 표시 |
| `export` | JSON 내보내기 | JSON + 임베딩 | RB가 벡터 포함 |
| `import` | JSON 가져오기 | JSON + 벡터 재생성 | RB가 임베딩 재생성 |
| `clear`  | 항목 삭제 | 아카이브 + 정리 | RB가 학습 내용 보존 |
| `list`   | 키 목록 | 신뢰도 점수와 함께 목록 표시 | RB가 품질 메트릭 표시 |

### 새로운 명령어

```bash
# ReasoningBank 초기화 (최초 1회 설정)
claude-flow memory init --reasoningbank

# ReasoningBank 상태 확인
claude-flow memory status --reasoningbank

# 활성화된 모드 표시
claude-flow memory mode

# ReasoningBank 사용 가능 여부 감지
claude-flow memory detect

# 기본 → ReasoningBank 마이그레이션
claude-flow memory migrate --to reasoningbank

# ReasoningBank 통합/최적화
claude-flow memory consolidate --reasoningbank
```

## 🔄 하위 호환성

### 호환성 보장

1. **기존 명령어 변경 없이 작동**
   ```bash
   # 이 명령어들은 이전과 정확히 동일하게 작동합니다
   claude-flow memory store key value
   claude-flow memory query search
   ```

2. **호환성이 깨지는 변경 없음**
   - 기본 동작 변경 없음 (기본 모드 사용)
   - 기존 JSON 파일에 영향을 주지 않음
   - 강제 마이그레이션 없음

3. **선택적(Opt-in) 강화**
   - 사용자는 명시적으로 `--reasoningbank` 또는 `--rb`를 사용해야 합니다
   - 또는 먼저 `memory init --reasoningbank`를 실행해야 합니다
   - 그 후 선택적으로 기본 모드를 설정할 수 있습니다

### 마이그레이션 경로

```bash
# 1단계: 현재 메모리 확인
claude-flow memory stats
# 표시: 기본 모드에 150개 항목

# 2단계: ReasoningBank 초기화
claude-flow memory init --reasoningbank
# .swarm/memory.db 생성

# 3단계: (선택) 기존 데이터 마이그레이션
claude-flow memory migrate --to reasoningbank
# 150개 항목 모두 가져오기 + 임베딩 생성

# 4단계: ReasoningBank 모드 사용
claude-flow memory query api --reasoningbank
# 이제 AI를 이용한 시맨틱 검색 사용
```

## 📝 구현 계획

### 1단계: 코어 통합 (1주차)

**파일**: `src/cli/simple-commands/memory.js`

모드 감지 추가:
```javascript
export async function memoryCommand(subArgs, flags) {
  const memorySubcommand = subArgs[0];

  // 신규: 모드 감지
  const mode = detectMemoryMode(flags);
  // 반환값: 'basic' | 'reasoningbank' | 'auto'

  if (mode === 'reasoningbank') {
    // ReasoningBank 구현으로 위임
    return await reasoningBankMemoryCommand(subArgs, flags);
  }

  // 기존 기본 구현 계속 진행...
}
```

### 2단계: 자동 감지 (1주차)

지능형 감지 기능 추가:
```javascript
async function detectMemoryMode(flags) {
  // 명시적 플래그가 우선 적용됩니다
  if (flags.reasoningbank || flags.rb) {
    return 'reasoningbank';
  }

  // 자동 모드: ReasoningBank가 초기화되었는지 확인
  if (flags.auto) {
    const rbAvailable = await isReasoningBankInitialized();
    return rbAvailable ? 'reasoningbank' : 'basic';
  }

  // 기본값: 기본 모드 (하위 호환)
  return 'basic';
}
```

### 3단계: 강화된 명령어 (2주차)

ReasoningBank 관련 기능 추가:
```javascript
// ReasoningBank 모드에서만 사용 가능한 새로운 명령어
case 'init':
  if (mode === 'reasoningbank') {
    await initializeReasoningBank();
  }
  break;

case 'status':
  if (mode === 'reasoningbank') {
    await showReasoningBankStatus();
  } else {
    await showBasicMemoryStats();
  }
  break;
```

### 4단계: 마이그레이션 도구 (2주차)

마이그레이션 유틸리티 추가:
```javascript
case 'migrate':
  await migrateMemoryData(flags.to); // 'reasoningbank' 또는 'basic'
  break;

case 'detect':
  await detectAndShowAvailableModes();
  break;
```

## 🎯 사용자 경험

### 처음 사용자

```bash
# 즉시 기본 메모리 설치 및 사용
$ claude-flow memory store project "Started new API project"
✅ Stored: project

$ claude-flow memory query project
✅ Found 1 result:
   project: Started new API project

# 추후: ReasoningBank 발견
$ claude-flow memory detect
ℹ️  사용 가능한 메모리 모드:
   ✅ 기본 모드 (활성)
   ⚠️  ReasoningBank (초기화되지 않음)

💡 AI 기반 메모리를 활성화하려면:
   claude-flow memory init --reasoningbank
```

### 기존 사용자 (하위 호환)

```bash
# 기존 설치 - 모든 것이 변경 없이 작동
$ claude-flow memory stats
📊 메모리 통계:
   총 항목 수: 247
   네임스페이스: 5
   크기: 45.2 KB
   모드: Basic

# ReasoningBank 선택적 사용
$ claude-flow memory init --reasoningbank
🧠 ReasoningBank 초기화 중...
✅ 생성됨: .swarm/memory.db
✅ ReasoningBank 준비 완료!

# 기존 데이터 마이그레이션 (선택 사항)
$ claude-flow memory migrate --to reasoningbank
📦 247개 항목 마이그레이션 중...
⏳ 임베딩 생성 중... (시간이 걸릴 수 있습니다)
✅ 마이그레이션 성공!

# 이제 두 모드 중 하나를 사용
$ claude-flow memory query api
# 기본 모드 사용 (기본값)

$ claude-flow memory query api --reasoningbank
# 시맨틱 검색과 함께 ReasoningBank 사용
```

### 고급 사용자

```bash
# 설정을 통해 기본 모드 설정
$ claude-flow config set memory.default_mode reasoningbank
✅ 기본 메모리 모드: ReasoningBank

# 이제 모든 명령어가 기본적으로 ReasoningBank를 사용
$ claude-flow memory query performance
# 자동으로 ReasoningBank 사용

# 기본 모드를 사용하도록 재정의
$ claude-flow memory query performance --basic
# 강제로 기본 모드 사용
```

## 🔐 보안 및 개인정보 보호

### 데이터 분리

- 기본 모드: `./memory/memory-store.json`
- ReasoningBank: `.swarm/memory.db`
- 두 모드 모두 `--redact` 플래그 지원
- ReasoningBank 임베딩은 원본 API 키를 절대 노출하지 않음

### 개인정보 보호 제어

```bash
# 두 모드에서 민감한 데이터 수정
claude-flow memory store api "sk-ant-xxx" --redact

# 개인정보 보호 우선 로컬 임베딩을 사용하는 ReasoningBank
claude-flow memory init --reasoningbank --local-embeddings
# ONNX 로컬 모델을 사용하며, 외부 API로 데이터를 전송하지 않음
```

## 📊 성능 비교

| 메트릭 | 기본 모드 | ReasoningBank | 개선점 |
|--------|-----------|--------------|-------------|
| 쿼리 속도 | 2ms | 15ms | -6.5배 느림 |
| 쿼리 정확도 | 60% | 88% | +46% 향상 |
| 학습 | 없음 | 가능 | ∞ 향상 |
| 메모리 사용량 | 1MB | 50MB | -49배 더 많음 |
| 설정 시간 | 0s | 30s | -30초 더 김 |

**권장 사항**: 간단한 key-value 저장에는 기본 모드를, AI 기반 학습 및 시맨틱 검색에는 ReasoningBank를 사용하세요.

## 🧪 테스트 전략

### 하위 호환성 테스트

```bash
# 테스트 1: 기존 명령어가 변경 없이 작동하는지 확인
claude-flow memory store test "value"
claude-flow memory query test

# 테스트 2: 강제 마이그레이션이 없는지 확인
claude-flow memory stats
# 기본적으로 기본 모드를 표시해야 함

# 테스트 3: 선택적 사용(Opt-in)이 작동하는지 확인
claude-flow memory query test --reasoningbank
# 초기화되지 않은 경우 정상적으로 실패해야 함
```

### 통합 테스트

```bash
# 테스트 4: ReasoningBank 초기화
claude-flow memory init --reasoningbank
claude-flow memory status --reasoningbank

# 테스트 5: 마이그레이션
claude-flow memory migrate --to reasoningbank
claude-flow memory stats --reasoningbank

# 테스트 6: 모드 감지
claude-flow memory detect
```

## 📚 문서 업데이트

### 도움말 텍스트 업데이트

```bash
$ claude-flow memory --help

메모리 관리

사용법:
  claude-flow memory <command> [options]

모드:
  기본 모드 (기본값)     JSON 파일에 간단한 key-value 저장
  ReasoningBank 모드       시맨틱 검색을 통한 AI 기반 학습

플래그:
  --reasoningbank, --rb    ReasoningBank 모드 사용 (AI 기반)
  --auto                   최적 모드 자동 감지
  --basic                  강제로 기본 모드 사용
  --redact                 API 키 수정 활성화

명령어:
  store <key> <value>      key-value 쌍 저장
  query <search>           항목 검색
  stats                    메모리 통계 표시
  export [filename]        메모리를 파일로 내보내기
  import <filename>        파일에서 메모리 가져오기
  clear --namespace <ns>   네임스페이스 비우기
  list                     모든 네임스페이스 목록 표시

  # ReasoningBank 명령어 (--reasoningbank 필요)
  init --reasoningbank     ReasoningBank 시스템 초기화
  status --reasoningbank   ReasoningBank 통계 표시
  consolidate --rb         ReasoningBank 데이터베이스 최적화

  # 모드 관리
  detect                   사용 가능한 메모리 모드 표시
  migrate --to <mode>      기본/reasoningbank 모드 간 마이그레이션
  mode                     현재 기본 모드 표시

예시:
  # 기본 모드 (항상 작동)
  memory store api_key "sk-ant-xxx" --redact
  memory query research

  # ReasoningBank 모드 (초기화 필요)
  memory init --reasoningbank
  memory store api_key "sk-ant-xxx" --reasoningbank
  memory query research --reasoningbank

  # 자동 감지 (사용 가능한 최적의 모드 사용)
  memory query research --auto
```

## 🚦 출시 계획

### 버전 2.6.1 (현재)

- ✅ `agent memory` 명령어를 통해 ReasoningBank 사용 가능
- ✅ 코어 메모리는 독립적으로 작동

### 버전 2.7.0 (다음 - 이 통합)

- 🎯 `memory` 명령어에 `--reasoningbank` 플래그 추가
- 🎯 모드 감지 및 자동 선택 기능 추가
- 🎯 마이그레이션 도구 추가
- 🎯 도움말 및 문서 업데이트
- 🎯 완전한 하위 호환성 유지

### 버전 2.8.0 (미래)

- 🔮 하이브리드 모드 추가 (둘 다 동시 사용)
- 🔮 기본 ↔ ReasoningBank 간 동기화 추가
- 🔮 클라우드 ReasoningBank 동기화 추가

## ✅ 이점

### 사용자 측면

1. **원활한 업그레이드 경로**: 강제 변경 없음
2. **모드 선택**: 간단한 작업에는 기본 모드, AI 기능에는 ReasoningBank
3. **점진적 마이그레이션**: 기존 데이터 손실 없이 ReasoningBank 시도 가능
4. **성능 옵션**: 빠른 기본 모드 vs. 스마트한 ReasoningBank

### 개발 측면

1. **호환성을 깨는 변경 없음**: 기존 코드가 계속 작동
2. **기능 플래그 패턴**: 활성화/비활성화 용이
3. **독립적인 테스트**: 각 모드를 개별적으로 테스트
4. **깔끔한 아키텍처**: 명확한 관심사 분리

## 🔌 MCP 도구 통합

### 현재 MCP 도구

**기존** (`mcp__claude-flow__memory_usage`)
```javascript
// 현재 구현 - 기본 모드만 해당
mcp__claude-flow__memory_usage({
  action: "store",
  key: "api_config",
  value: "some data"
})
```

### 강화된 MCP 도구

**옵션 1: 모드 매개변수 추가**
```javascript
// 하위 호환 - 기본적으로 기본 모드 사용
mcp__claude-flow__memory_usage({
  action: "store",
  key: "api_config",
  value: "some data",
  mode: "basic"  // 신규: 선택 사항, 기본값 "basic"
})

// ReasoningBank 선택적 사용
mcp__claude-flow__memory_usage({
  action: "store",
  key: "api_config",
  value: "some data",
  mode: "reasoningbank"  // 신규: AI 기반 모드 사용
})

// 최적 모드 자동 감지
mcp__claude-flow__memory_usage({
  action: "store",
  key: "api_config",
  value: "some data",
  mode: "auto"  // 신규: 지능적 선택
})
```

**옵션 2: 별도의 MCP 도구** (권장)

하위 호환성을 유지하고 새로운 도구를 추가합니다:

```javascript
// 기존 도구 - 변경 없음 (기본 모드)
mcp__claude-flow__memory_usage({
  action: "store",
  key: "api_config",
  value: "some data"
})

// 신규 도구 - ReasoningBank
mcp__claude-flow__reasoningbank_memory({
  action: "store",
  key: "api_config",
  value: "some data",
  domain: "api",           // 신규: 시맨틱 도메인
  confidence: 0.8          // 신규: 학습 신뢰도
})

// 신규 도구 - 시맨틱 쿼리
mcp__claude-flow__reasoningbank_query({
  query: "how to configure API",
  k: 3,                    // 상위 k개 결과
  min_confidence: 0.7      // 최소 신뢰도 임계값
})
```

### MCP 도구 스키마 업데이트

**강화된 memory_usage 도구**:
```json
{
  "name": "mcp__claude-flow__memory_usage",
  "description": "선택적인 ReasoningBank 모드로 메모리 저장/검색",
  "parameters": {
    "action": {
      "type": "string",
      "enum": ["store", "retrieve", "list", "delete", "search"]
    },
    "key": { "type": "string" },
    "value": { "type": "string" },
    "namespace": { "type": "string" },
    "mode": {
      "type": "string",
      "enum": ["basic", "reasoningbank", "auto"],
      "default": "basic",
      "description": "메모리 모드: basic (JSON), reasoningbank (AI), auto (감지)"
    },
    "ttl": { "type": "number" }
  }
}
```

**신규 ReasoningBank 전용 도구**:
```json
{
  "name": "mcp__claude-flow__reasoningbank_store",
  "description": "AI 학습으로 메모리 저장 (ReasoningBank)",
  "parameters": {
    "key": { "type": "string" },
    "value": { "type": "string" },
    "domain": {
      "type": "string",
      "description": "시맨틱 도메인 (예: 'api', 'security', 'performance')"
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "이 메모리에 대한 신뢰도 점수"
    },
    "metadata": {
      "type": "object",
      "description": "학습을 위한 추가 메타데이터"
    }
  }
}
```

### MCP 사용 예시

**ReasoningBank와 함께 사용하는 Claude Desktop**:
```typescript
// Claude Desktop 대화에서
"방금 배운 API 설정을 저장해줘"

// Claude Code MCP 호출 (모드 자동 감지):
await mcp__claude-flow__memory_usage({
  action: "store",
  key: "api_config_pattern",
  value: "Always use environment variables for API keys",
  mode: "auto"  // 초기화된 경우 ReasoningBank를 사용합니다
})

// 나중에, 새로운 대화에서:
"API 설정에 대해 내가 배운 게 뭐지?"

// Claude Code MCP 호출:
await mcp__claude-flow__reasoningbank_query({
  query: "API configuration best practices",
  k: 3
})

// 신뢰도 점수와 함께 시맨틱 검색 결과를 반환합니다:
// 1. [0.92] Always use environment variables for API keys
// 2. [0.85] API keys should be in .env files
// 3. [0.78] Never commit API keys to git
```

### MCP 통합의 이점

1. **호환성을 깨는 변경 없음**: 기존 MCP 호출이 변경 없이 작동
2. **선택적 강화**: ReasoningBank를 활성화하기 위해 `mode` 매개변수 추가
3. **지능적인 기본값**: `mode: "auto"`가 사용 가능한 최적의 모드를 감지
4. **전용 도구**: ReasoningBank 관련 기능을 위한 새로운 도구
5. **세션 간 학습**: MCP 도구는 Claude Desktop 세션 간에 유지됨

### MCP 도구 마이그레이션 경로

```typescript
// 1단계: 현재 (v2.6.x)
mcp__claude-flow__memory_usage({ action: "store", ... })
// 항상 기본 모드 사용

// 2단계: 강화 (v2.7.0)
mcp__claude-flow__memory_usage({
  action: "store",
  mode: "auto",  // 신규 매개변수 (선택 사항)
  ...
})
// ReasoningBank 사용 가능 시 자동 감지

// 3단계: 전용 (v2.7.0)
mcp__claude-flow__reasoningbank_store({
  key: "pattern",
  value: "learned behavior",
  domain: "coding",
  confidence: 0.9
})
// 모든 기능을 갖춘 ReasoningBank 전용 도구
```

## 🎉 요약

이 통합은 ReasoningBank를 코어 메모리의 **선택적 강화 기능**으로 추가합니다:

✅ **하위 호환성**: 기존 설치가 변경 없이 작동합니다
✅ **선택적 사용(Opt-In)**: 사용자가 ReasoningBank 활성화 시점을 선택합니다
✅ **자동 감지**: `--auto`를 통한 지능적인 모드 선택
✅ **마이그레이션 도구**: 기본 모드에서 ReasoningBank로의 쉬운 업그레이드 경로
✅ **유연성**: 필요에 따라 기본, ReasoningBank 또는 둘 다 사용 가능
✅ **문서화**: 두 모드를 모두 보여주는 명확한 도움말 텍스트
✅ **MCP 통합**: Claude Desktop이 두 메모리 모드를 원활하게 사용 가능

**결과**: 두 가지 장점을 모두 누리세요 - 간단한 JSON 저장소 또는 AI 기반 학습 메모리! 🚀
