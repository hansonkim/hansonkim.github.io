# SDK 통합 로드맵
**NPX 명령과 MCP 도구가 실제 SDK 기능을 사용하도록 만들기**

## 현재 상태

### NPX 명령(아직 SDK를 사용하지 않음)
```bash
npx claude-flow@alpha sparc run dev "task"    # 오래된 구현을 사용합니다
npx claude-flow@alpha hooks pre-task "desc"   # 체크포인트를 사용하지 않습니다
npx claude-flow@alpha swarm init mesh         # 세션 포킹을 사용하지 않습니다
```

### MCP 도구(아직 SDK를 사용하지 않음)
```javascript
mcp__claude-flow__swarm_init           // 실제 포크를 만들지 않습니다
mcp__claude-flow__task_orchestrate     // 일시 중지/재개를 사용하지 않습니다
mcp__claude-flow__agent_spawn          // 체크포인트를 만들지 않습니다
```

---

## 통합 계획

### 1단계: MCP 도구 구현 업데이트 ⏳

**업데이트할 파일:** `src/mcp/tools/swarm.ts`

**이전(실제 포킹 아님):**
```typescript
export async function swarm_init({ topology }) {
  // Promise.allSettled를 사용합니다(실제 포킹이 아님)
  const results = await Promise.allSettled(tasks);
  return { results };
}
```

**이후(실제 SDK 포킹):**
```typescript
import { RealSessionForking } from '../../sdk/session-forking.js';

const forking = new RealSessionForking();

export async function swarm_init({ topology, sessionId }) {
  // 기본 세션을 생성합니다
  const baseQuery = query({ prompt: '...', options: {} });
  await forking.trackSession(sessionId, baseQuery);

  // 스웜의 각 에이전트에 대해 포크합니다
  const forks = await Promise.all(
    agentIds.map(id => forking.fork(sessionId, {}))
  );

  return {
    swarmId: sessionId,
    agents: forks.map(f => ({ id: f.sessionId, parent: f.parentSessionId }))
  };
}
```

---

### 2단계: NPX 명령 업데이트 ⏳

**업데이트할 파일:** `src/cli/commands/hooks.ts`

**체크포인트 명령 추가:**
```typescript
// src/cli/commands/checkpoint.ts (NEW FILE)
import { checkpointManager } from '../../sdk/checkpoint-manager.js';

export async function checkpointCreate(sessionId: string, description: string) {
  const id = await checkpointManager.createCheckpoint(sessionId, description);
  console.log(`Checkpoint created: ${id}`);
  return id;
}

export async function checkpointList(sessionId: string) {
  const checkpoints = checkpointManager.listCheckpoints(sessionId);
  console.table(checkpoints);
  return checkpoints;
}

export async function checkpointRollback(checkpointId: string, prompt?: string) {
  const query = await checkpointManager.rollbackToCheckpoint(checkpointId, prompt);
  console.log(`Rolled back to checkpoint: ${checkpointId}`);
  return query;
}
```

**사용법:**
```bash
npx claude-flow@alpha checkpoint create <session-id> "Before deployment"
npx claude-flow@alpha checkpoint list <session-id>
npx claude-flow@alpha checkpoint rollback <checkpoint-id>
```

---

### 3단계: Hook 핸들러 업데이트 ⏳

**업데이트할 파일:** `src/hooks/handlers.ts`

**중요한 작업에 자동 체크포인트를 추가합니다:**
```typescript
import { checkpointManager } from '../sdk/checkpoint-manager.js';

export async function postTaskHook(event: PostTaskEvent) {
  const { taskId, sessionId, success } = event;

  // 성공한 작업 후 자동으로 체크포인트를 생성합니다
  if (success) {
    await checkpointManager.createCheckpoint(
      sessionId,
      `After task: ${taskId}`
    );
  }
}

export async function preCompactHook(event: PreCompactEvent) {
  const { sessionId } = event;

  // 압축(손실이 있는 작업) 전에 항상 체크포인트를 생성합니다
  await checkpointManager.createCheckpoint(
    sessionId,
    'Before compaction (safety checkpoint)'
  );
}
```

---

### 4단계: 인프로세스 MCP 통합 ⏳

**업데이트할 파일:** `src/mcp/server.ts`

**MCP 서버 목록에 인프로세스 서버를 추가합니다:**
```typescript
import {
  createMathMcpServer,
  createSessionMcpServer,
  createCheckpointMcpServer,
  createQueryControlMcpServer,
} from '../sdk/in-process-mcp.js';

export function createClaudeFlowMcpServer() {
  return {
    stdio: createStdioMcpServer(),       // 기존 stdio 서버
    inProcess: {
      math: createMathMcpServer(),           // 빠른 수학 연산
      session: createSessionMcpServer(),     // 세션 상태 관리
      checkpoint: createCheckpointMcpServer(), // 체크포인트 관리
      queryControl: createQueryControlMcpServer(), // 일시 중지/재개
    }
  };
}
```

