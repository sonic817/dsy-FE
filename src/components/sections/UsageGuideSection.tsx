"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useFees } from "@/lib/useFees";

interface Program { id: number; name: string; description: string; }

const USAGE_TABS = ["프로그램", "개인·단체예약", "대관문의", "이용료·환불규정"];
const PERIOD_LABELS: Record<string, string> = { morning: "오전", afternoon: "오후", night: "야간" };

export default function UsageGuideSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const { fees, loading: loadingFees } = useFees();
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    fetchApi("/api/programs").then((r) => r.json()).then(setPrograms).catch(() => {}).finally(() => setLoadingPrograms(false));
  }, []);

  return (
    <section id="usage" className="section usage-section">
      <div className="container">
        <h2 className="section-title">이용안내</h2>

        <div className="tabs">
          {USAGE_TABS.map((tab, index) => (
            <button
              key={index}
              className={`tab-btn ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 프로그램 */}
        <div className={`tab-content ${activeTab === 0 ? "active" : ""}`}>
          {loadingPrograms ? (
            <div className="program-skeleton">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="program-skeleton-item">
                  <div className="skeleton-box skeleton-title" />
                  <div className="skeleton-box skeleton-desc" />
                </div>
              ))}
            </div>
          ) : (
            <div className="program-list">
              {programs.map((program) => (
                <div key={program.id} className="program-card">
                  <h4>{program.name}</h4>
                  <p>{program.description}</p>
                </div>
              ))}
            </div>
          )}
          <p className="program-notice">프로그램은 계절 및 운영 상황에 따라 변경될 수 있습니다.</p>
        </div>

        {/* 개인·단체예약 */}
        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
          <div className="usage-info-content">
            <h4>개인 예약</h4>
            <ul>
              <li>1인 이상 신청 가능</li>
              <li>홈페이지 예약 메뉴에서 날짜 및 프로그램 선택 후 예약</li>
            </ul>
            <h4>단체 예약</h4>
            <ul>
              <li>10인 이상 단체 예약 가능</li>
              <li>전화(052-914-6967) 또는 이메일(dis2412@naver.com)로 사전 문의</li>
            </ul>
            <p className="usage-info-notice">예약 변경 및 취소는 이용일 기준 정책에 따라 처리됩니다.</p>
          </div>
        </div>

        {/* 대관문의 */}
        <div className={`tab-content ${activeTab === 2 ? "active" : ""}`}>
          <div className="usage-info-content">
            <h4>대관 안내</h4>
            <ul>
              <li>행사, 워크숍, 교육 등 다양한 목적의 대관이 가능합니다.</li>
              <li>대관 가능 시설 및 이용 조건은 문의 시 안내드립니다.</li>
            </ul>
            <h4>문의 방법</h4>
            <ul>
              <li>전화: 052-914-6967</li>
              <li>이메일: dis2412@naver.com</li>
            </ul>
            <p className="usage-info-notice">대관 일정은 사전 협의가 필요하며, 운영 상황에 따라 조정될 수 있습니다.</p>
          </div>
        </div>

        {/* 이용료·환불규정 */}
        <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
          <div className="fee-refund-layout">
            <div className="fee-refund-panel">
              <h4 className="refund-title">이용료</h4>
              <table className="fee-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>개인</th>
                    <th>단체</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingFees ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td><div className="skeleton-box" style={{ height: 14, width: "60%", margin: "0 auto" }} /></td>
                        <td><div className="skeleton-box" style={{ height: 14, width: "60%", margin: "0 auto" }} /></td>
                        <td><div className="skeleton-box" style={{ height: 14, width: "60%", margin: "0 auto" }} /></td>
                      </tr>
                    ))
                  ) : fees.map((fee) => (
                    <tr key={fee.id}>
                      <td>{PERIOD_LABELS[fee.period] || fee.period}</td>
                      <td>{fee.individual_price.toLocaleString()}원</td>
                      <td>{fee.group_price.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="fee-notice">이용료는 변경될 수 있습니다.</p>
            </div>
            <div className="fee-refund-panel">
              <h4 className="refund-title">취소 및 환불 규정</h4>
              <table className="fee-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>위약금</th>
                    <th>환불액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>예약 후 2시간 이내 취소</td><td>없음</td><td>전액 환불</td></tr>
                  <tr><td>이용일 6일 전까지 취소</td><td>이용료의 30%</td><td>이용료의 70%</td></tr>
                  <tr><td>이용일 2~5일 전 취소</td><td>이용료의 50%</td><td>이용료의 50%</td></tr>
                  <tr><td>이용일 당일 취소</td><td>이용료의 100%</td><td>환불 불가</td></tr>
                  <tr><td>예약 후 미이용 (노쇼)</td><td>이용료의 100%</td><td>환불 불가</td></tr>
                </tbody>
              </table>
              <p className="fee-notice">천재지변으로 프로그램 운영이 중단되는 경우 전액 환불됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
