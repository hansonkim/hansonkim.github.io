---
title: "Claude Code Hooks를 활용한 블로그 자동 배포 시스템"
description: "블로그 포스트를 작성할 때마다 반복되는 작업들이 있습니다. Front matter 추가, 파일 복사, Git commit과 push... 이런 작업들을 자동화할 수 있다면 얼마나 좋을까요? Claude Code의 Hooks 시스템을 활용하면 이 모든 과정을 완전히..."
date: 2025-10-15T16:26:26+09:00
tags:
  - posts
  - AI
  - 개발도구
  - 문서화
  - JavaScript
---

# Claude Code Hooks를 활용한 블로그 자동 배포 시스템

## 들어가며

블로그 포스트를 작성할 때마다 반복되는 작업들이 있습니다. Front matter 추가, 파일 복사, Git commit과 push... 이런 작업들을 자동화할 수 있다면 얼마나 좋을까요? Claude Code의 Hooks 시스템을 활용하면 이 모든 과정을 완전히 자동화할 수 있습니다.

이 글에서는 실제로 구현한 블로그 자동 배포 시스템을 소개합니다. Markdown 파일을 저장하는 순간, Front matter 추가부터 GitHub Pages 배포까지 모든 과정이 자동으로 진행됩니다.

**📦 전체 소스 코드는 GitHub에 공개되어 있습니다:**
🔗 **https://github.com/hansonkim/claude-code-blog-hook**

## 시스템 아키텍처

### 워크플로우

```
1. Markdown 파일 작성/수정
   ↓
2. Claude Code가 파일 저장 감지
   ↓
3. Hook 스크립트 자동 실행
   ↓
4. Front matter 자동 생성 및 추가
   ↓
5. _site/ 디렉토리에 포맷팅
   ↓
6. Git repository로 복사
   ↓
7. 자동 commit & push
   ↓
8. GitHub Pages 배포
```

### 디렉토리 구조

```
/Users/hanson/blogs/              # 블로그 작성 디렉토리
├── .hooks/
│   ├── post-write-hook.js        # Hook 스크립트
│   └── README.md                 # 문서
├── _site/                        # 포맷팅된 파일
│   └── *.md                      # Front matter 포함
├── CLAUDE.md                     # 설정 파일
└── *.md                          # 원본 포스트

~/workspace/hansonkim.github.io/  # GitHub Pages 저장소
└── src/posts/                    # 배포 대상
    └── *.md                      # 최종 파일
```

## 구현 과정

### 1. Hook 스크립트 작성

Node.js로 작성한 Hook 스크립트의 핵심 기능들입니다.

#### Front Matter 자동 생성

```javascript
function generateFrontMatter(content) {
  const title = extractTitle(content);        // 첫 # 헤딩에서 추출
  const description = generateDescription(content);  // 첫 단락 요약
  const date = new Date().toISOString().replace(/\.\d{3}Z$/, '+09:00');
  const tags = extractTags(content, title);   // 키워드 기반 자동 추출

  return `---
title: "${title}"
description: "${description}"
date: ${date}
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
---

`;
}
```

**자동 추출되는 정보:**
- **제목**: 첫 번째 `#` 헤딩
- **설명**: 첫 문단을 150자로 요약
- **날짜**: KST 기준 현재 시간
- **태그**: 내용 분석을 통한 키워드 추출

#### 스마트 태그 추출

10개 카테고리의 키워드를 분석하여 관련 태그를 자동으로 추출합니다:

```javascript
const keywords = {
  'AI': ['AI', 'artificial intelligence', '인공지능', 'Claude', 'GPT'],
  '개발도구': ['개발도구', 'tool', '도구', 'CLI'],
  '문서화': ['문서', 'documentation', '가이드', 'guide'],
  'JavaScript': ['JavaScript', 'Node.js', 'npm', 'TypeScript'],
  'Python': ['Python', 'pip', 'Django', 'Flask'],
  '데이터베이스': ['database', 'SQL', 'MongoDB', '데이터베이스'],
  '웹개발': ['web', '웹', 'HTTP', 'API', 'REST'],
  '보안': ['security', '보안', 'authentication', 'authorization'],
  '성능': ['performance', '성능', 'optimization', '최적화'],
  '테스트': ['test', 'testing', '테스트', 'TDD']
};
```

#### Git 자동화

