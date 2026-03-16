"use client";

import Modal from "./Modal";

interface NewsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  date: string;
  content: string;
}

export default function NewsDetailModal({
  isOpen,
  onClose,
  title,
  date,
  content,
}: NewsDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <button className="modal-btn modal-btn-primary" onClick={onClose}>
          닫기
        </button>
      }
    >
      <p className="news-detail-date">{date}</p>
      <p className="news-detail-content">{content}</p>
    </Modal>
  );
}
