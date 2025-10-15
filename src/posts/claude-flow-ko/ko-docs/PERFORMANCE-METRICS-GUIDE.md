# 성능 지표 향상 가이드

## 개요

`performance.json` 파일에 메모리 작업, 모드 사용량, ReasoningBank 전용 성능을 추적할 수 있는 포괄적인 메트릭이 추가되었습니다.

## 확장된 구조

### 세션 정보
```json
{
  "startTime": 1234567890,
  "sessionId": "session-1234567890",
  "lastActivity": 1234567890,
  "sessionDuration": 12345
}
```
세션 시작 시각, 고유 세션 ID, 마지막 활동 타임스탬프, 총 세션 지속 시간을 밀리초 단위로 추적합니다.

### 메모리 모드 추적
```json
{
  "memoryMode": {
    "reasoningbankOperations": 45,
    "basicOperations": 12,
    "autoModeSelections": 50,
    "modeOverrides": 7,
    "currentMode": "auto"
  }
}
```
어떤 메모리 모드(ReasoningBank vs Basic/JSON)를 사용 중인지, AUTO MODE가 각 모드를 얼마나 자주 선택하는지, 수동 재정의가 얼마나 발생했는지를 추적합니다.

### 작업 유형 분해
```json
{
  "operations": {
    "store": { "count": 20, "totalDuration": 1234, "errors": 0 },
    "retrieve": { "count": 45, "totalDuration": 2345, "errors": 1 },
    "query": { "count": 30, "totalDuration": 15000, "errors": 0 },
    "list": { "count": 10, "totalDuration": 500, "errors": 0 },
    "delete": { "count": 3, "totalDuration": 200, "errors": 0 },
    "search": { "count": 25, "totalDuration": 12000, "errors": 0 },
    "init": { "count": 1, "totalDuration": 500, "errors": 0 }
  }
}
```
각 작업 유형의 실행 횟수, 총 소요 시간, 오류 횟수를 자세히 분류합니다.

### 성능 통계
```json
{
  "performance": {
    "avgOperationDuration": 450.5,
    "minOperationDuration": 10,
    "maxOperationDuration": 5000,
    "slowOperations": 3,
    "fastOperations": 100,
    "totalOperationTime": 45050
  }
}
```
- `avgOperationDuration`: 작업당 평균 시간(ms)
- `minOperationDuration`: 가장 빠른 작업 시간(ms)
- `maxOperationDuration`: 가장 느린 작업 시간(ms)
- `slowOperations`: 5000ms를 초과한 작업 횟수
- `fastOperations`: 100ms 미만 작업 횟수
- `totalOperationTime`: 모든 작업의 누적 시간(ms)

### 저장소 통계
```json
{
  "storage": {
    "totalEntries": 150,
    "reasoningbankEntries": 120,
    "basicEntries": 30,
    "databaseSize": 2048000,
    "lastBackup": 1234567890,
    "growthRate": 12.5
  }
}
```
- `totalEntries`: 모든 모드를 합친 메모리 엔트리 수
- `reasoningbankEntries`: ReasoningBank 데이터베이스의 엔트리 수
- `basicEntries`: JSON 저장소의 엔트리 수
- `databaseSize`: 데이터베이스 파일 크기(byte)
- `lastBackup`: 마지막 백업 타임스탬프
- `growthRate`: 시간당 엔트리 증가율

### 오류 추적
```json
{
  "errors": {
    "total": 5,
    "byType": {
      "timeout": 2,
      "connection": 1,
      "validation": 2
    },
    "byOperation": {
      "query": 3,
      "store": 2
    },
    "recent": [
      {
        "operation": "query",
        "type": "timeout",
        "timestamp": 1234567890,
        "mode": "reasoningbank"
      }
    ]
  }
}
```
오류 유형, 작업, 최근 오류 이력에 대한 포괄적인 추적을 제공합니다.

### ReasoningBank 전용 메트릭
```json
{
  "reasoningbank": {
    "semanticSearches": 45,
    "sqlFallbacks": 12,
    "embeddingGenerated": 40,
    "consolidations": 3,
    "avgQueryTime": 450.5,
    "cacheHits": 25,
    "cacheMisses": 20
  }
}
```
- `semanticSearches`: 시맨틱 벡터 검색 횟수
- `sqlFallbacks`: SQL fallback 쿼리 횟수(시맨틱 검색이 비어 있을 때)
- `embeddingGenerated`: 생성된 텍스트 임베딩 수
- `consolidations`: 메모리 통합 실행 횟수
- `avgQueryTime`: 평균 쿼리 실행 시간(ms)
- `cacheHits`: 성공적인 캐시 조회 수
- `cacheMisses`: 추가 계산이 필요한 캐시 미스 수

