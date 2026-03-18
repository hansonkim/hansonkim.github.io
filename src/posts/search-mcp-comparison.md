---
title: "웹 검색 MCP 도구 비교: Perplexity vs Gemini Google Search vs WebSearch"
description: "Claude Code에서 웹 검색이 필요할 때, 어떤 도구를 써야 할까요? 내장 WebSearch 하나로 충분할까요?"
date: 2026-03-18T01:58:12+09:00
tags:
  - posts
  - AI
  - 개발도구
  - 문서화
  - JavaScript
---

# 웹 검색 MCP 도구 비교: Perplexity vs Gemini Google Search vs WebSearch

## 들어가며

Claude Code에서 웹 검색이 필요할 때, 어떤 도구를 써야 할까요? 내장 WebSearch 하나로 충분할까요?

이 글에서는 Claude Code에서 사용할 수 있는 3가지 웹 검색 도구를 실제 테스트하고, 속도·품질·용도별 최적 선택 가이드를 제시합니다.

> **테스트 기준일**: 2025년 3월 (모델 버전: Perplexity `sonar`, Gemini `gemini-2.5-flash-lite`)
> 모델 업데이트에 따라 결과가 달라질 수 있습니다.

## MCP란?

**MCP(Model Context Protocol)**는 AI 모델이 외부 도구와 데이터 소스에 연결할 수 있게 해주는 표준 프로토콜입니다. Claude Code에서 MCP 서버를 등록하면, AI가 직접 외부 API를 호출하여 실시간 정보를 가져올 수 있습니다.

```json
// ~/.claude.json 에 MCP 서버 등록 예시
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "perplexity-mcp"],
      "env": {
        "PERPLEXITY_API_KEY": "your-api-key"
      }
    }
  }
}
```

이번에 비교한 3가지 도구도 모두 이 MCP 구조 위에서 동작합니다.

## 비교 대상

