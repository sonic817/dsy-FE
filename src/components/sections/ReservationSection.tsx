"use client";

import { useState } from "react";
import Calendar from "@/components/common/Calendar";
import ReservationConfirmModal from "@/components/modal/ReservationConfirmModal";
import ReservationCompleteModal from "@/components/modal/ReservationCompleteModal";
import { TIME_SLOTS } from "@/constants";
import type { ReservationType, ReservationFormData } from "@/types";

export default function ReservationSection() {
  const [type, setType] = useState<ReservationType>("individual");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [formData, setFormData] = useState<ReservationFormData>({
    name: "",
    phone: "",
    totalPeople: "",
    emergencyContact: "",
  });

  const handleNameChange = (value: string) => {
    const filtered = value.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, name: filtered }));
  };

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (field: "phone" | "emergencyContact", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: formatPhone(value) }));
  };

  const handlePeopleChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    const formatted = digits ? Number(digits).toLocaleString() : "";
    setFormData((prev) => ({ ...prev, totalPeople: formatted }));
  };

  const handleInputChange = (field: keyof ReservationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setTimeout(() => {
      const el = document.getElementById("reservation-form");
      const header = document.querySelector(".header-fixed-wrapper") as HTMLElement;
      if (el) {
        const offset = header ? header.offsetHeight : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setIsCompleteOpen(true);
    // TODO: API 연동
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
    selectedSlot &&
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.totalPeople.trim() &&
    formData.emergencyContact.trim();

  return (
    <section id="reservation" className="section reservation-section">
      <div className="container">
        <h2 className="section-title">예약</h2>

        {/* 개인 / 단체 탭 */}
        <div className="reservation-type-tabs">
          <button
            className={`type-tab individual ${type === "individual" ? "active" : ""}`}
            onClick={() => setType("individual")}
          >
            개인
          </button>
          <button
            className={`type-tab group ${type === "group" ? "active" : ""}`}
            onClick={() => setType("group")}
          >
            단체
          </button>
        </div>

        <div className="reservation-layout">
        <div className="reservation-left">
        {/* 달력 */}
        <Calendar selectedDate={selectedDate} onDateSelect={(date) => {
          setSelectedDate(date);
          setTimeout(() => {
            const el = document.getElementById("time-slots");
            const header = document.querySelector(".header-fixed-wrapper") as HTMLElement;
            if (el) {
              const offset = header ? header.offsetHeight : 0;
              const top = el.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }, 100);
        }} />

        {/* 선택된 날짜 표시 */}
        {selectedDate && (
          <div className="selected-date-display">
            {formatDate(selectedDate)}
          </div>
        )}

        {/* 시간 선택 */}
        {selectedDate ? (
          <div className="time-slots" id="time-slots">
            <h3 className="time-slots-title">시간 선택</h3>

            <div className="time-slot-group">
              <p className="time-slot-group-label">
                <span className="dot morning" />
                오전
              </p>
              <div className="time-slot-grid">
                {TIME_SLOTS.morning.map((slot) => (
                  <button
                    key={slot}
                    className={`time-slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="time-slot-group">
              <p className="time-slot-group-label">
                <span className="dot afternoon" />
                오후
              </p>
              <div className="time-slot-grid">
                {TIME_SLOTS.afternoon.map((slot) => (
                  <button
                    key={slot}
                    className={`time-slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="time-slot-group">
              <p className="time-slot-group-label">
                <span className="dot night" />
                야간
              </p>
              <div className="time-slot-grid night-grid">
                {TIME_SLOTS.night.map((slot) => (
                  <button
                    key={slot}
                    className={`time-slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        </div>
        {/* 신청 폼 */}
        <form className="reservation-form" id="reservation-form" onSubmit={handleSubmit}>
          <h3 className="form-title">
            {type === "individual" ? "개인" : "단체"} 예약 신청
          </h3>

          {/* 요약 */}
          <div className="form-summary">
            <div className="form-summary-row">
              <span className="label">구분</span>
              <span className="value">
                {type === "individual" ? "개인" : "단체"}
              </span>
            </div>
            <div className="form-summary-row">
              <span className="label">날짜</span>
              <span className="value">
                {selectedDate ? formatDate(selectedDate) : "미선택"}
              </span>
            </div>
            <div className="form-summary-row">
              <span className="label">시간</span>
              <span className="value">{selectedSlot || "미선택"}</span>
            </div>
          </div>

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

          <div className="form-group">
            <label className="form-label">
              비상연락처 (신청인 외)<span className="required">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="010-0000-0000"
              value={formData.emergencyContact}
              onChange={(e) =>
                handlePhoneChange("emergencyContact", e.target.value)
              }
              maxLength={13}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid}
          >
            예약 신청하기
          </button>
        </form>
        </div>
      </div>

      <ReservationConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        type={type}
        date={selectedDate ? formatDate(selectedDate) : ""}
        timeSlot={selectedSlot || ""}
        formData={formData}
      />

      <ReservationCompleteModal
        isOpen={isCompleteOpen}
        onClose={() => {
          setIsCompleteOpen(false);
          setFormData({ name: "", phone: "", totalPeople: "", emergencyContact: "" });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </section>
  );
}
