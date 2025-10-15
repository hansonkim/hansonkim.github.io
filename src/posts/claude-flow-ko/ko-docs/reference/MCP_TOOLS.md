# Claude Flow MCP Tools 참조

이 문서는 Claude Flow 생태계에서 사용 가능한 112개의 MCP (Model Context Protocol) tool에 대한 포괄적인 참조를 제공합니다.

## 개요

Claude Flow는 두 가지 MCP tool 제공자와 통합됩니다:
- **claude-flow tools**: 87개의 핵심 기능 tool
- **ruv-swarm tools**: 25개의 고급 swarm intelligence tool

모든 tool은 다음 명명 규칙을 따릅니다: `mcp__provider__tool_name`

---

## Claude Flow Tools (87개 tool)

claude-flow tool은 8개 카테고리로 구성되어 종합적인 개발, 조정 및 시스템 관리 기능을 제공합니다.

### Swarm Coordination (12개 tool)

이 tool들은 swarm 초기화, agent 생성 및 조정 작업을 관리합니다.

#### `mcp__claude-flow__swarm_init`
**기능**: 지정된 topology 및 구성으로 새 swarm 초기화
**매개변수**:
- `topology` (string): Swarm topology 타입 - "hierarchical", "mesh", "distributed", "centralized"
- `maxAgents` (number): Swarm의 최대 agent 수 (기본값: 8)
- `strategy` (string): 조정 전략 - "auto", "manual", "adaptive"
- `swarmId` (string, 선택): 사용자 정의 swarm 식별자

**사용 예제**:
```json
{
  "topology": "hierarchical",
  "maxAgents": 12,
  "strategy": "auto",
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__agent_spawn`
**기능**: 특정 역할 및 기능을 가진 새 agent 생성 및 생성
**매개변수**:
- `type` (string): Agent 타입 - "coder", "researcher", "tester", "coordinator", "architect"
- `name` (string, 선택): 사용자 정의 agent 이름
- `swarmId` (string): 대상 swarm 식별자
- `capabilities` (array, 선택): 활성화할 특정 기능

**사용 예제**:
```json
{
  "type": "coder",
  "name": "BackendSpecialist",
  "swarmId": "project-alpha",
  "capabilities": ["nodejs", "database", "api-design"]
}
```

#### `mcp__claude-flow__task_orchestrate`
**기능**: Agent 간 작업 배분 및 실행 조정
**매개변수**:
- `task` (string): 작업 설명
- `strategy` (string): 실행 전략 - "parallel", "sequential", "adaptive"
- `priority` (number): 작업 우선순위 (1-10)
- `swarmId` (string): 대상 swarm 식별자

**사용 예제**:
```json
{
  "task": "Implement user authentication system",
  "strategy": "parallel",
  "priority": 8,
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__swarm_status`
**기능**: 모든 swarm 및 구성 요소의 종합 상태 확인
**매개변수**:
- `swarmId` (string, 선택): 조회할 특정 swarm
- `includeMetrics` (boolean): 성능 metrics 포함

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "includeMetrics": true
}
```

#### `mcp__claude-flow__agent_list`
**기능**: 현재 상태 및 할당과 함께 모든 agent 목록
**매개변수**:
- `status` (string, 선택): 상태별 필터링 - "active", "idle", "offline"
- `type` (string, 선택): Agent 타입별 필터링
- `swarmId` (string, 선택): Swarm별 필터링

**사용 예제**:
```json
{
  "status": "active",
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__agent_metrics`
**기능**: Agent의 상세 성능 metrics 검색
**매개변수**:
- `agentId` (string, 선택): 특정 agent ID
- `timeframe` (string): 시간 기간 - "1h", "24h", "7d", "30d"
- `metrics` (array): 포함할 특정 metrics

**사용 예제**:
```json
{
  "timeframe": "24h",
  "metrics": ["tasks_completed", "success_rate", "avg_response_time"]
}
```

#### `mcp__claude-flow__swarm_monitor`
**기능**: Swarm 활동 및 성능의 실시간 모니터링
**매개변수**:
- `interval` (number): 업데이트 간격 (밀리초)
- `swarmId` (string, 선택): 모니터링할 특정 swarm
- `alerts` (boolean): Alert 알림 활성화

**사용 예제**:
```json
{
  "interval": 5000,
  "swarmId": "project-alpha",
  "alerts": true
}
```

#### `mcp__claude-flow__topology_optimize`
**기능**: 현재 작업량 및 성능 기반으로 swarm topology 최적화
**매개변수**:
- `swarmId` (string): 대상 swarm 식별자
- `criteria` (string): 최적화 기준 - "performance", "cost", "reliability"
- `autoApply` (boolean): 최적화 자동 적용

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "criteria": "performance",
  "autoApply": false
}
```

#### `mcp__claude-flow__load_balance`
**기능**: 사용 가능한 agent에 작업량 균등 분배
**매개변수**:
- `swarmId` (string): 대상 swarm 식별자
- `strategy` (string): 분산 전략 - "round_robin", "least_loaded", "capability_based"
- `tasks` (array): 분배할 작업

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "strategy": "capability_based",
  "tasks": ["task-1", "task-2", "task-3"]
}
```

#### `mcp__claude-flow__coordination_sync`
**기능**: Swarm 내 모든 agent 간 조정 상태 동기화
**매개변수**:
- `swarmId` (string): 대상 swarm 식별자
- `force` (boolean): Agent가 바쁘더라도 강제 동기화

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "force": false
}
```

#### `mcp__claude-flow__swarm_scale`
**기능**: 작업량 수요에 따라 swarm 크기 동적 확장
**매개변수**:
- `swarmId` (string): 대상 swarm 식별자
- `direction` (string): 확장 방향 - "up", "down", "auto"
- `targetSize` (number, 선택): 원하는 agent 수

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "direction": "up",
  "targetSize": 15
}
```

#### `mcp__claude-flow__swarm_destroy`
**기능**: Swarm을 안전하게 종료하고 관련 리소스 정리
**매개변수**:
- `swarmId` (string): 대상 swarm 식별자
- `preserveData` (boolean): 분석을 위해 swarm 데이터 보존
- `graceful` (boolean): Agent가 현재 작업을 완료하도록 허용

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "preserveData": true,
  "graceful": true
}
```

### Neural Networks & AI (15개 tool)

패턴 인식 및 적응형 동작을 위한 고급 AI 및 machine learning 기능.

#### `mcp__claude-flow__neural_status`
**기능**: Neural network 모델 및 훈련 프로세스의 상태 확인
**매개변수**:
- `modelId` (string, 선택): 특정 모델 식별자
- `includeWeights` (boolean): 응답에 모델 가중치 포함

**사용 예제**:
```json
{
  "includeWeights": false
}
```

#### `mcp__claude-flow__neural_train`
**기능**: 조정 패턴 및 작업 결과에 대한 neural network 훈련
**매개변수**:
- `pattern_type` (string): 패턴 타입 - "coordination", "optimization", "prediction"
- `epochs` (number): 훈련 epoch 수
- `data_source` (string): 훈련 데이터 소스
- `swarmId` (string, 선택): 컨텍스트를 위한 관련 swarm

**사용 예제**:
```json
{
  "pattern_type": "coordination",
  "epochs": 100,
  "data_source": "swarm_interactions",
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__neural_patterns`
**기능**: Swarm 동작 및 결과에서 패턴 분석 및 추출
**매개변수**:
- `analysis_type` (string): 분석 타입 - "behavior", "performance", "communication"
- `timeframe` (string): 분석할 시간 기간
- `swarmId` (string, 선택): 대상 swarm

**사용 예제**:
```json
{
  "analysis_type": "behavior",
  "timeframe": "7d",
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__neural_predict`
**기능**: 작업 결과 및 최적 전략 예측
**매개변수**:
- `input_data` (object): 예측을 위한 입력 데이터
- `modelId` (string): 예측에 사용할 모델
- `confidence_threshold` (number): 최소 신뢰 수준

**사용 예제**:
```json
{
  "input_data": {"task_complexity": 7, "agent_count": 5},
  "modelId": "coordination_predictor",
  "confidence_threshold": 0.8
}
```

#### `mcp__claude-flow__model_load`
**기능**: 사전 훈련된 neural network 모델 로드
**매개변수**:
- `modelId` (string): 모델 식별자
- `version` (string, 선택): 특정 모델 버전
- `cache` (boolean): 메모리에 모델 캐시

**사용 예제**:
```json
{
  "modelId": "task_optimizer_v2",
  "version": "1.2.0",
  "cache": true
}
```

#### `mcp__claude-flow__model_save`
**기능**: 현재 neural network 모델 상태 저장
**매개변수**:
- `modelId` (string): 모델 식별자
- `version` (string): 버전 태그
- `metadata` (object): 추가 모델 metadata

**사용 예제**:
```json
{
  "modelId": "task_optimizer_v2",
  "version": "1.3.0",
  "metadata": {"training_date": "2024-01-15", "accuracy": 0.92}
}
```

