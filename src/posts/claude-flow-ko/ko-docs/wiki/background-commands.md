# Claude Code의 백그라운드 명령어

## 개요

Claude Code는 여러 방법을 통해 셸 명령어를 백그라운드에서 실행하는 것을 지원합니다:

1. **키보드 단축키**: Claude가 명령어를 제안할 때 `Ctrl+B`를 눌러 백그라운드에서 실행합니다 (tmux에서는 `Ctrl+B Ctrl+B`)
2. **프로그래밍 방식 실행**: Bash 도구에서 `run_in_background` 파라미터를 사용합니다
3. **프롬프트 지시**: Claude에게 보내는 프롬프트에서 직접 백그라운드 실행을 요청합니다
4. **인터랙티브 관리**: `/bashes` 명령어를 사용하여 모든 백그라운드 셸을 보고 관리합니다

이 기능을 사용하면 워크플로우를 차단하지 않고 오래 실행되는 프로세스를 실행할 수 있어, 서버, 빌드 또는 기타 프로세스를 모니터링하면서 지속적인 개발이 가능합니다. 백그라운드 작업은 고유 ID를 가진 별도의 셸에서 실행되므로, 출력을 모니터링하고, 상태를 확인하며, 필요에 따라 종료할 수 있습니다.

## 빠른 참조

| 작업 | 방법 | 예시 |
|--------|--------|---------|
| **백그라운드 작업 시작** | Ctrl+B 또는 프롬프트 | `"npm run dev를 백그라운드에서 실행해줘"` |
| **모든 작업 목록 보기** | /bashes 명령어 | `/bashes` (인터랙티브 모드) |
| **특정 작업 확인** | 프롬프트 | `"bash_1의 상태를 확인해줘"` |
| **작업 출력 보기** | 프롬프트 | `"bash_1의 출력을 보여줘"` |
| **특정 작업 종료** | 프롬프트 또는 /bashes | `"bash_1을 종료해줘"` 또는 /bashes에서 'k' 누르기 |
| **모든 작업 종료** | 프롬프트 | `"모든 백그라운드 작업을 종료해줘"` |

### 일반적인 셸 ID
- 백그라운드 작업에는 `bash_1`, `bash_2`, `bash_3` 등과 같은 ID가 할당됩니다.
- ID는 세션별로 순차적이며 고유합니다.
- ID는 셸이 종료되거나 완료될 때까지 유지됩니다.

### 빠른 시작

**인터랙티브 (키보드)**:
Claude가 명령어를 제시할 때, 기본 포그라운드 실행 대신 `Ctrl+B`를 눌러 백그라운드에서 실행합니다.

**프로그래밍 방식 (도구 파라미터)**:
```javascript
{
  "tool": "Bash",
  "command": "npm run dev",
  "run_in_background": true  // 이 파라미터가 백그라운드 실행을 트리거합니다
}
```

**프롬프트를 통해**:
Claude에게 간단히 "개발 서버를 백그라운드에서 시작해줘"라고 말하면 Claude가 자동으로 `run_in_background` 파라미터를 사용합니다.

## 주요 구성 요소

### 1. **백그라운드 지원이 포함된 Bash 도구**
표준 Bash 도구는 별도의 백그라운드 셸에서 명령어를 생성하는 `run_in_background` 파라미터를 허용합니다.

#### 도구 파라미터
```javascript
{
  "tool": "Bash",
  "command": "npm run dev",           // 필수: 실행할 명령어
  "run_in_background": true,          // 선택: 백그라운드에서 실행
  "description": "개발 서버 시작",  // 선택: 설명
  "timeout": 60000                    // 선택: 타임아웃(ms) (최대 600000)
}
```

#### Claude에서의 사용 예시
Claude와 상호작용할 때, 다음과 같이 백그라운드 실행을 요청할 수 있습니다:
```
사용자: "개발 서버를 시작해줘"
Claude: 개발 서버를 백그라운드에서 시작하여 계속 작업할 수 있도록 하겠습니다.

[Claude가 run_in_background: true로 Bash 도구를 사용함]
명령어: npm run dev
결과: ID: bash_1로 백그라운드에서 명령어가 실행 중입니다
```


### 2. **BashOutput 도구**
실행 중이거나 완료된 백그라운드 셸에서 출력을 가져옵니다. 각 호출은 마지막 확인 이후의 **새로운** 출력만 반환합니다.

#### 도구 파라미터
```javascript
{
  "tool": "BashOutput",
  "bash_id": "bash_1",               // 필수: 백그라운드 작업의 ID
  "filter": "error|warning"          // 선택: 출력을 필터링할 정규식
}
```

#### 응답 형식
```xml
<status>running|completed|killed</status>
<exit_code>0</exit_code>  <!-- 완료된 경우에만 표시 -->
<stdout>
  [마지막 확인 이후의 새로운 출력]
</stdout>
<stderr>
  [오류 출력]
</stderr>
<timestamp>2025-08-11T22:05:20.964Z</timestamp>
```

