"use client";

import Modal from "./Modal";
import type { ReservationType, ReservationFormData } from "@/types";

type PaymentMethodOption = "CARD" | "TRANSFER";

interface ReservationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ReservationType;
  date: string;
  timeSlot: string;
  program: string;
  formData: ReservationFormData;
  totalAmount: number;
  paymentMethod: PaymentMethodOption;
  onPaymentMethodChange: (value: PaymentMethodOption) => void;
}

const paymentMethodOptions: Array<{
  value: PaymentMethodOption;
  label: string;
}> = [
  {
    value: "CARD",
    label: "카드 결제",
  },
  {
    value: "TRANSFER",
    label: "실시간 계좌이체",
  },
];

export default function ReservationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  date,
  timeSlot,
  program,
  formData,
  totalAmount,
  paymentMethod,
  onPaymentMethodChange,
}: ReservationConfirmModalProps) {
  const isGroup = type === "group";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isGroup ? "예약 신청 확인" : "예약 결제 확인"}
      footer={
        <>
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            취소
          </button>
          <button className="modal-btn modal-btn-primary" onClick={onConfirm}>
            {isGroup ? "신청하기" : "결제하기"}
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
        <span className="confirm-label">프로그램</span>
        <span className="confirm-value">{program}</span>
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
      {!isGroup && (
        <>
          <div className="confirm-row confirm-row-stacked">
            <span className="confirm-label">결제수단</span>
            <div className="confirm-payment-methods" role="radiogroup" aria-label="결제수단 선택">
              {paymentMethodOptions.map((option) => (
                <label
                  key={option.value}
                  className={`confirm-payment-method ${paymentMethod === option.value ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => onPaymentMethodChange(option.value)}
                  />
                  <span className="confirm-payment-method-title">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="confirm-row" style={{ borderTop: "2px solid #e0e0e0", paddingTop: 12, marginTop: 4 }}>
            <span className="confirm-label" style={{ fontWeight: 700, color: "var(--text)" }}>결제금액</span>
            <span className="confirm-value" style={{ color: "var(--primary)", fontSize: "var(--fs-body-lg)" }}>
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </>
      )}
    </Modal>
  );
}