#### `mcp__claude-flow__wasm_optimize`
**기능**: WebAssembly를 사용하여 neural network 실행 최적화
**매개변수**:
- `modelId` (string): 최적화할 모델
- `optimization_level` (string): 최적화 수준 - "basic", "aggressive", "max"
- `target_platform` (string): 대상 플랫폼 - "browser", "node", "edge"

**사용 예제**:
```json
{
  "modelId": "coordination_predictor",
  "optimization_level": "aggressive",
  "target_platform": "node"
}
```

#### `mcp__claude-flow__inference_run`
**기능**: 로드된 neural network 모델에서 inference 실행
**매개변수**:
- `modelId` (string): 모델 식별자
- `input_data` (object): 입력 데이터
- `batch_size` (number, 선택): Batch 처리 크기

**사용 예제**:
```json
{
  "modelId": "task_classifier",
  "input_data": {"description": "Implement API endpoint", "complexity": "medium"},
  "batch_size": 1
}
```

#### `mcp__claude-flow__pattern_recognize`
**기능**: Agent 동작 및 작업 실행의 패턴 인식
**매개변수**:
- `data_type` (string): 분석할 데이터 타입 - "logs", "metrics", "communications"
- `pattern_types` (array): 찾을 패턴 타입
- `swarmId` (string, 선택): 대상 swarm

**사용 예제**:
```json
{
  "data_type": "communications",
  "pattern_types": ["bottlenecks", "inefficiencies", "optimal_flows"],
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__cognitive_analyze`
**기능**: 의사 결정 프로세스의 인지 분석 수행
**매개변수**:
- `decision_context` (object): 의사 결정의 컨텍스트
- `analysis_depth` (string): 분석 깊이 - "surface", "deep", "comprehensive"
- `include_alternatives` (boolean): 대안 결정 경로 포함

**사용 예제**:
```json
{
  "decision_context": {"task": "architecture_choice", "constraints": ["time", "budget"]},
  "analysis_depth": "deep",
  "include_alternatives": true
}
```

#### `mcp__claude-flow__learning_adapt`
**기능**: 과거 경험으로부터의 학습을 기반으로 동작 적응
**매개변수**:
- `experience_data` (object): 학습할 경험 데이터
- `adaptation_type` (string): 적응 타입 - "strategy", "communication", "resource_allocation"
- `swarmId` (string): 대상 swarm

**사용 예제**:
```json
{
  "experience_data": {"task_type": "api_development", "outcome": "success", "duration": 240},
  "adaptation_type": "strategy",
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__neural_compress`
**기능**: 효율적인 배포를 위해 neural network 모델 압축
**매개변수**:
- `modelId` (string): 압축할 모델
- `compression_ratio` (number): 대상 압축 비율 (0.1~0.9)
- `quality_threshold` (number): 유지할 최소 품질

**사용 예제**:
```json
{
  "modelId": "large_coordination_model",
  "compression_ratio": 0.3,
  "quality_threshold": 0.85
}
```

#### `mcp__claude-flow__ensemble_create`
**기능**: 여러 neural network에서 ensemble 모델 생성
**매개변수**:
- `modelIds` (array): Ensemble에 포함할 모델
- `voting_strategy` (string): Voting 전략 - "majority", "weighted", "soft"
- `ensembleId` (string): 새 ensemble 식별자

**사용 예제**:
```json
{
  "modelIds": ["predictor_1", "predictor_2", "predictor_3"],
  "voting_strategy": "weighted",
  "ensembleId": "task_prediction_ensemble"
}
```

#### `mcp__claude-flow__transfer_learn`
**기능**: 한 도메인에서 다른 도메인으로 transfer learning 적용
**매개변수**:
- `source_model` (string): 소스 모델 식별자
- `target_domain` (string): 대상 도메인
- `freeze_layers` (array): Transfer 중 동결할 layer

**사용 예제**:
```json
{
  "source_model": "general_coordinator",
  "target_domain": "mobile_development",
  "freeze_layers": ["layer1", "layer2"]
}
```

#### `mcp__claude-flow__neural_explain`
**기능**: Neural network 결정 및 예측에 대한 설명 제공
**매개변수**:
- `modelId` (string): 설명할 모델
- `input_data` (object): 예측에 사용된 입력 데이터
- `explanation_type` (string): 설명 타입 - "feature_importance", "decision_path", "counterfactual"

**사용 예제**:
```json
{
  "modelId": "task_prioritizer",
  "input_data": {"urgency": 8, "complexity": 6, "resources": 3},
  "explanation_type": "feature_importance"
}
```

### Memory & Persistence (12개 tool)

Swarm 세션 간 영구 메모리, 상태 및 데이터 관리를 위한 tool.

#### `mcp__claude-flow__memory_usage`
**기능**: Namespace 지원을 통한 영구 메모리에 데이터 저장 및 검색
**매개변수**:
- `action` (string): 작업 타입 - "store", "retrieve", "delete"
- `key` (string): 메모리 키
- `value` (any, store용): 저장할 데이터
- `namespace` (string, 선택): 메모리 namespace
- `type` (string, 선택): 데이터 타입 - "knowledge", "config", "metrics", "state"

**사용 예제**:
```json
{
  "action": "store",
  "key": "project_requirements",
  "value": {"features": ["auth", "dashboard"], "deadline": "2024-02-01"},
  "namespace": "project-alpha",
  "type": "knowledge"
}
```

#### `mcp__claude-flow__memory_search`
**기능**: 패턴 및 필터를 사용하여 메모리 검색
**매개변수**:
- `pattern` (string): 검색 패턴 또는 쿼리
- `namespace` (string, 선택): 검색할 namespace
- `type_filter` (string, 선택): 데이터 타입별 필터링
- `limit` (number, 선택): 반환할 최대 결과 수

**사용 예제**:
```json
{
  "pattern": "authentication",
  "namespace": "project-alpha",
  "type_filter": "knowledge",
  "limit": 10
}
```

#### `mcp__claude-flow__memory_persist`
**기능**: 메모리 데이터를 영구 저장소에 지속
**매개변수**:
- `namespace` (string, 선택): 지속할 특정 namespace
- `compression` (boolean): 압축 활성화
- `backup_existing` (boolean): 지속 전 백업 생성

**사용 예제**:
```json
{
  "namespace": "project-alpha",
  "compression": true,
  "backup_existing": true
}
```

#### `mcp__claude-flow__memory_namespace`
**기능**: 메모리 namespace 관리 (생성, 삭제, 목록)
**매개변수**:
- `action` (string): 작업 타입 - "create", "delete", "list", "info"
- `namespace` (string): Namespace 이름
- `maxSize` (number, 선택): 최대 namespace 크기 (MB)

**사용 예제**:
```json
{
  "action": "create",
  "namespace": "experiment-beta",
  "maxSize": 500
}
```

#### `mcp__claude-flow__memory_backup`
**기능**: 메모리 데이터 백업 생성
**매개변수**:
- `namespace` (string, 선택): 백업할 특정 namespace
- `backup_name` (string): 백업 식별자
- `incremental` (boolean): 증분 백업 생성

**사용 예제**:
```json
{
  "namespace": "project-alpha",
  "backup_name": "milestone_1_complete",
  "incremental": false
}
```

#### `mcp__claude-flow__memory_restore`
**기능**: 백업에서 메모리 데이터 복원
**매개변수**:
- `backup_name` (string): 복원할 백업 식별자
- `namespace` (string, 선택): 대상 namespace
- `merge_strategy` (string): 병합 전략 - "overwrite", "merge", "skip_conflicts"

**사용 예제**:
```json
{
  "backup_name": "milestone_1_complete",
  "namespace": "project-alpha",
  "merge_strategy": "merge"
}
```

#### `mcp__claude-flow__memory_compress`
**기능**: 저장 공간 절약을 위해 메모리 데이터 압축
**매개변수**:
- `namespace` (string, 선택): 압축할 특정 namespace
- `compression_level` (number): 압축 수준 (1-9)
- `preserve_access_patterns` (boolean): 접근 패턴 최적화

**사용 예제**:
```json
{
  "namespace": "archived_projects",
  "compression_level": 7,
  "preserve_access_patterns": false
}
```

#### `mcp__claude-flow__memory_sync`
**기능**: 여러 swarm 인스턴스 간 메모리 동기화
**매개변수**:
- `source_namespace` (string): 소스 namespace
- `target_namespaces` (array): 대상 namespace
- `sync_strategy` (string): 동기화 전략 - "full", "incremental", "selective"

**사용 예제**:
```json
{
  "source_namespace": "master_project",
  "target_namespaces": ["dev_branch", "test_branch"],
  "sync_strategy": "incremental"
}
```

#### `mcp__claude-flow__cache_manage`
**기능**: 자주 접근하는 메모리 데이터를 위한 cache 관리
**매개변수**:
- `action` (string): 작업 타입 - "clear", "optimize", "stats", "configure"
- `cache_size` (number, 선택): Cache 크기 (MB)
- `eviction_policy` (string, 선택): 제거 정책 - "lru", "lfu", "ttl"

