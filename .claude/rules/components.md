---
globs: src/components/**/*.tsx
---

# 컴포넌트 패턴

- 로딩 패턴: 데이터 로딩 → 스켈레톤 UI, 처리 중 → 스피너 오버레이
- 모달: `Modal` 베이스 컴포넌트 (`@/components/modal/Modal.tsx`) 사용이 기본
- 버튼 클릭 시 텍스트를 "처리 중..." 등으로 바꾸지 말 것 (disabled + 스피너)