#### 사용 예시
```
사용자: "서버가 성공적으로 시작되었는지 확인해줘"
Claude: 개발 서버의 출력을 확인해 보겠습니다.

[Claude가 BashOutput 도구를 사용함]
bash_id: bash_1
결과:
<status>running</status>
<stdout>
  > my-app@1.0.0 dev
  > vite

  VITE v5.0.0  ready in 532 ms
  ➜  Local:   http://localhost:5173/
</stdout>

서버가 http://localhost:5173/에서 성공적으로 실행 중입니다.
```


### 3. **KillBash 도구**
ID로 백그라운드 셸을 종료합니다. 먼저 정상적인 종료를 시도합니다.

#### 도구 파라미터
```javascript
{
  "tool": "KillBash",
  "shell_id": "bash_1"               // 필수: 종료할 백그라운드 작업의 ID
}
```

#### 응답 형식
```json
{
  "success": true,
  "message": "셸을 성공적으로 종료했습니다: bash_1 (npm run dev)",
  "shell_id": "bash_1"
}
```

#### 사용 예시
```
사용자: "개발 서버를 중지해줘"
Claude: 백그라운드에서 실행 중인 개발 서버를 중지하겠습니다.

[Claude가 KillBash 도구를 사용함]
shell_id: bash_1
결과: 셸을 성공적으로 종료했습니다: bash_1

개발 서버가 중지되었습니다.
```

## 인터랙티브 명령어 및 단축키

### /bashes 명령어

Claude Code에는 백그라운드 셸을 인터랙티브하게 관리하기 위한 내장 명령어가 포함되어 있습니다:

```bash
/bashes
```

이 명령어는 다음을 표시하는 인터랙티브 메뉴를 엽니다:
- **모든 백그라운드 셸** (실행 중 및 완료됨)
- 참조용 **셸 ID** (예: bash_1, bash_2)
- 실행된 **명령어**
- **상태** (running, completed, killed)
- **실행 시간** 및 종료 코드

**사용 예시:**
```
> /bashes

백그라운드 Bash 셸
세부 정보를 보려면 셸을 선택하세요

1. npm run dev (running)
2. docker-compose up (running)  
3. npm test (completed)

↑/↓로 선택 · Enter로 보기 · k로 종료 · Esc로 닫기
```

셸을 선택하고 Enter를 누르면 다음을 볼 수 있습니다:
- STDOUT의 마지막 10줄
- 모든 STDERR 출력
- 실행 시간 정보
- 종료 코드 (완료된 경우)


### Ctrl+B를 사용한 백그라운드 실행

Claude가 실행할 명령어를 제시할 때 두 가지 옵션이 있습니다:
- **Enter/Return**: 포그라운드에서 실행 (기본값)
- **Ctrl+B**: 백그라운드에서 실행

#### 작동 방식
1. Claude가 `npm run dev` 명령어를 제안합니다.
2. "실행하려면 Enter, 백그라운드에서 실행하려면 Ctrl+B를 누르세요"라는 프롬프트가 표시됩니다.
3. `Ctrl+B`를 눌러 백그라운드에서 실행합니다.
4. 명령어가 고유 ID(예: `bash_1`)로 시작됩니다.
5. 실행되는 동안 계속 작업할 수 있습니다.


### 백그라운드 모드의 프로그래밍 방식 호출

Ctrl+B 기능은 다음과 같은 방법으로 프로그래밍 방식으로 트리거할 수 있습니다:

#### 1. 직접 도구 파라미터
```javascript
// Ctrl+B를 누르면 이렇게 됩니다
{
  "tool": "Bash",
  "command": "npm run dev",
  "run_in_background": true  // Ctrl+B는 이 값을 true로 설정합니다
}
```

#### 2. Claude-Flow 자동화
```javascript
// 자동화된 백그라운드 감지
function handleCommand(command) {
  const shouldBackground = detectLongRunning(command);
  
  return {
    tool: "Bash",
    command: command,
    run_in_background: shouldBackground  // Ctrl+B를 시뮬레이션합니다
  };
}
```

#### 3. Hook 시스템 통합
```bash
# 특정 명령어에 대해 Ctrl+B를 시뮬레이션하는 pre-command hook
npx claude-flow hooks pre-command \
  --auto-background "npm run dev" \
  --auto-background "docker-compose up"
```

### 터미널 호환성

- **표준 터미널**: `Ctrl+B`는 백그라운드 실행을 트리거합니다.
- **Tmux 세션**: `Ctrl+B Ctrl+B` (두 번 탭). Ctrl+B가 tmux 접두사이기 때문입니다.
- **VS Code 터미널**: `Ctrl+B`가 정상적으로 작동합니다.
- **SSH 세션**: `Ctrl+B`가 Claude Code로 전달됩니다.

## Claude Code 도구를 사용한 실제 예시

### 실제 예시: 개발 서버 시작하기

다음은 백그라운드 서버를 시작하고 확인하는 실제 예시입니다:

```bash
# 백그라운드에서 Python HTTP 서버 시작
사용자: "백그라운드에서 개발 서버를 시작해줘"

Claude: [run_in_background: true로 Bash 도구를 사용함]
명령어: python3 -m http.server 8080
결과: ID: bash_3로 백그라운드에서 명령어가 실행 중입니다

# 실행 중인지 확인
Claude: [BashOutput 도구를 사용함]
bash_id: bash_3
결과:
<status>running</status>
<stderr>
127.0.0.1 - - [11/Aug/2025 22:18:58] "HEAD / HTTP/1.1" 200 -
127.0.0.1 - - [11/Aug/2025 22:19:37] "GET / HTTP/1.1" 200 -
</stderr>

# 서버 테스트
Claude: [Bash 도구를 사용함]
명령어: curl http://localhost:8080
결과: <!DOCTYPE HTML><html>... (서버가 응답함)
```


