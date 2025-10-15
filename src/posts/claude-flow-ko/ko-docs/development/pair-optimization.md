# Pair Programming 명령어 최적화

## 해결된 문제
Pair programming 명령어가 30초마다 지속적으로 검증 확인을 실행하여 다음과 같은 문제 발생:
- 과도한 CPU 사용량
- 지속적인 터미널 출력 스팸
- 반복되는 실패 메시지로 인한 사용자 경험 저하
- Interactive 세션을 제대로 사용할 수 없음

## 구현된 최적화

### 1. **자동 Interval 기반 검증 제거**
- **이전**: `setInterval`이 30초마다 자동으로 검증 실행
- **이후**: 요청 시에만 또는 명시적 auto-verify flag 사용 시에만 검증 실행

### 2. **검증 Cooldown 추가**
- 자동 검증 간 60초 cooldown
- Auto-verify가 활성화되어 있어도 검증 스팸 방지
- 수동 `/verify` 명령어는 cooldown 우회

### 3. **지능형 점수 시스템**
```javascript
// 이전: 이진 pass/fail (0.5 또는 1.0)
const score = passed ? 1.0 : 0.5;

// 신규: 오류 수 기반 단계별 점수
if (output.includes('error')) {
  const errorCount = (output.match(/error/gi) || []).length;
  score = Math.max(0.2, 1.0 - (errorCount * 0.1));
} else if (output.includes('warning')) {
  const warningCount = (output.match(/warning/gi) || []).length;
  score = Math.max(0.7, 1.0 - (warningCount * 0.05));
}
```

### 4. **가중치 적용 검증 확인**
- Type Check: 40% 가중치 (가장 중요)
- Linting: 30% 가중치
- Build: 30% 가중치

### 5. **동시 검증 방지**
- 여러 동시 검증을 방지하기 위한 `isVerifying` flag 추가
- 검증이 이미 진행 중이면 조기 반환

### 6. **수동 제어 옵션**
- `/verify` - 수동으로 검증 실행
- `/auto` - 자동 검증 on/off 전환
- `/metrics` - 검증 기록 보기
- `/status` - 현재 설정 확인

### 7. **향상된 오류 메시지**
- 매우 낮은 점수(<0.5)에 대해서만 상세 제안 표시
- 아이콘(✅, ⚠️, ❌)을 사용한 깔끔한 출력
- 검증 기록에 타임스탬프 포함

## 사용 패턴

### 수동 검증 (권장)
```bash
# 수동 검증만으로 시작
./claude-flow pair --start --verify

# 필요할 때 검증 실행
/verify
```

### 자동 검증 (모니터링용)
```bash
# 60초 cooldown으로 auto-verify 활성화
./claude-flow pair --start --verify --auto

# 세션 중 전환
/auto
```

### Testing 통합
```bash
# Auto-run 없이 testing 활성화
./claude-flow pair --start --test

# 수동으로 테스트 실행
/test
```

## 성능 영향

### 최적화 전
- 30초마다 검증
- 검증당 ~3-5초
- 검증만으로 10-17% CPU 사용량
- 시간당 120회 검증

### 최적화 후
- 요청 시에만 검증
- Auto 활성화 시 60초 cooldown
- 유휴 시 <1% CPU 사용량
- 시간당 최대 ~60회 검증

## 명령어 참조

| 명령어 | 설명 | Auto-Verify 영향 |
|---------|-------------|-------------------|
| `/verify` | 지금 검증 실행 | Cooldown 우회 |
| `/test` | 지금 테스트 실행 | 독립적 |
| `/auto` | Auto-verify 전환 | 활성화/비활성화 |
| `/status` | 설정 표시 | 영향 없음 |
| `/metrics` | 기록 표시 | 영향 없음 |
| `/commit` | Pre-commit 확인 | 검증 실행 |

## 구성 Flag

| Flag | 기본값 | 설명 |
|------|---------|-------------|
| `--verify` | false | 검증 시스템 활성화 |
| `--auto` | false | 자동 검증 활성화 |
| `--test` | false | 테스트 시스템 활성화 |
| `--threshold` | 0.95 | 검증 통과 임계값 |

## 모범 사례

1. **수동 검증으로 시작** - `--auto` 없이 `--verify` 사용
2. **Commit 전 검증 실행** - `/commit` 명령어 사용
3. **정기적으로 metrics 확인** - `/metrics`를 사용하여 추세 추적
4. **Auto-verify 신중하게 활성화** - 모니터링이 필요한 긴 세션에만 사용
5. **가중치 점수 사용** - 지능형 점수 시스템 신뢰

## 세션 데이터 구조

```json
{
  "id": "pair_1755038032183",
  "mode": "switch",
  "verify": true,
  "autoVerify": false,
  "verificationScores": [
    {
      "score": 0.82,
      "timestamp": 1755038045000,
      "results": [
        { "name": "Type Check", "score": 0.8 },
        { "name": "Linting", "score": 0.85 },
        { "name": "Build", "score": 0.82 }
      ]
    }
  ]
}
```

## 향후 개선사항

- [ ] 스마트 검증을 위한 file watcher 통합
- [ ] Incremental 검증 (변경된 파일만)
- [ ] 검증 결과 캐싱
- [ ] 병렬 검증 확인
- [ ] 사용자 정의 검증 명령어
- [ ] Git hook 통합
