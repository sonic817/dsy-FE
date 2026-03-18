"use client";

import { useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  onPrev?: () => void;
  onNext?: () => void;
  list?: { src: string; alt: string }[];
  index?: number;
  onSlideChange?: (index: number) => void;
}

export default function ImageModal({ isOpen, onClose, src, alt, onPrev, onNext, list, index, onSlideChange }: ImageModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      history.back();
    }
    if (e.key === "ArrowLeft" && onPrev) onPrev();
    if (e.key === "ArrowRight" && onNext) onNext();
  }, [onPrev, onNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      history.pushState({ modal: "image" }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      {/* 모바일: Swiper 라이트박스 */}
      <div className="lightbox" onClick={() => history.back()}>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <button className="lightbox-close" onClick={() => history.back()}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M14 14L26 26M26 14L14 26" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          {list && list.length > 1 ? (
            <Swiper
              slidesPerView={1}
              initialSlide={index || 0}
              onSlideChange={(swiper) => onSlideChange?.(swiper.activeIndex)}
              style={{ width: "100%", height: "100%" }}
            >
              {list.map((item, i) => (
                <SwiperSlide key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={item.src} alt={item.alt} className="lightbox-img" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img src={src} alt={alt} className="lightbox-img" />
          )}
        </div>
      </div>

      {/* 데스크톱: 풀스크린 오버레이 */}
      <div className="image-viewer-desktop">
        <div className="image-viewer-overlay">
          <button className="image-viewer-close" onClick={() => history.back()}>&times;</button>
          {onPrev && (
            <button className="image-viewer-nav image-viewer-prev" onClick={onPrev}>
              &lt;
            </button>
          )}
          <img src={src} alt={alt} className="image-viewer-img" onClick={(e) => e.stopPropagation()} />
          {onNext && (
            <button className="image-viewer-nav image-viewer-next" onClick={onNext}>
              &gt;
            </button>
          )}
        </div>
      </div>
    </>
  );
}
