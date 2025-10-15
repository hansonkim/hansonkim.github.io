# Claude-Flow 통합: 네트워크 샌드박싱 및 DevTools
## 스웜 오케스트레이션을 위한 고급 SDK 기능 통합

**버전**: 2.5.0-alpha.130
**날짜**: 2025-09-30
**상태**: 설계 단계

---

## 🎯 개요

이 문서는 Claude-Flow의 스웜 오케스트레이션 시스템에 두 가지 고급 Claude Code SDK 기능을 통합하는 방법을 다룹니다.

1. **Network Request Sandboxing** - 에이전트별 네트워크 격리와 거버넌스
2. **React DevTools Integration** - 실시간 스웜 시각화 및 프로파일링

---

## 1️⃣ Network Request Sandboxing 통합

### SDK 기능 분석

```typescript
// @anthropic-ai/claude-code CLI 소스에서 발견
interface NetworkPermission {
  hostPattern: { host: string; port: number };
  allow: boolean;
  rememberForSession: boolean;
}

// 난독화된 코드에서 추론한 구현 패턴
function promptNetworkAccess(
  hostPattern: { host: string; port: number }
): Promise<NetworkPermissionResponse> {
  // SDK가 사용자에게 승인 여부를 묻습니다
  // 반환: { allow: boolean, rememberForSession: boolean }
}
```

**주요 기능**:
- ✅ 호스트 단위 네트워크 격리
- ✅ 포트별 접근 제어
- ✅ 세션 지속형 권한
- ✅ 대화형 승인 흐름

---

### 🚀 Claude-Flow 통합 전략

#### **사용 사례 1: 에이전트별 네트워크 정책**

**시나리오**: 에이전트마다 서로 다른 네트워크 접근 수준이 필요합니다
- 연구 에이전트 → 전체 인터넷 접근
- 코드 분석 에이전트 → GitHub API만 허용
- 검증 에이전트 → 네트워크 접근 불가(샌드박스)

**구현**:

