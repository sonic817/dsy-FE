"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const SECTIONS = ["intro", "usage", "reservation", "news"];

export default function Header() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && wrapperRef.current) {
      const headerHeight = wrapperRef.current.offsetHeight;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
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
            <span>다율</span>숲
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
            <button className={`nav-link nav-link-accent ${activeSection === "reservation" ? "active" : ""}`} onClick={() => scrollTo("reservation")}>
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
    </div>
  );
}