### 전체 개발 워크플로우 예시

#### 1단계: 여러 백그라운드 서비스 시작하기
```
사용자: "프론트엔드, 백엔드, 데이터베이스로 전체 개발 환경을 설정해줘"

Claude: 모든 개발 서비스를 백그라운드에서 시작하겠습니다.

[Bash 도구 호출 1]
command: docker-compose up postgres redis
run_in_background: true
→ 결과: ID: bash_1로 백그라운드에서 명령어가 실행 중입니다

[Bash 도구 호출 2] 
command: npm run api
run_in_background: true
→ 결과: ID: bash_2로 백그라운드에서 명령어가 실행 중입니다

[Bash 도구 호출 3]
command: npm run dev
run_in_background: true  
→ 결과: ID: bash_3로 백그라운드에서 명령어가 실행 중입니다

모든 서비스가 백그라운드에서 시작 중입니다. 상태를 확인해 보겠습니다.
```

#### 2단계: 서비스 상태 모니터링
```
[bash_1에 대한 BashOutput 도구 호출]
bash_id: bash_1
→ 결과:
<status>running</status>
<stdout>
  postgres_1  | database system is ready to accept connections
  redis_1     | Ready to accept connections
</stdout>

[bash_2에 대한 BashOutput 도구 호출]
bash_id: bash_2
→ 결과:
<status>running</status>
<stdout>
  API server listening on port 4000
  Connected to database
</stdout>

[bash_3에 대한 BashOutput 도구 호출]
bash_id: bash_3
→ 결과:
<status>running</status>
<stdout>
  VITE v5.0.0  ready in 532 ms
  ➜  Local:   http://localhost:5173/
</stdout>

모든 서비스가 성공적으로 실행 중입니다:
- 데이터베이스 및 Redis: 준비 완료
- API 서버: http://localhost:4000
- 프론트엔드: http://localhost:5173
```

#### 3단계: 개발 중 지속적인 모니터링
```
사용자: "로그인 버튼을 클릭하면 오류가 발생합니다"

Claude: 문제를 재현하는 동안 API 서버 로그를 모니터링하겠습니다.

[필터가 있는 BashOutput 도구 호출]
bash_id: bash_2
filter: "error|Error|ERROR|failed"
→ 결과:
<status>running</status>
<stdout>
  ERROR: Authentication failed - Invalid token format
  Error at AuthMiddleware.verify (src/middleware/auth.js:45)
</stdout>

오류를 찾았습니다! 인증 미들웨어의 45번째 줄에서 잘못된 토큰 형식으로 인해 인증이 실패하고 있습니다.
```

#### 4단계: 정리
```
사용자: "오늘 작업은 끝났으니 모든 서비스를 중지해주세요"

Claude: 실행 중인 모든 서비스를 중지하겠습니다.

[KillBash 도구 호출 1]
shell_id: bash_3
→ 결과: 셸을 성공적으로 종료했습니다: bash_3 (npm run dev)

[KillBash 도구 호출 2]
shell_id: bash_2
→ 결과: 셸을 성공적으로 종료했습니다: bash_2 (npm run api)

[KillBash 도구 호출 3]
shell_id: bash_1
→ 결과: 셸을 성공적으로 종료했습니다: bash_1 (docker-compose up -d postgres redis)

모든 서비스가 성공적으로 중지되었습니다.
```


### 실시간 로그 모니터링 예시

```
사용자: "결제 흐름을 테스트하는 동안 애플리케이션 로그에서 오류가 있는지 모니터링해줘"

Claude: 백그라운드에서 애플리케이션 로그를 모니터링하고 오류를 필터링하겠습니다.

[Bash 도구 호출]
command: tail -f /var/log/app.log
run_in_background: true
→ 결과: ID: bash_4로 백그라운드에서 명령어가 실행 중입니다

이제 테스트하는 동안 오류를 모니터링하겠습니다. 시작할 때 알려주세요.

사용자: "지금 결제 테스트를 시작합니다"

[BashOutput 도구 호출 - 첫 번째 확인]
bash_id: bash_4
filter: "error|exception|failed|Error|Exception"
→ 결과:
<status>running</status>
<stdout>
  [2025-08-11 22:10:15] ERROR: Payment validation failed: Card expired
  [2025-08-11 22:10:15] Exception: PaymentException at checkout.js:234
</stdout>

결제 오류를 감지했습니다 - 카드가 만료된 것 같습니다. 예외는 checkout.js 234번째 줄에서 발생했습니다.

[BashOutput 도구 호출 - 두 번째 확인]
bash_id: bash_4
filter: "error|exception|failed|Error|Exception"
→ 결과:
<status>running</status>
<stdout>
  [2025-08-11 22:10:45] ERROR: Inventory check failed for SKU-12345
  [2025-08-11 22:10:45] Error: Insufficient stock (requested: 5, available: 2)
</stdout>

또 다른 오류: SKU-12345의 재고가 부족합니다. 5개를 요청했지만 2개만 사용 가능합니다.
```


