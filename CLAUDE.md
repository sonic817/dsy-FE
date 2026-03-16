# 다율숲(dys-FE) 프로젝트

## 프로젝트 개요
- 다율숲 숲체험 비회원 예약 웹사이트 (모바일 반응형, SPA)
- 의뢰인은 비개발자 — 기술 용어 최소화, 화면 중심으로 소통
- 결제 기능은 미구현 (추후 연동 예정)
- 백엔드(서버)는 별도 프로젝트로 나중에 생성 예정

## 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Plain CSS (섹션별 분리, CSS 변수 기반 테마)
- **폰트**: Jalnan2 (잘난체) — `public/fonts/`에 위치, 단일 굵기 폰트
- **패키지 매니저**: npm

## 프로젝트 구조
```
src/
├── app/                  # Next.js App Router
│   ├── globals.css       # CSS import 허브 (직접 스타일 없음)
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 메인 페이지 (단일 페이지)
├── components/
│   ├── common/           # 재사용 가능한 공통 컴포넌트
│   │   └── Calendar.tsx
│   ├── layout/           # 레이아웃 컴포넌트 (헤더, 푸터)
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── sections/         # 페이지 섹션 컴포넌트
│       ├── HeroSection.tsx
│       ├── NewsSection.tsx
│       ├── IntroSection.tsx
│       ├── UsageGuideSection.tsx
│       └── ReservationSection.tsx
├── constants/            # 하드코딩 데이터 (추후 API 교체 대상)
│   ├── index.ts
│   ├── intro.ts
│   ├── news.ts
│   ├── reservation.ts
│   └── usage.ts
├── styles/               # CSS 섹션별 분리
│   ├── variables.css     # CSS 변수, 폰트 정의
│   ├── reset.css         # 리셋, 기본 스타일
│   ├── common.css        # 공통 (container, section, tabs, grids)
│   ├── header.css
│   ├── hero.css
│   ├── news.css
│   ├── intro.css
│   ├── usage.css
│   ├── reservation.css   # 달력, 시간 슬롯, 예약 폼 포함
│   ├── footer.css
│   └── responsive.css    # 미디어 쿼리
└── types/                # TypeScript 타입 정의
    ├── index.ts
    └── reservation.ts
```

## 페이지 구성 (단일 페이지, 섹션 스크롤)
1. **헤더** — 다율숲 로고 + 네비게이션 (소식/소개/이용안내/예약), 상단 고정(fixed)
2. **히어로** — 배너 영역
3. **다율숲 소식** — 뉴스/공지 리스트
4. **소개** — 탭 UI (다율숲 / 찾아오시는 길 / 주요시설 / 사진)
5. **이용안내** — 탭 UI (숲체험 프로그램 / 주요시설 / 이용료 / 사진)
6. **예약** — 개인/단체 선택 → 달력(2개월) → 시간대 선택 → 신청 폼
7. **푸터** — 연락처, 주소, 저작권

## 주요 구현 사항

### 달력
- 이번 달 + 다음 달 동시 표시
- 오늘: 노란색 동그라미 (선택된 날짜가 없을 때만)
- 선택된 날짜: 노란색 동그라미 (선택 시 오늘 표시 제거)
- 과거 날짜 비활성화
- 일요일 빨간색, 토요일 파란색

### 시간대
- 오전1~4, 오후1~4, 야간1~2 (총 10개 슬롯)

### 예약 폼 유효성
- 신청인 성명: 한글/영어만 (숫자, 특수문자 자동 제거)
- 연락처/비상연락처: 숫자만, `010-0000-0000` 형식 자동 포맷

### 이미지
- 이미지 미확보 상태 — 빨간 점선 테두리 placeholder로 표시
- 이미지 추가 시 `.image-placeholder` 클래스를 `<img>` 태그로 교체

## 코딩 컨벤션
- CSS: Plain CSS + CSS 변수, 섹션별 파일 분리
- 컴포넌트: 기능별 디렉토리 분리 (layout / sections / common)
- 상수: `constants/`에서 관리, 컴포넌트에 하드코딩 금지
- 타입: `types/`에서 관리

## 명령어
```bash
npm run dev    # 개발 서버 (http://localhost:3000)
npm run build  # 프로덕션 빌드
npm run start  # 프로덕션 서버
npm run lint   # ESLint 검사
```

## 추후 작업
- [ ] 백엔드 서버 프로젝트 생성 (별도 repo)
- [ ] API 연동 (constants → API 호출로 교체)
- [ ] 결제 기능 연동
- [ ] 실제 이미지 교체
- [ ] 푸터 실제 연락처/주소 입력