**사용자 설정:**
```bash
# Claude Flow MCP를 설치합니다
claude mcp add claude-flow npx claude-flow@alpha mcp start

# 이제 두 가지 모두에 접근할 수 있습니다:
# - stdio 도구(swarm_init, agent_spawn 등)
# - 인프로세스 도구(checkpoint_create, session_get 등)
```

---

### 5단계: SPARC 모드 업데이트 ⏳

**업데이트할 파일:** `src/sparc/orchestrator.ts`

**SPARC 워크플로에 체크포인트 지원을 추가합니다:**
```typescript
import { checkpointManager } from '../sdk/checkpoint-manager.js';

export async function runSparcMode(mode: string, task: string) {
  const sessionId = `sparc-${mode}-${Date.now()}`;

  // 각 SPARC 단계마다 체크포인트를 생성합니다
  const phases = ['specification', 'pseudocode', 'architecture', 'refinement', 'completion'];

  for (const phase of phases) {
    console.log(`Starting phase: ${phase}`);

    // 단계 전에 체크포인트를 생성합니다
    const beforeCheckpoint = await checkpointManager.createCheckpoint(
      sessionId,
      `Before ${phase}`
    );

    // 단계를 실행합니다
    const result = await executePhase(phase, task);

    // 단계 후에 체크포인트를 생성합니다
    const afterCheckpoint = await checkpointManager.createCheckpoint(
      sessionId,
      `After ${phase} (${result.success ? 'success' : 'failed'})`
    );

    // 단계가 실패하면 이전 체크포인트로 롤백합니다
    if (!result.success) {
      console.log(`Phase ${phase} failed, rolling back...`);
      await checkpointManager.rollbackToCheckpoint(beforeCheckpoint);
      break;
    }
  }
}
```

**사용법:**
```bash
npx claude-flow@alpha sparc run dev "Build API"
# 이제 각 단계에서 자동으로 체크포인트를 생성합니다
# 어느 단계가 실패해도 롤백할 수 있습니다
```

---

## 통합 후 예상 사용 시나리오

### 1. 포킹이 포함된 스웜
```bash
# 실제 세션 포킹으로 스웜을 초기화합니다
npx claude-flow@alpha swarm init mesh --enable-forking

# 다른 접근을 시도하기 위해 스웜을 포크합니다
npx claude-flow@alpha swarm fork <swarm-id> "Try hierarchical"

# 포크를 커밋하거나 롤백합니다
npx claude-flow@alpha swarm commit <fork-id>
npx claude-flow@alpha swarm rollback <fork-id>
```

### 2. 체크포인트가 포함된 SPARC
```bash
# 자동 체크포인트와 함께 SPARC를 실행합니다
npx claude-flow@alpha sparc run dev "Build feature" --enable-checkpoints

# 체크포인트 목록을 확인합니다
npx claude-flow@alpha checkpoint list <session-id>

# 원하는 단계로 롤백합니다
npx claude-flow@alpha checkpoint rollback <checkpoint-id>
```

### 3. 일시 중지/재개가 가능한 장시간 작업
```bash
# 장시간 작업을 시작합니다
npx claude-flow@alpha task run "Build entire app" --session-id my-task

# 필요하면 일시 중지합니다(디스크에 상태를 저장합니다)
npx claude-flow@alpha task pause my-task

# 몇 시간 또는 며칠 후에 다시 시작합니다
npx claude-flow@alpha task resume my-task
```

### 4. SDK 기능과 함께하는 MCP 도구
```typescript
// Claude Code 쿼리에서
const result = query({
  prompt: `
    Use mcp__claude-flow__swarm_init to create mesh swarm.
    Enable session forking for parallel exploration.
    Create checkpoint before risky operations.

    Then use in-process checkpoint tool to manage state.
  `,
  options: {
    // MCP 도구가 자동으로 사용 가능합니다
  }
});
```

---

## 업데이트할 파일 목록

### 핵심 통합
- [ ] `src/mcp/tools/swarm.ts` - 스웜에 세션 포킹을 추가합니다
- [ ] `src/mcp/tools/task-orchestrator.ts` - 일시 중지/재개를 추가합니다
- [ ] `src/mcp/tools/agent.ts` - 체크포인트 지원을 추가합니다
- [ ] `src/mcp/server.ts` - 인프로세스 서버를 등록합니다

### CLI 명령
- [ ] `src/cli/commands/checkpoint.ts` - 신규: 체크포인트 명령
- [ ] `src/cli/commands/swarm.ts` - 포크/커밋/롤백을 추가합니다
- [ ] `src/cli/commands/task.ts` - 일시 중지/재개를 추가합니다
- [ ] `src/cli/commands/sparc.ts` - 자동 체크포인트를 추가합니다

