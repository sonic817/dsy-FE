"use client";

export default function ReservationGuideContent() {
  return (
    <div className="usage-info-content">
      <h4>개인 예약</h4>
      <ul>
        <li>홈페이지 예약 메뉴에서 날짜 및 프로그램 선택 후 예약</li>
        <li>회차별 5명 미만 신청한 경우 프로그램 미운영</li>
      </ul>
      <h4>단체 예약</h4>
      <ul>
        <li>10인 이상 단체 예약 가능</li>
        <li>전화(0507-1317-1974) 또는 이메일(dis2412@naver.com)로 사전 문의</li>
      </ul>
      <p className="usage-info-notice">예약 변경 및 취소는 이용일 기준 정책에 따라 처리됩니다.</p>
    </div>
  );
}
