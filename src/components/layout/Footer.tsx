export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-left">
            <h3 className="footer-title">다율숲 주식회사</h3>
            <p className="footer-info">
              전화: 052-914-6967
              <br />
              평일 오전 9시 ~ 오후 6시
              <br />
              * 주말 및 공휴일 미운영
            </p>
          </div>
          <div className="footer-right">
            <p className="footer-info">
              대표: 하우석
              <br />
              사업자등록번호: 818-86-03659
              <br />
              통신판매업신고: 제2026-울산북구-0104호
              <br />
              주소: 울산광역시 북구 동남로 477, 1층
              <br />
              이메일: dis2412@naver.com
              <br />
              개인정보관리책임자: 하우석
            </p>
          </div>
        </div>
        <div className="footer-divider" />
        <p className="footer-links">
          <a href="/terms/service">이용약관</a>
          <span> | </span>
          <a href="/terms/privacy">개인정보처리방침</a>
          <span> | </span>
          <a href="/terms/refund">취소 및 환불 정책</a>
        </p>
        <p className="footer-copyright">
          Copyright &copy; {new Date().getFullYear()} 다율숲 주식회사. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
