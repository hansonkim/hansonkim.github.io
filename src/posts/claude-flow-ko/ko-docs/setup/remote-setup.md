# Claude Flow 원격 설정 가이드

## 문제
원격에서 `npx claude-flow@alpha`를 사용할 때 다음을 경험할 수 있습니다:
- `ENOTEMPTY` npm 캐시 오류
- 버전 불일치 문제
- **init 후 `./claude-flow@alpha` 래퍼 누락** ⭐ **수정됨!**
- Hook 기능이 작동하지 않음

## 빠른 수정

### 방법 1: 원라인 설치
```bash
curl -fsSL https://raw.githubusercontent.com/ruvnet/claude-flow/main/install-remote.sh | bash
```

### 방법 2: 수동 설치
```bash
# npm 캐시 정리 및 재설치
npm cache clean --force
npm uninstall -g claude-flow
npm install -g claude-flow@alpha --no-optional --legacy-peer-deps

# 확인 및 초기화
claude-flow --version
claude-flow init
```

### 방법 3: 로컬 개발 설정
소스 코드로 작업하는 경우:

```bash
# claude-code-flow 디렉토리에서
npm pack
npm install -g ./claude-flow-*.tgz
claude-flow --version
```

## 검증

모든 것이 작동하는지 테스트:
```bash
# 버전 확인
claude-flow --version

# hooks 테스트
claude-flow hooks notify --message "Setup complete" --level "success"

# 시스템 상태 확인
claude-flow status

# ⭐ 신규: 래퍼 생성 테스트
npx claude-flow@alpha init --force
ls -la ./claude-flow*
# 표시되어야 함: ./claude-flow@alpha (실행 가능)
./claude-flow@alpha --version
```

## 문제 해결

### 캐시 문제
```bash
npm cache clean --force
rm -rf ~/.npm/_npx
```

### 권한 문제
```bash
sudo npm install -g claude-flow@alpha
# 또는 sudo를 피하기 위해 nvm 사용
```

### 바이너리를 찾을 수 없음
```bash
# 전역 bin 디렉토리 확인
npm config get prefix
# 필요한 경우 PATH에 추가
export PATH="$(npm config get prefix)/bin:$PATH"
```

## 원격 사용 팁

1. **안정적인 alpha 버전 사용**: 특정 버전 대신 `claude-flow@alpha` 사용
2. **먼저 캐시 정리**: 설치 전 항상 `npm cache clean --force` 실행
3. **--legacy-peer-deps 사용**: 의존성 충돌 해결에 도움
4. **hooks 즉시 테스트**: 설치 후 기능 확인

## 성공 지표

✅ `claude-flow --version`이 현재 버전 표시
✅ `claude-flow status`가 시스템 실행 중 표시
✅ `claude-flow hooks notify`가 오류 없이 작동
✅ 모든 명령어를 전역적으로 사용 가능