```typescript
// src/swarm/network-policy-manager.ts
import { AgentType, SwarmConfig } from './types';

interface AgentNetworkPolicy {
  agentType: AgentType;
  allowedHosts: Array<{ host: string; port: number }>;
  deniedHosts: Array<{ host: string; port: number }>;
  defaultBehavior: 'allow' | 'deny' | 'prompt';
}

export class NetworkPolicyManager {
  private policies: Map<AgentType, AgentNetworkPolicy> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies() {
    // 연구 에이전트 - 광범위한 접근
    this.policies.set('researcher', {
      agentType: 'researcher',
      allowedHosts: [
        { host: '*.anthropic.com', port: 443 },
        { host: '*.github.com', port: 443 },
        { host: '*.stackoverflow.com', port: 443 },
        { host: '*.npmjs.com', port: 443 }
      ],
      deniedHosts: [],
      defaultBehavior: 'prompt'
    });

    // 코더 에이전트 - 문서와 패키지 레지스트리로 제한
    this.policies.set('coder', {
      agentType: 'coder',
      allowedHosts: [
        { host: 'api.github.com', port: 443 },
        { host: 'registry.npmjs.org', port: 443 },
        { host: 'pypi.org', port: 443 }
      ],
      deniedHosts: [],
      defaultBehavior: 'deny'
    });

    // 분석 에이전트 - 네트워크 접근 불가(샌드박스)
    this.policies.set('analyst', {
      agentType: 'analyst',
      allowedHosts: [],
      deniedHosts: [{ host: '*', port: '*' }],
      defaultBehavior: 'deny'
    });

    // 옵티마이저 에이전트 - 메트릭 엔드포인트만 허용
    this.policies.set('optimizer', {
      agentType: 'optimizer',
      allowedHosts: [
        { host: 'api.anthropic.com', port: 443 }
      ],
      deniedHosts: [],
      defaultBehavior: 'deny'
    });
  }

  async checkNetworkAccess(
    agentType: AgentType,
    host: string,
    port: number,
    sessionId: string
  ): Promise<{ allowed: boolean; reason: string }> {
    const policy = this.policies.get(agentType);
    if (!policy) {
      return { allowed: false, reason: 'No policy found for agent type' };
    }

    // 명시적 거부를 먼저 확인합니다
    if (this.isHostDenied(host, port, policy.deniedHosts)) {
      return {
        allowed: false,
        reason: `Host ${host}:${port} is explicitly denied for ${agentType} agents`
      };
    }

    // 명시적 허용을 확인합니다
    if (this.isHostAllowed(host, port, policy.allowedHosts)) {
      return {
        allowed: true,
        reason: `Host ${host}:${port} is whitelisted for ${agentType} agents`
      };
    }

    // 기본 동작을 적용합니다
    switch (policy.defaultBehavior) {
      case 'allow':
        return { allowed: true, reason: 'Default allow policy' };
      case 'deny':
        return { allowed: false, reason: 'Default deny policy' };
      case 'prompt':
        // SDK의 대화형 프롬프트로 위임합니다
        return await this.promptUserForAccess(agentType, host, port, sessionId);
    }
  }

  private isHostAllowed(
    host: string,
    port: number,
    allowedHosts: Array<{ host: string; port: number }>
  ): boolean {
    return allowedHosts.some(pattern =>
      this.matchesPattern(host, pattern.host) &&
      (pattern.port === '*' || pattern.port === port)
    );
  }

  private isHostDenied(
    host: string,
    port: number,
    deniedHosts: Array<{ host: string; port: number }>
  ): boolean {
    return deniedHosts.some(pattern =>
      this.matchesPattern(host, pattern.host) &&
      (pattern.port === '*' || pattern.port === port)
    );
  }

  private matchesPattern(host: string, pattern: string): boolean {
    // 와일드카드 패턴 매칭
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\./g, '\\.') + '$'
    );
    return regex.test(host);
  }

  private async promptUserForAccess(
    agentType: AgentType,
    host: string,
    port: number,
    sessionId: string
  ): Promise<{ allowed: boolean; reason: string }> {
    // SDK의 기본 네트워크 프롬프트를 사용합니다
    const response = await this.sdkNetworkPrompt({ host, port });

    if (response.rememberForSession) {
      // 해당 세션에 대해서 결정을 캐시합니다
      this.cacheSessionDecision(sessionId, host, port, response.allow);
    }

    return {
      allowed: response.allow,
      reason: response.allow
        ? `User approved access to ${host}:${port}`
        : `User denied access to ${host}:${port}`
    };
  }

  async setAgentPolicy(agentType: AgentType, policy: AgentNetworkPolicy): Promise<void> {
    this.policies.set(agentType, policy);
  }

  async getAgentPolicy(agentType: AgentType): Promise<AgentNetworkPolicy | undefined> {
    return this.policies.get(agentType);
  }
}
```
```

---

#### **사용 사례 2: 스웜 수준 네트워크 격리**

**시나리오**: 전체 스웜이 제한된 네트워크 환경에서 동작합니다

```typescript
// src/swarm/swarm-network-manager.ts
export class SwarmNetworkManager {
  private policyManager: NetworkPolicyManager;
  private swarmSessions: Map<string, NetworkSessionData> = new Map();

  async initializeSwarm(
    swarmId: string,
    config: SwarmNetworkConfig
  ): Promise<void> {
    this.swarmSessions.set(swarmId, {
      isolationMode: config.isolationMode,
      allowedHosts: config.allowedHosts || [],
      deniedHosts: config.deniedHosts || [],
      agentPermissions: new Map()
    });
  }

  async beforeAgentNetworkRequest(
    agentId: string,
    agentType: AgentType,
    request: NetworkRequest
  ): Promise<NetworkRequestResult> {
    const swarmId = this.getSwarmIdForAgent(agentId);
    const session = this.swarmSessions.get(swarmId);

    if (!session) {
      throw new Error(`No network session found for swarm ${swarmId}`);
    }

    // 먼저 스웜 수준 제한을 확인합니다
    if (session.isolationMode === 'strict') {
      const swarmAllowed = this.isHostAllowedInSwarm(
        request.host,
        request.port,
        session
      );

      if (!swarmAllowed) {
        return {
          allowed: false,
          reason: `Swarm ${swarmId} operates in strict isolation mode`,
          blockedBy: 'swarm-policy'
        };
      }
    }

    // 에이전트 수준 정책을 확인합니다
    const agentCheck = await this.policyManager.checkNetworkAccess(
      agentType,
      request.host,
      request.port,
      agentId
    );

    if (!agentCheck.allowed) {
      return {
        allowed: false,
        reason: agentCheck.reason,
        blockedBy: 'agent-policy'
      };
    }

    // 감사 용도로 권한 부여를 기록합니다
    this.recordNetworkAccess(swarmId, agentId, request);

    return {
      allowed: true,
      reason: 'Approved by swarm and agent policies'
    };
  }