### 빌드 프로세스 관리 예시

```
사용자: "프로덕션 빌드를 실행하되 문서 작업은 계속하고 싶어"

Claude: 계속 작업하실 수 있도록 프로덕션 빌드를 백그라운드에서 실행하겠습니다.

[Bash 도구 호출]
command: npm run build:production
run_in_background: true
→ 결과: ID: bash_5로 백그라운드에서 명령어가 실행 중입니다

프로덕션 빌드가 백그라운드에서 실행 중입니다. 문서 작업을 계속하셔도 됩니다.

[5분 후...]

빌드 진행 상황을 확인해 보겠습니다:

[BashOutput 도구 호출]
bash_id: bash_5
→ 결과:
<status>completed</status>
<exit_code>0</exit_code>
<stdout>
  > build:production
  > webpack --mode production
  
  assets by status 1.2 MiB [cached] 12 assets
  ./src/index.js 523 KiB [built]
  webpack compiled successfully in 4523 ms
  Build completed successfully!
</stdout>

좋은 소식입니다! 프로덕션 빌드가 성공적으로 완료되었습니다. 번들된 에셋이 준비되었습니다.
```


### 백그라운드 프로세스를 사용한 디버깅

```
사용자: "앱이 느리게 실행되는데, 조사해줄 수 있나요?"

Claude: 백그라운드에서 시스템 리소스와 애플리케이션 성능을 모니터링 시작하겠습니다.

[Bash 도구 호출 1 - 시스템 모니터링]
command: top -b -d 2 | head -20
run_in_background: true
→ 결과: ID: bash_6로 백그라운드에서 명령어가 실행 중입니다

[Bash 도구 호출 2 - 애플리케이션 메트릭]
command: npm run metrics:watch
run_in_background: true
→ 결과: ID: bash_7로 백그라운드에서 명령어가 실행 중입니다

[잠시 후, 둘 다 확인]

[bash_6에 대한 BashOutput 도구 호출]
bash_id: bash_6
→ 결과:
<status>running</status>
<stdout>
  CPU: 87% - node (PID 12345)
  Memory: 2.3GB / 4GB
  Load average: 3.45, 2.89, 2.10
</stdout>

[bash_7에 대한 BashOutput 도구 호출]
bash_id: bash_7
filter: "slow|timeout|bottleneck"
→ 결과:
<status>running</status>
<stdout>
  SLOW QUERY: SELECT * FROM orders (2.3s)
  BOTTLENECK: Database connection pool exhausted
  TIMEOUT: Redis connection timeout after 5000ms
</stdout>

문제를 찾았습니다:
1. Node 프로세스의 높은 CPU 사용량 (87%)
2. 2.3초가 걸리는 느린 데이터베이스 쿼리
3. 데이터베이스 커넥션 풀 고갈
4. Redis 연결 시간 초과

주요 병목 현상은 데이터베이스 관련인 것으로 보입니다.
```

## 일반적인 사용 사례 및 명령어

### 개발 서버

#### Node.js/NPM
```bash
# Vite/React/Vue 개발 서버
npm run dev              # run_in_background: true
npm run serve           # run_in_background: true
yarn dev                # run_in_background: true
pnpm dev                # run_in_background: true

# Watch 모드
npm run watch           # run_in_background: true
npm run build:watch     # run_in_background: true
```

#### Python
```bash
# Django 개발 서버
python manage.py runserver              # run_in_background: true
python manage.py runserver 0.0.0.0:8000 # run_in_background: true

# Flask 개발 서버
flask run                               # run_in_background: true
flask run --host=0.0.0.0 --port=5000   # run_in_background: true

# uvicorn을 사용한 FastAPI
uvicorn main:app --reload              # run_in_background: true
uvicorn main:app --host 0.0.0.0 --port 8000 --reload  # run_in_background: true

# 간단한 HTTP 서버
python3 -m http.server 8080            # run_in_background: true
python -m SimpleHTTPServer 8000        # run_in_background: true (Python 2)
```

#### Docker 서비스
```bash
# Docker compose
docker-compose up                      # run_in_background: true
docker-compose up postgres redis       # run_in_background: true
docker-compose up -d                   # 이미 데몬화되었지만, 여전히 백그라운드 사용 가능

# 개별 컨테이너
docker run -p 5432:5432 postgres      # run_in_background: true
docker run -p 6379:6379 redis         # run_in_background: true
```

#### 기타 언어
```bash
# Ruby on Rails
rails server                           # run_in_background: true
bundle exec rails s                    # run_in_background: true

# PHP 내장 서버
php -S localhost:8000                  # run_in_background: true
php artisan serve                      # run_in_background: true (Laravel)

# Go
go run main.go                         # run_in_background: true
air                                    # run_in_background: true (hot reload)

# Rust
cargo run                              # run_in_background: true
cargo watch -x run                     # run_in_background: true
```


### Watch 프로세스
```bash
# Webpack watch 모드
webpack --watch  # run_in_background: true

# TypeScript 컴파일러 watch
tsc --watch  # run_in_background: true

# 자동 재시작을 위한 Nodemon
nodemon server.js  # run_in_background: true
```

