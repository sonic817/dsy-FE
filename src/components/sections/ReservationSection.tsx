"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Calendar from "@/components/common/Calendar";
import MobileInfoCard from "@/components/common/MobileInfoCard";
import Modal from "@/components/modal/Modal";
import ReservationConfirmModal from "@/components/modal/ReservationConfirmModal";
import ReservationCompleteModal from "@/components/modal/ReservationCompleteModal";
import ReservationCheckSection from "@/components/sections/ReservationCheckSection";
import { fetchApi } from "@/lib/api";
import { useProgramFees } from "@/lib/useProgramFees";
import { formatPhone, filterName } from "@/lib/formatters";
import type { ReservationType, ReservationFormData } from "@/types";

interface SlotInfo {
  id: number;
  name: string;
  period: string;
  maxCapacity: number;
  currentCount: number;
  sortOrder: number;
}

interface Program {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
}

type ReservationTab = "reserve" | "check";

export default function ReservationSection() {
  const [activeTab, setActiveTab] = useState<ReservationTab>("reserve");
  const [type, setType] = useState<ReservationType>("individual");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isProgramPreviewOpen, setIsProgramPreviewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const { programFees } = useProgramFees();
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReservationFormData>({
    name: "",
    email: "",
    phone: "",
    totalPeople: "",
    emergencyContact: "",
  });

  const timePanelRef = useRef<HTMLDivElement>(null);
  const programPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApi("/api/programs")
      .then((r) => r.json())
      .then(setPrograms)
      .catch(() => {})
      .finally(() => setLoadingPrograms(false));
  }, []);

  useEffect(() => {
    const timeEl = timePanelRef.current;
    const programEl = programPanelRef.current;
    if (!timeEl || !programEl) return;

    const sync = () => {
      programEl.style.maxHeight = `${timeEl.offsetHeight}px`;
    };
    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(timeEl);
    return () => observer.disconnect();
  }, [selectedProgram, slots, loadingSlots]);

  const fetchSlots = useCallback(async (date: Date, programId: number) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    setLoadingSlots(true);
    try {
      const res = await fetchApi(`/api/time-slots?date=${y}-${m}-${d}&programId=${programId}`);
      if (res.ok) setSlots(await res.json());
    } catch { /* */ }
    setLoadingSlots(false);
  }, []);

  useEffect(() => {
    if (selectedDate && selectedProgram) fetchSlots(selectedDate, selectedProgram.id);
  }, [selectedDate, selectedProgram, fetchSlots]);

  const morningSlots = useMemo(() => slots.filter(s => s.period === "morning"), [slots]);
  const afternoonSlots = useMemo(() => slots.filter(s => s.period === "afternoon"), [slots]);
  const nightSlots = useMemo(() => slots.filter(s => s.period === "night"), [slots]);
  const allDaySlots = useMemo(() => slots.filter(s => s.period === "all_day"), [slots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedProgram(null);
    setIsProgramPreviewOpen(false);
    setSelectedSlot(null);
    setSelectedSlotId(null);
    setTimeout(() => {
      const el = document.getElementById("program-slots-area");
      const header = document.querySelector(".header-fixed-wrapper") as HTMLElement;
      if (el) {
        const offset = header ? header.offsetHeight : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setIsProgramPreviewOpen(false);
    } else {
      setIsProgramPreviewOpen(true);
    }
    setSelectedSlot(null);
    setSelectedSlotId(null);
  };

  const handleSlotSelect = (slot: SlotInfo) => {
    setSelectedSlotId(slot.id);
    setSelectedSlot(slot.name);
    setTimeout(() => {
      const el = document.getElementById("reservation-form-wrapper");
      const header = document.querySelector(".header-fixed-wrapper") as HTMLElement;
      if (el) {
        const offset = header ? header.offsetHeight : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: filterName(value) }));
  };

  const handlePhoneChange = (field: "phone" | "emergencyContact", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: formatPhone(value) }));
  };

  const handlePeopleChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    const formatted = digits ? Number(digits).toLocaleString() : "";
    setFormData((prev) => ({ ...prev, totalPeople: formatted }));
  };

  const getUnitPrice = () => {
    if (!selectedSlot || !selectedProgram) return 0;
    const slotInfo = slots.find((s) => s.name === selectedSlot);
    if (!slotInfo) return 0;
    const fee = programFees.find(
      (f) => f.program_id === selectedProgram.id && f.reservation_type === type && f.period === slotInfo.period
    );
    if (!fee) return 0;
    return fee.price;
  };

  const unitPrice = getUnitPrice();
  const peopleCount = Number(formData.totalPeople.replace(/,/g, "") || "0");
  const totalAmount = unitPrice * peopleCount;
  const reservationTypeLabel = type === "individual" ? "개인" : "단체";
  const showPriceSummary = unitPrice > 0 && peopleCount > 0;
  const timeSlotSkeletonGroups = [
    { label: "오전", count: 4, gridClass: "" },
    { label: "오후", count: 4, gridClass: "" },
    { label: "야간", count: 2, gridClass: "night" },
    { label: "종일", count: 2, gridClass: "" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    setSubmitting(true);
    try {
      const y = selectedDate!.getFullYear();
      const m = String(selectedDate!.getMonth() + 1).padStart(2, "0");
      const d = String(selectedDate!.getDate()).padStart(2, "0");

      const prepareRes = await fetchApi("/api/reservations/prepare", {
        method: "POST",
        body: JSON.stringify({
          type,
          date: `${y}-${m}-${d}`,
          programTimeSlotId: selectedSlotId,
          programId: selectedProgram!.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          totalPeople: Number(formData.totalPeople.replace(/,/g, "")),
          emergencyContact: formData.emergencyContact.trim(),
        }),
      });

      if (!prepareRes.ok) {
        const data = await prepareRes.json();
        alert(data.message || "예약 준비에 실패했습니다.");
        setSubmitting(false);
        return;
      }

      const { orderId, expectedAmount } = await prepareRes.json();

      const hasPayment = process.env.NEXT_PUBLIC_PORTONE_STORE_ID && process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

      if (hasPayment) {
        const PortOne = await import("@portone/browser-sdk/v2");
        let payment;
        try {
          payment = await PortOne.requestPayment({
            storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
            channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
            paymentId: orderId,
            orderName: `다율숲 숲체험 예약 (${selectedSlot})`,
            totalAmount: expectedAmount,
            currency: "KRW",
            payMethod: "CARD",
            redirectUrl: `${window.location.origin}/payment-complete?orderId=${orderId}&expectedAmount=${expectedAmount}`,
            customer: {
              fullName: formData.name.trim(),
              phoneNumber: formData.phone.trim().replace(/-/g, ""),
              email: formData.email.trim(),
            },
          });
        } catch {
          await fetchApi(`/api/reservations/${orderId}/cleanup`, { method: "DELETE" }).catch(() => {});
          alert("결제창을 열 수 없습니다.");
          setSubmitting(false);
          return;
        }

        if (payment?.code != null) {
          await fetchApi(`/api/reservations/${orderId}/cleanup`, { method: "DELETE" }).catch(() => {});
          setSubmitting(false);
          return;
        }

        const completeRes = await fetchApi("/api/reservations/complete", {
          method: "POST",
          body: JSON.stringify({ orderId, expectedAmount }),
        });

        if (!completeRes.ok) {
          const data = await completeRes.json();
          alert(data.message || "결제 검증에 실패했습니다.");
          setSubmitting(false);
          return;
        }
      } else {
        const completeRes = await fetchApi("/api/reservations/complete-without-payment", {
          method: "POST",
          body: JSON.stringify({ orderId }),
        });

        if (!completeRes.ok) {
          const data = await completeRes.json();
          alert(data.message || "예약 처리에 실패했습니다.");
          setSubmitting(false);
          return;
        }
      }

      setSubmitting(false);
      setIsCompleteOpen(true);
    } catch {
      setSubmitting(false);
      alert("결제에 실패했습니다.");
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const wd = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${wd})`;
  };

  const isFormValid =
    selectedDate &&
    selectedProgram &&
    selectedSlot &&
    unitPrice > 0 &&
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.totalPeople.trim() &&
    peopleCount > 0;

  return (
    <section id="reservation" className="section reservation-section">
      <div className="container">
        <h2 className="section-title">예약</h2>

        <div className="reservation-main-tabs">
          <button
            className={`reservation-main-tab ${activeTab === "reserve" ? "active" : ""}`}
            onClick={() => setActiveTab("reserve")}
          >
            예약하기
          </button>
          <button
            className={`reservation-main-tab ${activeTab === "check" ? "active" : ""}`}
            onClick={() => setActiveTab("check")}
          >
            예약확인
          </button>
        </div>

        {activeTab === "check" && <ReservationCheckSection />}

        {activeTab === "reserve" && (<>
        {/* 달력 */}
        <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />

        {selectedDate && (
          <div className="selected-date-display">
            {formatDate(selectedDate)}
          </div>
        )}

        {/* 프로그램 선택 + 시간 선택 */}
        {selectedDate && (
          <div id="program-slots-area">
            <div className="program-time-area">
            <div className="program-select-panel" ref={programPanelRef}>
              <h3 className="step-title">프로그램 선택</h3>
              {loadingPrograms ? (
                <div className="program-select-skeleton">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton-box" style={{ height: 56, borderRadius: 8 }} />
                  ))}
                </div>
              ) : (
                <div className="program-select-list">
                  {programs.map((program) => (
                    <MobileInfoCard
                      key={program.id}
                      selected={selectedProgram?.id === program.id}
                      title={program.name}
                      onClick={() => handleProgramSelect(program)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="time-select-panel" ref={timePanelRef}>
              <h3 className="step-title">시간 선택</h3>
              {!selectedProgram ? (
                <div id="time-slots" className="time-slots-placeholder">
                  <div className="time-slots-placeholder-skeleton" aria-hidden="true">
                    {timeSlotSkeletonGroups.map((group) => (
                      <div key={group.label} className="slot-skeleton-group">
                        <div className="skeleton-box slot-skeleton-label" />
                        <div className={`slot-skeleton-grid ${group.gridClass}`}>
                          {Array.from({ length: group.count }).map((_, i) => (
                            <div key={i} className="skeleton-box slot-skeleton-btn" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="time-slots-placeholder-text">프로그램을 먼저 선택해 주세요.</p>
                </div>
              ) : loadingSlots ? (
                <div id="time-slots">
                  {timeSlotSkeletonGroups.map((group) => (
                    <div key={group.label} className="slot-skeleton-group">
                      <div className="skeleton-box slot-skeleton-label" />
                      <div className={`slot-skeleton-grid ${group.gridClass}`}>
                        {Array.from({ length: group.count }).map((_, i) => (
                          <div key={i} className="skeleton-box slot-skeleton-btn" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : slots.length > 0 ? (
                <div id="time-slots">
                  {[
                    { label: "오전", dotClass: "morning", items: morningSlots, gridClass: "" },
                    { label: "오후", dotClass: "afternoon", items: afternoonSlots, gridClass: "" },
                    { label: "야간", dotClass: "night", items: nightSlots, gridClass: "night-grid" },
                    { label: "종일", dotClass: "allday", items: allDaySlots, gridClass: "" },
                  ].filter((group) => group.items.length > 0).map((group) => (
                    <div key={group.label} className="time-slot-group">
                      <p className="time-slot-group-label">
                        <span className={`dot ${group.dotClass}`} />
                        {group.label}
                      </p>
                      <div className={`time-slot-grid ${group.gridClass}`}>
                        {group.items.map((slot) => {
                          const isFull = slot.currentCount >= slot.maxCapacity;
                          return (
                            <button
                              key={slot.id}
                              className={`time-slot-btn ${selectedSlot === slot.name ? "selected" : ""} ${isFull ? "unavailable" : ""}`}
                              onClick={() => { if (!isFull) handleSlotSelect(slot); }}
                              disabled={isFull}
                            >
                              <span className="slot-name">{slot.name}</span>
                              <span className="slot-count">{isFull ? "마감" : `${slot.currentCount}/${slot.maxCapacity}`}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            </div>
          </div>
        )}

        {/* 예약 신청 */}
        {selectedDate && selectedSlot && (
        <div className="reservation-form-wrapper" id="reservation-form-wrapper">
          <div className="reservation-form-header">
            <h3 className="step-title">예약 신청</h3>
            <p className="reservation-form-desc">
              선택한 예약 정보를 확인한 뒤 신청자 정보를 입력해 주세요.
            </p>
          </div>
          <div className="reservation-form-layout">
            <aside className="form-summary">
              <div className="form-summary-head">
                <span className="form-summary-kicker">선택 내역</span>
                <strong className="form-summary-title">예약 정보</strong>
                <p className="form-summary-desc">
                  신청 전에 일정과 프로그램을 한 번 더 확인해 주세요.
                </p>
              </div>

              <div className="form-summary-emphasis">
                <span className="form-summary-emphasis-label">일시</span>
                <strong className="form-summary-emphasis-value">
                  {selectedDate ? formatDate(selectedDate) : "미선택"}
                </strong>
                <span className="form-summary-emphasis-subvalue">{selectedSlot || "미선택"}</span>
              </div>

              <div className="form-summary-details">
                <div className="form-summary-row">
                  <span className="label">프로그램</span>
                  <span className="value">{selectedProgram?.name || "미선택"}</span>
                </div>
                <div className="form-summary-row">
                  <span className="label">구분</span>
                  <span className="value">{reservationTypeLabel}</span>
                </div>
                <div className="form-summary-row">
                  <span className="label">체험비</span>
                  <span className="value">{unitPrice > 0 ? `${unitPrice.toLocaleString()}원 / 인` : "미선택"}</span>
                </div>
              </div>

              <div className={`form-summary-total ${showPriceSummary ? "ready" : ""}`}>
                <span className="form-summary-total-label">예상 결제금액</span>
                {showPriceSummary ? (
                  <>
                    <strong className="form-summary-total-value">
                      {totalAmount.toLocaleString()}원
                    </strong>
                    <span className="form-summary-total-meta">
                      {peopleCount}명 x {unitPrice.toLocaleString()}원
                    </span>
                  </>
                ) : (
                  <span className="form-summary-total-placeholder">
                    참여 인원을 입력하면 자동으로 계산됩니다.
                  </span>
                )}
              </div>
            </aside>

            <form className="reservation-form" id="reservation-form" onSubmit={handleSubmit}>
              <div className="reservation-form-section">
                <h4 className="form-section-title">예약 기본 정보</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      구분<span className="required">*</span>
                    </label>
                    <div className="form-type-select">
                      <button
                        type="button"
                        className={`form-type-btn ${type === "individual" ? "active" : ""}`}
                        onClick={() => setType("individual")}
                      >
                        개인
                      </button>
                      <button
                        type="button"
                        className={`form-type-btn ${type === "group" ? "active" : ""}`}
                        onClick={() => setType("group")}
                      >
                        단체
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      참여자 전체 수<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      placeholder={
                        type === "individual"
                          ? "참여 인원 수를 입력하세요"
                          : "단체 전체 인원 수를 입력하세요"
                      }
                      value={formData.totalPeople}
                      onChange={(e) => handlePeopleChange(e.target.value)}
                      maxLength={5}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="reservation-form-section">
                <h4 className="form-section-title">신청자 정보</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      신청인 성명<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="성명을 입력하세요"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      이메일<span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      연락처<span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="010-0000-0000"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange("phone", e.target.value)}
                      maxLength={13}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      비상연락처 (신청인 외)
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="010-0000-0000"
                      value={formData.emergencyContact}
                      onChange={(e) => handlePhoneChange("emergencyContact", e.target.value)}
                      maxLength={13}
                    />
                  </div>
                </div>
              </div>

              {showPriceSummary && (
                <div className="form-price-info">
                  <span className="form-price-label">결제 예정 금액</span>
                  <div className="form-price-inline">
                    <span className="form-price-calc">
                      {peopleCount}명 x {unitPrice.toLocaleString()}원 =
                    </span>
                    <span className="form-price-total">
                      {totalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid}
              >
                결제 및 예약하기
              </button>
            </form>
          </div>
        </div>
        )}
      </>)}
      </div>

      <ReservationConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        type={type}
        date={selectedDate ? formatDate(selectedDate) : ""}
        timeSlot={selectedSlot || ""}
        program={selectedProgram?.name || ""}
        formData={formData}
        totalAmount={totalAmount}
      />

      <ReservationCompleteModal
        isOpen={isCompleteOpen}
        onClose={() => {
          setIsCompleteOpen(false);
          setSelectedDate(null);
          setSelectedSlot(null);
          setSelectedSlotId(null);
          setSelectedProgram(null);
          setSlots([]);
          setFormData({ name: "", email: "", phone: "", totalPeople: "", emergencyContact: "" });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <Modal
        isOpen={isProgramPreviewOpen}
        onClose={() => setIsProgramPreviewOpen(false)}
        title={selectedProgram?.name || "프로그램 상세"}
      >
        {selectedProgram && (
          <div className="program-preview-modal-content">
            {selectedProgram.image_url && (
              <div className="program-preview-modal-image">
                <img
                  src={selectedProgram.image_url}
                  alt={selectedProgram.name}
                  className="program-preview-image"
                />
              </div>
            )}
            <div className="program-preview-modal-desc">{selectedProgram.description}</div>
          </div>
        )}
      </Modal>

      {submitting && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}
    </section>
  );
}
