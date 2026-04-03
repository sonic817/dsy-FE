"use client";

import Modal from "./Modal";

interface NewsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  date: string;
  content: string;
  previousTitle?: string;
  nextTitle?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function NewsDetailModal({
  isOpen,
  onClose,
  title,
  date,
  content,
  previousTitle = "",
  nextTitle = "",
  onPrevious,
  onNext,
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
      <div className="news-detail-nav news-detail-nav-modal">
        <button
          type="button"
          className={`news-detail-nav-item ${onPrevious ? "" : "disabled"}`}
          onClick={onPrevious}
          disabled={!onPrevious}
        >
          <span className="news-detail-nav-label">이전글</span>
          <span className="news-detail-nav-title">{onPrevious ? previousTitle : "이전글이 없습니다."}</span>
        </button>
        <button
          type="button"
          className={`news-detail-nav-item ${onNext ? "" : "disabled"}`}
          onClick={onNext}
          disabled={!onNext}
        >
          <span className="news-detail-nav-label">다음글</span>
          <span className="news-detail-nav-title">{onNext ? nextTitle : "다음글이 없습니다."}</span>
        </button>
      </div>
    </Modal>
  );
}
