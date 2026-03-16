"use client";

import { useState } from "react";
import { USAGE_TABS, PROGRAMS, USAGE_FACILITIES } from "@/constants";
import ImageModal from "@/components/modal/ImageModal";

export default function UsageGuideSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; list?: { src: string; alt: string }[]; index?: number } | null>(null);

  const goModalPrev = () => {
    if (modalImage?.list && modalImage.index !== undefined && modalImage.index > 0) {
      const prev = modalImage.index - 1;
      setModalImage({ ...modalImage.list[prev], list: modalImage.list, index: prev });
    }
  };

  const goModalNext = () => {
    if (modalImage?.list && modalImage.index !== undefined && modalImage.index < modalImage.list.length - 1) {
      const next = modalImage.index + 1;
      setModalImage({ ...modalImage.list[next], list: modalImage.list, index: next });
    }
  };

  return (
    <section id="usage" className="section usage-section">
      <div className="container">
        <h2 className="section-title">이용안내</h2>

        <div className="tabs">
          {USAGE_TABS.map((tab, index) => (
            <button
              key={index}
              className={`tab-btn ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 숲체험 프로그램 */}
        <div className={`tab-content ${activeTab === 0 ? "active" : ""}`}>
          <div className="program-list">
            {PROGRAMS.map((program, i) => (
              <div key={i} className="program-card">
                <h4>{program.name}</h4>
                <p>{program.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 주요시설 */}
        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
          <div className="facility-grid">
            {USAGE_FACILITIES.map((facility, i) => (
              <div
                key={i}
                className="facility-card"
                onClick={() => {
                  const list = USAGE_FACILITIES.map(f => ({ src: f.image, alt: f.name }));
                  setModalImage({ src: facility.image, alt: facility.name, list, index: i });
                }}
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

        {/* 이용료 */}
        <div className={`tab-content ${activeTab === 2 ? "active" : ""}`}>
          <table className="fee-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>개인</th>
                <th>단체</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>오전</td>
                <td>5,000원</td>
                <td>3,000원</td>
              </tr>
              <tr>
                <td>오후</td>
                <td>5,000원</td>
                <td>3,000원</td>
              </tr>
              <tr>
                <td>야간</td>
                <td>8,000원</td>
                <td>5,000원</td>
              </tr>
            </tbody>
          </table>
          <p className="fee-note">
            * 이용료는 추후 업데이트 예정입니다.
          </p>
        </div>

        {/* 사진 */}
        <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
          <div className="photo-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const src = `/images/usage/usage-0${n}.png`;
              return (
                <img
                  key={n}
                  src={src}
                  alt={`이용안내 사진 ${n}`}
                  className="photo-grid-img"
                  onClick={() => {
                    const list = [1, 2, 3, 4, 5, 6].map(i => ({ src: `/images/usage/usage-0${i}.png`, alt: "사진" }));
                    setModalImage({ src, alt: "사진", list, index: n - 1 });
                  }}
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
        onPrev={modalImage?.list && modalImage.index !== undefined && modalImage.index > 0 ? goModalPrev : undefined}
        onNext={modalImage?.list && modalImage.index !== undefined && modalImage.index < modalImage.list.length - 1 ? goModalNext : undefined}
      />
    </section>
  );
}
