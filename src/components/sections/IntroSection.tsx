"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import ImageModal from "@/components/modal/ImageModal";

interface Gallery { id: number; title: string; image_url: string; sort_order: number; }

const INTRO_TABS = ["다율숲", "찾아오시는 길", "주요시설", "사진"];

export default function IntroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [facilities, setFacilities] = useState<Gallery[]>([]);
  const [photos, setPhotos] = useState<Gallery[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; list?: { src: string; alt: string }[]; index?: number } | null>(null);

  useEffect(() => {
    fetchApi("/api/galleries?category=facility").then((r) => r.json()).then(setFacilities).catch(() => {}).finally(() => setLoadingFacilities(false));
    fetchApi("/api/galleries?category=intro").then((r) => r.json()).then(setPhotos).catch(() => {}).finally(() => setLoadingPhotos(false));
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
            src="https://pub-6e4c4b7de2a64b20a6f4ed43bc11a71e.r2.dev/prod/static/3010cb09-4e43-4044-9865-e1bad91b0abc.png"
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
            src="https://pub-6e4c4b7de2a64b20a6f4ed43bc11a71e.r2.dev/prod/static/76edab39-316b-4bc1-a0c3-3475d4b5e641.png"
            alt="찾아오시는 길"
            className="map-img"
            onClick={() => setModalImage({ src: "https://pub-6e4c4b7de2a64b20a6f4ed43bc11a71e.r2.dev/prod/static/76edab39-316b-4bc1-a0c3-3475d4b5e641.png", alt: "찾아오시는 길" })}
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
