# Claude Flow MCP 서버 설정 가이드

## 🎯 개요

Claude Flow는 MCP(Model Context Protocol) 서버를 통해 Claude Code와 통합됩니다. 이 가이드는 MCP 서버를 올바르게 설정하는 방법을 설명합니다.

## 📋 초기화하는 두 가지 방법

### 1. **자동 설정 (권장)**

```bash
# 이 명령어는 MCP 서버를 자동으로 추가합니다
npx claude-flow@alpha init --force
```

**수행 작업:**
- 프로젝트 파일 생성 (CLAUDE.md, settings.json 등)
- 자동으로 실행: `claude mcp add claude-flow npx claude-flow@alpha mcp start`
- ruv-swarm 및 flow-nexus MCP 서버 설정 (선택 사항)
- hooks 및 권한 구성

### 2. **수동 설정**

Claude Code가 이미 설치되어 있지만 MCP 서버를 추가해야 하는 경우:

```bash
# Claude Flow MCP 서버 추가
claude mcp add claude-flow npx claude-flow@alpha mcp start

# 선택 사항: 향상된 조정 추가
claude mcp add ruv-swarm npx ruv-swarm mcp start

# 선택 사항: 클라우드 기능 추가
claude mcp add flow-nexus npx flow-nexus@latest mcp start
```

## ✅ 설정 확인

MCP 서버가 실행 중인지 확인:

```bash
claude mcp list
```

예상 출력:
```
claude-flow: npx claude-flow@alpha mcp start - ✓ Connected
ruv-swarm: npx ruv-swarm mcp start - ✓ Connected
flow-nexus: npx flow-nexus@latest mcp start - ✓ Connected
```

## 🔧 문제 해결

### 문제: MCP 서버가 npx 대신 로컬 경로를 표시

**예:**
```
claude-flow: /workspaces/claude-code-flow/bin/claude-flow mcp start - ✓ Connected
```

**해결:**
claude-flow 저장소 자체에서 작업할 때 이런 일이 발생합니다. 개발에는 실제로 괜찮습니다! MCP 서버가 올바르게 작동합니다.

대신 npx 명령어를 사용하려면:

```bash
# 기존 서버 제거
claude mcp remove claude-flow

# npx 명령어로 다시 추가
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

### 문제: "claude: command not found"

**해결:**
먼저 Claude Code 설치:

```bash
npm install -g @anthropic-ai/claude-code
```

### 문제: MCP 서버 연결 실패

**원인 및 해결 방법:**

1. **패키지가 전역으로 설치되지 않음:**
   ```bash
   # 패키지 설치
   npm install -g claude-flow@alpha
   ```

2. **로컬 개발 버전 사용:**
   ```bash
   # claude-flow 저장소에서 먼저 빌드
   npm run build
   ```

3. **권한 문제:**
   ```bash
   # 테스트용으로 --dangerously-skip-permissions 사용
   claude --dangerously-skip-permissions
   ```

## 📚 명령어 이해하기

### `npx claude-flow@alpha init`
- Claude Flow 프로젝트 파일 초기화
- **자동으로** `claude mcp add` 호출
- 프로젝트당 한 번만 실행하면 됨

### `claude init`
- Claude Code 자체 초기화
- Claude Flow MCP 서버를 자동으로 추가하지 **않음**
- Claude Flow 초기화와 별개

### `claude mcp add <name> <command>`
- Claude Code의 전역 구성에 MCP 서버 추가
- 프로젝트 간 유지
- `~/.config/claude/`에 위치

## 🎯 권장 워크플로우

```bash
# 1. Claude Code 설치 (한 번만)
npm install -g @anthropic-ai/claude-code

# 2. Claude Flow로 프로젝트 초기화 (프로젝트당)
cd your-project
npx claude-flow@alpha init --force

# 3. MCP 서버가 연결되었는지 확인
claude mcp list

# 4. MCP 도구와 함께 Claude Code 사용 시작
claude
```

## 💡 주요 사항

- **`npx claude-flow@alpha init`**는 파일 설정과 MCP 구성을 모두 수행
- **`claude init`**는 Claude Code용이며 Claude Flow용이 아님
- MCP 서버는 **전역** (모든 Claude Code 세션에 영향)
- 프로젝트 파일 (.claude/, CLAUDE.md)은 각 프로젝트에 **로컬**

## 🔗 관련 문서

- [설치 가이드](../setup/remote-setup.md)
- [환경 설정](../setup/ENV-SETUP-GUIDE.md)
- [MCP 도구 참조](../reference/MCP_TOOLS.md)

---

**질문이 있으신가요?** [GitHub Issues](https://github.com/ruvnet/claude-flow/issues)를 참조하거나 [Discord](https://discord.com/invite/dfxmpwkG2D)에 참여하세요
