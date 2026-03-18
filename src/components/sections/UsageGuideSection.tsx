"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import ImageModal from "@/components/modal/ImageModal";

interface Program { id: number; name: string; description: string; }
interface Gallery { id: number; title: string; image_url: string; sort_order: number; }
interface Fee { id: number; period: string; individual_price: number; group_price: number; }

const USAGE_TABS = ["숲체험 프로그램", "주요시설", "이용료", "사진"];
const PERIOD_LABELS: Record<string, string> = { morning: "오전", afternoon: "오후", night: "야간" };

export default function UsageGuideSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [facilities, setFacilities] = useState<Gallery[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [photos, setPhotos] = useState<Gallery[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingFees, setLoadingFees] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; list?: { src: string; alt: string }[]; index?: number } | null>(null);

  useEffect(() => {
    fetchApi("/api/programs").then((r) => r.json()).then(setPrograms).catch(() => {}).finally(() => setLoadingPrograms(false));
    fetchApi("/api/galleries?category=usage_facility").then((r) => r.json()).then(setFacilities).catch(() => {}).finally(() => setLoadingFacilities(false));
    fetchApi("/api/fees").then((r) => r.json()).then(setFees).catch(() => {}).finally(() => setLoadingFees(false));
    fetchApi("/api/galleries?category=usage").then((r) => r.json()).then(setPhotos).catch(() => {}).finally(() => setLoadingPhotos(false));
  }, []);

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
          {loadingPrograms ? (
            <div className="program-skeleton">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="program-skeleton-item">
                  <div className="skeleton-box skeleton-title" />
                  <div className="skeleton-box skeleton-desc" />
                </div>
              ))}
            </div>
          ) : (
            <div className="program-list">
              {programs.map((program) => (
                <div key={program.id} className="program-card">
                  <h4>{program.name}</h4>
                  <p>{program.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주요시설 */}
        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
          {loadingFacilities ? (
            <div className="gallery-skeleton">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="gallery-skeleton-item">
                  <div className="skeleton-box skeleton-img" />
                  <div className="skeleton-box skeleton-name" />
                </div>
              ))}
            </div>
          ) : (
            <div className="facility-grid">
              {facilities.map((facility, i) => (
                <div
                  key={facility.id}
                  className="facility-card"
                  onClick={() => {
                    const list = facilities.map(f => ({ src: f.image_url, alt: f.title }));
                    setModalImage({ src: facility.image_url, alt: facility.title, list, index: i });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src={facility.image_url} alt={facility.title} className="facility-card-img" />
                  <p className="facility-card-name">{facility.title}</p>
                </div>
              ))}
            </div>
          )}
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
              {loadingFees ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton-box" style={{ height: 14, width: "60%", margin: "0 auto" }} /></td>
                    <td><div className="skeleton-box" style={{ height: 14, width: "60%", margin: "0 auto" }} /></td>
                    <td><div className="skeleton-box" style={{ height: 14, width: "60%", margin: "0 auto" }} /></td>
                  </tr>
                ))
              ) : fees.map((fee) => (
                <tr key={fee.id}>
                  <td>{PERIOD_LABELS[fee.period] || fee.period}</td>
                  <td>{fee.individual_price.toLocaleString()}원</td>
                  <td>{fee.group_price.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 사진 */}
        <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
          {loadingPhotos ? (
            <div className="photo-skeleton">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-box skeleton-img" />
              ))}
            </div>
          ) : (
            <div className="photo-grid">
              {photos.map((photo, i) => (
                <img
                  key={photo.id}
                  src={photo.image_url}
                  alt={photo.title || "사진"}
                  className="photo-grid-img"
                  onClick={() => {
                    const list = photos.map(p => ({ src: p.image_url, alt: "사진" }));
                    setModalImage({ src: photo.image_url, alt: "사진", list, index: i });
                  }}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={modalImage !== null}
        onClose={() => setModalImage(null)}
        src={modalImage?.src || ""}
        alt={modalImage?.alt || ""}
        list={modalImage?.list}
        index={modalImage?.index}
        onSlideChange={(i) => {
          if (modalImage?.list) setModalImage({ ...modalImage.list[i], list: modalImage.list, index: i });
        }}
        onPrev={modalImage?.list && modalImage.index !== undefined && modalImage.index > 0 ? goModalPrev : undefined}
        onNext={modalImage?.list && modalImage.index !== undefined && modalImage.index < modalImage.list.length - 1 ? goModalNext : undefined}
      />
    </section>
  );
}
