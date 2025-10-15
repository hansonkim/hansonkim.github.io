# Training Pipeline - 실제 코드 실행만

## 개요
Claude Flow Training Pipeline은 이제 **실제 코드 실행만 독점적으로 사용**합니다. 시뮬레이션 모드는 없습니다 - 모든 training이 실제 코드 파일에서 실제 npm 테스트를 실행하여 진정한 학습과 개선을 제공합니다.

## 변경사항

### 이전 (v1 - 시뮬레이션 모드)
- `Math.random()`을 사용하여 테스트 결과 시뮬레이션
- 실제 코드 실행 없음
- 현실을 반영하지 않는 인위적인 점수
- 무작위 데이터로부터 학습

### 현재 (v2 - 실제 실행만)
- 실제 코드로 실제 JavaScript 파일 생성
- 실제 `npm install` 및 `npm test` 명령어 실행
- 실제 Jest 테스트 실행
- 진정한 테스트 결과로부터 학습
- Agent 성능의 실제 개선 표시

## 작동 방식

### 1. 작업 생성
Pipeline이 `.claude-flow/training/real-tasks/`에 **실제 코드 파일** 생성:

```javascript
// 예제: 이메일 검증 함수
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### 2. 전략 테스트
세 가지 전략이 코드를 다르게 수정:
- **Conservative**: 추가 검증 추가 (더 안정적, 느림)
- **Balanced**: 원본 코드 유지 (좋은 균형)
- **Aggressive**: 검증 감소 (빠름, 위험)

### 3. 실제 실행
각 전략 variant는 다음을 사용하여 테스트됨:
```bash
npm install  # Jest 및 dependencies 설치
npm test     # 실제 테스트 실행
npm run lint # 코드 품질 확인
```

### 4. 결과로부터 학습
시스템이 **실제 테스트 결과**로부터 학습:
- 테스트 통과/실패율
- 실제 실행 시간
- 실제 오류 메시지
- 성능 metrics

## 사용법

### Training 실행
```bash
# 항상 실제 코드로 실행 - 시뮬레이션 옵션 없음
./claude-flow train-pipeline run

# 옵션
./claude-flow train-pipeline run --complexity hard --iterations 5
```

### 상태 확인
```bash
./claude-flow train-pipeline status

# 출력에 실제 metrics 표시:
📊 Training Pipeline Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Strategy Profiles:
   conservative:
     Success Rate: 40.9%    # 실제 테스트 통과율
     Average Score: 40.25   # 실제 결과 기반
     Execution Time: 1633ms # 실제 npm test 시간
     Real Executions: 4     # 실제 실행 수
```

### 성능 검증
```bash
./claude-flow train-pipeline validate

# 현재 실제 성능 표시:
📊 Current Performance:
   Success Rate: 43.1%      # 실제 성공률
   Avg Execution Time: 1567ms # 실제 실행 시간
   Average Score: 41.05      # 실제 테스트 기반
```

## 실제 결과 예제

실제 training 실행에서:

### 초기 상태 (반복 1)
```
📊 Learning Results:
   conservative: Score 12.64, Success 0.0%, Time 1839ms
   balanced: Score 12.98, Success 0.0%, Time 1756ms
   aggressive: Score 13.24, Success 0.0%, Time 1691ms
```

### 수정 후 (반복 2)
```
📊 Learning Results:
   conservative: Score 42.56, Success 50.0%, Time 1860ms
   balanced: Score 42.57, Success 50.0%, Time 1858ms
   aggressive: Score 43.33, Success 50.0%, Time 1667ms

📈 Improvements:
   Success Rate: +14.3%
   Execution Time: -10.8%
   Score: +3.0%
```

## 작업 복잡도 수준

### Easy
- 간단한 함수 (이메일 검증, 문자열 조작)
- 명확한 pass/fail이 있는 기본 테스트
- 빠른 실행 (~2초)

### Medium
- Express를 사용한 API endpoint
- Integration 테스트
- 중간 실행 (~3-4초)

### Hard
- 복잡한 알고리즘 (정렬, 검색)
- 성능 중요 코드
- 종합 테스트 suite (~5초 이상)

## 생성된 파일

Training pipeline이 실제 프로젝트 구조 생성:

```
.claude-flow/training/real-tasks/
└── task-[timestamp]/
    └── [taskName]/
        ├── index.js        # 실제 구현
        ├── index.test.js   # 실제 Jest 테스트
        └── package.json    # 실제 dependencies
```

## 학습 메커니즘

### Exponential Moving Average
```javascript
// 학습률: 실제 실행의 경우 0.4 (시뮬레이션보다 높음)
newReliability = oldReliability * 0.6 + newScore * 0.4
```

### 추적되는 실제 Metrics
- **Success Rate**: 실제 테스트 통과 백분율
- **Execution Time**: 실제 npm test 지속 시간
- **Score**: 성공과 속도의 가중 조합
- **Trend**: 시간 경과에 따른 개선 또는 하락

## 실제 실행의 이점

1. **진정한 학습**: Agent가 실제 테스트 결과로부터 학습
2. **실제 성능**: Metrics가 실제 실행 시간 반영
3. **정확한 예측**: 실제 데이터 기반의 미래 예측
4. **실용적인 개선**: 실제로 작동하는 최적화
5. **인위적인 편향 없음**: 결과에 영향을 미치는 난수 없음

## 시뮬레이션에서 마이그레이션

시뮬레이션 모드에서 기존 프로필이 있는 경우:
1. 시스템이 계속 사용하지만 실제 데이터로 업데이트
2. 몇 번의 실제 실행 후, 데이터가 완전히 현실 기반이 됨
3. 이전 시뮬레이션 점수가 실제 점수로 덮어써짐

## 문제 해결

### 테스트 실패
- Jest가 설치되었는지 확인: `npm ls jest`
- 테스트 구문이 올바른지 검증
- Template에서 적절한 regex escaping 확인

### 느린 실행
- 첫 실행의 경우 정상 (npm install)
- 후속 실행은 더 빠름 (캐시된 dependencies)
- 더 빠른 반복을 위해 `--complexity easy` 사용

### 개선 없음
- 실제 개선에는 여러 반복 필요
- 테스트 실행의 일부 무작위성은 정상
- 단일 실행보다 추세에 집중

## 요약

Training Pipeline은 이제 **실제 코드 실행**을 기반으로 **실제 machine learning**을 제공합니다. 더 이상 시뮬레이션 없음 - 모든 점수, 모든 metric, 모든 개선은 실제 npm 테스트 결과를 기반으로 합니다. 이는 agent 개선이 실제 성능 향상으로 직접 전환되도록 보장합니다.