## 사용 예시

### 메모리 작업 추적

```javascript
import { trackMemoryOperation } from './performance-metrics.js';

// 성공한 쿼리를 추적합니다
const startTime = Date.now();
const result = await queryMemory('search term');
const duration = Date.now() - startTime;

await trackMemoryOperation('query', 'reasoningbank', duration, true);

// 오류가 발생한 실패한 작업을 추적합니다
try {
  await storeMemory(data);
} catch (error) {
  const duration = Date.now() - startTime;
  await trackMemoryOperation('store', 'basic', duration, false, 'validation_error');
}
```

### 모드 선택 추적

```javascript
import { trackModeSelection } from './performance-metrics.js';

// AUTO MODE 선택을 추적합니다
const mode = await detectMemoryMode();
await trackModeSelection(mode, true); // true = automatic selection

// 수동 재정의를 추적합니다
if (flags.reasoningbank) {
  await trackModeSelection('reasoningbank', false); // false = manual override
}
```

### ReasoningBank 작업 추적

```javascript
import { trackReasoningBankOperation } from './performance-metrics.js';

// 시맨틱 검색을 추적합니다
const startTime = Date.now();
const results = await semanticSearch(query);
const duration = Date.now() - startTime;

if (results.length === 0) {
  // 시맨틱 검색 결과가 없어 SQL fallback을 사용합니다
  await trackReasoningBankOperation('sql_fallback', duration);
} else {
  await trackReasoningBankOperation('semantic_search', duration);
}

// 캐시 히트/미스를 추적합니다
if (cacheHit) {
  await trackReasoningBankOperation('cache_hit', 0);
} else {
  await trackReasoningBankOperation('cache_miss', duration);
}
```

### 성능 요약 가져오기

```javascript
import { getMemoryPerformanceSummary } from './performance-metrics.js';

const summary = await getMemoryPerformanceSummary();

console.log('Session:', summary.session);
console.log('Mode Usage:', summary.mode);
console.log('Operations:', summary.operations);
console.log('Performance:', summary.performance);
console.log('Storage:', summary.storage);
console.log('ReasoningBank:', summary.reasoningbank);
console.log('Errors:', summary.errors);
```

이 요약에는 다음과 같은 계산된 메트릭이 포함됩니다:
- 오류율(%)
- SQL fallback 비율(시맨틱 검색이 SQL로 대체된 비율)
- 캐시 히트율(성공적으로 캐시를 조회한 비율)

## 통합 지점

다음 구성 요소에 해당 추적 함수를 통합해야 합니다:

1. **Memory Command** (`src/cli/simple-commands/memory.js`)
   - store, retrieve, query, list, delete 작업을 모두 추적합니다
   - 모드 감지와 선택을 추적합니다

2. **ReasoningBank Adapter** (`src/reasoningbank/reasoningbank-adapter.js`)
   - 시맨틱 검색을 추적합니다
   - SQL fallback을 추적합니다
   - 임베딩 생성을 추적합니다
   - 캐시 히트/미스를 추적합니다

3. **Session Hooks** (hooks system)
   - 세션 시작 시 메트릭을 초기화합니다
   - 세션 종료 시 메트릭을 내보냅니다
   - 저장소 통계를 주기적으로 업데이트합니다

## 이점

1. **가시성**: AUTO MODE가 실제 사용 환경에서 어떻게 동작하는지 파악합니다
2. **성능 튜닝**: 느린 작업과 병목 지점을 식별합니다
3. **오류 분석**: 오류 패턴과 발생 빈도를 추적합니다
4. **모드 최적화**: 워크로드별로 어떤 모드가 더 잘 동작하는지 확인합니다
5. **리소스 계획**: 증가율과 저장소 사용량을 모니터링합니다
6. **캐시 효율성**: 최적화를 위해 캐시 히트율을 측정합니다

## 향후 확장

추가로 고려할 수 있는 항목:
- 쿼리 패턴 분석(가장 자주 사용되는 쿼리)
- 작업 빈도 히트맵
- 성능 저하 알림
- 자동 추천 시스템
- 장기 분석을 위한 시계열 데이터베이스 내보내기
- 실시간 대시보드
