---
title: "제미나이 TTS, 무료로 시작해서 expression까지 쓰는 법"
description: "Gemini 3.8 Flash TTS를 무료로 시작하는 방법부터 문장별 감정 연출(expression), 순간 소리 태그, 사투리 보이스까지 직접 써본 실전 가이드."
date: 2026-10-11T10:00:00+09:00
tags:
  - TTS
  - Gemini
  - AIStudio
  - ElevenLabs
  - 음성합성
  - AI
category: "AI"
draft: false
---

ElevenLabs v4랑 비교 영상을 올렸더니 이런 댓글이 달렸습니다.
“제미나이도 TTS 되는 건가요? 어디서 하는 겁니까?”

됩니다. 그리고 무료로 시작할 수 있습니다.

저도 처음에는 API 요금표만 보고 있었습니다. 실제로는 Google AI Studio에서 바로 테스트할 수 있고, 가격표 기준으로 Gemini 3.8 Flash-Lite TTS는 무료 등급이 있습니다.

## 어디서 쓰나

https://aistudio.google.com 에 구글 계정으로 로그인하면 됩니다.

순서는 이렇습니다.

1. Google AI Studio 접속
2. 음성 생성에서 Gemini 3.8 Flash-Lite TTS 또는 Gemini 3.8 Flash TTS 선택
3. 읽힐 대본 입력
4. 목소리를 고르고, 필요한 문장에는 스타일 지정
5. 생성해서 들어보고 다운로드

짧은 나레이션이나 테스트용 음성은 이 단계에서 충분합니다.

공식 가격표에서도 Flash-Lite TTS는 무료 등급이 입력과 출력 모두 무료로 표시돼 있습니다. 무료 등급은 사용량 제한이 있고, 넣은 내용이 제품 개선에 쓰일 수 있는 조건이 붙습니다. 민감한 대본이나 대량 제작은 이 조건부터 보고 판단하면 됩니다.

제 프로젝트에서 확인한 무료 등급 한도는 Flash-Lite와 Flash 둘 다 분당 3요청, 분당 10,000토큰, 하루 10요청이었습니다. 결제 연결이 돼 있으면 Tier 1이 적용돼 하루 100요청으로 올라갑니다. 이 수치는 프로젝트마다 다르고 구글이 보장하는 수치가 아니니, 정확한 한도는 AI Studio의 비율 제한 페이지에서 확인하면 됩니다.

## 구글 클라우드 $300 크레딧은 못 쓰나

신규 계정이면 구글 클라우드 $300 무료 크레딧(90일)이 있습니다. 여기서 많이들 헷갈립니다. 구글 제품들이 다 이따위로 어렵게 되어 있습니다. 두 서비스를 책임지는 조직이 달라서 그렇습니다.

아무튼 무료로 받는 크레딧은 AI Studio의 Gemini API 비용에는 못 씁니다.

Vertex AI에서 Gemini 모델을 호출할 때 적용되는 거라, 무료로 테스트만 할 거면 AI Studio 무료 등급이 제일 간단합니다.

정리하면 이렇습니다.

- 테스트와 짧은 제작: AI Studio 무료 등급
- 코드로 자동화: Gemini API 무료 등급에서 시작(분당 요청, 분당 토큰, 하루 요청 제한 있음)
- 구글 클라우드 프로젝트로 Vertex를 쓸 때: 신규 계정이면 $300 크레딧 확인

## 감정 표현은 어떻게 하나

ElevenLabs v4 장점 중 하나죠. 감정표현. gemini-3.8-flash-tts 도 가능합니다.

3.8부터는 대본 텍스트를 그대로 읽을 문장으로 취급합니다. 예전처럼 대본 앞에 “기쁘게 말해줘”라고 써 넣으면, 그 지시문까지 읽어버릴 수 있습니다.

감정 연출은 두 층으로 나눕니다.

### 1. 문장 전체의 분위기는 style에 쓴다

문장 전체에 유지될 감정, 속도, 말투는 speech\_metadata의 style에 따로 넣습니다. 정해진 목록은 없고, 자연어로 자유롭게 적으면 됩니다.

공식 가이드에 나온 예:

