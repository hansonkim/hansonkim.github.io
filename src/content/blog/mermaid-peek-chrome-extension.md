---
title: "PR 리뷰에서 Mermaid 다이어그램 바로 보기 — Mermaid Peek 만들었습니다"
description: "Bitbucket PR diff에 박힌 Mermaid 코드를 복사하지 않고 바로 렌더링해서 보는 크롬 확장 프로그램 Mermaid Peek을 만들었습니다."
date: 2026-10-16T10:00:00+09:00
tags:
  - Chrome확장프로그램
  - Mermaid
  - 코드리뷰
  - Bitbucket
  - 개발도구
category: "개발도구"
draft: false
---

Bitbucket에서 PR 리뷰를 하다 보면 Mermaid 코드블록이 그냥 텍스트로 보일 때가 있습니다. 다이어그램을 확인하려면 코드를 복사해서 별도 렌더러에 붙여넣어야 했고, diff 안에 있으면 줄번호와 diff 마커까지 섞여 들어옵니다. 이 과정을 없애려고 크롬 확장 프로그램 Mermaid Peek을 만들었습니다.

Mermaid Peek은 허용한 사이트에서 Mermaid 코드블록을 찾아 플로팅 패널에 렌더링합니다. 페이지를 떠나지 않고 다이어그램을 볼 수 있습니다.

코드리뷰에 맞춰 만들었습니다. Bitbucket PR의 Files changed diff에서 Mermaid 코드펜스를 감지하고, 새 revision만 추출합니다. 줄번호와 diff 마커는 제외됩니다. 뒤늦게 로드되는 diff 콘텐츠와 lazy-loading 플레이스홀더도 처리합니다. 일반 웹페이지의 Mermaid 코드블록도 감지합니다.

뷰어는 작게 시작합니다. 화면에 작은 플로팅 버튼으로 떠 있다가 Ctrl+M으로 펼치고 접습니다. Esc로 접을 수도 있습니다. 펼친 뷰어는 화면의 94%를 쓰고, 줌 인아웃과 100% 보기, 화면 맞춤을 지원합니다. 확대한 다이어그램은 드래그나 스크롤로 이동합니다. 다이어그램을 고르고 PNG로 저장할 수 있습니다. PNG 렌더링은 다이어그램을 열 때 시작됩니다.

동작 범위는 사용자가 정합니다. 기본 사이트는 bitbucket.org와 atlassian.net이고, 옵션에서 사이트를 추가하거나 뺄 수 있습니다. 추가한 사이트에서는 크롬 사이트 권한을 허용하고 페이지를 새로고침하면 됩니다. 목록에 없는 사이트에는 감지 스크립트를 넣지 않습니다.

렌더링은 전부 로컬에서 합니다. Mermaid 렌더러를 확장 프로그램에 내장했고, 소스와 PNG는 외부 렌더링 서비스 없이 브라우저 안에서 처리됩니다. 분석, 광고, 추적 코드를 넣지 않았습니다. 사이트 목록은 브라우저 로컬에만 저장됩니다.

한계도 있습니다. 감지는 페이지 HTML 구조에 의존하고, 지원되는 Mermaid 블록이나 완전한 코드펜스가 필요합니다. 로드되지 않은 코드, iframe 내용, 닫힌 shadow root, 캔버스 기반 에디터는 지원하지 않습니다. 5만 자를 넘는 소스는 제외되고, PNG 출력은 한 변 4096픽셀, 약 1200만 화소까지입니다. 크롬 116 이상이 필요합니다.

크롬 웹스토어에서 설치할 수 있습니다.

[Mermaid Peek 설치하기](https://chromewebstore.google.com/detail/mermaid-peek/nmdkikngbchcniagpjlcgnlbnjklbmpb)