  async getSwarmNetworkAudit(swarmId: string): Promise<NetworkAuditLog> {
    // 네트워크 요청에 대한 전체 감사 기록을 반환합니다
    return {
      swarmId,
      totalRequests: this.getTotalRequests(swarmId),
      approvedRequests: this.getApprovedRequests(swarmId),
      deniedRequests: this.getDeniedRequests(swarmId),
      requestsByAgent: this.getRequestsByAgent(swarmId),
      requestsByHost: this.getRequestsByHost(swarmId)
    };
  }
}
```
```

---

#### **사용 사례 3: 동적 네트워크 정책 업데이트**

**시나리오**: 스웜 동작에 따라 네트워크 정책을 조정합니다

```typescript
// src/swarm/adaptive-network-policy.ts
export class AdaptiveNetworkPolicy {
  async analyzeSwarmBehavior(swarmId: string): Promise<PolicyRecommendations> {
    const audit = await this.networkManager.getSwarmNetworkAudit(swarmId);

    const recommendations: PolicyRecommendations = {
      expansions: [],
      restrictions: [],
      warnings: []
    };

    // 거부된 요청 패턴을 감지합니다
    const frequentlyDenied = this.findFrequentlyDeniedHosts(audit);
    if (frequentlyDenied.length > 0) {
      recommendations.warnings.push({
        type: 'frequent-denials',
        hosts: frequentlyDenied,
        suggestion: '신뢰할 수 있다면 허용 목록에 추가하는 것을 고려하세요'
      });
    }

    // 의심스러운 네트워크 패턴을 탐지합니다
    const suspiciousActivity = this.detectSuspiciousPatterns(audit);
    if (suspiciousActivity.length > 0) {
      recommendations.restrictions.push({
        type: 'suspicious-activity',
        details: suspiciousActivity,
        action: '영향을 받는 에이전트의 네트워크 접근을 제한하는 것을 권장합니다'
      });
    }

    return recommendations;
  }

  private detectSuspiciousPatterns(audit: NetworkAuditLog): SuspiciousPattern[] {
    const patterns: SuspiciousPattern[] = [];

    // 포트 스캔 감지
    const portScans = this.detectPortScanning(audit);
    if (portScans.length > 0) {
      patterns.push({
        type: 'port-scan',
        agents: portScans,
        severity: 'high'
      });
    }

    // 이례적인 TLD 접근
    const unusualTLDs = this.detectUnusualTLDs(audit);
    if (unusualTLDs.length > 0) {
      patterns.push({
        type: 'unusual-tld',
        hosts: unusualTLDs,
        severity: 'medium'
      });
    }

    return patterns;
  }
}
```

---

## 2️⃣ React DevTools 통합

### SDK 기능 분석

```typescript
// @anthropic-ai/claude-code CLI 소스에서 발견
window.__REACT_DEVTOOLS_COMPONENT_FILTERS__

// SDK에는 TUI 렌더링을 위한 전체 React DevTools 백엔드가 포함됩니다
// React Fiber 프로파일링
// 컴포넌트 트리 검사
// 성능 타임라인 추적
```

**주요 기능**:
- ✅ 실시간 컴포넌트 트리 시각화
- ✅ 성능 프로파일링(렌더링 시간, 재렌더링)
- ✅ 상태 검사
- ✅ props 추적
- ✅ 타임라인 분석

---

### 🚀 Claude-Flow 통합 전략

#### **사용 사례 1: 스웜 시각화 대시보드**

**시나리오**: 스웜 토폴로지와 에이전트 상태를 실시간으로 시각화합니다