- cheerful and friendly, sarcastic, whispering
- speaking rapidly, speaking slowly
- angry tone, out of breath, muttering
- high pitch, cheerful and excited inflection / monotone and flat

한국어로 써도 됩니다. 의기소침한 사과면 "dejected and apologetic, low energy", 삐지고 화난 말투면 "sulking and annoyed, angry" 같은 식입니다.

실전 요령은 이렇습니다.

- style은 짧게 씁니다. "casual, friendly" 같은 한 줄이 기준선이고, 길게 쓰면 목소리가 흔들립니다.
- 감정이 중간에 바뀌면 한 문장 안에서 해결하려고 하지 말고, 턴을 나눠서 각각 다른 style을 주는 게 더 안정적입니다.
- 나이, 성별, 고정 억양을 바꾸는 지시는 style에 넣지 않습니다. 억양은 보이스 선택으로 고정합니다.
- 처음부터 style을 다 채우지 말고, 비워 두고 한 번 들어본 뒤 필요한 턴에만 짧게 덧씁니다.

저는 쇼츠 나레이션을 만들 때 문장마다 이 값을 바꿔서 씁니다. 같은 목소리라도 첫 문장은 밝게, 설명하는 문장은 차분하게, 마지막 문장은 또렷하게 가져갈 수 있습니다.

### 2. 순간의 소리는 대본 안에 태그로 넣는다

웃음, 한숨, 기침, 숨소리처럼 특정 지점에서 나올 소리는 대본 안에 꺾쇠 태그로 넣습니다. 태그는 영어 그대로 씁니다. `<한숨>`처럼 한국어로 바꾸면 인식이 안 됩니다.

공식 태그 전체 목록:

`<argh>` `<breath>` `<heavy breath>` `<exhales>` `<cackle>` `<cheer>` `<chuckle>` `<chuckles>` `<cough>` `<cry>` `<gasp>` `<giggle>` `<groan>` `<growl>` `<grunt>` `<grr>` `<hiss>` `<laugh>` `<laughter>` `<moan>` `<pant>` `<pff>` `<phew>` `<scream>` `<shout>` `<shriek>` `<sigh>` `<sighs>` `<sneeze>` `<snicker>` `<snort>` `<sob>` `<throat-clearing>` `<tsk>` `<whimper>` `<whispers>` `<whispering>` `<yawn>` `<short pause>` `<long pause>`

어디에 넣느냐가 중요합니다. style은 문장 전체에 거는 지시이고, 태그는 그 단어가 나오는 자리에서만 터지는 소리입니다. 둘을 섞어 쓰면 연기가 훨씬 덜 밋밋해집니다.

### 3. 강조는 문장부호와 쉬어가는 자리로 만든다

영어 대본이면 특정 단어만 대문자로 쓰는 방법도 있습니다. 예: This is a VERY important point!

한국어는 대문자가 없습니다. 대신 문장부호와 리듬으로 강조합니다.

- 세게 치고 싶은 문장 끝에 느낌표를 붙이기
- 강조할 단어 앞에 `<short pause>`를 넣어 한 박자 쉬고 들어가기
- 쉼표, 줄임표, 대시로 숨 고르는 자리 만들기

문장 전체의 강세는 style에 짧게 지정하는 게 확실합니다. 긴 style 설명보다 대본 자체를 말하듯이 쓰는 게 우선입니다.

### 4. 두 사람 대화는 화자를 메타데이터에 적는다

팟캐스트처럼 두 사람이 주고받는 대본은 화자 이름과 style을 각 대사마다 메타데이터로 지정합니다. 한 번에 만들 수 있는 다중 화자는 기본 제공 목소리 기준으로 최대 2명입니다.

직접 설계한 목소리나 복제한 목소리를 여러 명 섞어 쓰려면, 화자별로 따로 생성해서 이어 붙이는 방식이 맞습니다.

### 5. 사투리는 보이스와 대본으로 만든다

사투리는 style에 "부산 사투리로 말해줘"라고 쓰는 방식이 아닙니다. 억양은 보이스가 고정합니다.

한국어 보이스에는 Seoul Korean과 Busan Korean이 따로 있습니다. 경상도 억양을 원하면 Busan Korean 보이스를 고릅니다. 예: 남성 ko-kr-assistant-4, 여성 ko-kr-assistant-2.

