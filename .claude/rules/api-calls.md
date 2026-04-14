---
globs: src/**/*.{ts,tsx}
---

# API 호출 및 유틸리티

- 내부 API 호출은 `fetchApi()` (`@/lib/api`) 우선 사용
- 체험비 데이터는 `useProgramFees()` 훅 사용 (모듈 레벨 캐싱)
- 전화번호/이름 입력 포맷: `formatPhone()`, `filterName()` (`@/lib/formatters`)