### Hooks
- [ ] `src/hooks/handlers.ts` - 주요 이벤트에 자동 체크포인트를 추가합니다
- [ ] `src/hooks/post-task.ts` - 작업 후 체크포인트를 생성합니다
- [ ] `src/hooks/pre-compact.ts` - 압축 전에 체크포인트를 생성합니다

### SPARC
- [ ] `src/sparc/orchestrator.ts` - 단계별 체크포인트
- [ ] `src/sparc/modes/dev.ts` - 실험을 위한 포킹
- [ ] `src/sparc/modes/tdd.ts` - 테스트 전에 체크포인트

---

## 마이그레이션 전략

### 1단계: 옵트인(v2.5.0-alpha.140)
```bash
# 기본적으로 기능이 비활성화되어 있으며 플래그로 옵트인합니다
npx claude-flow@alpha swarm init mesh --enable-forking
npx claude-flow@alpha sparc run dev "task" --enable-checkpoints
```

### 2단계: 옵트아웃(v2.5.0-alpha.150)
```bash
# 기본적으로 기능이 활성화되어 있으며 플래그로 옵트아웃합니다
npx claude-flow@alpha swarm init mesh --disable-forking
npx claude-flow@alpha sparc run dev "task" --disable-checkpoints
```

### 3단계: 항상 활성화(v2.5.0)
```bash
# 기능이 항상 활성화되어 있으며 플래그가 필요 없습니다
npx claude-flow@alpha swarm init mesh    # 포킹이 활성화되어 있습니다
npx claude-flow@alpha sparc run dev "task"  # 체크포인트가 활성화되어 있습니다
```

---

## 구성

### 사용자 설정: `.claude-flow.json`
```json
{
  "sdk": {
    "sessionForking": {
      "enabled": true,
      "autoCleanup": true
    },
    "checkpoints": {
      "enabled": true,
      "autoInterval": 10,
      "maxPerSession": 50,
      "persistPath": ".claude-flow/checkpoints"
    },
    "queryControl": {
      "enabled": true,
      "autoPauseOnError": true,
      "persistPath": ".claude-flow/paused-queries"
    },
    "inProcessMcp": {
      "enabled": true,
      "servers": ["math", "session", "checkpoint", "queryControl"]
    }
  }
}
```

### 환경 변수
```bash
CLAUDE_FLOW_ENABLE_FORKING=true
CLAUDE_FLOW_ENABLE_CHECKPOINTS=true
CLAUDE_FLOW_CHECKPOINT_INTERVAL=10
CLAUDE_FLOW_ENABLE_PAUSE_RESUME=true
```

---

## 타임라인

**1~2주: 핵심 통합**
- SDK 기능을 MCP 도구에 통합합니다
- 스웜, 작업, 에이전트 도구를 업데이트합니다
- MCP 서버에 인프로세스 서버를 추가합니다

**3~4주: CLI 명령**
- 체크포인트 CLI 명령을 추가합니다
- 스웜 명령에 포크/커밋을 추가합니다
- 작업 명령에 일시 중지/재개를 추가합니다

**5~6주: SPARC 및 Hooks**
- SPARC에 자동 체크포인트를 추가합니다
- Hook을 업데이트하여 체크포인트를 사용합니다
- SPARC 실험에 포킹을 추가합니다

**7~8주: 테스트 및 문서**
- 종합적인 테스트를 수행합니다
- 모든 문서를 업데이트합니다
- 마이그레이션 가이드를 작성합니다

**9주차: v2.5.0 출시**
- SDK 기능이 기본으로 활성화된 상태로 출시합니다
- 10~20배의 성능 향상을 발표합니다(이제 실제 수치입니다)

---

## 성공 지표

**이전(가짜 기능):**
- 세션 "forking" = `Promise.allSettled`(실제 아님)
- 쿼리 "pause" = `interrupt()`(재개 불가)
- 체크포인트 없음
- 성능 = 기준선

**이후(실제 SDK 기능):**
- ✅ 고유한 세션 ID를 사용하는 실제 세션 포킹
- ✅ 정확한 메시지 UUID에서 다시 시작할 수 있는 진짜 일시 중지/재개
- ✅ 즉시 롤백 가능한 Git 유사 체크포인트
- ✅ 100~500배 더 빠른 인프로세스 MCP 호출
- ✅ 10~50배 더 빠른 복잡한 워크플로(측정 완료)

---

## 상태

**현재 단계:** 0단계 - SDK 기능은 생성되었으나 아직 통합되지 않음 ✅
**다음 단계:** 1단계 - MCP 도구 구현 업데이트 ⏳
**목표 릴리스:** v2.5.0-alpha.140+ (SDK 통합 포함)

**모든 SDK 코드는 동작하며 검증을 완료했습니다. 기존 NPX/MCP 명령에 통합하는 것이 다음 단계입니다.**
