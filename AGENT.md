# 다율숲(dys-FE) 프로젝트

## 작업 규칙
- **작업이 끝날 때마다 반드시 CLAUDE.md를 최신 상태로 업데이트할 것**

## 프로젝트 개요
- 다율숲 숲체험 비회원 예약 웹사이트 (모바일 반응형 + 데스크톱)
- 의뢰인은 비개발자 — 기술 용어 최소화, 화면 중심으로 소통
- 결제: 포트원 V2 연동 (KG이니시스)
- 백엔드: `dys-BE` 프로젝트 (별도)
- DB: Supabase (PostgreSQL)
- 정적 이미지: Cloudflare R2 저장소 (hero, intro-main, directions 등)

## 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **결제**: @portone/browser-sdk ^0.1.3 (V2)
- **이미지 슬라이더**: Swiper ^12.1.2
- **스타일링**: Plain CSS (섹션별 분리, CSS 변수 기반 테마)
- **폰트**: SB 어그로 M (본문), SB 어그로 L (헤더 로고) — `public/fonts/`
- **패키지 매니저**: npm

## 프로젝트 구조
```
src/
├── app/
│   ├── globals.css              # CSS import 허브 (직접 스타일 없음)
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 메인 페이지 (단일 페이지)
│   ├── payment-complete/
│   │   └── page.tsx             # 모바일 결제 완료 리다이렉트 페이지
│   └── terms/
│       ├── layout.tsx           # 약관 공통 레이아웃 (max-width 720px)
│       ├── privacy/
│       │   └── page.tsx         # 개인정보처리방침
│       ├── refund/
│       │   └── page.tsx         # 취소 및 환불 정책
│       └── service/
│           └── page.tsx         # 이용약관
├── components/
│   ├── common/
│   │   └── Calendar.tsx         # 2개월 달력
│   ├── layout/
│   │   ├── Header.tsx           # 네비게이션 (스크롤 활성 표시, 예약 바운스)
│   │   └── Footer.tsx           # 회사 정보, 약관 링크 (/terms/*)
│   ├── modal/
│   │   ├── Modal.tsx                    # 공통 모달 (ESC, 모바일 터치 스크롤 방지)
│   │   ├── ImageModal.tsx               # 이미지 뷰어 (모바일: Swiper 라이트박스, 데스크톱: 풀스크린 오버레이)
│   │   ├── NewsDetailModal.tsx          # 소식 상세
│   │   ├── ReservationConfirmModal.tsx  # 예약 결제 확인 (결제금액 표시)
│   │   ├── ReservationCompleteModal.tsx # 예약 완료
│   │   └── ReservationCancelModal.tsx   # 예약 취소 (환불금액 계산, 스크롤 가능 정책 테이블)
│   └── sections/
│       ├── HeroSection.tsx              # R2 이미지 URL
│       ├── NewsSection.tsx              # 스켈레톤 로딩
│       ├── IntroSection.tsx             # R2 이미지 URL, 스켈레톤 로딩
│       ├── UsageGuideSection.tsx        # 스켈레톤 로딩
│       ├── ReservationSection.tsx       # 결제 연동, 슬롯 스켈레톤, 스피너
│       └── ReservationCheckSection.tsx  # 예약 조회 + 취소, 스켈레톤
├── lib/
│   └── api.ts                   # fetchApi (API_URL, x-api-key 헤더)
├── styles/
│   ├── variables.css            # CSS 변수, 폰트 정의
│   ├── reset.css                # 리셋, 기본 스타일
│   ├── common.css               # 공통 (container, section, tabs, grids)
│   ├── header.css               # 네비 활성 바, 예약 바운스 애니메이션
│   ├── hero.css
│   ├── news.css
│   ├── intro.css
│   ├── usage.css
│   ├── reservation.css          # 달력, 시간 슬롯, 예약 폼, 취소 버튼, 가격 표시
│   ├── modal.css                # 모달, 라이트박스(모바일), image-viewer(데스크톱), 취소 정책 테이블
│   ├── skeleton.css             # 스켈레톤 + 스피너
│   ├── footer.css
│   └── responsive.css           # 데스크톱 미디어 쿼리 (768px~, 1024px~, 1280px~)
└── types/
    ├── index.ts                 # 재export (reservation)
    └── reservation.ts           # ReservationFormData (name, email, phone, totalPeople, emergencyContact), TimeSlots
```

