import type { Metadata } from "next";

export const metadata: Metadata = { title: "취소 및 환불 정책 - 다율숲" };

export default function RefundPolicyPage() {
  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #333", paddingBottom: 12 }}>취소 및 환불 정책</h1>

      <p style={{ marginBottom: 24 }}>다율숲 주식회사(이하 &quot;회사&quot;)는 다율숲 숲체험 예약 서비스의 취소 및 환불에 대해 다음과 같은 정책을 적용합니다.</p>

      <Section title="1. 서비스 제공기간">
        <ul>
          <li>서비스는 예약일 당일 선택한 시간대에 제공됩니다.</li>
          <li>프로그램별 소요 시간은 예약 시 안내되며, 운영 상황에 따라 변경될 수 있습니다.</li>
        </ul>
      </Section>

      <Section title="2. 교환">
        <ul>
          <li>숲체험 서비스 특성상 교환은 불가합니다.</li>
          <li>예약 일정 변경을 원하시는 경우, 기존 예약을 취소하고 새로 예약해 주시기 바랍니다.</li>
        </ul>
      </Section>

      <Section title="3. 취소 및 환불 기준">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={th}>구분</th>
              <th style={th}>위약금</th>
              <th style={th}>환불액</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>예약 후 2시간 이내 취소</td><td style={td}>없음</td><td style={td}>전액 환불</td></tr>
            <tr><td style={td}>이용일 6일 전까지 취소</td><td style={td}>이용료의 30%</td><td style={td}>이용료의 70% 환불</td></tr>
            <tr><td style={td}>이용일 2~5일 전 취소</td><td style={td}>이용료의 50%</td><td style={td}>이용료의 50% 환불</td></tr>
            <tr><td style={td}>이용일 당일 취소</td><td style={td}>이용료의 100%</td><td style={td}>환불 불가</td></tr>
            <tr><td style={td}>예약 후 미이용 (노쇼)</td><td style={td}>이용료의 100%</td><td style={td}>환불 불가</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="4. 환불 처리 기간">
        <ul>
          <li>카드 결제: 취소 요청 후 3~7 영업일 이내 (카드사 정책에 따라 상이)</li>
          <li>계좌이체: 취소 요청 후 3 영업일 이내</li>
        </ul>
      </Section>

      <Section title="5. 취소 방법">
        <ul>
          <li>예약 사이트의 &quot;예약확인&quot; 메뉴에서 취소</li>

          <li>이메일 취소: dis2412@naver.com</li>
        </ul>
      </Section>

      <Section title="6. 특별 사항">
        <ul>
          <li>천재지변(태풍, 폭우, 폭설 등), 기상악화로 인해 회사가 프로그램 운영을 중단하는 경우 전액 환불합니다.</li>
          <li>이용자의 단순 변심에 의한 취소는 위 기준에 따라 위약금이 부과됩니다.</li>
          <li>예약 인원 변경은 이용일 3일 전까지 가능하며, 이후에는 변경이 불가합니다.</li>
        </ul>
      </Section>

      <Section title="7. 문의">
        <ul style={{ listStyle: "none", padding: 0 }}>

          <li>이메일: dis2412@naver.com</li>
        </ul>
      </Section>

      <p style={{ marginTop: 32, color: "#888" }}>시행일: 2026년 03월 17일</p>
    </>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #ddd", fontWeight: 600 };
const td: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid #eee" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