### 로그 모니터링
```bash
# 애플리케이션 로그 tail
tail -f /var/log/app.log  # run_in_background: true

# Journal 로그
journalctl -f -u myservice  # run_in_background: true
```

### 빌드 프로세스
```bash
# 오래 실행되는 빌드
npm run build:production  # run_in_background: true

# Docker 이미지 빌드
docker build -t myapp .  # run_in_background: true
```

## Claude-Flow와의 통합

### 자동 백그라운드 감지

Claude-Flow는 특정 명령어를 자동으로 감지하고 백그라운드에서 실행하도록 향상될 수 있습니다:

#### 패턴 기반 감지
이러한 패턴과 일치하는 명령어는 자동으로 백그라운드 실행을 사용할 수 있습니다:
- `npm run dev`, `yarn start`, `pnpm dev`
- `python manage.py runserver`, `flask run`, `uvicorn`
- `docker-compose up`, `docker run`
- `webpack --watch`, `parcel watch`
- `--watch` 또는 `-w` 플래그가 있는 모든 명령어

#### 설정
`.claude/settings.json`에 추가:
```json
{
  "autoBackground": {
    "enabled": true,
    "patterns": [
      "npm run dev",
      "yarn start",
      "docker-compose up",
      "*--watch*",
      "tail -f *"
    ],
    "excludePatterns": [
      "npm test",
      "npm run build"
    ]
  }
}
```

## 프롬프트에서의 자동 백그라운드 실행

### 직접적인 프롬프트 지시

프롬프트에서 Claude에게 직접 백그라운드 실행을 지시할 수 있습니다:

#### 예시 프롬프트
```markdown
# 명시적인 백그라운드 지시
"run_in_background 파라미터를 사용하여 백그라운드에서 개발 서버를 시작해줘"

# 암시적인 백그라운드 요청
"개발 서버를 실행하고 API 엔드포인트 작업을 계속해줘"
(Claude가 백그라운드 실행의 필요성을 인식할 것입니다)

# 여러 백그라운드 작업
"전체 개발 환경을 설정해줘:
- 프론트엔드 개발 서버를 백그라운드에서 시작
- API 서버를 백그라운드에서 실행
- 데이터베이스 컨테이너를 백그라운드에서 실행
그런 다음 사용자 인증 구현을 시작해줘"
```

### 에이전트를 위한 시스템 프롬프트

에이전트가 자동으로 백그라운드 실행을 사용하도록 설정합니다:

```markdown
## 에이전트 시스템 프롬프트 예시
당신은 개발 보조원입니다. 명령어를 실행할 때:
1. 항상 run_in_background: true로 개발 서버를 실행하세요.
2. 항상 watch 프로세스를 백그라운드에서 실행하세요.
3. 'dev', 'watch', 'serve', 또는 'monitor'를 포함하는 모든 명령어에 대해 백그라운드 실행을 사용하세요.
4. 백그라운드 작업을 모니터링하고 문제를 보고하세요.
5. 컨텍스트를 전환할 때 백그라운드 작업을 정리하세요.

특별 처리:
- npm run dev → 항상 백그라운드
- docker-compose up → 항상 백그라운드
- 빌드 명령어 → 30초를 초과하지 않으면 포그라운드
- 테스트 명령어 → 즉각적인 피드백을 위해 항상 포그라운드
```

### CLAUDE.md 설정

프로젝트의 `CLAUDE.md` 파일에 추가하여 자동 백그라운드 실행을 보장합니다:

```markdown
# 프로젝트 개발 가이드라인

## 명령어 실행 규칙

### 항상 백그라운드에서 실행:
- `npm run dev` - 프론트엔드 개발 서버
- `npm run api` - API 개발 서버
- `docker-compose up` - 로컬 서비스
- `npm run watch` - 파일 감시자
- --watch 플래그가 있는 모든 명령어

### 백그라운드 모니터링:
백그라운드 작업을 시작한 후, BashOutput을 사용하여 주기적으로 상태를 확인하세요.
백그라운드 작업이 실패하거나 예기치 않게 중지되면 알림을 보내세요.

### 예시 워크플로우:
1. 백그라운드에서 개발 서버 시작: npm run dev (run_in_background: true 사용)
2. 출력 모니터링: 30초마다 BashOutput으로 확인
3. 서버가 실행되는 동안 다른 작업 계속
4. 정리: 완료되면 KillBash 사용
```

### 프롬프트 템플릿

#### 개발 설정 템플릿
```markdown
개발 환경을 설정합니다:
1. 'npm install' 실행 (포그라운드)
2. run_in_background: true로 'npm run dev' 시작
3. run_in_background: true로 'npm run api' 시작
4. 두 백그라운드 작업의 성공적인 시작을 모니터링
5. 실행이 확인되면 [주요 작업]을 진행
```

#### 디버깅 템플릿
```markdown
애플리케이션 문제를 디버깅합니다:
1. 상세 로깅으로 백그라운드에서 앱 시작:
   DEBUG=* npm run dev (run_in_background: true 사용)
2. "error|warning" 필터로 BashOutput을 사용하여 출력 모니터링
3. 로그를 모니터링하면서 문제 재현
4. 필터링된 출력에서 문제 분석
```

