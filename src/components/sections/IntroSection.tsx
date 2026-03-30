"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchApi } from "@/lib/api";
import ImageModal from "@/components/modal/ImageModal";

interface Gallery { id: number; title: string | null; image_url: string; sort_order: number; }

const INTRO_TABS = ["다율숲", "찾아오시는 길", "주요시설", "주변관광"];

export default function IntroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [facilities, setFacilities] = useState<Gallery[]>([]);
  const [tourism, setTourism] = useState<Gallery[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingTourism, setLoadingTourism] = useState(true);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; list?: { src: string; alt: string }[]; index?: number } | null>(null);

  useEffect(() => {
    fetchApi("/api/galleries?category=facility").then((r) => r.json()).then(setFacilities).catch(() => {}).finally(() => setLoadingFacilities(false));
    fetchApi("/api/galleries?category=tourism").then((r) => r.json()).then(setTourism).catch(() => {}).finally(() => setLoadingTourism(false));
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

  const getGalleryLabel = (title: string | null | undefined, fallback: string) => {
    const trimmed = title?.trim();
    return trimmed || fallback;
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
          <Image
            src="https://pub-6e4c4b7de2a64b20a6f4ed43bc11a71e.r2.dev/prod/static/3010cb09-4e43-4044-9865-e1bad91b0abc.png"
            alt="다율숲 대표 이미지"
            className="intro-main-img"
            width={480}
            height={320}
            sizes="(min-width: 1024px) 1100px, 100vw"
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
          <Image
            src="https://pub-6e4c4b7de2a64b20a6f4ed43bc11a71e.r2.dev/prod/static/76edab39-316b-4bc1-a0c3-3475d4b5e641.png"
            alt="찾아오시는 길"
            className="map-img"
            width={480}
            height={320}
            sizes="(min-width: 1024px) 1100px, 100vw"
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
                    const list = facilities.map((f, index) => ({
                      src: f.image_url,
                      alt: getGalleryLabel(f.title, `주요시설 ${index + 1}`),
                    }));
                    setModalImage({
                      src: facility.image_url,
                      alt: getGalleryLabel(facility.title, `주요시설 ${i + 1}`),
                      list,
                      index: i,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={facility.image_url}
                    alt={getGalleryLabel(facility.title, `주요시설 ${i + 1}`)}
                    className="facility-card-img"
                    width={240}
                    height={120}
                    sizes="50vw"
                  />
                  <p className="facility-card-name">{getGalleryLabel(facility.title, `주요시설 ${i + 1}`)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주변관광 */}
        <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
          {loadingTourism ? (
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
              {tourism.map((spot, i) => (
                <div
                  key={spot.id}
                  className="facility-card"
                  onClick={() => {
                    const list = tourism.map((s, index) => ({
                      src: s.image_url,
                      alt: getGalleryLabel(s.title, `주변 관광지 ${index + 1}`),
                    }));
                    setModalImage({
                      src: spot.image_url,
                      alt: getGalleryLabel(spot.title, `주변 관광지 ${i + 1}`),
                      list,
                      index: i,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={spot.image_url}
                    alt={getGalleryLabel(spot.title, `주변 관광지 ${i + 1}`)}
                    className="facility-card-img"
                    width={240}
                    height={120}
                    sizes="50vw"
                  />
                  <p className="facility-card-name">{getGalleryLabel(spot.title, `주변 관광지 ${i + 1}`)}</p>
                </div>
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
