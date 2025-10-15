# PreToolUse Modification 훅 (v2.0.10+)

## ✅ 구현 완료

Claude Flow에 Claude Code v2.0.10+의 PreToolUse 입력 수정 기능을 활용하는 세 가지 수정 훅이 추가되었습니다.

## 🎯 신규 훅

### 1. `modify-bash` - Bash 명령어 수정

**특징:**
- **안전성**: `rm` 명령어에 `-i` 플래그를 자동으로 추가하여 대화형 확인을 수행합니다
- **Alias 변환**: `ll` → `ls -lah`, `la` → `ls -la`
- **경로 보정**: 테스트 파일 출력을 `/tmp/`로 리다이렉트합니다
- **비밀 탐지**: 명령어에서 민감한 키워드를 경고합니다

**예시:**
```bash
echo '{"tool_input":{"command":"rm test.txt"}}' | npx claude-flow@alpha hooks modify-bash
# 출력: {"tool_input":{"command":"rm -i test.txt"}, "modification_notes":"[Safety: Added -i flag]"}
```

### 2. `modify-file` - 파일 경로 수정

**특징:**
- **루트 폴더 보호**: 작업 파일을 프로젝트 루트에 저장하지 않습니다
- **자동 정리**:
  - 테스트 파일 → `/tests/`
  - 소스 파일 → `/src/`
  - 작업 문서 → `/docs/working/`
  - 임시 파일 → `/tmp/`
- **포맷 안내**: 적합한 포매터(Prettier, Black 등)를 제안합니다

**예시:**
```bash
echo '{"tool_input":{"file_path":"test.js"}}' | npx claude-flow@alpha hooks modify-file
# 출력: {"tool_input":{"file_path":"src/test.js"}, "modification_notes":"[Organization: Moved to /src/]"}
```

### 3. `modify-git-commit` - Git 커밋 메시지 포매팅

**특징:**
- **Conventional Commits**: 타입 프리픽스(`[feat]`, `[fix]`, `[docs]` 등)를 자동으로 추가합니다
- **티켓 추출**: 브랜치 이름에서 JIRA 티켓을 추출합니다(예: `feature/PROJ-123` → `(PROJ-123)`)
- **Co-Author**: Claude Flow 공동 작성자 푸터를 추가합니다

**예시:**
```bash
echo '{"tool_input":{"command":"git commit -m \"fix auth bug\""}}' | npx claude-flow@alpha hooks modify-git-commit
# 출력: 형식은 "[fix] fix auth bug"이며 공동 작성자를 포함합니다
```

## 📝 구성

두 개의 훅 구성 파일이 업데이트되었습니다:

### `.claude-plugin/hooks/hooks.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "cat | npx claude-flow@alpha hooks modify-bash"
        }]
      },
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "cat | npx claude-flow@alpha hooks modify-file"
        }]
      }
    ]
  }
}
```

### `.claude/settings.json`
로컬 개발 환경에도 동일한 구성이 적용됩니다.

## 🧪 테스트

모든 훅은 컨테이너/원격 환경에서 테스트를 완료했습니다:

```bash
# bash 수정 테스트
echo '{"tool_input":{"command":"rm test.txt"}}' | ./bin/claude-flow hooks modify-bash
# ✅ 출력: {"tool_input":{"command":"rm -i test.txt"},"modification_notes":"[Safety: Added -i flag]"}

# alias 확장 테스트
echo '{"tool_input":{"command":"ll"}}' | ./bin/claude-flow hooks modify-bash
# ✅ 출력: {"tool_input":{"command":"ls -lah"},"modification_notes":"[Alias: ll → ls -lah]"}

# 파일 경로 수정 테스트
echo '{"tool_input":{"file_path":"test.js"}}' | ./bin/claude-flow hooks modify-file
# ✅ 출력: {"tool_input":{"file_path":"src/test.js"},"modification_notes":"[Organization: Moved to /src/]"}

# git 커밋 포매팅 테스트
echo '{"tool_input":{"command":"git commit -m \"fix bug\""}}' | ./bin/claude-flow hooks modify-git-commit
# ✅ 출력: [fix] fix bug와 Co-Authored-By: claude-flow <noreply@ruv.io>

# 도움말 표시 테스트(입력 없음)
./bin/claude-flow hooks modify-bash
# ✅ 출력: 100ms 타임아웃 후 usage 도움말을 보여줍니다
```

**참고**: 이 훅은 파이프 입력과 대화형 입력을 구분하기 위해 100ms 타임아웃을 사용합니다. 그 결과 `process.stdin.isTTY`가 정의되지 않을 수 있는 컨테이너 및 원격 개발 환경에서도 정상 동작합니다.

## 🚀 사용법

이 훅은 PreToolUse 기능을 사용하는 Claude Code v2.0.10+에서 자동으로 호출됩니다.

직접 사용하려면:
```bash
npx claude-flow@alpha hooks modify-bash  # bash 명령어용
npx claude-flow@alpha hooks modify-file  # 파일 작업용
npx claude-flow@alpha hooks modify-git-commit  # git 커밋용
```

## 📖 도움말

모든 훅을 보려면:
```bash
npx claude-flow@alpha hooks --help
```

## 🎉 이점

1. **안전성**: 실수로 파괴적 명령어를 실행하는 것을 방지합니다
2. **구조화**: 올바른 프로젝트 구조를 강제합니다
3. **일관성**: 커밋 메시지와 파일 구성을 표준화합니다
4. **개발자 경험**: 유용한 alias와 포맷 안내를 제공합니다

## 📦 버전

- **Claude Flow**: 2.5.0-alpha.140
- **필수 조건**: Claude Code >= v2.0.10
- **기능**: PreToolUse 입력 수정

---

**작성자**: claude-flow
**공동 작성자**: claude-flow <noreply@ruv.io>
