# Claude-Flow .env 설정 가이드

## 개요

`.env` 파일은 claude-flow의 ReasoningBank 메모리 기능에 **필수**입니다. 이 파일이 없으면 시스템이 휴리스틱 모드(단순 정규식 패턴 매칭)로 폴백되며 실제 학습이 없습니다.

## 빠른 시작

### 1. .env 템플릿 생성

```bash
claude-flow init --env
```

다음을 포함하는 포괄적인 `.env` 템플릿이 생성됩니다:
- API 키 플레이스홀더 및 설정 지침
- 비용 최적화 지침 (46% 절감)
- 지원되는 모든 제공업체의 구성 예제
- 보안 모범 사례

### 2. API 키 추가

`.env`를 열고 최소한 다음 중 하나를 추가:

```bash
# 필수: 최소 하나 선택
ANTHROPIC_API_KEY=sk-ant-xxxxx  # https://console.anthropic.com/settings/keys 에서 받기
OPENROUTER_API_KEY=sk-or-v1-xxxxx  # https://openrouter.ai/keys 에서 받기
GOOGLE_GEMINI_API_KEY=...
```

### 3. API 키 받기

- **Anthropic**: https://console.anthropic.com/settings/keys
- **OpenRouter**: https://openrouter.ai/keys (비용 절감 권장)
- **Gemini**: https://aistudio.google.com/app/apikey (무료 티어)

## .env 없이는 어떻게 되나요?

### ❌ .env 파일 없이

다음을 실행하면:
```bash
claude-flow agent run coder "Build API" --enable-memory
```

**결과:**
```
⚠️  ReasoningBank 메모리에는 .env 설정이 필요합니다

📋 ReasoningBank 기능을 위한 .env 설정:
1. .env 파일 생성:
   claude-flow init --env

2. .env에 API 키 추가:
   ANTHROPIC_API_KEY=sk-ant-...
   OPENROUTER_API_KEY=sk-or-v1-...

3. API 키 받기:
   • Anthropic: https://console.anthropic.com/settings/keys
   • OpenRouter: https://openrouter.ai/keys

💡 API 키 없이:
   • ReasoningBank는 정규식 패턴 매칭으로 폴백 (학습 없음)
   • 메모리 작업이 작동하는 것처럼 보이지만 실제로 학습하지 않습니다

❌ .env 파일 없이는 --enable-memory를 사용할 수 없습니다
```

### ⚠️ 비어있는 .env (API 키 없음)

`.env`는 존재하지만 API 키가 없으면:

```
⚠️  .env 파일에 API 키가 없습니다

⚠️  ReasoningBank는 휴리스틱 모드로 폴백합니다 (정규식 매칭)
   API 키 없이는 메모리가 경험에서 학습하지 않습니다!

❌ 실제 학습을 활성화하려면 .env에 API 키를 추가하세요
```

### ✅ 유효한 .env 및 API 키 사용

```
✅ API 키 설정됨:
   • Anthropic (Claude)
   • OpenRouter (비용 최적화 가능)

🚀 agentic-flow로 coder agent 실행 중...
작업: Build API
[... 학습을 통한 실제 agent 실행 ...]
```

## 설정 우선순위

1. **환경 변수** (`.env` 또는 수동 export에서)
2. **ReasoningBank YAML** (`.swarm/reasoningbank.yaml`)
3. **기본 모델** (claude-3-5-sonnet-20241022)

## 고급: 비용 최적화

OpenRouter + DeepSeek R1으로 비용을 46% 절감할 수 있습니다:

### 전통적 설정 (모두 Claude):
- 메인 작업: $0.20
- Judge: $0.05
- Distill: $0.10
- Embeddings: $0.02
- **합계: 작업당 $0.37**

### 최적화된 설정 (하이브리드):
- 메인 작업: $0.20 (Claude - 품질 유지)
- Judge: $0.001 (DeepSeek - 99% 저렴!)
- Distill: $0.002 (DeepSeek - 99% 저렴!)
- Embeddings: $0.0005 (DeepSeek)
- **합계: 작업당 $0.20** (46% 절감!)

### 설정 스크립트

```bash
# 1. .env에 추가
OPENROUTER_API_KEY=sk-or-v1-...

# 2. .swarm/reasoningbank.yaml 생성
mkdir -p .swarm
cat > .swarm/reasoningbank.yaml << 'EOF'
reasoningbank:
  judge:
    model: "deepseek/deepseek-r1"
    max_tokens: 512
    temperature: 0
  distill:
    model: "deepseek/deepseek-r1"
    max_tokens: 2048
    temperature: 0.3
  embeddings:
    provider: "openrouter"
    model: "deepseek/deepseek-r1"
    dimensions: 1024
EOF

# 3. 비용 최적화와 함께 메모리 사용
claude-flow agent run coder "Build API" \
  --enable-memory \
  --memory-domain api/authentication \
  --memory-k 5
```