```javascript
function commitAndPush() {
  // Git repository 동기화
  setupRepository();

  // 파일 복사
  copyToRepository();

  // Commit & Push
  exec(`git add ${TARGET_PATH}`);
  const status = exec('git status --porcelain', { silent: true });

  if (status && status.trim() !== '') {
    exec(`git commit -m "Update blog posts - ${new Date().toISOString()}"`);
    exec('git push origin main');
  }
}
```

### 2. 제외 설정 시스템

`CLAUDE.md` 파일에서 제외할 파일과 디렉토리를 관리합니다.

```markdown
## 제외 목록

다음 파일과 디렉토리는 hook 처리에서 제외됩니다:

### 제외 파일:
- CLAUDE.md
- README.md
- draft-post.md

### 제외 디렉토리:
- .obsidian
- .claude-flow
- _site
- drafts
```

**제외 처리 로직:**

```javascript
function getExcludedItems() {
  const content = fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
  const section = content.match(/##\s+제외 목록[\s\S]*?(?=\n##[^#]|$)/);

  // 파일 섹션 파싱
  const filesSection = section.match(/###\s+제외\s*파일:\s*\n([\s\S]*?)(?=\n###|\n##|$)/);
  // 디렉토리 섹션 파싱
  const dirsSection = section.match(/###\s+제외\s*디렉토리:\s*\n([\s\S]*?)(?=\n###|\n##|$)/);

  return { files: [...], directories: [...] };
}
```

### 3. Claude Code 설정

Hook을 Claude Code에 등록합니다:

**방법 1: 설정 파일 편집**

`~/.claude-code/config.json`:
```json
{
  "hooks": {
    "post-write": "/Users/hanson/blogs/.hooks/post-write-hook.js"
  }
}
```

**방법 2: CLI 명령**

```bash
claude-code config set hooks.post-write "/Users/hanson/blogs/.hooks/post-write-hook.js"
```

## 사용 예시

### 자동 실행

Markdown 파일을 저장하면 자동으로 실행됩니다:

```bash
=== Blog Post Write Hook ===
Excluded files: CLAUDE.md, README.md
Excluded directories: .hooks, .obsidian, .claude-flow, _site

Processing: my-new-post.md
  → Formatting: my-new-post.md
  → Saved to: /Users/hanson/blogs/_site/my-new-post.md

=== Git Operations ===
  → Pulling latest changes...
  → Copying 1 file(s) to repository...
    • my-new-post.md
  → Committing changes...
  → Pushing to remote...
  ✓ Successfully pushed to GitHub

✓ All operations completed successfully
```

### 수동 실행

특정 파일이나 디렉토리를 처리하고 싶을 때:

```bash
# 단일 파일
node .hooks/post-write-hook.js my-post.md

# 디렉토리 전체
node .hooks/post-write-hook.js /Users/hanson/blogs
```

## 핵심 기능

### 1. 지능형 제외 시스템

- **파일 단위 제외**: 특정 파일명 지정
- **디렉토리 단위 제외**: 재귀적으로 모든 하위 파일 제외
- **동적 설정**: CLAUDE.md 수정 시 즉시 반영

### 2. Front Matter 자동화

- **제목 추출**: Markdown 헤딩 분석
- **설명 생성**: 콘텐츠 요약
- **태그 추출**: 키워드 기반 자동 분류
- **타임스탬프**: KST 기준 자동 생성

### 3. Git 워크플로우

- **자동 동기화**: Pull → Add → Commit → Push
- **변경 감지**: 실제 변경이 있을 때만 commit
- **에러 처리**: 실패 시 롤백 및 로깅

## 활용 팁

### 1. 초안 관리

초안은 `drafts/` 디렉토리에 작성하고 제외 목록에 추가:

```markdown
### 제외 디렉토리:
- drafts
```

### 2. 커스텀 태그

키워드 사전을 확장하여 프로젝트별 태그 추가:

```javascript
const keywords = {
  '내프로젝트': ['project-name', 'specific-term'],
  // ... 기타 키워드
};
```

### 3. 배포 시간 제어

특정 시간에 배포하고 싶다면 Git commit을 나중에 실행:

```bash
# Front matter만 추가하고 _site에 저장
# Git push는 수동으로 나중에 실행
```

## 성능 및 안정성

### 성능 최적화

- **파일 변경 감지**: Claude Code의 네이티브 감지 활용
- **증분 처리**: 변경된 파일만 처리
- **병렬 처리 가능**: 여러 파일 동시 처리

