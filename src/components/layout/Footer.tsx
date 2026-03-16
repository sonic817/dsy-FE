export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h3 className="footer-title">다율숲</h3>
        <p className="footer-phone">000-0000-0000</p>
        <p className="footer-info">
          평일 오전 9시 ~ 오후 6시
          <br />
          * 주말 및 공휴일 미운영
        </p>
        <div className="footer-divider" />
        <p className="footer-info">
          주소: 주소를 입력하세요
          <br />
          이메일: email@example.com
        </p>
        <p className="footer-copyright">
          Copyright &copy; {new Date().getFullYear()} 다율숲. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
