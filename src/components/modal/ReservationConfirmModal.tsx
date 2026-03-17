"use client";

import Modal from "./Modal";
import type { ReservationType, ReservationFormData } from "@/types";

interface ReservationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ReservationType;
  date: string;
  timeSlot: string;
  formData: ReservationFormData;
  totalAmount: number;
}

export default function ReservationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  date,
  timeSlot,
  formData,
  totalAmount,
}: ReservationConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="예약 결제 확인"
      footer={
        <>
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            취소
          </button>
          <button className="modal-btn modal-btn-primary" onClick={onConfirm}>
            결제하기
          </button>
        </>
      }
    >
      <div className="confirm-row">
        <span className="confirm-label">구분</span>
        <span className="confirm-value">
          {type === "individual" ? "개인" : "단체"}
        </span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">날짜</span>
        <span className="confirm-value">{date}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">시간</span>
        <span className="confirm-value">{timeSlot}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">신청인</span>
        <span className="confirm-value">{formData.name}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">이메일</span>
        <span className="confirm-value">{formData.email}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">연락처</span>
        <span className="confirm-value">{formData.phone}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">참여 인원</span>
        <span className="confirm-value">{formData.totalPeople}명</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">비상연락처</span>
        <span className="confirm-value">{formData.emergencyContact}</span>
      </div>
      <div className="confirm-row" style={{ borderTop: "2px solid #e0e0e0", paddingTop: 12, marginTop: 4 }}>
        <span className="confirm-label" style={{ fontWeight: 700, color: "var(--text)" }}>결제금액</span>
        <span className="confirm-value" style={{ color: "var(--primary)", fontSize: "1.125rem" }}>
          {totalAmount.toLocaleString()}원
        </span>
      </div>
    </Modal>
  );
}
