"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { formatPhone, filterName } from "@/lib/formatters";
import ReservationCancelModal from "@/components/modal/ReservationCancelModal";

interface ReservationResult {
  id: number;
  date: string;
  timeSlot: string;
  type: string;
  name: string;
  email: string | null;
  phone: string;
  totalPeople: number;
  program: string | null;
  amountPaid: number;
  amountCancelled: number;
  status: string;
  createdAt: string;
}

interface CancelPreview {
  createdAt: string;
  timeSlot: string;
  name: string;
  amountPaid: number;
  refundAmount: number;
  refundLabel: string;
  policy: { label: string; penalty: string; refund: string }[];
}

export default function ReservationCheckSection() {
  const [checkName, setCheckName] = useState("");
  const [checkPhone, setCheckPhone] = useState("");
  const [results, setResults] = useState<ReservationResult[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);
  const [cancelPreview, setCancelPreview] = useState<CancelPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleNameChange = (value: string) => {
    setCheckName(filterName(value));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSearching(true);
    try {
      const res = await fetchApi("/api/reservations/check", {
        method: "POST",
        body: JSON.stringify({ name: checkName, phone: checkPhone }),
      });
      if (res.ok) {
        setResults(await res.json());
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
    setSearching(false);
    setTimeout(() => {
      const el = document.getElementById("check-results");
      const header = document.querySelector(".header-fixed-wrapper") as HTMLElement;
      if (el) {
        const offset = header ? header.offsetHeight + 16 : 16;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const openCancelModal = async (id: number) => {
    setCancelTargetId(id);
    setPreviewLoading(true);
    setCancelPreview(null);
    try {
      const res = await fetchApi(`/api/reservations/${id}/cancel-preview`);
      if (res.ok) {
        setCancelPreview(await res.json());
      } else {
        alert("취소 정보를 불러올 수 없습니다.");
        setCancelTargetId(null);
      }
    } catch {
      alert("취소 정보를 불러올 수 없습니다.");
      setCancelTargetId(null);
    }
    setPreviewLoading(false);
  };

  const handleCancel = async () => {
    if (!cancelTargetId) return;
    setCancelling(true);
    try {
      const res = await fetchApi(`/api/reservations/${cancelTargetId}/cancel`, { method: "PATCH" });
      if (res.ok) {
        const data = await res.json();
        setCancelling(false);
        setCancelTargetId(null);
        setCancelPreview(null);
        alert(data.message || "예약이 취소되었습니다.");
        setResults((prev) => prev?.map((r) => r.id === cancelTargetId ? { ...r, status: "취소" } : r) || null);
        return;
      } else {
        const data = await res.json();
        setCancelling(false);
        alert(data.message || "취소에 실패했습니다.");
      }
    } catch {
      setCancelling(false);
      alert("취소에 실패했습니다.");
    }
  };

  const isSearchValid = checkName.trim() && checkPhone.trim();

  return (
    <div>
      <div className="reservation-form">
        <h3 className="form-title">예약 조회</h3>
        <p className="check-desc">
          예약 시 입력한 정보를 정확히 입력해주세요.
        </p>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">
              신청인 성명<span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="성명을 입력하세요"
              value={checkName}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              연락처<span className="required">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="010-0000-0000"
              value={checkPhone}
              onChange={(e) => setCheckPhone(formatPhone(e.target.value))}
              maxLength={13}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!isSearchValid}
          >
            예약 조회하기
          </button>
        </form>
      </div>

      {searched && (
        <div className="check-results" id="check-results">
          {searching ? (
            <div className="check-result-list">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="check-result-card">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <div key={j} className="check-result-row">
                      <div className="skeleton-box" style={{ width: "20%", height: 14 }} />
                      <div className="skeleton-box" style={{ width: "30%", height: 14 }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <div className="check-result-list">
              {results.map((item, i) => (
                <div key={i} className="check-result-card">
                  <div className="check-result-row">
                    <span className="check-result-label">날짜</span>
                    <span className="check-result-value">{item.date}</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">시간</span>
                    <span className="check-result-value">{item.timeSlot}</span>
                  </div>
                  {item.program && (
                    <div className="check-result-row">
                      <span className="check-result-label">프로그램</span>
                      <span className="check-result-value">{item.program}</span>
                    </div>
                  )}
                  <div className="check-result-row">
                    <span className="check-result-label">구분</span>
                    <span className="check-result-value">{item.type}</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">신청인</span>
                    <span className="check-result-value">{item.name}</span>
                  </div>
                  {item.email && (
                    <div className="check-result-row">
                      <span className="check-result-label">이메일</span>
                      <span className="check-result-value">{item.email}</span>
                    </div>
                  )}
                  <div className="check-result-row">
                    <span className="check-result-label">인원</span>
                    <span className="check-result-value">{item.totalPeople}명</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">결제금액</span>
                    <span className="check-result-value">
                      {item.status === "취소" && item.amountPaid > 0
                        ? item.amountCancelled >= item.amountPaid
                          ? `${item.amountPaid.toLocaleString()}원 (환불완료)`
                          : item.amountCancelled > 0
                            ? `${item.amountPaid.toLocaleString()}원 (${item.amountCancelled.toLocaleString()}원 환불)`
                            : `${item.amountPaid.toLocaleString()}원 (환불없음)`
                        : item.amountPaid > 0
                          ? `${item.amountPaid.toLocaleString()}원`
                          : "미결제"}
                    </span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">상태</span>
                    <span className={`check-result-value check-status ${item.status === "취소" ? "check-status-canceled" : ""}`}>{item.status}</span>
                  </div>
                  {item.status !== "취소" && new Date(item.date + "T00:00:00") > new Date(new Date().toDateString()) && (
                    <button className="cancel-btn" onClick={() => openCancelModal(item.id)}>
                      취소하기
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="check-empty">
              <p>조회된 예약이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      <ReservationCancelModal
        isOpen={cancelTargetId !== null}
        onClose={() => { setCancelTargetId(null); setCancelPreview(null); }}
        onConfirm={handleCancel}
        loading={previewLoading}
        createdAt={cancelPreview?.createdAt || ""}
        timeSlot={cancelPreview?.timeSlot || ""}
        name={cancelPreview?.name || ""}
        amountPaid={cancelPreview?.amountPaid || 0}
        refundAmount={cancelPreview?.refundAmount || 0}
        refundLabel={cancelPreview?.refundLabel || ""}
        policy={cancelPreview?.policy || []}
      />

      {cancelling && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
