# Hanson Kim's Blog

Eleventy로 구축한 개인 블로그입니다.

## 개발 환경 설정

### 필수 요구사항
- Node.js 20 이상

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:8080)
npm start

# 프로덕션 빌드
npm run build
```

## 프로젝트 구조

```
.
├── src/
│   ├── _layouts/        # 레이아웃 템플릿
│   ├── _includes/       # 재사용 가능한 컴포넌트
│   ├── posts/           # 블로그 포스트 (Markdown)
│   ├── css/             # 스타일시트
│   ├── images/          # 이미지 파일
│   ├── index.njk        # 홈페이지
│   └── blog.njk         # 블로그 목록 페이지
├── _site/               # 빌드된 정적 파일 (자동 생성)
└── .eleventy.js         # Eleventy 설정
```

## 새 글 작성하기

`src/posts/` 디렉토리에 새 Markdown 파일을 생성합니다:

```markdown
---
title: "글 제목"
description: "글 설명"
date: 2025-10-15
tags:
  - tag1
  - tag2
---

여기에 내용을 작성합니다.
```

## 배포

GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

main 브랜치에 푸시하면 자동으로 빌드 및 배포가 진행됩니다.

## 기술 스택

- [Eleventy](https://www.11ty.dev/) - 정적 사이트 생성기
- [Nunjucks](https://mozilla.github.io/nunjucks/) - 템플릿 엔진
- GitHub Pages - 호스팅
- GitHub Actions - CI/CD

## 라이선스

ISC