### 에이전트별 백그라운드 전략

#### DevOps 에이전트
```javascript
// 에이전트 설정
{
  "name": "DevOps Agent",
  "autoBackground": {
    "rules": [
      { "pattern": "docker*", "background": true },
      { "pattern": "*compose*", "background": true },
      { "pattern": "kubectl logs -f", "background": true },
      { "pattern": "terraform apply", "background": false },
      { "pattern": "*--watch*", "background": true }
    ]
  }
}
```

#### QA 테스팅 에이전트
```javascript
{
  "name": "QA Agent",
  "autoBackground": {
    "rules": [
      { "pattern": "cypress open", "background": true },
      { "pattern": "jest --watch", "background": true },
      { "pattern": "npm test", "background": false },
      { "pattern": "playwright test", "background": false }
    ]
  }
}
```

### Swarm 조정

Claude-Flow의 hive-mind 시스템을 사용할 때:

```bash
# 전문 백그라운드 모니터 에이전트 생성
npx claude-flow hive-mind spawn "background-monitor" \
  --role "모든 백그라운드 프로세스 모니터링 및 관리" \
  --instructions "
    1. 모든 백그라운드 작업 추적
    2. 실패 시 알림
    3. 충돌한 서비스 재시작
    4. 리소스 사용량 보고
    5. 모든 모니터링 명령어에 run_in_background 사용
  "

# 백그라운드 인식이 있는 주요 개발 에이전트
npx claude-flow hive-mind spawn "full-stack-dev" \
  --role "서비스가 백그라운드에서 실행되는 동안 기능 개발" \
  --instructions "
    모든 개발 서버를 백그라운드에서 시작:
    - 프론트엔드: npm run dev (백그라운드)
    - 백엔드: npm run api (백그라운드)
    - 데이터베이스: docker-compose up db (백그라운드)
    그런 다음 기능 구현에 집중
  "
```

### 워크플로우 자동화

백그라운드 실행을 활용하는 자동화된 워크플로우를 생성합니다:

```yaml
# .claude/workflows/dev-setup.yaml
name: 개발 설정
steps:
  - name: 의존성 설치
    command: npm install
    background: false
    
  - name: 프론트엔드 시작
    command: npm run dev
    background: true
    monitor: true
    
  - name: 백엔드 시작
    command: npm run api  
    background: true
    monitor: true
    
  - name: 데이터베이스 시작
    command: docker-compose up db
    background: true
    monitor: true
    
  - name: 서비스 대기
    command: npx wait-on http://localhost:3000 http://localhost:4000
    background: false
    
  - name: 마이그레이션 실행
    command: npm run migrate
    background: false
    depends_on: [데이터베이스 시작]
```

### 스마트 명령어 래퍼

백그라운드 실행을 자동으로 결정하는 명령어 래퍼를 생성합니다:

```javascript
// .claude/scripts/smart-exec.js
const BACKGROUND_PATTERNS = [
  /^npm run (dev|watch|serve)/,
  /^yarn (dev|watch|start)/,
  /^pnpm (dev|watch|serve)/,
  /docker-compose up/,
  /--watch/,
  /webpack.*watch/,
  /nodemon/,
  /^ng serve/,
  /^vue-cli-service serve/,
  /^next dev/,
  /^nuxt dev/,
  /python.*runserver/,
  /flask run/,
  /uvicorn.*--reload/,
  /tail -f/,
  /journalctl.*-f/
];

function shouldRunInBackground(command) {
  return BACKGROUND_PATTERNS.some(pattern => pattern.test(command));
}

// Claude-Flow 통합을 위해 내보내기
module.exports = { shouldRunInBackground };
```

### 컨텍스트 인식 백그라운드 결정

Claude가 지능적인 백그라운드 결정을 내리도록 학습시킵니다:

```markdown
## 지능형 백그라운드 실행 규칙

### 명령어 의도 분석:
1. **개발/Watch 명령어** → 항상 백그라운드
   - 포함: dev, watch, serve, monitor
   - 목적: 장기 실행 관찰

2. **빌드 명령어** → 조건부
   - 예상 시간이 30초 이상이면 → 백그라운드
   - 30초 미만이면 → 포그라운드

3. **테스트 명령어** → 보통 포그라운드
   - 예외: --watch 모드 → 백그라운드
   - CI/CD 테스트 → 즉각적인 결과를 위해 포그라운드

4. **데이터 처리** → 범위 분석
   - 대용량 데이터셋 → 백그라운드
   - 빠른 쿼리 → 포그라운드

### 다단계 워크플로우:
여러 관련 명령어를 실행할 때:
1. 준비 단계 (설치, 빌드) → 포그라운드
2. 서비스 (서버, 데이터베이스) → 백그라운드
3. 모니터링 (로그, 메트릭) → 백그라운드
4. 작업 (마이그레이션, 시드) → 포그라운드
5. 정리 → 포그라운드

### 예시 결정 트리:
```
서버/서비스인가? → 예 → 백그라운드
파일을 감시하고 있는가? → 예 → 백그라운드
추가 작업을 차단하는가? → 예 → 백그라운드
즉각적인 출력이 필요한가? → 아니오 → 백그라운드
일회성 명령어인가? → 예 → 포그라운드
기본값 → 포그라운드
```
```