### 에러 처리

```javascript
try {
  processMarkdownFile(filePath);
} catch (error) {
  console.error(`Error processing ${filePath}:`, error.message);
  return false;  // 다른 파일 처리는 계속
}
```

### 안전 장치

- **제외 파일 보호**: CLAUDE.md, .hooks 자동 제외
- **중복 방지**: Front matter 존재 시 스킵
- **변경 확인**: Git status 체크 후 commit

## 실제 효과

### Before (수동 작업)

1. Markdown 파일 작성 (10분)
2. Front matter 수동 작성 (2분)
3. 파일 복사 (1분)
4. Git add, commit, push (2분)

**총 소요 시간: 15분**

### After (자동화)

1. Markdown 파일 작성 (10분)
2. 저장 (1초) → 모든 과정 자동 완료

**총 소요 시간: 10분**

**시간 절약: 33%**

## 확장 가능성

### 1. 이미지 최적화

```javascript
function optimizeImages(filePath) {
  // 이미지 압축
  // CDN 업로드
  // 링크 자동 변경
}
```

### 2. SEO 최적화

```javascript
function generateSEOMetadata(content) {
  return {
    ogTitle: extractTitle(content),
    ogDescription: generateDescription(content),
    ogImage: findFirstImage(content),
    keywords: extractKeywords(content)
  };
}
```

### 3. 다중 플랫폼 배포

```javascript
function deployToMultiplePlatforms() {
  deployToGitHubPages();
  deployToMedium();
  deployToDevTo();
}
```

## 문제 해결

### Hook이 실행되지 않을 때

```bash
# 권한 확인
chmod +x .hooks/post-write-hook.js

# Claude Code 설정 확인
claude-code config get hooks.post-write
```

### Git push 실패

```bash
# SSH 연결 확인
ssh -T git@github.com

# 수동 push 테스트
cd ~/workspace/hansonkim.github.io
git push origin main
```

### Front matter 중복

```bash
# _site 디렉토리 초기화
rm -rf _site
```

## 마치며

Claude Code의 Hooks 시스템을 활용하면 블로그 작성 워크플로우를 완전히 자동화할 수 있습니다. 이 시스템의 핵심은:

1. **자동화**: 반복 작업 제거
2. **일관성**: 표준화된 포맷 유지
3. **효율성**: 작성에만 집중
4. **확장성**: 필요에 따라 기능 추가

단순히 시간을 절약하는 것을 넘어, 글쓰기 자체에 집중할 수 있는 환경을 만들 수 있습니다.

## 소스 코드

### GitHub Repository

전체 소스 코드는 GitHub에 공개되어 있습니다:

**🔗 https://github.com/hansonkim/claude-code-blog-hook**

### 설치

```bash
# Repository clone
git clone https://github.com/hansonkim/claude-code-blog-hook.git

# 블로그 디렉토리로 복사
cp -r claude-code-blog-hook /path/to/your/blog/.hooks

# 설정
cd /path/to/your/blog/.hooks
cp config.example.json config.json
# config.json을 자신의 환경에 맞게 수정

# 실행 권한
chmod +x post-write-hook.js

# Claude Code에 등록
claude-code config set hooks.post-write "$(pwd)/post-write-hook.js"
```

### 포함된 파일

```
.hooks/
├── post-write-hook.js      # 메인 Hook 스크립트
├── config.example.json      # 설정 템플릿
├── .gitignore              # 개인 설정 제외
├── README.md               # 사용 가이드
├── INSTALL.md              # 설치 가이드
└── LICENSE                 # MIT License
```

## 참고 자료

### 관련 기술

- **Claude Code**: https://claude.com/claude-code
- **GitHub Repository**: https://github.com/hansonkim/claude-code-blog-hook
- **GitHub Pages**: https://pages.github.com
- **Eleventy**: https://www.11ty.dev
- **Node.js**: https://nodejs.org

### 다음 단계

이 시스템을 기반으로 더 발전시킬 수 있는 방향:

1. **AI 기반 요약**: Claude API를 활용한 자동 요약 생성
2. **이미지 처리**: 자동 압축 및 최적화
3. **링크 검증**: 깨진 링크 자동 체크
4. **번역 자동화**: 다국어 버전 자동 생성
5. **분석 통합**: Google Analytics 자동 태깅

블로그 자동화의 가능성은 무궁무진합니다. 여러분만의 워크플로우를 만들어보세요!