**사용 예제**:
```json
{
  "action": "configure",
  "cache_size": 128,
  "eviction_policy": "lru"
}
```

#### `mcp__claude-flow__state_snapshot`
**기능**: 현재 swarm 상태의 snapshot 생성
**매개변수**:
- `swarmId` (string): 대상 swarm 식별자
- `snapshot_name` (string): Snapshot 식별자
- `include_memory` (boolean): 메모리 데이터 포함
- `include_agent_state` (boolean): Agent 상태 포함

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "snapshot_name": "pre_deployment",
  "include_memory": true,
  "include_agent_state": true
}
```

#### `mcp__claude-flow__context_restore`
**기능**: Snapshot에서 swarm 컨텍스트 복원
**매개변수**:
- `snapshot_name` (string): 복원할 snapshot
- `swarmId` (string): 대상 swarm 식별자
- `selective_restore` (array, 선택): 복원할 특정 구성 요소

**사용 예제**:
```json
{
  "snapshot_name": "pre_deployment",
  "swarmId": "project-alpha",
  "selective_restore": ["agent_states", "task_queue"]
}
```

#### `mcp__claude-flow__memory_analytics`
**기능**: 메모리 사용 패턴 및 최적화 기회 분석
**매개변수**:
- `namespace` (string, 선택): 분석할 특정 namespace
- `analysis_type` (string): 분석 타입 - "usage", "patterns", "optimization"
- `timeframe` (string): 분석할 시간 기간

**사용 예제**:
```json
{
  "namespace": "project-alpha",
  "analysis_type": "optimization",
  "timeframe": "30d"
}
```

### Analysis & Monitoring (13개 tool)

시스템 성능을 위한 종합 모니터링, 분석 및 보고 tool.

#### `mcp__claude-flow__performance_report`
**기능**: 상세 성능 보고서 생성
**매개변수**:
- `timeframe` (string): 시간 기간 - "1h", "24h", "7d", "30d"
- `format` (string): 보고서 형식 - "summary", "detailed", "csv", "json"
- `include_predictions` (boolean): 성능 예측 포함
- `swarmId` (string, 선택): 보고할 특정 swarm

**사용 예제**:
```json
{
  "timeframe": "24h",
  "format": "detailed",
  "include_predictions": true,
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__bottleneck_analyze`
**기능**: 성능 병목 현상 식별 및 분석
**매개변수**:
- `component` (string): 분석할 구성 요소 - "agents", "tasks", "communication", "memory"
- `analysis_depth` (string): 분석 깊이 - "quick", "thorough", "comprehensive"
- `swarmId` (string, 선택): 대상 swarm

**사용 예제**:
```json
{
  "component": "communication",
  "analysis_depth": "thorough",
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__token_usage`
**기능**: 작업 전반의 token 소비 추적 및 분석
**매개변수**:
- `operation` (string, 선택): 분석할 특정 작업
- `breakdown_by` (string): 분류 기준 - "agent", "task", "time", "operation"
- `optimize_suggestions` (boolean): 최적화 제안 포함

**사용 예제**:
```json
{
  "operation": "code_generation",
  "breakdown_by": "agent",
  "optimize_suggestions": true
}
```

#### `mcp__claude-flow__task_status`
**기능**: Swarm 전반의 작업에 대한 종합 상태 확인
**매개변수**:
- `taskId` (string, 선택): 특정 작업 식별자
- `swarmId` (string, 선택): Swarm별 필터링
- `status_filter` (string, 선택): 상태별 필터링 - "pending", "in_progress", "completed", "failed"

**사용 예제**:
```json
{
  "swarmId": "project-alpha",
  "status_filter": "in_progress"
}
```

#### `mcp__claude-flow__task_results`
**기능**: 완료된 작업의 상세 결과 및 출력 검색
**매개변수**:
- `taskId` (string): 작업 식별자
- `include_logs` (boolean): 실행 로그 포함
- `include_artifacts` (boolean): 생성된 artifact 포함

**사용 예제**:
```json
{
  "taskId": "task_api_impl_001",
  "include_logs": true,
  "include_artifacts": true
}
```

#### `mcp__claude-flow__benchmark_run`
**기능**: Swarm 작업에 대한 성능 benchmark 실행
**매개변수**:
- `benchmark_type` (string): Benchmark 타입 - "throughput", "latency", "resource_usage", "accuracy"
- `test_duration` (number): 테스트 지속 시간 (초)
- `concurrent_operations` (number): 동시 작업 수

**사용 예제**:
```json
{
  "benchmark_type": "throughput",
  "test_duration": 300,
  "concurrent_operations": 10
}
```

#### `mcp__claude-flow__metrics_collect`
**기능**: 모든 시스템 구성 요소에서 metrics 수집 및 집계
**매개변수**:
- `metrics` (array): 수집할 특정 metrics
- `granularity` (string): 데이터 세분성 - "minute", "hour", "day"
- `retention_period` (number): Metrics 보존 기간 (일)

**사용 예제**:
```json
{
  "metrics": ["cpu_usage", "memory_usage", "task_completion_rate"],
  "granularity": "minute",
  "retention_period": 30
}
```

#### `mcp__claude-flow__trend_analysis`
**기능**: 시간 경과에 따른 성능 및 동작의 추세 분석
**매개변수**:
- `metric` (string): 분석할 metric
- `timeframe` (string): 분석 기간
- `prediction_horizon` (string): 미래 예측 기간
- `alert_thresholds` (object, 선택): Alert 임계값 설정

**사용 예제**:
```json
{
  "metric": "task_completion_rate",
  "timeframe": "7d",
  "prediction_horizon": "3d",
  "alert_thresholds": {"warning": 0.8, "critical": 0.6}
}
```

#### `mcp__claude-flow__cost_analysis`
**기능**: Swarm 작업과 관련된 비용 분석
**매개변수**:
- `cost_type` (string): 비용 타입 - "tokens", "compute", "storage", "total"
- `breakdown_by` (string): 비용 분류 - "swarm", "agent", "task", "operation"
- `budget_tracking` (boolean): 예산 한도 대비 추적

**사용 예제**:
```json
{
  "cost_type": "total",
  "breakdown_by": "swarm",
  "budget_tracking": true
}
```

#### `mcp__claude-flow__quality_assess`
**기능**: 출력 및 프로세스의 품질 평가
**매개변수**:
- `assessment_type` (string): 평가 타입 - "code_quality", "task_completion", "communication"
- `quality_metrics` (array): 평가할 특정 품질 metrics
- `swarmId` (string, 선택): 대상 swarm

**사용 예제**:
```json
{
  "assessment_type": "code_quality",
  "quality_metrics": ["complexity", "maintainability", "test_coverage"],
  "swarmId": "project-alpha"
}
```

#### `mcp__claude-flow__error_analysis`
**기능**: 개선 기회 식별을 위한 오류 및 실패 분석
**매개변수**:
- `error_category` (string, 선택): 집중할 오류 범주
- `timeframe` (string): 분석 기간
- `include_resolution` (boolean): 해결 제안 포함
- `severity_filter` (string, 선택): 심각도별 필터링

**사용 예제**:
```json
{
  "error_category": "communication_failures",
  "timeframe": "7d",
  "include_resolution": true,
  "severity_filter": "high"
}
```

#### `mcp__claude-flow__usage_stats`
**기능**: 사용 통계 및 인사이트 생성
**매개변수**:
- `stat_type` (string): 통계 타입 - "agent_utilization", "feature_usage", "resource_consumption"
- `aggregation` (string): 집계 수준 - "hourly", "daily", "weekly"
- `comparative_analysis` (boolean): 비교 분석 포함

**사용 예제**:
```json
{
  "stat_type": "agent_utilization",
  "aggregation": "daily",
  "comparative_analysis": true
}
```

#### `mcp__claude-flow__health_check`
**기능**: 시스템 구성 요소에 대한 종합 상태 확인 수행
**매개변수**:
- `component` (string, 선택): 확인할 특정 구성 요소
- `check_depth` (string): 확인 깊이 - "basic", "standard", "comprehensive"
- `auto_remediate` (boolean): 탐지된 문제 자동 수정

**사용 예제**:
```json
{
  "component": "memory_system",
  "check_depth": "comprehensive",
  "auto_remediate": false
}
```

### Workflow & Automation (11개 tool)

자동화된 workflow 및 프로세스 생성 및 관리를 위한 tool.

#### `mcp__claude-flow__workflow_create`
**기능**: 새 자동화 workflow 생성
**매개변수**:
- `workflow_name` (string): Workflow 식별자
- `steps` (array): Workflow 단계 정의
- `triggers` (array): Workflow trigger
- `schedule` (string, 선택): 자동 실행을 위한 Cron 일정

**사용 예제**:
```json
{
  "workflow_name": "daily_health_check",
  "steps": [
    {"action": "health_check", "params": {}},
    {"action": "generate_report", "params": {"format": "summary"}}
  ],
  "triggers": ["schedule", "system_alert"],
  "schedule": "0 9 * * *"
}
```

#### `mcp__claude-flow__sparc_mode`
**기능**: SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) workflow 실행
**매개변수**:
- `mode` (string): SPARC 모드 - "specification", "pseudocode", "architecture", "refinement", "completion"
- `project_context` (object): 프로젝트 컨텍스트 및 요구사항
- `previous_artifacts` (array, 선택): 이전 SPARC 단계의 artifact

**사용 예제**:
```json
{
  "mode": "architecture",
  "project_context": {
    "description": "E-commerce API",
    "requirements": ["authentication", "product_catalog", "order_processing"]
  },
  "previous_artifacts": ["specification_doc", "pseudocode_outline"]
}
```

#### `mcp__claude-flow__workflow_execute`
**기능**: 정의된 workflow 실행
**매개변수**:
- `workflow_id` (string): 실행할 workflow 식별자
- `execution_params` (object, 선택): Runtime 매개변수
- `async_execution` (boolean): 비동기 실행

**사용 예제**:
```json
{
  "workflow_id": "daily_health_check",
  "execution_params": {"verbose": true},
  "async_execution": false
}
```

#### `mcp__claude-flow__workflow_export`
**기능**: 공유 또는 백업을 위해 workflow 정의 내보내기
**매개변수**:
- `workflow_ids` (array): 내보낼 workflow
- `format` (string): 내보내기 형식 - "json", "yaml", "xml"
- `include_history` (boolean): 실행 기록 포함

**사용 예제**:
```json
{
  "workflow_ids": ["daily_health_check", "deployment_pipeline"],
  "format": "yaml",
  "include_history": false
}
```

#### `mcp__claude-flow__automation_setup`
**기능**: 자동화 규칙 및 trigger 설정
**매개변수**:
- `rule_name` (string): 자동화 규칙 이름
- `conditions` (array): Trigger 조건
- `actions` (array): 수행할 작업
- `enabled` (boolean): 즉시 규칙 활성화

**사용 예제**:
```json
{
  "rule_name": "auto_scale_on_load",
  "conditions": [{"metric": "cpu_usage", "threshold": 80, "duration": "5m"}],
  "actions": [{"type": "scale_swarm", "direction": "up", "amount": 2}],
  "enabled": true
}
```

#### `mcp__claude-flow__pipeline_create`
**기능**: CI/CD 스타일 pipeline 생성
**매개변수**:
- `pipeline_name` (string): Pipeline 식별자
- `stages` (array): Pipeline 단계
- `parallel_execution` (boolean): 병렬 단계 실행 허용
- `failure_strategy` (string): 실패 처리 - "abort", "continue", "retry"

**사용 예제**:
```json
{
  "pipeline_name": "code_quality_pipeline",
  "stages": [
    {"name": "lint", "commands": ["npm run lint"]},
    {"name": "test", "commands": ["npm test"]},
    {"name": "build", "commands": ["npm run build"]}
  ],
  "parallel_execution": false,
  "failure_strategy": "abort"
}
```

#### `mcp__claude-flow__scheduler_manage`
**기능**: 작업 스케줄링 및 cron job 관리
**매개변수**:
- `action` (string): 작업 타입 - "create", "update", "delete", "list", "status"
- `schedule_id` (string, 선택): Schedule 식별자
- `cron_expression` (string, 선택): Cron schedule 표현식
- `task_definition` (object, 선택): 스케줄할 작업

**사용 예제**:
```json
{
  "action": "create",
  "schedule_id": "weekly_optimization",
  "cron_expression": "0 2 * * 0",
  "task_definition": {"type": "topology_optimize", "swarmId": "production"}
}
```

#### `mcp__claude-flow__trigger_setup`
**기능**: 이벤트 기반 trigger 구성
**매개변수**:
- `trigger_name` (string): Trigger 식별자
- `event_type` (string): 수신할 이벤트 타입
- `conditions` (object): Trigger 조건
- `webhook_url` (string, 선택): 알림을 위한 Webhook endpoint

**사용 예제**:
```json
{
  "trigger_name": "deployment_complete",
  "event_type": "task_completed",
  "conditions": {"task_type": "deployment", "status": "success"},
  "webhook_url": "https://api.example.com/deploy-webhook"
}
```

#### `mcp__claude-flow__workflow_template`
**기능**: 재사용성을 위한 workflow template 관리
**매개변수**:
- `action` (string): 작업 타입 - "create", "update", "delete", "list", "instantiate"
- `template_name` (string): Template 식별자
- `template_definition` (object, 선택): Template 정의
- `parameters` (object, 선택): Instantiation을 위한 template 매개변수

**사용 예제**:
```json
{
  "action": "instantiate",
  "template_name": "api_development_template",
  "parameters": {
    "project_name": "user-service",
    "database_type": "postgresql"
  }
}
```

#### `mcp__claude-flow__batch_process`
**기능**: Batch 처리 작업 실행
**매개변수**:
- `batch_name` (string): Batch 작업 식별자
- `operations` (array): Batch에서 실행할 작업
- `concurrency_limit` (number): 최대 동시 작업 수
- `retry_failed` (boolean): 실패한 작업 재시도

**사용 예제**:
```json
{
  "batch_name": "migrate_projects",
  "operations": [
    {"type": "update_project", "project_id": "proj1"},
    {"type": "update_project", "project_id": "proj2"}
  ],
  "concurrency_limit": 5,
  "retry_failed": true
}
```

#### `mcp__claude-flow__parallel_execute`
**기능**: 여러 작업을 병렬로 실행
**매개변수**:
- `operations` (array): 실행할 작업
- `max_concurrency` (number): 최대 동시 작업 수
- `timeout` (number): 작업당 timeout (초)
- `collect_results` (boolean): 모든 결과 수집 및 반환

**사용 예제**:
```json
{
  "operations": [
    {"tool": "health_check", "params": {"component": "agents"}},
    {"tool": "health_check", "params": {"component": "memory"}},
    {"tool": "health_check", "params": {"component": "neural"}}
  ],
  "max_concurrency": 3,
  "timeout": 30,
  "collect_results": true
}
```

### GitHub Integration (8개 tool)

Repository 관리 및 협업을 위한 종합 GitHub 통합.

#### `mcp__claude-flow__github_repo_analyze`
**기능**: 구조, 패턴 및 인사이트를 위해 GitHub repository 분석
**매개변수**:
- `repo_url` (string): GitHub repository URL
- `analysis_type` (string): 분석 타입 - "structure", "activity", "contributors", "issues", "code_quality"
- `depth` (string): 분석 깊이 - "shallow", "moderate", "deep"
- `include_history` (boolean): Commit 기록 분석 포함

**사용 예제**:
```json
{
  "repo_url": "https://github.com/example/project",
  "analysis_type": "code_quality",
  "depth": "moderate",
  "include_history": true
}
```

#### `mcp__claude-flow__github_pr_manage`
**기능**: GitHub pull request 관리 (생성, 리뷰, 병합)
**매개변수**:
- `action` (string): 작업 타입 - "create", "review", "merge", "close", "list"
- `repo` (string): Repository 식별자
- `pr_number` (number, 선택): Pull request 번호
- `title` (string, 선택): 생성을 위한 PR 제목
- `description` (string, 선택): PR 설명
- `base_branch` (string, 선택): PR의 base branch

**사용 예제**:
```json
{
  "action": "create",
  "repo": "example/project",
  "title": "Add user authentication feature",
  "description": "Implements JWT-based authentication system",
  "base_branch": "main"
}
```

#### `mcp__claude-flow__github_issue_track`
**기능**: GitHub issue 추적 및 관리
**매개변수**:
- `action` (string): 작업 타입 - "create", "update", "close", "list", "assign"
- `repo` (string): Repository 식별자
- `issue_number` (number, 선택): Issue 번호
- `title` (string, 선택): Issue 제목
- `labels` (array, 선택): Issue label
- `assignee` (string, 선택): Issue 할당자

**사용 예제**:
```json
{
  "action": "create",
  "repo": "example/project",
  "title": "Bug: Login form validation",
  "labels": ["bug", "frontend"],
  "assignee": "dev-team"
}
```

#### `mcp__claude-flow__github_release_coord`
**기능**: GitHub release 및 버전 관리 조정
**매개변수**:
- `action` (string): 작업 타입 - "create", "update", "delete", "list"
- `repo` (string): Repository 식별자
- `tag_name` (string, 선택): Release tag
- `release_name` (string, 선택): Release 제목
- `description` (string, 선택): Release 설명
- `draft` (boolean, 선택): Draft로 생성

**사용 예제**:
```json
{
  "action": "create",
  "repo": "example/project",
  "tag_name": "v2.1.0",
  "release_name": "Version 2.1.0 - Feature Release",
  "description": "Added new dashboard and improved performance",
  "draft": false
}
```

#### `mcp__claude-flow__github_workflow_auto`
**기능**: GitHub Actions workflow 자동화
**매개변수**:
- `repo` (string): Repository 식별자
- `workflow_action` (string): 작업 타입 - "trigger", "status", "list", "create"
- `workflow_name` (string, 선택): Workflow 이름
- `inputs` (object, 선택): Workflow 입력
- `branch` (string, 선택): 대상 branch

**사용 예제**:
```json
{
  "repo": "example/project",
  "workflow_action": "trigger",
  "workflow_name": "deploy-to-production",
  "inputs": {"environment": "production"},
  "branch": "main"
}
```

#### `mcp__claude-flow__github_code_review`
**기능**: AI를 사용한 자동화된 코드 리뷰 수행
**매개변수**:
- `repo` (string): Repository 식별자
- `pr_number` (number, 선택): 리뷰할 pull request
- `review_type` (string): 리뷰 타입 - "security", "performance", "style", "comprehensive"
- `auto_comment` (boolean): 발견 사항에 자동으로 댓글 달기
- `review_criteria` (array, 선택): 확인할 특정 기준

**사용 예제**:
```json
{
  "repo": "example/project",
  "pr_number": 42,
  "review_type": "comprehensive",
  "auto_comment": true,
  "review_criteria": ["security_vulnerabilities", "performance_issues", "code_style"]
}
```

#### `mcp__claude-flow__github_sync_coord`
**기능**: GitHub와 로컬 개발 간 동기화 조정
**매개변수**:
- `repos` (array): 동기화할 repository
- `sync_direction` (string): 동기화 방향 - "push", "pull", "bidirectional"
- `conflict_resolution` (string): 충돌 해결 전략
- `sync_branches` (array, 선택): 동기화할 특정 branch

**사용 예제**:
```json
{
  "repos": ["example/project", "example/shared-lib"],
  "sync_direction": "bidirectional",
  "conflict_resolution": "manual_review",
  "sync_branches": ["main", "develop"]
}
```

#### `mcp__claude-flow__github_metrics`
**기능**: GitHub repository metrics 수집 및 분석
**매개변수**:
- `repo` (string): Repository 식별자
- `metrics` (array): 수집할 metrics - "commits", "contributors", "issues", "prs", "releases"
- `timeframe` (string): 분석 기간
- `export_format` (string, 선택): Metrics 내보내기 형식

**사용 예제**:
```json
{
  "repo": "example/project",
  "metrics": ["commits", "issues", "prs"],
  "timeframe": "30d",
  "export_format": "csv"
}
```

### DAA (Dynamic Agent Architecture) (8개 tool)

고급 동적 agent 관리 및 architecture tool.

#### `mcp__claude-flow__daa_agent_create`
**기능**: 적응형 기능을 가진 동적 agent 생성
**매개변수**:
- `agent_type` (string): Agent 타입 또는 기능 프로필
- `adaptation_rules` (array): 동적 적응을 위한 규칙
- `resource_constraints` (object): 리소스 할당 제약
- `lifecycle_policy` (string): Agent 수명 주기 관리 정책

**사용 예제**:
```json
{
  "agent_type": "adaptive_coder",
  "adaptation_rules": [
    {"condition": "high_complexity", "action": "request_specialist"},
    {"condition": "low_workload", "action": "hibernate"}
  ],
  "resource_constraints": {"max_memory": "512MB", "max_cpu": "2_cores"},
  "lifecycle_policy": "auto_scale"
}
```

#### `mcp__claude-flow__daa_capability_match`
**기능**: Agent 기능과 작업 요구사항 매칭
**매개변수**:
- `task_requirements` (object): 작업에 필요한 기능
- `available_agents` (array, 선택): 고려할 agent
- `match_criteria` (string): 매칭 기준 - "exact", "partial", "adaptive"
- `optimization_goal` (string): 최적화 목표 - "speed", "quality", "cost"

**사용 예제**:
```json
{
  "task_requirements": {
    "skills": ["python", "machine_learning", "data_analysis"],
    "experience_level": "senior",
    "availability": "immediate"
  },
  "match_criteria": "adaptive",
  "optimization_goal": "quality"
}
```

#### `mcp__claude-flow__daa_resource_alloc`
**기능**: 수요 기반으로 agent에 리소스 동적 할당
**매개변수**:
- `allocation_strategy` (string): 전략 - "fair", "priority_based", "demand_based", "predictive"
- `resource_pool` (object): 사용 가능한 리소스
- `constraints` (object): 할당 제약
- `monitoring_interval` (number): 리소스 모니터링 간격 (초)

**사용 예제**:
```json
{
  "allocation_strategy": "demand_based",
  "resource_pool": {"cpu_cores": 16, "memory_gb": 64, "storage_gb": 1000},
  "constraints": {"min_cpu_per_agent": 1, "max_memory_per_agent": "8GB"},
  "monitoring_interval": 30
}
```

#### `mcp__claude-flow__daa_lifecycle_manage`
**기능**: 동적 agent 수명 주기 관리 (생성, 확장, 종료)
**매개변수**:
- `lifecycle_action` (string): 작업 - "spawn", "scale", "hibernate", "terminate", "migrate"
- `agent_ids` (array, 선택): 관리할 특정 agent
- `scaling_policy` (object): 확장 정책 및 trigger
- `migration_target` (string, 선택): Agent migration을 위한 대상

**사용 예제**:
```json
{
  "lifecycle_action": "scale",
  "scaling_policy": {
    "scale_up_threshold": 80,
    "scale_down_threshold": 20,
    "cooldown_period": 300
  }
}
```

#### `mcp__claude-flow__daa_communication`
**기능**: Agent 간 동적 통신 패턴 관리
**매개변수**:
- `communication_pattern` (string): 패턴 - "broadcast", "peer_to_peer", "hierarchical", "mesh"
- `message_routing` (object): 메시지 라우팅 구성
- `protocol_adaptation` (boolean): Protocol 적응 활성화
- `bandwidth_management` (object): Bandwidth 할당 규칙

**사용 예제**:
```json
{
  "communication_pattern": "mesh",
  "message_routing": {"priority_queues": true, "load_balancing": true},
  "protocol_adaptation": true,
  "bandwidth_management": {"max_per_agent": "10Mbps", "priority_levels": 3}
}
```

#### `mcp__claude-flow__daa_consensus`
**기능**: 분산 의사 결정을 위한 consensus 메커니즘 구현
**매개변수**:
- `consensus_algorithm` (string): 알고리즘 - "raft", "byzantine", "proof_of_stake", "democratic"
- `decision_topic` (string): Consensus가 필요한 주제
- `voting_power` (object, 선택): Voting power 분배
- `timeout_seconds` (number): Consensus timeout

**사용 예제**:
```json
{
  "consensus_algorithm": "democratic",
  "decision_topic": "architecture_choice",
  "voting_power": {"senior_agents": 2, "junior_agents": 1},
  "timeout_seconds": 120
}
```

#### `mcp__claude-flow__daa_fault_tolerance`
**기능**: Fault tolerance 및 복구 메커니즘 구현
**매개변수**:
- `fault_detection` (object): Fault 탐지 구성
- `recovery_strategy` (string): 복구 전략 - "restart", "migrate", "replicate", "degrade"
- `health_monitoring` (object): 상태 모니터링 설정
- `backup_agents` (number): 유지할 백업 agent 수

**사용 예제**:
```json
{
  "fault_detection": {"heartbeat_interval": 10, "failure_threshold": 3},
  "recovery_strategy": "migrate",
  "health_monitoring": {"check_interval": 30, "metrics": ["cpu", "memory", "response_time"]},
  "backup_agents": 2
}
```

#### `mcp__claude-flow__daa_optimization`
**기능**: 성능 및 효율성을 위해 동적 agent architecture 최적화
**매개변수**:
- `optimization_target` (string): 대상 - "performance", "cost", "reliability", "energy"
- `constraints` (object): 최적화 제약
- `optimization_algorithm` (string): 사용할 알고리즘
- `continuous_optimization` (boolean): 지속적인 최적화 활성화

**사용 예제**:
```json
{
  "optimization_target": "performance",
  "constraints": {"max_cost": 1000, "min_reliability": 0.99},
  "optimization_algorithm": "genetic",
  "continuous_optimization": true
}
```

### System & Utilities (8개 tool)

핵심 시스템 관리 및 유틸리티 기능.

#### `mcp__claude-flow__terminal_execute`
**기능**: 안전 제어를 통한 터미널 명령어 실행
**매개변수**:
- `command` (string): 실행할 명령어
- `working_directory` (string, 선택): 작업 디렉토리
- `timeout` (number, 선택): 실행 timeout (초)
- `capture_output` (boolean): 명령어 출력 캡처
- `environment_vars` (object, 선택): Environment 변수

**사용 예제**:
```json
{
  "command": "npm test",
  "working_directory": "/path/to/project",
  "timeout": 300,
  "capture_output": true,
  "environment_vars": {"NODE_ENV": "test"}
}
```

#### `mcp__claude-flow__config_manage`
**기능**: 시스템 구성 설정 관리
**매개변수**:
- `action` (string): 작업 - "get", "set", "update", "delete", "list", "backup", "restore"
- `config_key` (string, 선택): 구성 키
- `config_value` (any, 선택): 구성 값
- `namespace` (string, 선택): 구성 namespace

**사용 예제**:
```json
{
  "action": "set",
  "config_key": "swarm.default_topology",
  "config_value": "hierarchical",
  "namespace": "system"
}
```

#### `mcp__claude-flow__features_detect`
**기능**: 사용 가능한 기능 및 성능 탐지
**매개변수**:
- `component` (string, 선택): 확인할 특정 구성 요소
- `detailed_info` (boolean): 상세 기능 정보 포함
- `compatibility_check` (boolean): 기능 호환성 확인

**사용 예제**:
```json
{
  "component": "neural_networks",
  "detailed_info": true,
  "compatibility_check": true
}
```

#### `mcp__claude-flow__security_scan`
**기능**: 시스템 구성 요소에 대한 보안 스캔 수행
**매개변수**:
- `scan_type` (string): 스캔 타입 - "vulnerability", "compliance", "access_control", "data_integrity"
- `scope` (string): 스캔 범위 - "system", "agents", "communications", "storage"
- `severity_threshold` (string): 보고할 최소 심각도
- `remediation_suggestions` (boolean): Remediation 제안 포함

**사용 예제**:
```json
{
  "scan_type": "vulnerability",
  "scope": "system",
  "severity_threshold": "medium",
  "remediation_suggestions": true
}
```

#### `mcp__claude-flow__backup_create`
**기능**: 시스템 백업 생성
**매개변수**:
- `backup_type` (string): 백업 타입 - "full", "incremental", "differential"
- `components` (array): 백업할 구성 요소
- `compression` (boolean): 압축 활성화
- `encryption` (boolean): 암호화 활성화
- `retention_days` (number): 백업 보존 기간

**사용 예제**:
```json
{
  "backup_type": "incremental",
  "components": ["memory", "configs", "agent_states"],
  "compression": true,
  "encryption": true,
  "retention_days": 30
}
```

#### `mcp__claude-flow__restore_system`
**기능**: 백업에서 시스템 복원
**매개변수**:
- `backup_id` (string): 복원할 백업 식별자
- `restore_components` (array): 복원할 구성 요소
- `verification` (boolean): 복원 전 백업 무결성 확인
- `rollback_plan` (boolean): 복원 전 rollback 지점 생성

**사용 예제**:
```json
{
  "backup_id": "backup_2024_01_15_001",
  "restore_components": ["memory", "configs"],
  "verification": true,
  "rollback_plan": true
}
```

#### `mcp__claude-flow__log_analysis`
**기능**: 인사이트 및 문제를 위한 시스템 로그 분석
**매개변수**:
- `log_source` (string): 로그 소스 - "system", "agents", "tasks", "communications"
- `analysis_type` (string): 분석 타입 - "errors", "performance", "patterns", "anomalies"
- `timeframe` (string): 분석할 시간 기간
- `export_results` (boolean): 분석 결과 내보내기

**사용 예제**:
```json
{
  "log_source": "agents",
  "analysis_type": "errors",
  "timeframe": "24h",
  "export_results": true
}
```

#### `mcp__claude-flow__diagnostic_run`
**기능**: 종합 시스템 진단 실행
**매개변수**:
- `diagnostic_level` (string): 진단 수준 - "quick", "standard", "comprehensive"
- `components` (array, 선택): 진단할 특정 구성 요소
- `include_recommendations` (boolean): 개선 권장사항 포함
- `auto_fix` (boolean): 탐지된 문제 자동 수정

**사용 예제**:
```json
{
  "diagnostic_level": "comprehensive",
  "components": ["memory", "agents", "neural_networks"],
  "include_recommendations": true,
  "auto_fix": false
}
```

---

## Ruv-Swarm Tools (25개 tool)

ruv-swarm tool은 고급 swarm intelligence, 분산 컴퓨팅 및 협업 AI 기능을 제공합니다. 모든 ruv-swarm tool은 `mcp__ruv-swarm__` 접두사를 사용합니다.

### Core Swarm Intelligence (8개 tool)

#### `mcp__ruv-swarm__memory_usage`
**기능**: Swarm network 전반의 고급 분산 메모리 관리
**매개변수**:
- `action` (string): 작업 타입 - "store", "retrieve", "sync", "replicate", "compress"
- `key` (string): 계층적 지원이 있는 메모리 키
- `value` (any, store용): 자동 직렬화로 저장할 데이터
- `namespace` (string, 선택): 격리를 위한 메모리 namespace
- `replication_factor` (number, 선택): 노드 간 replica 수
- `consistency_level` (string, 선택): Consistency 수준 - "eventual", "strong", "bounded"

**사용 예제**:
```json
{
  "action": "store",
  "key": "distributed/project_state",
  "value": {"phase": "implementation", "completion": 0.75},
  "namespace": "project-alpha",
  "replication_factor": 3,
  "consistency_level": "strong"
}
```

#### `mcp__ruv-swarm__swarm_monitor`
**기능**: 분산 swarm 작업의 실시간 모니터링
**매개변수**:
- `monitoring_mode` (string): 모드 - "realtime", "batch", "event_driven"
- `metrics` (array): 모니터링할 metrics - "performance", "health", "communication", "resource_usage"
- `alert_thresholds` (object): Alert 임계값 구성
- `dashboard_update` (boolean): 모니터링 대시보드 업데이트

**사용 예제**:
```json
{
  "monitoring_mode": "realtime",
  "metrics": ["performance", "health", "communication"],
  "alert_thresholds": {"cpu_usage": 80, "memory_usage": 75},
  "dashboard_update": true
}
```

#### `mcp__ruv-swarm__task_orchestrate`
**기능**: 지능형 agent 할당을 통한 고급 작업 오케스트레이션
**매개변수**:
- `orchestration_strategy` (string): 전략 - "capability_based", "load_balanced", "priority_weighted", "ml_optimized"
- `task_graph` (object): 작업 dependency graph
- `resource_constraints` (object): 리소스 할당 제약
- `optimization_goals` (array): 목표 - "speed", "quality", "cost", "energy_efficiency"

**사용 예제**:
```json
{
  "orchestration_strategy": "ml_optimized",
  "task_graph": {
    "nodes": ["research", "design", "implement", "test"],
    "edges": [["research", "design"], ["design", "implement"], ["implement", "test"]]
  },
  "resource_constraints": {"max_parallel_tasks": 5, "memory_limit": "16GB"},
  "optimization_goals": ["speed", "quality"]
}
```

#### `mcp__ruv-swarm__neural_train`
**기능**: Swarm 노드 전반의 분산 neural network 훈련
**매개변수**:
- `training_mode` (string): 모드 - "federated", "distributed", "ensemble", "transfer"
- `model_architecture` (object): Neural network architecture 정의
- `training_data` (string): 훈련 데이터 소스 또는 식별자
- `hyperparameters` (object): 훈련 hyperparameter
- `convergence_criteria` (object): 훈련 중단 조건

**사용 예제**:
```json
{
  "training_mode": "federated",
  "model_architecture": {"type": "transformer", "layers": 12, "hidden_size": 768},
  "training_data": "swarm_collaboration_logs",
  "hyperparameters": {"learning_rate": 0.001, "batch_size": 32},
  "convergence_criteria": {"min_accuracy": 0.95, "max_epochs": 100}
}
```

#### `mcp__ruv-swarm__consensus_vote`
**기능**: 분산 consensus voting 메커니즘 구현
**매개변수**:
- `vote_type` (string): Vote 타입 - "simple_majority", "weighted", "byzantine_tolerant", "proof_of_stake"
- `proposal` (object): 제안 세부사항 및 옵션
- `voting_power` (object, 선택): Voting 가중치 분배
- `quorum_threshold` (number): 유효한 투표를 위한 최소 참여
- `timeout_duration` (number): Vote timeout (초)

**사용 예제**:
```json
{
  "vote_type": "weighted",
  "proposal": {
    "id": "architecture_decision_001",
    "description": "Choose database architecture",
    "options": ["PostgreSQL", "MongoDB", "Hybrid"]
  },
  "voting_power": {"senior_agents": 2.0, "junior_agents": 1.0},
  "quorum_threshold": 0.67,
  "timeout_duration": 300
}
```

#### `mcp__ruv-swarm__agent_spawn`
**기능**: 적응형 기능을 가진 지능형 agent 생성
**매개변수**:
- `agent_template` (string): Agent template 또는 타입
- `specialization` (array): Agent 전문화 및 스킬
- `autonomy_level` (string): 자율성 수준 - "supervised", "semi_autonomous", "fully_autonomous"
- `learning_enabled` (boolean): 지속적인 학습 활성화
- `collaboration_preferences` (object): 협업 설정

**사용 예제**:
```json
{
  "agent_template": "adaptive_researcher",
  "specialization": ["data_analysis", "pattern_recognition", "report_generation"],
  "autonomy_level": "semi_autonomous",
  "learning_enabled": true,
  "collaboration_preferences": {"preferred_team_size": 3, "communication_style": "structured"}
}
```

#### `mcp__ruv-swarm__swarm_status`
**기능**: 예측 분석이 포함된 종합 swarm 상태
**매개변수**:
- `status_depth` (string): 상태 깊이 - "overview", "detailed", "comprehensive", "predictive"
- `include_predictions` (boolean): 미래 상태 예측 포함
- `health_assessment` (boolean): 상태 평가 수행
- `performance_analysis` (boolean): 성능 분석 포함
- `export_format` (string, 선택): 내보내기 형식 - "json", "dashboard", "report"

**사용 예제**:
```json
{
  "status_depth": "comprehensive",
  "include_predictions": true,
  "health_assessment": true,
  "performance_analysis": true,
  "export_format": "dashboard"
}
```

#### `mcp__ruv-swarm__collective_intelligence`
**기능**: 문제 해결을 위한 집단 지능 활용
**매개변수**:
- `intelligence_mode` (string): 모드 - "aggregated", "emergent", "collective_reasoning", "wisdom_of_crowds"
- `problem_context` (object): 문제 정의 및 컨텍스트
- `participation_criteria` (object): Agent 참여 요구사항
- `synthesis_method` (string): 인사이트 결합 방법
- `confidence_weighting` (boolean): 신뢰도별 기여도 가중치

**사용 예제**:
```json
{
  "intelligence_mode": "collective_reasoning",
  "problem_context": {
    "domain": "software_architecture",
    "complexity": "high",
    "constraints": ["scalability", "maintainability", "cost"]
  },
  "participation_criteria": {"min_experience": "intermediate", "domain_expertise": true},
  "synthesis_method": "weighted_consensus",
  "confidence_weighting": true
}
```

### Advanced Coordination (7개 tool)

#### `mcp__ruv-swarm__dynamic_topology`
**기능**: 성능 기반으로 swarm topology 동적 적응
**매개변수**:
- `adaptation_trigger` (string): Trigger - "performance_threshold", "workload_change", "failure_detection", "optimization_cycle"
- `topology_options` (array): 사용 가능한 topology 구성
- `transition_strategy` (string): 전환 전략 - "gradual", "immediate", "rolling"
- `performance_metrics` (object): 최적화할 metrics

**사용 예제**:
```json
{
  "adaptation_trigger": "performance_threshold",
  "topology_options": ["hierarchical", "mesh", "star", "hybrid"],
  "transition_strategy": "gradual",
  "performance_metrics": {"latency": 100, "throughput": 1000, "error_rate": 0.01}
}
```

#### `mcp__ruv-swarm__resource_federation`
**기능**: 여러 swarm 인스턴스 간 리소스 연합
**매개변수**:
- `federation_policy` (string): 정책 - "fair_share", "priority_based", "market_based", "need_based"
- `resource_types` (array): 연합할 리소스 - "compute", "memory", "storage", "bandwidth"
- `sharing_constraints` (object): 리소스 공유 제약
- `billing_model` (string, 선택): 리소스 사용량에 대한 과금 모델

**사용 예제**:
```json
{
  "federation_policy": "priority_based",
  "resource_types": ["compute", "memory"],
  "sharing_constraints": {"max_share_percentage": 0.7, "reserved_for_local": 0.3},
  "billing_model": "usage_based"
}
```

#### `mcp__ruv-swarm__load_prediction`
**기능**: 사전 확장을 위한 미래 부하 패턴 예측
**매개변수**:
- `prediction_horizon` (string): 예측 기간 - "minutes", "hours", "days", "weeks"
- `prediction_model` (string): 모델 타입 - "linear", "seasonal", "ml_based", "hybrid"
- `historical_data_period` (string): 사용할 과거 데이터
- `confidence_intervals` (boolean): 예측 신뢰 구간 포함

**사용 예제**:
```json
{
  "prediction_horizon": "hours",
  "prediction_model": "ml_based",
  "historical_data_period": "30d",
  "confidence_intervals": true
}
```

#### `mcp__ruv-swarm__fault_recovery`
**기능**: 고급 fault 탐지 및 복구 구현
**매개변수**:
- `recovery_strategy` (string): 전략 - "restart", "migrate", "replicate", "degrade_gracefully", "self_heal"
- `fault_detection_sensitivity` (string): 민감도 - "low", "medium", "high", "adaptive"
- `recovery_timeout` (number): 복구 시도의 최대 시간
- `cascade_prevention` (boolean): Cascade 장애 방지

**사용 예제**:
```json
{
  "recovery_strategy": "self_heal",
  "fault_detection_sensitivity": "adaptive",
  "recovery_timeout": 120,
  "cascade_prevention": true
}
```

#### `mcp__ruv-swarm__communication_optimize`
**기능**: 통신 패턴 및 protocol 최적화
**매개변수**:
- `optimization_target` (string): 대상 - "latency", "bandwidth", "reliability", "energy"
- `communication_patterns` (array): 현재 통신 패턴
- `protocol_adaptation` (boolean): Protocol 적응 활성화
- `compression_strategies` (array): 사용 가능한 압축 방법

**사용 예제**:
```json
{
  "optimization_target": "latency",
  "communication_patterns": ["broadcast", "peer_to_peer", "hierarchical"],
  "protocol_adaptation": true,
  "compression_strategies": ["gzip", "lz4", "adaptive"]
}
```

#### `mcp__ruv-swarm__knowledge_synthesis`
**기능**: 분산 agent에서 지식 합성
**매개변수**:
- `synthesis_method` (string): 방법 - "weighted_average", "expert_consensus", "evidence_based", "emergent_patterns"
- `knowledge_domains` (array): 지식을 합성할 도메인
- `conflict_resolution` (string): 충돌하는 정보 해결 방법
- `quality_filtering` (object): 지식 소스의 품질 필터

**사용 예제**:
```json
{
  "synthesis_method": "evidence_based",
  "knowledge_domains": ["technical_specifications", "user_requirements", "best_practices"],
  "conflict_resolution": "weighted_voting",
  "quality_filtering": {"min_confidence": 0.8, "source_credibility": "high"}
}
```

#### `mcp__ruv-swarm__adaptive_learning`
**기능**: Swarm 전반의 적응형 학습 활성화
**매개변수**:
- `learning_mode` (string): 모드 - "continuous", "episodic", "reinforcement", "meta_learning"
- `knowledge_sharing` (boolean): Agent 간 지식 공유 활성화
- `learning_objectives` (array): 특정 학습 목표
- `adaptation_rate` (string): 적응 속도 - "slow", "medium", "fast", "adaptive"

**사용 예제**:
```json
{
  "learning_mode": "continuous",
  "knowledge_sharing": true,
  "learning_objectives": ["task_efficiency", "collaboration_patterns", "error_reduction"],
  "adaptation_rate": "adaptive"
}
```

### Analytics & Intelligence (5개 tool)

#### `mcp__ruv-swarm__behavioral_analysis`
**기능**: Agent 및 swarm 행동 패턴 분석
**매개변수**:
- `analysis_scope` (string): 범위 - "individual_agents", "agent_groups", "entire_swarm", "cross_swarm"
- `behavioral_dimensions` (array): 분석할 차원
- `pattern_detection` (boolean): 행동 패턴 탐지
- `anomaly_detection` (boolean): 비정상 행동 탐지

**사용 예제**:
```json
{
  "analysis_scope": "entire_swarm",
  "behavioral_dimensions": ["communication_frequency", "task_selection", "collaboration_preferences"],
  "pattern_detection": true,
  "anomaly_detection": true
}
```

#### `mcp__ruv-swarm__performance_prediction`
**기능**: 다양한 조건에서 swarm 성능 예측
**매개변수**:
- `prediction_scenarios` (array): 성능을 예측할 시나리오
- `performance_metrics` (array): 예측할 metrics
- `model_complexity` (string): 예측 모델 복잡도
- `uncertainty_quantification` (boolean): 불확실성 추정 포함

**사용 예제**:
```json
{
  "prediction_scenarios": [
    {"agent_count": 10, "task_complexity": "high", "load": "peak"},
    {"agent_count": 15, "task_complexity": "medium", "load": "normal"}
  ],
  "performance_metrics": ["throughput", "latency", "success_rate"],
  "model_complexity": "advanced",
  "uncertainty_quantification": true
}
```

#### `mcp__ruv-swarm__sentiment_analysis`
**기능**: Swarm 통신 내 감정 및 사기 분석
**매개변수**:
- `analysis_timeframe` (string): 감정 분석 기간
- `communication_channels` (array): 분석할 채널
- `sentiment_dimensions` (array): 추적할 감정의 차원
- `trend_analysis` (boolean): 감정 추세 분석 포함

**사용 예제**:
```json
{
  "analysis_timeframe": "7d",
  "communication_channels": ["task_coordination", "peer_feedback", "status_updates"],
  "sentiment_dimensions": ["confidence", "satisfaction", "stress", "collaboration_quality"],
  "trend_analysis": true
}
```

#### `mcp__ruv-swarm__insight_generation`
**기능**: Swarm 데이터 및 상호작용에서 인사이트 생성
**매개변수**:
- `insight_categories` (array): 생성할 인사이트 범주
- `data_sources` (array): 분석할 데이터 소스
- `insight_depth` (string): 분석 깊이
- `actionable_recommendations` (boolean): 실행 가능한 권장사항 포함

**사용 예제**:
```json
{
  "insight_categories": ["efficiency_improvements", "collaboration_optimization", "resource_utilization"],
  "data_sources": ["task_logs", "communication_history", "performance_metrics"],
  "insight_depth": "comprehensive",
  "actionable_recommendations": true
}
```

#### `mcp__ruv-swarm__predictive_maintenance`
**기능**: Swarm 시스템 문제 예측 및 방지
**매개변수**:
- `prediction_horizon` (string): 얼마나 앞서 예측할지
- `maintenance_categories` (array): 예측할 유지보수 범주
- `alert_thresholds` (object): 유지보수 alert 임계값
- `automated_actions` (boolean): 자동 예방 조치 활성화

**사용 예제**:
```json
{
  "prediction_horizon": "weeks",
  "maintenance_categories": ["agent_performance_degradation", "resource_exhaustion", "communication_bottlenecks"],
  "alert_thresholds": {"degradation_rate": 0.1, "resource_usage": 0.9},
  "automated_actions": true
}
```

### Specialized Operations (5개 tool)

#### `mcp__ruv-swarm__quantum_simulate`
**기능**: 최적화 문제를 위한 quantum computing 알고리즘 시뮬레이션
**매개변수**:
- `algorithm_type` (string): Quantum 알고리즘 - "vqe", "qaoa", "grover", "shor", "custom"
- `problem_encoding` (object): Quantum 시뮬레이션을 위한 문제 인코딩
- `qubit_count` (number): 시뮬레이션할 qubit 수
- `noise_model` (string, 선택): 적용할 quantum noise 모델

**사용 예제**:
```json
{
  "algorithm_type": "qaoa",
  "problem_encoding": {"type": "max_cut", "graph_nodes": 10},
  "qubit_count": 16,
  "noise_model": "depolarizing"
}
```

#### `mcp__ruv-swarm__blockchain_consensus`
**기능**: 중요한 결정을 위한 blockchain 기반 consensus 구현
**매개변수**:
- `consensus_mechanism` (string): 메커니즘 - "proof_of_work", "proof_of_stake", "delegated_pos", "practical_byzantine"
- `block_parameters` (object): Blockchain block 매개변수
- `validator_selection` (string): Validator 선택 방법
- `finality_requirements` (object): Transaction finality 요구사항

**사용 예제**:
```json
{
  "consensus_mechanism": "proof_of_stake",
  "block_parameters": {"block_time": 30, "max_transactions": 100},
  "validator_selection": "stake_weighted",
  "finality_requirements": {"confirmations": 6, "time_threshold": 180}
}
```

#### `mcp__ruv-swarm__evolutionary_optimize`
**기능**: Swarm 최적화를 위한 진화 알고리즘 사용
**매개변수**:
- `optimization_target` (string): 최적화할 대상
- `population_size` (number): 진화를 위한 population 크기
- `mutation_rate` (number): 유전 알고리즘의 mutation 비율
- `selection_pressure` (string): Selection pressure 수준
- `termination_criteria` (object): 진화를 멈출 시기

**사용 예제**:
```json
{
  "optimization_target": "task_allocation_strategy",
  "population_size": 50,
  "mutation_rate": 0.1,
  "selection_pressure": "moderate",
  "termination_criteria": {"max_generations": 100, "convergence_threshold": 0.01}
}
```

#### `mcp__ruv-swarm__swarm_robotics`
**기능**: 물리적 또는 가상 로봇 swarm 조정
**매개변수**:
- `coordination_mode` (string): 모드 - "centralized", "distributed", "hybrid", "emergent"
- `robot_capabilities` (array): 개별 로봇의 기능
- `formation_control` (object): Formation 제어 매개변수
- `path_planning` (string): 경로 계획 알고리즘

**사용 예제**:
```json
{
  "coordination_mode": "distributed",
  "robot_capabilities": ["movement", "sensing", "communication", "manipulation"],
  "formation_control": {"formation_type": "line", "spacing": 2.0, "flexibility": 0.5},
  "path_planning": "rrt_star"
}
```

#### `mcp__ruv-swarm__bio_inspired_algorithms`
**기능**: Swarm 동작을 위한 생체 모방 알고리즘 구현
**매개변수**:
- `algorithm_type` (string): 알고리즘 - "ant_colony", "particle_swarm", "bee_algorithm", "flocking", "stigmergy"
- `bio_parameters` (object): 알고리즘의 생물학적 매개변수
- `adaptation_rules` (array): 알고리즘 적응을 위한 규칙
- `emergence_detection` (boolean): 창발적 행동 탐지

**사용 예제**:
```json
{
  "algorithm_type": "ant_colony",
  "bio_parameters": {"pheromone_evaporation": 0.1, "alpha": 1.0, "beta": 2.0},
  "adaptation_rules": [
    {"condition": "stagnation", "action": "increase_exploration"},
    {"condition": "convergence", "action": "maintain_exploitation"}
  ],
  "emergence_detection": true
}
```

---

## 사용 패턴 및 모범 사례

### Batch 작업

많은 claude-flow tool이 효율성을 위해 batch 작업을 지원합니다:

```json
{
  "tool": "mcp__claude-flow__parallel_execute",
  "params": {
    "operations": [
      {"tool": "memory_usage", "params": {"action": "retrieve", "key": "project_status"}},
      {"tool": "agent_metrics", "params": {"timeframe": "1h"}},
      {"tool": "performance_report", "params": {"format": "summary"}}
    ],
    "max_concurrency": 3
  }
}
```

### 오류 처리

모든 tool은 구조화된 오류 응답을 제공합니다:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Swarm with ID 'project-alpha' not found",
    "details": {"swarmId": "project-alpha", "available_swarms": ["project-beta"]}
  }
}
```

### Tool Chaining

Tool을 복잡한 workflow를 위해 chain할 수 있습니다:

```json
[
  {"tool": "mcp__claude-flow__swarm_init", "params": {"topology": "hierarchical"}},
  {"tool": "mcp__claude-flow__agent_spawn", "params": {"type": "coordinator"}},
  {"tool": "mcp__ruv-swarm__neural_train", "params": {"pattern_type": "coordination"}}
]
```

### 성능 최적화

- 동시 작업을 위해 `mcp__claude-flow__parallel_execute` 사용
- 자주 접근하는 데이터를 위해 memory tool로 caching 활용
- Analytics tool로 성능 모니터링
- 리소스 요구사항을 예측하기 위해 예측 tool 사용

### 보안 고려사항

- 모든 tool은 multi-tenant 환경을 위한 namespace 격리 지원
- 민감한 데이터는 메모리 저장소에 자동으로 암호화됨
- 접근 제어는 MCP protocol 수준에서 적용됨
- 모든 tool 실행에 대한 감사 추적이 유지됨

---

## 통합 예제

### Full-Stack Development Swarm

```json
{
  "workflow": [
    {
      "tool": "mcp__claude-flow__swarm_init",
      "params": {"topology": "hierarchical", "maxAgents": 8}
    },
    {
      "tool": "mcp__claude-flow__agent_spawn",
      "params": {"type": "architect", "specialization": ["system_design"]}
    },
    {
      "tool": "mcp__claude-flow__agent_spawn",
      "params": {"type": "coder", "specialization": ["backend"]}
    },
    {
      "tool": "mcp__claude-flow__agent_spawn",
      "params": {"type": "coder", "specialization": ["frontend"]}
    },
    {
      "tool": "mcp__claude-flow__task_orchestrate",
      "params": {"task": "Build e-commerce platform", "strategy": "parallel"}
    }
  ]
}
```

### AI 연구 협업

```json
{
  "workflow": [
    {
      "tool": "mcp__ruv-swarm__collective_intelligence",
      "params": {"intelligence_mode": "collective_reasoning", "problem_context": {"domain": "machine_learning"}}
    },
    {
      "tool": "mcp__ruv-swarm__neural_train",
      "params": {"training_mode": "federated", "model_architecture": {"type": "transformer"}}
    },
    {
      "tool": "mcp__claude-flow__performance_report",
      "params": {"timeframe": "24h", "include_predictions": true}
    }
  ]
}
```

## 시작하기

1. **MCP Tools 설치**: 메인 문서의 설치 가이드 참조
2. **권한 구성**: Claude 구성에서 적절한 권한 설정
3. **기본 Tool로 시작**: `swarm_status` 및 `memory_usage`와 같은 간단한 tool로 시작
4. **Workflow 구축**: Tool을 자동화된 workflow로 결합
5. **모니터링 및 최적화**: Analytics tool을 사용하여 성능 최적화

자세한 설정 지침은 Integration Guide를 참조하세요.

---

*이 문서는 자동으로 생성 및 업데이트됩니다. 최종 업데이트: 2024-08-13*
