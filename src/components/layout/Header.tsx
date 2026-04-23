"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ReservationGuideModal from "@/components/modal/ReservationGuideModal";

const SECTIONS = ["intro", "usage", "reservation", "news"];
const RESERVATION_GUIDE_HIDE_KEY = "reservation-guide-hide-date";

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function Header() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && wrapperRef.current) {
      const headerHeight = wrapperRef.current.offsetHeight;
      const paddingTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
      const gap = 12;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight + paddingTop - gap;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleReservationClick = () => {
    scrollTo("reservation");
    let shouldOpen = true;
    try {
      const hideDate = localStorage.getItem(RESERVATION_GUIDE_HIDE_KEY);
      if (hideDate === getTodayKey()) shouldOpen = false;
    } catch {
      /* storage unavailable — default to opening */
    }
    if (shouldOpen) {
      // 스무스 스크롤이 완료된 뒤 모달을 열어야 Modal의 body overflow:hidden이 스크롤을 끊지 않는다.
      setTimeout(() => setIsGuideOpen(true), 500);
    }
  };

  const handleHideToday = () => {
    try {
      localStorage.setItem(RESERVATION_GUIDE_HIDE_KEY, getTodayKey());
    } catch {
      /* storage unavailable — silently ignore */
    }
    setIsGuideOpen(false);
  };

  const handleScroll = useCallback(() => {
    if (!wrapperRef.current) return;
    const headerHeight = wrapperRef.current.offsetHeight;
    let current = "";
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top - headerHeight - 1;
        if (top <= 0) current = id;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="header-fixed-wrapper" ref={wrapperRef}>
      <header className="header">
        <div className="container">
          <h1 className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer" }}>
            <Image src="/logo-white.png" alt="다율숲 로고" width={32} height={32} className="header-logo-img" />
            다율숲
          </h1>
        </div>
      </header>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <button className={`nav-link ${activeSection === "intro" ? "active" : ""}`} onClick={() => scrollTo("intro")}>
              소개
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeSection === "usage" ? "active" : ""}`} onClick={() => scrollTo("usage")}>
              이용안내
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link nav-link-accent ${activeSection === "reservation" ? "active" : ""}`} onClick={handleReservationClick}>
              <span className="bounce-text"><span className="bounce-char bounce-1">예</span><span className="bounce-char bounce-2">약</span></span>
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeSection === "news" ? "active" : ""}`} onClick={() => scrollTo("news")}>
              소식·참여
            </button>
          </li>
        </ul>
      </nav>
      <ReservationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onHideToday={handleHideToday}
      />
    </div>
  );
}
