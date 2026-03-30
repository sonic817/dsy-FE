---
globs: src/styles/**/*.css
---

# CSS 스타일링 원칙

- 기본 방향은 모바일 퍼스트 (기본 스타일이 모바일, 미디어 쿼리로 확장), 기존 max-width 예외는 존중
- CSS 변수 사용 권장 (`variables.css` 참조: `--fs-*`, `--primary` 등)
- 브레이크포인트: 768px (태블릿) / 1024px (데스크톱) / 1280px (와이드)
- 폰트 변수: `--font-body` (SB 어그로 M), `--font-logo` (SB 어그로 L)
