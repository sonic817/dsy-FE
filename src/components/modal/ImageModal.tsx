"use client";

import { useEffect, useRef, useCallback } from "react";
import Modal from "./Modal";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function ImageModal({ isOpen, onClose, src, alt, onPrev, onNext }: ImageModalProps) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold && onNext) {
      onNext();
    } else if (diff < -threshold && onPrev) {
      onPrev();
    }
  }, [onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <>
      {/* 모바일: 풀스크린 라이트박스 + 스와이프 */}
      <div className="lightbox" onClick={onClose}>
        <div
          className="lightbox-content"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="lightbox-close" onClick={onClose}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M14 14L26 26M26 14L14 26" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          {onPrev && (
            <button className="image-modal-nav prev" onClick={onPrev}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
          <img src={src} alt={alt} className="lightbox-img" />
          {onNext && (
            <button className="image-modal-nav next" onClick={onNext}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* 데스크톱: 기존 모달 */}
      <div className="image-modal-desktop">
        <Modal isOpen={true} onClose={onClose} title={alt} large>
          <div className="image-modal-body">
            {onPrev && (
              <button className="image-modal-nav prev" onClick={onPrev}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            <img
              src={src}
              alt={alt}
              style={{ width: "100%", height: "calc(90vh - 120px)", objectFit: "contain", borderRadius: 8, display: "block" }}
            />
            {onNext && (
              <button className="image-modal-nav next" onClick={onNext}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}