```typescript
// src/ui/swarm-devtools.tsx
import React, { useEffect, useState } from 'react';
import { Box, Text, useApp } from 'ink';

interface SwarmNode {
  id: string;
  type: string;
  status: 'idle' | 'busy' | 'failed';
  connections: string[];
  metrics: {
    tasksCompleted: number;
    avgExecutionTime: number;
    errorRate: number;
  };
}

export const SwarmDevToolsDashboard: React.FC<{
  swarmId: string;
}> = ({ swarmId }) => {
  const [topology, setTopology] = useState<SwarmNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    // 스웜 상태 업데이트를 구독합니다
    const unsubscribe = SwarmMonitor.subscribe(swarmId, (state) => {
      setTopology(state.agents);
    });

    return unsubscribe;
  }, [swarmId]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan">
        <Text bold color="cyan">
          🐝 스웜 토폴로지: {swarmId}
        </Text>
      </Box>

      <Box flexDirection="row" marginTop={1}>
        {/* 에이전트 그리드 */}
        <Box flexDirection="column" width="50%">
          {topology.map((node) => (
            <AgentCard
              key={node.id}
              node={node}
              selected={selectedNode === node.id}
              onSelect={() => setSelectedNode(node.id)}
            />
          ))}
        </Box>

        {/* 에이전트 상세 패널 */}
        <Box flexDirection="column" width="50%" paddingLeft={2}>
          {selectedNode && (
            <AgentDetailsPanel
              node={topology.find((n) => n.id === selectedNode)!}
            />
          )}
        </Box>
      </Box>

      {/* 네트워크 그래프 시각화 */}
      <Box marginTop={2}>
        <SwarmNetworkGraph topology={topology} />
      </Box>
    </Box>
  );
};
```

---

#### **사용 사례 2: 에이전트 성능 프로파일링**

**시나리오**: React Fiber 데이터를 사용해 개별 에이전트 성능을 프로파일링합니다

```typescript
// src/profiling/agent-profiler.ts
export class AgentProfiler {
  private fiberData: Map<string, FiberPerformanceData> = new Map();

  async captureAgentProfile(agentId: string): Promise<AgentProfile> {
    // React DevTools 프로파일링 API에 연결합니다
    const profiler = this.getReactProfiler();

    // 프로파일링을 시작합니다
    profiler.startProfiling();

    // 에이전트가 작업을 수행하도록 합니다
    await this.executeAgentTasks(agentId);

    // 중단하고 데이터를 수집합니다
    const profilingData = profiler.stopProfiling();

    return this.analyzeProfilingData(agentId, profilingData);
  }

  private analyzeProfilingData(
    agentId: string,
    data: ReactProfilingData
  ): AgentProfile {
    return {
      agentId,
      totalRenderTime: data.commitTime,
      componentBreakdown: data.durations.map(([id, duration]) => ({
        component: this.getComponentName(id),
        renderTime: duration,
        percentage: (duration / data.commitTime) * 100
      })),
      slowestComponents: this.findSlowestComponents(data),
      renderCount: data.durations.length,
      recommendations: this.generateOptimizationRecommendations(data)
    };
  }

  private generateOptimizationRecommendations(
    data: ReactProfilingData
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // 불필요한 재렌더링을 감지합니다
    const unnecessaryRerenders = this.detectUnnecessaryRerenders(data);
    if (unnecessaryRerenders.length > 0) {
      recommendations.push({
        type: 'unnecessary-rerenders',
        severity: 'medium',
        components: unnecessaryRerenders,
        suggestion: '불필요한 렌더링을 방지하려면 React.memo 또는 useMemo를 추가하세요'
      });
    }

    // 비용이 큰 연산을 감지합니다
    const expensiveComputations = this.detectExpensiveComputations(data);
    if (expensiveComputations.length > 0) {
      recommendations.push({
        type: 'expensive-computations',
        severity: 'high',
        components: expensiveComputations,
        suggestion: '비용이 큰 연산을 useMemo 또는 워커 스레드로 이동하세요'
      });
    }

    return recommendations;
  }
}
```

---

#### **사용 사례 3: 실시간 스웜 모니터링 UI**

**시나리오**: 모든 스웜 활동을 보여주는 라이브 대시보드