자세한 비용 분석은 [REASONINGBANK-COST-OPTIMIZATION.md](./REASONINGBANK-COST-OPTIMIZATION.md)를 참조하세요.

## .env 없이 메모리 사용 (대체 방법)

`.env`를 사용하지 않으려면 다음을 할 수 있습니다:

### 옵션 1: 변수를 직접 내보내기
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENROUTER_API_KEY="sk-or-v1-..."
claude-flow agent run coder "task" --enable-memory
```

### 옵션 2: 인라인 환경 변수
```bash
ANTHROPIC_API_KEY="sk-ant-..." \
  claude-flow agent run coder "task" --enable-memory
```

### 옵션 3: 시스템 전체 구성
```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENROUTER_API_KEY="sk-or-v1-..."
```

## 보안 모범 사례

1. **절대 .env를 git에 커밋하지 마세요** (`.gitignore`에 있음)
2. dev/staging/production에 대해 서로 다른 키 사용
3. 키를 정기적으로 교체
4. 가능한 경우 키별 권한 사용
5. 이상 현상에 대한 API 사용량 모니터링

## 명령어 참조

### .env 템플릿 생성
```bash
claude-flow init --env                # 새 .env 생성
claude-flow init --env --force        # 기존 .env 덮어쓰기
```

### .env로 메모리 사용
```bash
# 기본 메모리
claude-flow agent run coder "task" --enable-memory

# 고급 메모리
claude-flow agent run coder "task" \
  --enable-memory \
  --memory-domain api/authentication \
  --memory-k 5 \
  --memory-min-confidence 0.7
```

### 도움말 확인
```bash
claude-flow init --help               # 모든 init 옵션 보기
claude-flow agent --help              # 모든 agent 옵션 보기
```

## 증거: 가짜 vs 실제 ReasoningBank

### API 키 없이 (휴리스틱 모드):
```
지속 시간: 2ms
메모리: 0 (가짜)
성공률: 67% (정규식 기반)
학습: 없음
```

### API 키 사용 (실제 LLM 모드):
```
지속 시간: 19,036ms
메모리: 20 (실제)
성공률: 88% (학습됨)
학습: 실제 패턴 통합
데이터베이스: 임베딩이 있는 20개 항목
```

## 문제 해결

### 문제: ".env 파일 없이는 --enable-memory를 사용할 수 없습니다"
**해결**: `claude-flow init --env` 실행 후 API 키 추가

### 문제: ".env 파일에 API 키가 없습니다"
**해결**: `.env`에 유효한 API 키를 하나 이상 추가

### 문제: 메모리가 작동하는 것처럼 보이지만 학습하지 않음
**원인**: API 키가 구성되지 않아 휴리스틱 폴백 사용
**해결**: `.env` 파일에 API 키 추가

### 문제: 메모리 사용 시 높은 비용
**해결**: [REASONINGBANK-COST-OPTIMIZATION.md](./REASONINGBANK-COST-OPTIMIZATION.md) 참조

## 관련 문서

- [REASONINGBANK-AGENT-CREATION-GUIDE.md](./REASONINGBANK-AGENT-CREATION-GUIDE.md) - 커스텀 reasoning agent 생성
- [AGENTIC-FLOW-INTEGRATION-GUIDE.md](./AGENTIC-FLOW-INTEGRATION-GUIDE.md) - 완전한 명령어 참조
- [REASONINGBANK-COST-OPTIMIZATION.md](./REASONINGBANK-COST-OPTIMIZATION.md) - 비용 절감 전략

## 템플릿 내용

생성된 `.env` 템플릿에는 다음이 포함됩니다:

✅ 모든 제공업체의 API 키 플레이스홀더
✅ 직접 링크가 포함된 설정 지침
✅ 비용 최적화 예제
✅ 모델 구성 기본값
✅ 선택적 서비스 키 (Perplexity, HuggingFace, E2B, Supabase)
✅ 동작을 설명하는 포괄적인 주석
✅ 보안 모범 사례

총 템플릿 크기: 광범위한 문서와 함께 ~150줄

## 지원

문제 또는 질문:
- GitHub Issues: https://github.com/ruvnet/claude-flow/issues
- 문서: https://github.com/ruvnet/claude-flow
- Agentic-Flow: https://github.com/ruvnet/agentic-flow
