"use client";

import Modal from "@/components/modal/Modal";
import ReservationGuideContent from "@/components/common/ReservationGuideContent";

interface ReservationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHideToday: () => void;
}

export default function ReservationGuideModal({ isOpen, onClose, onHideToday }: ReservationGuideModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="개인·단체예약 안내"
      footer={
        <>
          <button type="button" className="modal-btn modal-btn-secondary" onClick={onHideToday}>
            오늘 하루 보지 않기
          </button>
          <button type="button" className="modal-btn modal-btn-primary" onClick={onClose}>
            닫기
          </button>
        </>
      }
    >
      <ReservationGuideContent />
    </Modal>
  );
}
