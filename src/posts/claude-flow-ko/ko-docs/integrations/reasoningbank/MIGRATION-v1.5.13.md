# ReasoningBank 마이그레이션 가이드: v1.5.12 → v1.5.13

## 개요

Claude-Flow는 ReasoningBank에 대해 이전 WASM 어댑터 방식을 대체하여 **Node.js backend**와 함께 **agentic-flow@1.5.13**을 사용하도록 업데이트되었습니다.

## 주요 변경 사항

### 백엔드 전환: WASM → Node.js SQLite

**이전(v1.5.12 - WASM)**:
- 휘발성 인메모리 스토리지(Node.js) 또는 IndexedDB(브라우저)
- WASM 모듈을 직접 import
- 매우 빠르지만 비지속적

**새 버전(v1.5.13 - Node.js)**:
- `.swarm/memory.db`에 **지속적인 SQLite 데이터베이스**
- 시맨틱 검색을 위한 전체 임베딩 지원
- 메모리 통합 및 trajectory 추적
- Node.js 환경에 권장되는 백엔드

### API 호환성

✅ **외부 API에 변경 사항 없음** - 모든 claude-flow memory 함수는 동일하게 유지됩니다:
- `storeMemory(key, value, options)`
- `queryMemories(searchQuery, options)`
- `listMemories(options)`
- `getStatus()`
- `initializeReasoningBank()`

### 내부 구현 변경 사항

**Storage**:
```javascript
// 이전 버전(WASM)
pattern = { task_description, task_category, strategy, success_score }
await wasm.storePattern(pattern)

// 새 버전(Node.js)
memory = { type: 'reasoning_memory', pattern_data: { title, content, domain } }
ReasoningBank.db.upsertMemory(memory)
await ReasoningBank.computeEmbedding(content) // 임베딩을 생성합니다
```

**Retrieval**:
```javascript
// 이전 버전(WASM)
results = await wasm.findSimilar(query, category, limit)

// 새 버전(Node.js)
results = await ReasoningBank.retrieveMemories(query, {
  domain, agent, k: limit, minConfidence
})
```

## 데이터베이스 스키마

**위치**: `.swarm/memory.db`

**테이블**:
- `patterns` - 신뢰도 점수가 포함된 Reasoning memory
- `pattern_embeddings` - 시맨틱 검색을 위한 벡터 임베딩
- `pattern_links` - 메모리 관계 및 상충 정보
- `task_trajectories` - 작업 실행 이력
- `matts_runs` - MaTTS 알고리즘 실행 기록
- `consolidation_runs` - 메모리 통합 이력

## 마이그레이션 단계

### 자동 마이그레이션

v2.7.0-alpha.7+로 업그레이드하면 ReasoningBank가 자동으로 다음을 수행합니다:

1. 첫 사용 시 Node.js 백엔드를 초기화합니다
2. `.swarm/memory.db`에 SQLite 데이터베이스를 생성합니다
3. 데이터베이스 마이그레이션(테이블 생성)을 실행합니다
4. 새로운 메모리에 대해 임베딩을 생성합니다

**수동 마이그레이션이 필요하지 않습니다!** 이전 WASM 데이터는 휘발성이며 저장되지 않았습니다.

### 환경 변수

```bash
# 선택 사항: 사용자 지정 데이터베이스 경로
export CLAUDE_FLOW_DB_PATH="/path/to/memory.db"

# 선택 사항: ReasoningBank 비활성화
export REASONINGBANK_ENABLED=false
```

## 기능 비교

| 기능 | WASM (v1.5.12) | Node.js (v1.5.13) |
|---------|----------------|-------------------|
| **스토리지** | 휘발성(인메모리) | 지속형(SQLite) |
| **시맨틱 검색** | 기본 유사도 | 임베딩 + MMR ranking |
| **도메인 필터링** | 카테고리 기반 | 전체 JSON 쿼리 지원 |
| **메모리 통합** | ❌ 제공되지 않음 | ✅ 기본 제공 |
| **Trajectory 추적** | ❌ 제공되지 않음 | ✅ 전체 이력 |
| **세션 간 메모리** | ❌ 재시작 시 손실 | ✅ 지속됨 |
| **성능** | 0.04ms/op (WASM) | 1-2ms/op (SQLite + 임베딩) |
| **데이터베이스 크기** | ~0 MB(메모리) | 데이터 증가에 따라 확장(~41MB/100개 패턴) |

## 성능

**벤치마크**(100개의 memory, 시맨틱 검색):

```
Storage:     메모리당 1-2ms (임베딩 생성 포함)
Query:       시맨틱 검색 쿼리당 1-3ms
Cached:      캐시된 쿼리는 <1ms
List:        데이터베이스 쿼리는 <1ms
```

**메모리 사용량**:
- SQLite 데이터베이스: 메모리당 약 400KB(임베딩 포함)
- RAM: 최소 (SQLite가 페이징을 처리합니다)

## 검증

ReasoningBank 통합을 검증하려면 다음을 실행하세요:

```bash
# 통합 테스트를 실행합니다
node tests/test-semantic-search.mjs

# 예상 출력:
# ✅ 초기화 완료
# ✅ 테스트용 메모리 5개 저장
# ✅ 시맨틱 검색이 결과를 반환함
# ✅ 쿼리 캐싱이 동작함
```

## 문제 해결

### 문제: "Database not found"
```bash
# 초기화가 실행되었는지 확인합니다
npx claude-flow@alpha memory status

# 필요하면 수동으로 초기화합니다
npx claude-flow@alpha memory init
```

### 문제: "No results from semantic search"
```bash
# 임베딩이 생성되는지 확인합니다
# 경고 "[ReasoningBank] Failed to generate embedding"을 확인하세요

# 데이터베이스에 임베딩이 있는지 확인합니다:
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM pattern_embeddings;"
```

### 문제: "Embeddings not generating"
```bash
# (Claude 임베딩을 사용하는 경우) API 키가 설정되어 있는지 확인합니다
export ANTHROPIC_API_KEY=$YOUR_API_KEY

# 또는 .reasoningbank.json에서 대체 임베딩 공급자를 설정합니다
```

## Node.js 백엔드의 장점

✅ **Persistent Memory** - 프로세스 재시작 이후에도 유지됩니다
✅ **Semantic Search** - 임베딩 기반 유사도를 제공합니다
✅ **Memory Consolidation** - 오래된 메모리를 중복 제거하고 정리합니다
✅ **Trajectory Tracking** - 전체 작업 실행 이력을 제공합니다
✅ **Production-Ready** - 검증된 SQLite 백엔드입니다

## 롤백(권장하지 않음)

임시로 v1.5.12로 롤백해야 하는 경우:

```bash
npm install agentic-flow@1.5.12 --legacy-peer-deps
```

**참고**: 이렇게 하면 Node.js 백엔드 기능이 사라지고 휘발성 스토리지로 되돌아갑니다.

## 지원

- GitHub Issues: https://github.com/ruvnet/claude-code-flow/issues
- 문서: /ko-docs/integrations/reasoningbank/
- 테스트 스위트: /tests/test-semantic-search.mjs

---

**마이그레이션 완료**: Claude-Flow v2.7.0-alpha.7에서 agentic-flow@1.5.13 Node.js backend ✅
