"use client";

import { useState } from "react";
import { INTRO_TABS, FACILITIES } from "@/constants";
import ImageModal from "@/components/modal/ImageModal";

export default function IntroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section id="intro" className="section intro-section">
      <div className="container">
        <h2 className="section-title">소개</h2>

        <div className="tabs">
          {INTRO_TABS.map((tab, index) => (
            <button
              key={index}
              className={`tab-btn ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 다율숲 */}
        <div className={`tab-content ${activeTab === 0 ? "active" : ""}`}>
          <img
            src="/images/intro-main.png"
            alt="다율숲 대표 이미지"
            className="intro-main-img"
          />
          <div className="intro-info">
            <h4>다율숲 소개</h4>
            <p>
              다율숲은 자연 속에서 힐링과 체험을 제공하는 공간입니다.
              다양한 숲체험 프로그램과 함께 특별한 시간을 보내세요.
            </p>
          </div>
        </div>

        {/* 찾아오시는 길 */}
        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
          <img
            src="/images/intro/directions.png"
            alt="찾아오시는 길"
            className="map-img"
            onClick={() => setModalImage({ src: "/images/intro/directions.png", alt: "찾아오시는 길" })}
            style={{ cursor: "pointer" }}
          />
          <div className="intro-info" style={{ marginTop: 16 }}>
            <h4>오시는 길</h4>
            <p>
              주소: 주소를 입력하세요
              <br />
              대중교통: 교통 정보를 입력하세요
              <br />
              자가용: 네비게이션에 &quot;다율숲&quot; 검색
            </p>
          </div>
        </div>

        {/* 주요시설 */}
        <div className={`tab-content ${activeTab === 2 ? "active" : ""}`}>
          <div className="facility-grid">
            {FACILITIES.map((facility, i) => (
              <div
                key={i}
                className="facility-card"
                onClick={() => setModalImage({ src: facility.image, alt: facility.name })}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="facility-card-img"
                />
                <p className="facility-card-name">{facility.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 사진 */}
        <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
          <div className="photo-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const src = `/images/intro/intro-0${n}.png`;
              return (
                <img
                  key={n}
                  src={src}
                  alt={`다율숲 사진 ${n}`}
                  className="photo-grid-img"
                  onClick={() => setModalImage({ src, alt: `다율숲 사진 ${n}` })}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={modalImage !== null}
        onClose={() => setModalImage(null)}
        src={modalImage?.src || ""}
        alt={modalImage?.alt || ""}
      />
    </section>
  );
}
