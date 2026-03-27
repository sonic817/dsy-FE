"use client";

import Modal from "./Modal";

interface ReservationCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationCompleteModal({
  isOpen,
  onClose,
}: ReservationCompleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="예약 신청 완료"
      footer={
        <button className="modal-btn modal-btn-primary" onClick={onClose}>
          확인
        </button>
      }
    >
      <p style={{ textAlign: "center", fontSize: "var(--fs-body-sm)", color: "#333", lineHeight: 1.8 }}>
        예약이 신청되었습니다.
      </p>
    </Modal>
  );
}
