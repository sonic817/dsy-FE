import type { Metadata } from "next";

export const metadata: Metadata = { title: "이용약관 - 다율숲" };

export default function TermsOfServicePage() {
  return (
    <>
      <h1 style={{ fontSize: "var(--fs-title-sm)", fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #333", paddingBottom: 12 }}>이용약관</h1>

      <Section title="제1조 (목적)">
        본 약관은 다율숲 주식회사(이하 &quot;회사&quot;)가 운영하는 다율숲 숲체험 예약 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
      </Section>

      <Section title="제2조 (정의)">
        <ol>
          <li>&quot;서비스&quot;란 회사가 제공하는 숲체험 프로그램 예약 및 관련 부가 서비스를 말합니다.</li>
          <li>&quot;이용자&quot;란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.</li>
          <li>&quot;예약&quot;이란 이용자가 서비스를 통해 숲체험 프로그램의 이용을 신청하는 것을 말합니다.</li>
        </ol>
      </Section>

      <Section title="제3조 (약관의 효력 및 변경)">
        <ol>
          <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
          <li>회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 공지 후 7일이 경과한 날부터 효력이 발생합니다.</li>
        </ol>
      </Section>

      <Section title="제4조 (서비스의 제공)">
        <ol>
          <li>회사는 다음과 같은 서비스를 제공합니다.
            <ul>
              <li>숲체험 프로그램 예약 서비스</li>
              <li>숲체험 프로그램 안내 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </li>
          <li>서비스의 이용 시간은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을 원칙으로 합니다.</li>
        </ol>
      </Section>

      <Section title="제5조 (예약 및 결제)">
        <ol>
          <li>이용자는 서비스에서 제공하는 절차에 따라 예약을 신청할 수 있습니다.</li>
          <li>예약은 이용자가 예약 정보를 입력하고 결제를 완료한 시점에 성립합니다.</li>
          <li>회사는 예약 내용을 확인 후 예약을 확정하며, 필요한 경우 예약을 거부할 수 있습니다.</li>
        </ol>
      </Section>

      <Section title="제6조 (예약 취소 및 환불)">
        <ol>
          <li>이용자는 다음 기준에 따라 예약을 취소할 수 있으며, 취소 시점에 따라 위약금이 부과됩니다.
            <ul>
              <li>예약 후 2시간 이내 취소: 전액 환불</li>
              <li>이용일 6일 전까지 취소: 이용료의 30% 위약금 부과</li>
              <li>이용일 2일~5일 전 취소: 이용료의 50% 위약금 부과</li>
              <li>이용일 당일 취소 또는 미이용: 환불 불가 (이용료의 100% 위약금)</li>
            </ul>
          </li>
          <li>환불은 결제 수단에 따라 처리되며, 카드 결제의 경우 카드사 정책에 따라 환불 처리 기간이 상이할 수 있습니다.</li>
          <li>천재지변, 기상악화 등 불가항력적 사유로 인한 취소 시 회사와 협의하여 처리합니다.</li>
        </ol>
      </Section>

      <Section title="제7조 (이용자의 의무)">
        <ol>
          <li>이용자는 예약 시 정확한 정보를 제공하여야 합니다.</li>
          <li>이용자는 타인의 개인정보를 도용하여 예약하여서는 안 됩니다.</li>
          <li>이용자는 서비스 이용 시 관련 법령, 본 약관 및 회사가 정한 이용 규칙을 준수하여야 합니다.</li>
        </ol>
      </Section>

      <Section title="제8조 (회사의 의무)">
        <ol>
          <li>회사는 관련 법령과 본 약관에서 정한 바에 따라 지속적이고 안정적으로 서비스를 제공하기 위해 노력합니다.</li>
          <li>회사는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를 준수합니다.</li>
        </ol>
      </Section>

      <Section title="제9조 (면책사항)">
        <ol>
          <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</li>
          <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
        </ol>
      </Section>

      <Section title="제10조 (분쟁 해결)">
        <ol>
          <li>회사와 이용자 간에 발생한 분쟁에 대해 양 당사자는 원만한 해결을 위해 성실히 협의합니다.</li>
          <li>협의가 이루어지지 않을 경우, 관할 법원에 소를 제기할 수 있습니다.</li>
        </ol>
      </Section>

      <p style={{ marginTop: 32, color: "#888" }}>부칙: 본 약관은 2026년 03월 17일부터 시행합니다.</p>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: "var(--fs-body-sm)", fontWeight: 700, marginBottom: 8 }}>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