### Hook 시스템 통합

#### Pre-Command Hook
```bash
npx claude-flow hooks pre-command \
  --analyze-for-background \
  --auto-background-threshold 30
```

#### 백그라운드 모니터 Hook
```bash
npx claude-flow hooks background-monitor \
  --check-interval 10 \
  --alert-on-failure
```

### MCP 도구 확장

Claude-Flow를 위한 잠재적인 새로운 MCP 도구:

1. **background_spawn**
   - 지능적으로 백그라운드에서 명령어 생성
   - 리소스 할당 관리
   - 프로세스 라이프사이클 추적

2. **background_monitor**
   - 실시간 모니터링 대시보드
   - 리소스 사용량 추적
   - 실패 시 자동 재시작

3. **background_orchestrate**
   - 여러 백그라운드 프로세스 관리
   - 프로세스 간의 종속성
   - 정상적인 종료 시퀀스

## 백그라운드 작업 관리

### 작업 상태 확인

#### /bashes 명령어 사용
```bash
# 인터랙티브 모드 - 모든 백그라운드 셸 보기
/bashes

# 출력 내용:
# - 셸 ID (bash_1, bash_2 등)
# - 실행된 명령어
# - 상태 (running/completed/killed)
# - 실행 시간 및 종료 코드
```

#### 프로그래밍 방식 상태 확인
```bash
# Claude에게 특정 셸 확인 요청
"bash_3의 상태를 확인해줘"

# 모든 백그라운드 작업 요청
"실행 중인 모든 백그라운드 작업을 보여줘"

# 특정 셸의 상세 출력 받기
"bash_3의 출력을 보여줘"
```

### 출력 모니터링

#### 실시간 모니터링 패턴
```bash
# 작업 시작
"백그라운드에서 npm run dev 실행해줘"
→ 반환: bash_1

# 주기적으로 출력 확인
"bash_1 출력 확인해줘"
→ 마지막 확인 이후의 새로운 출력 표시

# 오류 필터링
"bash_1에서 오류가 있는지 확인해줘"
→ Claude가 BashOutput에서 필터 파라미터 사용
```

#### 출력 관리
```bash
# BashOutput은 마지막 확인 이후의 새로운 출력만 반환합니다
# 이는 오래 실행되는 작업의 과도한 출력을 방지합니다

# 예시 워크플로우:
1. 서버 시작 → bash_1
2. 첫 번째 확인 → 시작 로그 표시
3. 두 번째 확인 → 새로운 요청만 표시
4. 세 번째 확인 → 가장 최신 활동만 표시
```

### 백그라운드 작업 종료

#### 작업 종료 방법
```bash
# 방법 1: /bashes 인터랙티브 메뉴 사용
/bashes
→ 화살표 키로 셸 선택
→ 'k'를 눌러 종료

# 방법 2: Claude에게 직접 요청
"bash_3을 종료해줘"
"npm dev 서버를 중지해줘"
"모든 백그라운드 작업을 종료해줘"

# 방법 3: 특정 패턴 매칭
"포트 8080에서 실행 중인 작업을 종료해줘"
"백그라운드에서 실행 중인 모든 도커 컨테이너를 중지해줘"
```

## 모범 사례

### 1. **셸 ID 관리**
```bash
# 백그라운드 작업을 시작할 때 항상 셸 ID를 캡처하세요
"백그라운드에서 서버를 시작하고 셸 ID를 알려줘"
→ "ID: bash_1로 백그라운드에서 명령어가 실행 중입니다"

# 각 ID가 무엇을 실행하는지 추적하세요
bash_1: npm run dev (프론트엔드)
bash_2: npm run api (백엔드)
bash_3: docker-compose up (데이터베이스)
```

### 2. **리소스 관리**
- 백그라운드 작업의 CPU 및 메모리 사용량 모니터링
- 오래 실행되는 프로세스에 대한 타임아웃 설정
- 동시 백그라운드 작업 수 제한
- 유휴 상태이거나 멈춘 프로세스 종료

### 3. **오류 처리**
```bash
# 정기적인 상태 확인
"bash_1이 아직 실행 중인지 확인해줘"

# 오류 모니터링
"bash_1 출력에서 오류나 경고가 있는지 확인해줘"

# 자동 재시작 패턴
"bash_1이 중지되었으면, 백그라운드에서 npm run dev를 다시 시작해줘"
```

### 4. **세션 정리**
```bash
# 세션을 종료하기 전
"모든 백그라운드 작업을 종료해줘"

# 또는 선택적으로
"bash_1과 bash_2는 종료하고 bash_3은 계속 실행해줘"

# 정리 확인
/bashes  # 실행 중인 작업이 없어야 함
```

### 5. **출력 관리**
- 필터를 사용하여 특정 패턴 찾기
- 지속적이 아닌 주기적으로 출력 확인
- /bashes 뷰에서 완료된 작업 지우기
- 가능하면 구조화된 로깅 사용

## 고급 기능

### 세션 지속성

백그라운드 작업은 Claude Code 세션 간에 **자동으로 지속**됩니다. 특별한 명령어가 필요 없습니다!

