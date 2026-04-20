"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MobileInfoCard from "@/components/common/MobileInfoCard";
import Modal from "@/components/modal/Modal";
import { fetchApi } from "@/lib/api";
import { useProgramFees } from "@/lib/useProgramFees";

interface Program { id: number; name: string; description: string; image_url: string | null; }

const USAGE_TABS = ["프로그램", "개인·단체예약", "체험비·환불규정", "대관문의"];
const PERIOD_LABELS: Record<string, string> = { morning: "오전", afternoon: "오후", night: "야간", all_day: "종일" };

export default function UsageGuideSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const { programFees, loading: loadingFees } = useProgramFees();
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [feeProgram, setFeeProgram] = useState<Program | null>(null);

  useEffect(() => {
    fetchApi("/api/programs").then((r) => r.json()).then((data: Program[]) => {
      setPrograms(data);
      if (data.length > 0) {
        setSelectedProgram(data[0]);
        setFeeProgram(data[0]);
      }
    }).catch(() => {}).finally(() => setLoadingPrograms(false));
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
            <>
              {/* 데스크톱: 두 패널 */}
              <div className="program-panel-layout">
                <div className="program-panel-list">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className={`program-panel-item ${selectedProgram?.id === program.id ? "active" : ""}`}
                      onClick={() => setSelectedProgram(program)}
                    >
                      <p className="program-item-name">{program.name}</p>
                    </div>
                  ))}
                </div>
                <div className="program-panel-detail">
                  {selectedProgram ? (
                    <>
                      <h3 className="program-panel-detail-title">{selectedProgram.name}</h3>
                      <div className="program-panel-detail-body">
                        {selectedProgram.image_url && (
                          <div className="program-panel-detail-image">
                            <Image
                              src={selectedProgram.image_url}
                              alt={selectedProgram.name}
                              width={600}
                              height={400}
                              sizes="(min-width: 1024px) 30vw, 100vw"
                            />
                          </div>
                        )}
                        <div className="program-panel-detail-content">{selectedProgram.description}</div>
                      </div>
                    </>
                  ) : (
                    <p className="program-panel-detail-empty">프로그램을 선택해주세요.</p>
                  )}
                </div>
              </div>
              {/* 모바일: 카드 리스트 */}
              <div className="program-mobile-list program-select-list">
                {programs.map((program) => (
                  <MobileInfoCard
                    key={program.id}
                    selected={selectedProgram?.id === program.id}
                    title={program.name}
                    subtitle={program.description}
                    onClick={() => {
                      setSelectedProgram(program);
                      setIsProgramModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </>
          )}
          <p className="program-notice">프로그램은 계절 및 운영 상황에 따라 변경될 수 있습니다.</p>
        </div>

        {/* 개인·단체예약 */}
        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
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
        </div>

        {/* 체험비·환불규정 */}
        <div className={`tab-content ${activeTab === 2 ? "active" : ""}`}>
          <div className="fee-refund-layout">
            <div className="fee-refund-panel">
              <div className="fee-title-nav">
                <button
                  className="fee-nav-btn"
                  onClick={() => {
                    const idx = programs.findIndex((p) => p.id === feeProgram?.id);
                    if (idx > 0) setFeeProgram(programs[idx - 1]);
                  }}
                  disabled={programs.findIndex((p) => p.id === feeProgram?.id) <= 0}
                >&lt;</button>
                <h4 className="refund-title">{feeProgram?.name ?? ""} 체험비</h4>
                <button
                  className="fee-nav-btn"
                  onClick={() => {
                    const idx = programs.findIndex((p) => p.id === feeProgram?.id);
                    if (idx < programs.length - 1) setFeeProgram(programs[idx + 1]);
                  }}
                  disabled={programs.findIndex((p) => p.id === feeProgram?.id) >= programs.length - 1}
                >&gt;</button>
              </div>
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
                  ) : (["morning", "afternoon", "night", "all_day"] as const)
                    .map((period) => {
                      const individual = programFees.find(
                        (f) => f.program_id === feeProgram?.id && f.reservation_type === "individual" && f.period === period
                      );
                      const group = programFees.find(
                        (f) => f.program_id === feeProgram?.id && f.reservation_type === "group" && f.period === period
                      );
                      return { period, individual, group };
                    })
                    .filter(({ individual, group }) => (individual?.price ?? 0) > 0 || (group?.price ?? 0) > 0)
                    .map(({ period, individual, group }) => (
                      <tr key={period}>
                        <td>{PERIOD_LABELS[period]}</td>
                        <td>{individual ? `${individual.price.toLocaleString()}원` : "-"}</td>
                        <td>{group ? `${group.price.toLocaleString()}원` : "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p className="fee-notice">단체는 10인 이상입니다.</p>
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
                  <tr><td>이용일 6일 전까지 취소</td><td>체험비의 30%</td><td>체험비의 70%</td></tr>
                  <tr><td>이용일 2~5일 전 취소</td><td>체험비의 50%</td><td>체험비의 50%</td></tr>
                  <tr><td>이용일 당일 취소</td><td>체험비의 100%</td><td>환불 불가</td></tr>
                  <tr><td>예약 후 미이용 (노쇼)</td><td>체험비의 100%</td><td>환불 불가</td></tr>
                </tbody>
              </table>
              <p className="fee-notice">천재지변으로 프로그램 운영이 중단되는 경우 전액 환불됩니다.</p>
            </div>
          </div>
        </div>

        {/* 대관문의 */}
        <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
          <div className="usage-info-content">
            <h4>대관 안내</h4>
            <ul>
              <li>행사, 워크숍, 교육 등 다양한 목적의 대관이 가능합니다.</li>
              <li>대관 가능 시설 및 이용 조건은 문의 시 안내드립니다.</li>
            </ul>
            <h4>문의 방법</h4>
            <ul>
              <li>전화: 0507-1317-1974</li>
              <li>이메일: dis2412@naver.com</li>
            </ul>
            <p className="usage-info-notice">대관 일정은 사전 협의가 필요하며, 운영 상황에 따라 조정될 수 있습니다.</p>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        title={selectedProgram?.name || "프로그램 상세"}
      >
        {selectedProgram && (
          <div className="program-mobile-modal-content">
            {selectedProgram.image_url && (
              <div className="program-mobile-modal-image">
                <Image
                  src={selectedProgram.image_url}
                  alt={selectedProgram.name}
                  width={600}
                  height={400}
                  sizes="100vw"
                />
              </div>
            )}
            <div className="program-mobile-modal-desc">{selectedProgram.description}</div>
          </div>
        )}
      </Modal>
    </section>
  );
}