그다음 대본을 사투리 말투로 씁니다. 어미와 단어만 바꿔도 억양 보이스와 합쳐져 사투리처럼 들립니다.

- 영수: `<sigh>` 미안타, 참말로
- 영희: 오빠야 `<short pause>` 뭐가 미안한데?

<audio controls preload="none" src="/images/gemini-tts-expression-guide/audio-dialect.mp3" style="width:100%;margin:0.5rem 0;"></audio>

감정 style과 순간 소리 태그는 표준어 대본과 같은 방식으로 함께 씁니다. 억양만 보이스로 고정하고, 연기는 style과 태그로 나눠 거는 구조는 그대로입니다.

전라도, 충청도처럼 전용 억양 보이스가 없는 지역은 대본 말투로만 흉내 내는 수준이라 강도가 약할 수 있습니다.

## 코드로 쓴다면

API에서는 대본과 연출을 이렇게 분리합니다.

대본: 오늘 점심 먹은 국밥집, 진짜 대박이었어요.
style: casual and excited, natural Korean podcast conversation

핵심은 대본 안에 지시문을 섞지 않는 것입니다. 읽을 문장은 text에, 연출은 speech\_metadata의 style에, 순간의 소리는 <...> 태그에 넣습니다.

## 에이전트에게 시킨다면

### 감정 표현, 순간 소리 포함 버전

```
화자 영수 목소리는 Bodi, 영희 목소리는 Nika

영수: (의기소침) <한숨> 미안해 진짜

영희: (삐짐, 화남) 오빠 <한박자쉬고> 뭐가 미안한데?
```

<audio controls preload="none" src="/images/gemini-tts-expression-guide/audio-expression.mp3" style="width:100%;margin:0.5rem 0;"></audio>

### 스타일, 순간 소리 제외한 버전

```
화자 영수 목소리는 Bodi, 영희 목소리는 Nika
영수: 미안해 진짜
영희: 오빠 뭐가 미안한데?
```

<audio controls preload="none" src="/images/gemini-tts-expression-guide/audio-plain.mp3" style="width:100%;margin:0.5rem 0;"></audio>

### 순간 소리 태그 데모 프롬프트

공식 태그 40개를 전부 넣어 생성한 데모 음성(50초)의 실제 프롬프트입니다. Flash-Lite, 목소리 Bodi, style: natural and expressive, reacting to each moment.

```
와 <cheer> 드디어 끝났다 <laugh> 오늘 진짜 재밌었어 <chuckle> 아까 그 장면 <giggle> 아직도 웃겨 <snicker> 진짜 너무했어 <cackle> <short pause> 근데 목이 좀 메었네 <cough> <throat-clearing> <sigh> 이제 피곤하다 <yawn> <long pause> 후 <breath> <heavy breath> <pant> 쉬자 <exhales> <pff> 별일 아니야 <tsk> <argh> 짜증나 <groan> <grunt> <growl> <grr> <hiss> 아야 <gasp> <scream> <shout> <shriek> 진짜 놀랐어 <moan> <cry> <sob> <whimper> <whispering> <snort> <sneeze>
```

<audio controls preload="none" src="/images/gemini-tts-expression-guide/audio-vocal-tags.mp3" style="width:100%;margin:0.5rem 0;"></audio>

## 어느 모델을 고를까

직접 써본 기준으로 나누면 이렇습니다.

짧은 숏폼 나레이션을 계속 뽑는 작업이면 Flash-Lite로도 충분합니다. 싸고 빠릅니다.

대사가 길어지거나 감정 연기가 중요하면 3.8 Flash 쪽이 낫습니다. 오디오북이나 팟캐스트처럼 장문으로 갈수록, 문장별 expression을 얼마나 안정적으로 먹느냐가 결과 차이를 만듭니다.

그래서 제 결론은 용도에 따라 다릅니다.

- 반복 제작과 비용이 먼저면 Flash-Lite
- 연기 디테일이 먼저면 3.8 Flash
- 품질 최우선 단품이면 ElevenLabs v4와 직접 들어보고 선택

무료로 시작할 수 있으니, 남의 비교표보다 자기 대본 한 문단으로 먼저 들어보는 게 빠릅니다.