## 결제 플로우
1. 예약 폼 작성 → "예약 신청하기" → 확인 모달 (결제금액 표시)
2. "결제하기" → BE `prepare` API (자리 선점, 금액 저장)
3. 포트원 결제창 오픈 (`PortOne.requestPayment`)
4. 결제 성공 → BE `complete` API (3중 검증)
5. 완료 모달
- 결제창 닫기/취소/에러 시 → BE `cleanup` API (PREPARED 즉시 삭제)
- 모바일: `redirectUrl`로 `/payment-complete` 페이지 리다이렉트
- 포트원 미설정 시 (`STORE_ID`, `CHANNEL_KEY` 비어있으면) → 결제 없이 바로 확정

## 예약 취소
- 예약 조회 → 취소하기 버튼 (이용일 전에만 표시)
- 취소 모달: BE `cancel-preview` API로 환불금액 조회 + 정책 테이블 (해당 행 하이라이트, 자동 스크롤)
- "취소하기" → BE `cancel` API (환불금액 재계산 + 포트원 환불)
- 결제금액 표시: 취소 시 "5,000원 (환불완료)" / "5,000원 (3,500원 환불)" / "5,000원 (환불없음)"

## 로딩 상태
- **스켈레톤**: 소식, 소개 시설/사진, 이용안내 프로그램/시설/이용료/사진, 시간대 슬롯, 예약 조회 결과
- **스피너**: 예약 결제 진행 중, 취소 처리 중 (풀스크린 오버레이)

## 헤더 네비게이션
- 스크롤 위치에 따라 활성 섹션에 초록 하단 바 표시
- "예약" 텍스트 바운스 애니메이션 (2초 주기)

## 이미지 모달 (ImageModal)
- **모바일**: Swiper 라이트박스 (부드러운 좌우 슬라이드), `history.pushState`로 Android 뒤로가기 버튼 처리
- **데스크톱**: 풀스크린 오버레이 + `<` `>` 네비게이션 버튼 + 키보드 좌우 화살표/ESC 지원
- CSS: `.lightbox` (모바일), `.image-viewer-desktop` (데스크톱) — 미디어 쿼리로 전환

## 공통 모달 (Modal.tsx)
- ESC 키로 닫기
- 모바일 터치 스크롤 방지 (`touchmove` 이벤트, `.modal-body`와 `.cancel-policy-table-wrapper`만 스크롤 허용)
- `large` prop으로 큰 모달 지원

## 정적 이미지
- Cloudflare R2 저장소 URL 사용: `https://pub-6e4c4b7de2a64b20a6f4ed43bc11a71e.r2.dev/prod/static/`
- hero 배경, 소개 메인 이미지, 찾아오시는 길 이미지 등

## 약관 페이지 (/terms/*)
- `/terms/service` — 이용약관
- `/terms/privacy` — 개인정보처리방침
- `/terms/refund` — 취소 및 환불 정책
- 공통 레이아웃: `terms/layout.tsx` (max-width 720px, 인라인 스타일)
- Footer에서 링크 제공

## 환경 변수 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_PORTONE_STORE_ID=     # 비어있으면 결제 없이 예약
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=  # 비어있으면 결제 없이 예약
```

## 명령어
```bash
npm run dev    # 개발 서버 (http://localhost:3000)
npm run build  # 프로덕션 빌드
npm run start  # 프로덕션 서버
npm run lint   # ESLint 검사
```
