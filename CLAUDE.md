# 다율숲(dys-FE) 프로젝트

## 작업 규칙
- **작업이 끝날 때마다 반드시 README.md와 CLAUDE.md를 최신 상태로 업데이트할 것**

## 프로젝트 개요
- 다율숲 숲체험 비회원 예약 웹사이트 (모바일 반응형 + 데스크톱)
- 의뢰인은 비개발자 — 기술 용어 최소화, 화면 중심으로 소통
- 결제 기능은 미구현 (추후 포트원 연동 예정)
- 백엔드: `dys-BE` 프로젝트 (별도)
- DB: Supabase (PostgreSQL)

## 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Plain CSS (섹션별 분리, CSS 변수 기반 테마)
- **폰트**: SB 어그로 M (본문), SB 어그로 L (헤더 로고) — `public/fonts/`
- **패키지 매니저**: npm

## 프로젝트 구조
```
src/
├── app/
│   ├── globals.css       # CSS import 허브 (직접 스타일 없음)
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 메인 페이지 (단일 페이지)
├── components/
│   ├── common/           # 재사용 가능한 공통 컴포넌트
│   │   └── Calendar.tsx
│   ├── layout/           # 레이아웃 컴포넌트 (헤더, 푸터)
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── modal/            # 모달 컴포넌트
│   │   ├── Modal.tsx                    # 공통 모달 (ESC 닫기 지원)
│   │   ├── ImageModal.tsx               # 이미지 뷰어 (모바일: 라이트박스, 데스크톱: 모달)
│   │   ├── NewsDetailModal.tsx          # 소식 상세
│   │   ├── ReservationConfirmModal.tsx  # 예약 확인
│   │   └── ReservationCompleteModal.tsx # 예약 완료
│   └── sections/         # 페이지 섹션 컴포넌트
│       ├── HeroSection.tsx
│       ├── NewsSection.tsx
│       ├── IntroSection.tsx
│       ├── UsageGuideSection.tsx
│       ├── ReservationSection.tsx
│       └── ReservationCheckSection.tsx  # 예약 조회
├── constants/            # 하드코딩 데이터 (추후 API 교체 대상)
│   ├── index.ts
│   ├── intro.ts
│   ├── news.ts
│   ├── reservation.ts   # TIME_SLOTS, MAX_CAPACITY, MOCK_SLOT_COUNT
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
│   ├── reservation.css   # 달력, 시간 슬롯, 예약 폼, 예약확인 포함
│   ├── modal.css         # 모달 + 라이트박스
│   ├── footer.css
│   └── responsive.css    # 데스크톱 미디어 쿼리 (1024px~, 1280px~)
└── types/
    ├── index.ts
    └── reservation.ts
```

## 페이지 구성 (단일 페이지, 섹션 스크롤)
1. **헤더** — 다율숲 로고(SB어그로L) + 네비게이션 (소식/소개/이용안내/예약), 상단 고정(fixed), 예약은 초록색 강조
2. **히어로** — 배경 이미지 + 텍스트 오버레이
3. **다율숲 소식** — 뉴스 리스트, 클릭 시 모달로 상세 보기
4. **소개** — 탭 UI (다율숲 / 찾아오시는 길 / 주요시설 / 사진), 이미지 클릭 시 모달(좌우 이동)
5. **이용안내** — 탭 UI (숲체험 프로그램 / 주요시설 / 이용료 / 사진), 이미지 클릭 시 모달(좌우 이동)
6. **예약** — [예약하기 / 예약확인] 탭
   - 예약하기: 개인/단체 → 달력(2개월) → 시간대 선택(인원 현황 표시) → 신청 폼
   - 예약확인: 성명 + 연락처로 조회
7. **푸터** — 연락처, 주소, 저작권

## 주요 구현 사항

### 달력
- 이번 달 + 다음 달 동시 표시
- 오늘: 초록색(`--primary`) 동그라미 + 흰 글자 (항상 표시)
- 선택된 날짜: 노란색(`--calendar-today`) 동그라미 + 검정 글자
- 과거 날짜 비활성화, ◀ 버튼 이번달 이전 비활성
- 일요일 빨간색, 토요일 파란색

### 시간대
- 오전1~4, 오후1~4, 야간1~2 (총 10개 슬롯)
- 각 슬롯에 현재 인원/최대 인원 표시 (예: `2/20`)
- 마감 시 비활성화 + "마감" 표시

### 예약 폼 유효성
- 신청인 성명: 한글/영어만, 최대 10글자
- 연락처/비상연락처: 숫자만, `010-0000-0000` 형식 자동 포맷
- 참여자 전체 수: 숫자만, 최대 4자리, 세자리 콤마
- 모든 필드 입력 시 예약 버튼 활성화

### 예약 플로우
1. 예약 신청하기 클릭 → 확인 모달 (정보 요약)
2. 신청하기 클릭 → 완료 모달
3. 확인 클릭 → 폼 초기화 + 맨 위로 스크롤

### 모바일/데스크톱 분기
- **이미지 모달**: 모바일=풀스크린 라이트박스, 데스크톱=모달(large)
- **날짜 선택 시**: 모바일/데스크톱 모두 "시간 선택"으로 스크롤 이동
- **시간 선택 시**: 모바일/데스크톱 모두 "예약 신청" 폼으로 스크롤 이동
- **사이드바**: 없음 (단일 페이지)

### 이미지
- 히어로: `main.jpg` (배경 이미지)
- 소개 > 다율숲: `intro-main.png`
- 소개 > 찾아오시는 길: `directions.png`
- 소개 > 주요시설: `facilities/` (4장)
- 소개 > 사진: `intro/intro-01~06.png`
- 이용안내 > 주요시설: `usage/usage-*.jpg` (4장)
- 이용안내 > 사진: `usage/usage-01~06.png`

## 코딩 컨벤션
- CSS: Plain CSS + CSS 변수, 섹션별 파일 분리, 인라인 스타일 최소화
- 컴포넌트: 기능별 디렉토리 분리 (layout / sections / common / modal)
- 상수: `constants/`에서 관리, 컴포넌트에 하드코딩 금지
- 타입: `types/`에서 관리
- 폰트 크기: rem 단위 (6단계: 3.5/1.75/1.25/1.125/1/0.9375rem)
- 모달: ESC 키 닫기 지원, 오버레이 클릭 닫기

## 명령어
```bash
npm run dev    # 개발 서버 (http://localhost:3000)
npm run build  # 프로덕션 빌드
npm run start  # 프로덕션 서버
npm run lint   # ESLint 검사
```

## 추후 작업
- [ ] API 연동 (constants → API 호출로 교체, dys-BE)
- [ ] 결제 기능 연동 (포트원)
- [ ] 푸터 실제 연락처/주소 입력
