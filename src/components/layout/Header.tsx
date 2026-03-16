"use client";

import { useRef } from "react";

export default function Header() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && wrapperRef.current) {
      const headerHeight = wrapperRef.current.offsetHeight;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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
            <button className="nav-link" onClick={() => scrollTo("news")}>
              소식
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link" onClick={() => scrollTo("intro")}>
              소개
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link" onClick={() => scrollTo("usage")}>
              이용안내
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link nav-link-accent" onClick={() => scrollTo("reservation")}>
              예약
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