```bash
# 한 세션에서 작업 시작
claude
> 백그라운드에서 npm run dev 실행  # → bash_1
> 백그라운드에서 docker-compose up 실행  # → bash_2
> 종료

# 나중에 다시 시작 - 작업은 여전히 실행 중!
claude --continue
> bash_1 출력 확인  # 개발 서버 여전히 실행 중
> bash_2 상태 확인  # Docker 여전히 실행 중
```

**주요 특징:**
- Claude를 종료한 후에도 백그라운드 프로세스는 계속 실행됩니다.
- 셸 ID(bash_1, bash_2 등)는 보존됩니다.
- 증분 읽기를 위해 출력 위치가 추적됩니다.
- 재연결하려면 `--continue` 또는 `--resume`을 사용하세요.

자세한 내용은 [세션 지속성 가이드](./session-persistence.md)를 참조하세요.

### 작업 오케스트레이션
여러 백그라운드 작업을 조정합니다:
```bash
# 개발 환경 설정
npx claude-flow orchestrate dev-env \
  --background "npm run dev" \
  --background "npm run api" \
  --background "docker-compose up db" \
  --wait-healthy
```

### 지능형 모니터링
```bash
# 알림 기능이 있는 스마트 모니터링
npx claude-flow monitor \
  --background-tasks \
  --alert-on "error|failed|exception" \
  --restart-on-failure
```

## 문제 해결

### 일반적인 문제

1. **작업이 백그라운드에서 시작되지 않음**
   - `run_in_background: true`가 설정되었는지 확인
   - 셸 호환성 확인
   - 명령어가 인터랙티브 입력을 요구하지 않는지 확인

2. **출력을 가져올 수 없음**
   - 올바른 bash_id인지 확인
   - 작업이 아직 실행 중인지 확인
   - 버퍼링 문제 확인 (버퍼링 없는 출력 사용)

3. **작업이 종료되지 않음**
   - 정상적인 종료가 실패하면 강제 종료 사용
   - 자식 프로세스 확인
   - 애플리케이션의 신호 처리 확인


### 디버그 명령어

#### 인터랙티브 셸 관리

**/bashes 명령어**는 백그라운드 셸을 관리하기 위한 인터랙티브 인터페이스를 제공합니다:

```bash
# Claude Code 인터랙티브 모드에서 다음을 입력:
/bashes

# 다음을 보여주는 인터랙티브 메뉴가 열립니다:
# - 실행 중 및 완료된 모든 백그라운드 셸
# - 셸 ID, 명령어 및 상태
# - 실행 시간 정보 및 종료 코드
```

**인터랙티브 컨트롤:**
- **↑/↓**: 셸 간 이동
- **Enter**: 선택한 셸의 상세 출력 보기
- **k**: 선택한 실행 중인 셸 종료
- **Esc**: 메뉴 종료


#### 프로그래밍 방식 관리

프로그래밍 방식 제어를 위해 Claude Code의 도구 시스템을 사용하세요:

```bash
# 특정 백그라운드 작업의 출력 확인
# bash_id와 함께 BashOutput 도구 사용

# 특정 백그라운드 작업 종료
# shell_id와 함께 KillBash 도구 사용

# 백그라운드 작업 모니터링
# 주기적으로 BashOutput 도구를 사용하여 상태 확인
```

**참고:** `/bashes` 명령어는 인터랙티브 모드에서만 사용할 수 있습니다. 스크립트 및 자동화의 경우 Claude의 도구 시스템을 통해 BashOutput 및 KillBash 도구를 사용하세요.

## 성능 고려 사항

### 메모리 사용량
- 백그라운드 작업은 독립적으로 메모리를 소비합니다.
- 총 시스템 메모리 사용량을 모니터링하세요.
- 작업별 메모리 제한을 구현하세요.

### CPU 사용량
- 백그라운드 작업은 동시에 실행됩니다.
- 주 Claude Code 성능에 영향을 줄 수 있습니다.
- 우선순위가 낮은 작업에 대해 nice 레벨을 고려하세요.

### I/O 고려 사항
- 백그라운드 작업은 디스크 I/O를 공유합니다.
- 네트워크 대역폭이 영향을 받을 수 있습니다.
- 리소스 집약적인 작업에 대해 속도 제한을 고려하세요.

## 향후 개선 사항

### 계획된 기능
1. **오래 실행되는 명령어 자동 감지**
2. **스마트 리소스 할당**
3. **백그라운드 작업 템플릿**
4. **세션 간 작업 마이그레이션**
5. **분산 백그라운드 실행**

### 커뮤니티 요청
- 시각적 작업 관리자 UI
- 작업 종속성 그래프
- 자동 재시작 정책
- 컨테이너 오케스트레이션과의 통합
- 백그라운드 작업 마켓플레이스

## 관련 문서

- [Claude Code Bash 도구 문서](./bash-tool.md)
- [Claude-Flow Hooks 시스템](./hooks-system.md)
- [MCP 도구 참조](./mcp-tools.md)
- [세션 관리](./session-management.md)

## 예시 저장소

더 많은 예시는 다음에서 찾을 수 있습니다: [claude-flow-examples/background-tasks](https://github.com/ruvnet/claude-flow-examples/tree/main/background-tasks)

---

*마지막 업데이트: 2025년 8월*
*Claude-Flow 버전: 2.0.0-alpha*
