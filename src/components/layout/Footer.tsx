import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-left">
            <h3 className="footer-title">
              <Image src="/logo-white.png" alt="다율숲 로고" width={24} height={24} className="footer-logo-img" />
              다율숲 주식회사
            </h3>
            <p className="footer-contact">문의: 0507-1317-1974</p>
            <p className="footer-hours">평일 10:00 - 20:00 | 주말 · 공휴일 10:00 - 21:00</p>
          </div>
          <div className="footer-divider-mobile" />
          <div className="footer-right">
            <p>대표 하우석</p>
            <p>사업자등록번호 818-86-03659</p>
            <p>통신판매업신고 제2026-울산북구-0104호</p>
            <p>(도로명) 울산광역시 북구 동남로 477, 1층</p>
            <p>(지번) 울산광역시 북구 대안동 606-8</p>
            <p>이메일 dayulsoup0301@naver.com</p>
            <p>개인정보관리책임자 하우석</p>
          </div>
        </div>

        <div className="footer-divider" />
        <p className="footer-links">
          <a href="/terms/service">이용약관</a>
          <span>|</span>
          <a href="/terms/privacy">개인정보처리방침</a>
          <span>|</span>
          <a href="/terms/refund">취소 및 환불 정책</a>
        </p>
        <p className="footer-copyright">
          Copyright &copy; {new Date().getFullYear()} 다율숲 주식회사. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
