---
title: "Claude Code 설정을 Git으로 똑똑하게 관리하기"
date: 2025-10-28
tags: [claude-code, git, development-tools, productivity]
---

# Claude Code 설정을 Git으로 똑똑하게 관리하기

Claude Code의 커스텀 agents와 commands를 사용하다 보면 점점 더 많은 설정 파일이 쌓이게 됩니다. 이를 여러 머신에서 동기화하고, 버전 관리하고 싶어지는 건 당연한 일이죠.

처음에는 단순하게 `~/.claude/` 디렉토리를 통째로 Git repository로 만들면 되지 않을까 생각했습니다. 하지만 실제로 해보니 예상치 못한 문제들이 발생했습니다.

## 문제: ~/.claude/ 디렉토리의 혼란

`~/.claude/` 디렉토리를 들여다보면 단순히 agents와 commands만 있는 게 아닙니다:

- 로그 파일들
- 캐시 데이터
- 세션 정보
- 임시 파일들
- Claude Code 런타임이 생성하는 각종 파일들

이런 파일들이 모두 섞여 있다 보니 몇 가지 문제가 생겼습니다:

1. **AI 컨텍스트 낭비**: Claude Code로 agents나 commands를 수정하려고 하면, AI가 디렉토리를 탐색할 때 불필요한 파일들까지 읽게 됩니다. 토큰을 낭비하고, 작업 효율이 떨어지죠.

2. **실수 위험**: AI가 혼동해서 로그 파일이나 내부 설정을 잘못 수정할 수 있습니다. 심각한 경우 Claude Code가 제대로 동작하지 않을 수도 있습니다.

3. **Git 관리의 어려움**: 어떤 파일을 커밋해야 하고, 어떤 파일을 무시해야 할까? `.gitignore`를 완벽하게 설정하기도 쉽지 않습니다.

## 해결책: 별도 디렉토리 + Symbolic Link

해답은 의외로 간단했습니다. **설정 파일만 별도 디렉토리로 분리**하고, symbolic link로 연결하는 것입니다.

### 구조

```
~/claude-settings/          # Git으로 관리
├── agents/                 # 커스텀 agents
├── commands/               # 커스텀 commands
├── .gitignore
└── README.md

~/.claude/                  # Claude Code 런타임
├── agents -> ~/claude-settings/agents/      (symlink)
├── commands -> ~/claude-settings/commands/  (symlink)
├── logs/                   # 런타임 파일들
├── cache/
└── ...
```

### 설정 방법

```bash
# 1. 설정 디렉토리 생성 및 Git 초기화
mkdir -p ~/claude-settings/{agents,commands}
cd ~/claude-settings
git init

# 2. .gitignore 생성
cat > .gitignore << 'EOF'
.claude/
*.env
*.key
.DS_Store
EOF

# 3. 기존 설정 이동 (있다면)
mv ~/.claude/agents/* ~/claude-settings/agents/
mv ~/.claude/commands/* ~/claude-settings/commands/

# 4. Symbolic link 생성
rm -rf ~/.claude/agents ~/.claude/commands
ln -s ~/claude-settings/agents ~/.claude/agents
ln -s ~/claude-settings/commands ~/.claude/commands

# 5. GitHub private repository 생성 및 푸시
gh repo create claude-code-config --private --source=. --remote=origin --push
```

## 이 방식의 장점

### 1. AI 작업 효율성 향상
Claude Code로 agents나 commands를 수정할 때, AI는 이제 필요한 파일만 집중해서 볼 수 있습니다. 컨텍스트 낭비가 없고, 작업 속도도 빨라집니다.

### 2. 명확한 책임 분리
- `~/claude-settings/` = 사용자가 직접 관리하는 설정 (Git 버전 관리)
- `~/.claude/` = Claude Code가 관리하는 런타임 데이터

두 영역이 명확히 분리되어 있어 혼란이 없습니다.

### 3. 안전성
실수로 Claude Code의 중요한 내부 파일을 손상시킬 위험이 사라집니다. AI가 아무리 잘못 동작해도 설정 파일만 영향을 받습니다.

### 4. Git 관리 용이성
어떤 파일을 커밋해야 할지 고민할 필요가 없습니다. `~/claude-settings/`의 모든 파일은 의미 있는 설정 파일입니다.

### 5. 멀티 머신 동기화
새로운 컴퓨터에서도 간단히 설정을 복원할 수 있습니다:

```bash
git clone git@github.com:username/claude-code-config.git ~/claude-settings
ln -s ~/claude-settings/agents ~/.claude/agents
ln -s ~/claude-settings/commands ~/.claude/commands
```

### 6. 검색 효율성
`grep`, `find` 등으로 검색할 때 관련 있는 파일만 나옵니다. 로그 파일이나 캐시에서 엉뚱한 결과가 나오지 않습니다.

## Symbolic Link의 마법

Symbolic link의 가장 큰 장점은 **별도의 동기화가 필요 없다**는 것입니다.

- `~/claude-settings/agents/`를 수정하면 → 즉시 `~/.claude/agents/`에 반영
- Claude Code는 `~/.claude/agents/`를 읽지만 → 실제로는 `~/claude-settings/agents/`의 내용을 봄
- 동기화 스크립트나 복잡한 설정이 필요 없음

## 실제 사용 경험

이 방식을 도입한 후:

1. **AI 작업이 더 빨라졌습니다**: 불필요한 파일 탐색이 없어져 응답 속도가 개선되었습니다.

2. **안심하고 수정할 수 있게 되었습니다**: Git으로 관리되니 언제든 이전 버전으로 돌아갈 수 있습니다.

3. **새 컴퓨터 세팅이 간편해졌습니다**: 클론 하나면 모든 설정이 복원됩니다.

4. **협업 가능성**: private repository로 관리하지만, 팀원과 공유하고 싶다면 권한만 주면 됩니다.

## 주의사항

### 민감 정보 관리
agents나 commands에 API 키나 토큰이 포함될 수 있습니다. `.gitignore`에 패턴을 추가하거나, 환경 변수를 사용하세요:

```gitignore
*secret*
*api-key*
*token*
*.env
*.key
```

### Private Repository 유지
실수로 public으로 전환하지 않도록 주의하세요. 개인 설정이나 워크플로우가 노출될 수 있습니다.

## 결론

Claude Code 설정을 효율적으로 관리하려면:

1. ✅ 별도 디렉토리로 분리
2. ✅ Symbolic link로 연결
3. ✅ Git으로 버전 관리
4. ✅ Private repository로 백업

이 방식은 단순하지만 강력합니다. AI 작업 효율성, 안전성, 관리 편의성을 모두 잡을 수 있는 현명한 선택입니다.

여러분도 한번 시도해보세요. 설정 관리의 스트레스에서 해방될 수 있을 것입니다.

---

*이 글은 Claude Code와 Git을 활용한 설정 관리 경험을 공유한 글입니다.*