| 도구 | 유형 | 사용 모델 | 비용 |
|---|---|---|---|
| **WebSearch** | Claude Code 내장 | Anthropic 자체 검색 엔진 | Claude Code 구독에 포함 (Pro $20/월, Max $100~200/월) |
| **Perplexity MCP** | MCP 서버 ([perplexity-mcp](https://www.npmjs.com/package/perplexity-mcp), 공식) | `sonar` (기본값, `PERPLEXITY_MODEL`로 변경 가능) | $5/1K 요청 (sonar 기준, [가격표](https://docs.perplexity.ai/guides/pricing)) |
| **Gemini Google Search** | MCP 서버 ([mcp-gemini-google-search](https://www.npmjs.com/package/mcp-gemini-google-search), 커뮤니티) | `gemini-2.5-flash-lite` + Google Search Grounding | 무료 티어 있음, 유료 시 $0.01~0.02/1K 토큰 ([가격표](https://ai.google.dev/pricing)) |

## 테스트 설계

총 7개 쿼리로 3가지 카테고리를 테스트했습니다. 각 도구에 동일한 쿼리를 동일 시점에 실행하고, 단독 실행과 병렬 실행 각 1회씩 측정했습니다.

### 평가 기준 (루브릭)

별점은 다음 기준으로 매겼습니다:

| 등급 | 기준 |
|---|---|
| ★★★★★ | 질의 의도를 완전히 충족하고, 구체적 수치/예시/출처까지 포함 |
| ★★★★☆ | 핵심 정보를 정확히 제공하나, 일부 세부사항 누락 |
| ★★★☆☆ | 개괄적 답변은 제공하나, 깊이가 부족하거나 일부 부정확 |
| ★★☆☆☆ | 관련 정보를 일부만 제공하거나, 피상적 수준 |
| ★☆☆☆☆ | 거의 유용한 정보 없음 또는 명백한 오류 |

### 테스트 1: 시사 뉴스 검색 (한국어)

**질의**: "어제 당정 검찰개혁 협의안 결과와 야당 반응 및 향후 일정"

시의성이 중요한 한국 정치 뉴스로, **한국어 최신 정보 반영 능력**을 테스트합니다.

### 테스트 2: 기술 제품 정보 (영어)

**질의**: "ChatGPT 5.4-mini"

최신 출시된 AI 모델의 스펙·가격·기능 정보로, 기술 정확도를 테스트합니다.

### 테스트 3: 개발자 커뮤니티 토픽 5개 (영어)

r/programming 최근 포스트 5개를 선정하여 각각 검색:
1. Torturing Rustc by Emulating HKTs
2. Finding a CPU Design Bug in the Xbox 360
3. Java 26 is here
4. What is Infrastructure from Code?
5. The Paxos algorithm, when presented in plain English, is very simple

## 테스트 결과

### 응답 속도

개별 도구 실행 시간을 측정한 결과:

| 도구 | 단독 측정 | 5개 주제 평균 (추정) |
|---|---|---|
| **WebSearch** | 48.5s | ~9s |
| **Perplexity** | 25.2s | ~19s |
| **Gemini Google Search** | 30.2s | ~16s |

> **측정 방법**: 단독 측정은 Claude Code 서브에이전트(Agent 도구) 1회 실행의 전체 시간 (API 호출 + 모델 응답 생성 포함). 5개 주제 평균은 동일 5개 쿼리를 병렬 실행한 세션에서 각 도구가 응답을 반환한 시간의 평균 추정치입니다. 각 조건당 1회 실행이므로 통계적 유의성은 제한적입니다.

단독 실행 시 Perplexity가 가장 빨랐지만, 병렬 환경에서는 WebSearch가 가장 먼저 응답을 반환하는 경향을 보였습니다.

### 테스트 1 결과: 시사 뉴스

| 항목 | WebSearch | Perplexity | Gemini |
|---|---|---|---|
| 협의안 상세도 | ★★★★☆ 구체적 조항 | ★★★★★ 가장 정리된 요약 | ★★★☆☆ 개괄적 서술 |
| 야당 반응 | ★★☆☆☆ 피상적 | ★★☆☆☆ 미확인 고지 | ★★★★★ 필리버스터, 국조특위 |
| 향후 일정 | ★★★☆☆ 본회의만 | ★★★★☆ 형소법 후속 논의 | ★★★★☆ 국조 협상 전망 |
| 출처 수 | 10개 | 7개 | 10개 |

**뉴스 검색 승자: Gemini** — 야당 반응, 시민단체 동향까지 가장 폭넓게 커버

**한국어 검색 특이사항**: Gemini는 Google Search Grounding 덕분에 한국 뉴스 소스(연합뉴스, 한겨레 등)를 직접 인덱싱하여 한국어 쿼리에서 가장 강력했습니다. Perplexity는 한국어 쿼리를 영어 소스 중심으로 처리하는 경향이 있어, 한국 시사 뉴스에서는 상대적으로 약했습니다. WebSearch는 한국어 소스를 적절히 반환했으나 맥락 요약이 얕았습니다.

### 테스트 2 결과: 기술 제품 정보

| 항목 | WebSearch | Perplexity | Gemini |
|---|---|---|---|
| 스펙 정확도 | ★★★★☆ | ★★★★★ API 스펙 최상세 | ★★★☆☆ |
| 가격 정보 | ★★★★☆ 기본 가격 | ★★★★★ cached/regional까지 | ★☆☆☆☆ 없음 |
| 기술 상세도 | ★★★★☆ | ★★★★★ cutoff, rate limit 등 | ★★★☆☆ |
| 활용 시나리오 | ★★★☆☆ | ★★★☆☆ | ★★★★☆ use case 구체적 |

**기술 스펙 승자: Perplexity** — context window, max output, rate limit, cached 가격까지 한 번에 제공

### 테스트 3 결과: 개발자 토픽 5개 종합

| 항목 | WebSearch | Perplexity | Gemini |
|---|---|---|---|
| 정보 정확도 | ★★★★☆ | ★★★★★ | ★★★★☆ |
| 기술 상세도 | ★★★☆☆ | ★★★★★ | ★★★★☆ |
| 출처 다양성 | ★★★★☆ | ★★★★☆ | ★★★★★ |
| 원문 링크 발굴 | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| 구조화 (표/코드) | ★★☆☆☆ | ★★★★★ | ★★★☆☆ |

주제별 차별화 포인트:

| 주제 | WebSearch 강점 | Perplexity 강점 | Gemini 강점 |
|---|---|---|---|
| Rust HKTs | 원문 블로그+HN 링크 | 코드 예시 (Functor::fmap) | rusty-hkt crate 등 라이브러리 |
| Xbox 360 CPU | Bruce Dawson 원문 링크 | MESI 프로토콜 위반 메커니즘 | 디버깅 어려움 관점 |
| Java 26 | 출시일+JEP 목록 | JEP 전체 표 + AOT 42% 수치 | JVP 생태계 (타 도구 미수록) |
| IfC | 구현체 6개 나열 | IaC vs IfC 5기준 비교표 | IaC 성숙도 비교 관점 |
| Paxos | 원문 블로그 링크 | 2f+1 공식 + Phase 단계별 | Raft 비교 + 홀수노드 이유 |

### 실패 및 오류 케이스

테스트 중 발견된 각 도구의 한계도 기록합니다:

| 도구 | 실패/오류 사례 |
|---|---|
| **WebSearch** | Java 26 검색 시 JEP 목록을 나열했으나, JEP 번호 일부가 실제와 다른 값을 반환 (hallucination 가능성) |
| **Perplexity** | 시사 뉴스(테스트 1)에서 "확인되지 않은 정보" 고지를 반환하며 야당 반응을 거의 제공하지 못함. 한국어 소스 접근이 제한적 |
| **Gemini** | ChatGPT 5.4-mini 가격 정보를 아예 반환하지 못함 (★☆☆☆☆). 기술 스펙 쿼리에서 수치 데이터가 약함 |

> 완벽한 도구는 없습니다. 각 도구의 약점을 인지하고 fallback 전략을 세우는 것이 중요합니다.

## 최종 비교 요약

| 항목 | WebSearch | Perplexity | Gemini |
|---|---|---|---|
| 응답 속도 | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| 기술 상세도 | ★★★☆☆ | ★★★★★ | ★★★★☆ |
| 뉴스/시사 | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| 출처 다양성 | ★★★★☆ | ★★★★☆ | ★★★★★ |
| 원문 URL 발굴 | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| 구조화 품질 | ★★☆☆☆ | ★★★★★ | ★★★☆☆ |
| 추가 비용 | 없음 | API 과금 | API 과금 |
| **종합** | **★★★★☆** | **★★★★★** | **★★★★☆** |

## 도구 선택 가이드

각 도구는 명확한 강점 영역이 있습니다. 용도에 따라 최적의 도구를 선택하세요.

```
┌─────────────────────────────────┐
│     어떤 검색이 필요한가?         │
└──────────┬──────────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
 기술 심층 조사   최신 뉴스/폭넓은 수집   원문 URL/빠른 개요
     │               │                      │
     ▼               ▼                      ▼
 Perplexity    Gemini Google Search      WebSearch
     │               │
     │ (실패 시)      │ (실패 시)
     ▼               ▼
 Gemini         WebSearch
     │
     │ (실패 시)
     ▼
 WebSearch
```

| 상황 | 1순위 | fallback |
|---|---|---|
| 기술 개념 심층 조사 (스펙, 코드, 비교 분석) | Perplexity | Gemini → WebSearch |
| 최신 뉴스, 공식 발표, 다각도 정보 수집 | Gemini | WebSearch |
| 원문 URL 탐색, 빠른 개요 | WebSearch | — |
| 어떤 도구든 실패 시 최종 fallback | WebSearch | — |

## Claude Code에서 설정하기

### 1. Perplexity MCP 추가

```bash
claude mcp add perplexity \
  --env PERPLEXITY_API_KEY="your-key" \
  -- npx -y perplexity-mcp
```

제공 도구: `perplexity_search`, `perplexity_ask`, `perplexity_research`, `perplexity_reason`

### 2. Gemini Google Search MCP 추가

```bash
claude mcp add gemini-google-search \
  --env GEMINI_API_KEY="your-key" \
  -- npx -y mcp-gemini-google-search
```

### 3. CLAUDE.md에 선택 원칙 반영

```markdown
### 웹 검색 도구 선택 원칙
- **기술 심층 조사** → perplexity → gemini-google-search → WebSearch
- **최신 뉴스/폭넓은 수집** → gemini-google-search → WebSearch
- **원문 URL/빠른 개요** → WebSearch 내장
- **최종 fallback** → WebSearch 내장
```

CLAUDE.md에 이 원칙을 명시하면, Claude Code가 자동으로 용도에 맞는 도구를 선택합니다.

## 마치며

하나의 검색 도구로 모든 상황을 커버하기는 어렵습니다. 세 도구는 각각 뚜렷한 강점이 있고, 상호 보완적입니다.

- **Perplexity**: 여러 소스를 합성하여 코드 예시·표·수치까지 포함한 고품질 답변을 만들어냅니다. 기술 조사의 깊이가 압도적입니다.
- **Gemini Google Search**: Google Search Grounding 기반으로 출처가 가장 다양하고, 뉴스·시사 분야에서 맥락 파악 능력이 뛰어납니다.
- **WebSearch**: 추가 비용 없이 빠르게 원문 링크를 찾아주는 만능 fallback입니다.

MCP의 진짜 가치는 "하나의 최강 도구"가 아니라, **용도에 맞는 도구를 자유롭게 조합할 수 있다**는 점에 있습니다. CLAUDE.md에 선택 원칙을 명시해두면, AI가 알아서 최적의 도구를 골라 씁니다.