```typescript
// src/ui/swarm-monitor.tsx
export const SwarmMonitorUI: React.FC = () => {
  const [swarms, setSwarms] = useState<SwarmState[]>([]);
  const [metrics, setMetrics] = useState<SwarmMetrics>({});

  useEffect(() => {
    // React DevTools 브리지를 활성화합니다
    if (typeof window !== 'undefined') {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        inject: (renderer) => {
          // 스웜 컴포넌트용 React 렌더러에 후킹합니다
          this.interceptSwarmComponents(renderer);
        }
      };
    }

    // 스웜 업데이트를 구독합니다
    const unsubscribe = SwarmCoordinator.subscribeToAll((updates) => {
      setSwarms(updates.swarms);
      setMetrics(updates.metrics);
    });

    return unsubscribe;
  }, []);

  return (
    <Box flexDirection="column">
      {/* 헤더 */}
      <Box borderStyle="double" borderColor="green">
        <Text bold color="green">
          🌊 Claude-Flow Swarm Monitor v2.5.0
        </Text>
      </Box>

      {/* 활성 스웜 그리드 */}
      <Box flexDirection="row" flexWrap="wrap" marginTop={1}>
        {swarms.map((swarm) => (
          <SwarmCard
            key={swarm.id}
            swarm={swarm}
            metrics={metrics[swarm.id]}
          />
        ))}
      </Box>

      {/* 글로벌 메트릭 */}
      <Box marginTop={2} borderStyle="single" borderColor="cyan">
        <GlobalMetricsPanel metrics={this.aggregateMetrics(metrics)} />
      </Box>

      {/* 성능 타임라인 */}
      <Box marginTop={2}>
        <PerformanceTimeline swarms={swarms} />
      </Box>
    </Box>
  );
};
```

---

## 🔧 구현 계획

### 1단계: 네트워크 샌드박싱 (1주차)
1. `NetworkPolicyManager` 클래스를 생성합니다
2. 에이전트별 네트워크 정책을 구현합니다
3. SDK 네트워크 프롬프트 통합을 추가합니다
4. 스웜 수준 네트워크 격리를 구축합니다
5. 네트워크 감사 로깅을 구현합니다

### 2단계: React DevTools 브리지 (2주차)
1. React DevTools 훅 통합을 설정합니다
2. 스웜 시각화 컴포넌트를 생성합니다
3. 에이전트 프로파일링 시스템을 구현합니다
4. 실시간 모니터링 대시보드를 구축합니다
5. 성능 권장 사항을 추가합니다

### 3단계: 통합 및 테스트 (3주차)
1. 기존 스웜 코디네이터와 통합합니다
2. 구성 옵션을 추가합니다
3. 종합적인 테스트 스위트를 작성합니다
4. 성능 벤치마킹을 수행합니다
5. 문서를 작성합니다

---

## 📊 기대 효과

### 네트워크 샌드박싱
- ✅ **보안**: 에이전트의 무단 네트워크 접근을 방지합니다
- ✅ **컴플라이언스**: 모든 네트워크 요청에 대한 감사 추적을 제공합니다
- ✅ **제어**: 에이전트별 세밀한 네트워크 정책을 제공합니다
- ✅ **가시성**: 네트워크 활동을 실시간으로 모니터링합니다

### React DevTools 통합
- ✅ **모니터링**: 스웜 상태를 실시간으로 시각화합니다
- ✅ **디버깅**: 컴포넌트 수준에서 에이전트를 검사합니다
- ✅ **성능**: 에이전트 실행의 병목을 식별합니다
- ✅ **최적화**: 데이터 기반 성능 개선을 지원합니다

---

## 🎯 성공 지표

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| 네트워크 정책 위반 | 0 | 감사 로그 분석 |
| 대시보드 렌더링 성능 | <16ms | React DevTools 프로파일러 |
| 에이전트 프로파일 수집 오버헤드 | <5% | 벤치마크 비교 |
| 네트워크 요청 지연 | <2ms 추가 | 성능 테스트 |

---

## 📝 구성 예시

### 네트워크 정책 구성
```typescript
// claude-flow.config.ts
export default {
  swarm: {
    networkPolicies: {
      researcher: {
        allowedHosts: ['*.github.com', '*.stackoverflow.com'],
        defaultBehavior: 'prompt'
      },
      coder: {
        allowedHosts: ['registry.npmjs.org', 'pypi.org'],
        defaultBehavior: 'deny'
      },
      analyst: {
        allowedHosts: [],
        defaultBehavior: 'deny' // 완전 샌드박싱
      }
    },
    networkIsolation: {
      mode: 'strict', // 'strict' | 'permissive' | 'audit-only' 중에서 선택
      allowedGlobalHosts: ['api.anthropic.com']
    }
  },
  devTools: {
    enabled: true,
    dashboard: {
      port: 3000,
      enableProfiling: true,
      updateInterval: 1000
    }
  }
};
```

---

*Claude-Flow v2.5.0-alpha.130용 통합 설계*
