"use client";

import { useEffect, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  large?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, footer, large }: ModalProps) {
  const preventScroll = useCallback((e: TouchEvent) => {
    const target = e.target as HTMLElement;
    const scrollable = target.closest(".modal-body, .cancel-policy-table-wrapper, .program-mobile-modal-content");
    if (!scrollable) {
      e.preventDefault();
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = scrollable;
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;
    if ((isAtTop && e.touches[0].clientY > 0) || (isAtBottom && e.touches[0].clientY < 0)) {
      // allow normal scroll within bounds
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", preventScroll, { passive: false });
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("touchmove", preventScroll);
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose, preventScroll]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${large ? "modal-large" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
