"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NaverMap from "@/components/common/NaverMap";
import ImageModal from "@/components/modal/ImageModal";
import { fetchApi } from "@/lib/api";
import {
  buildGalleryModalState,
  getAdjacentGalleryModalState,
  getGalleryLabel,
  type GalleryModalState,
} from "@/lib/gallery";

interface Gallery {
  id: number;
  title: string | null;
  image_url: string;
  sort_order: number;
}

const INTRO_TABS = ["다율숲", "찾아오시는 길", "주요시설", "주변관광"];
const DAYUL_SOOP_COORDS = {
  latitude: 35.662981387662974,
  longitude: 129.40243367701228,
};

export default function IntroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [facilities, setFacilities] = useState<Gallery[]>([]);
  const [tourism, setTourism] = useState<Gallery[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingTourism, setLoadingTourism] = useState(true);
  const [modalImage, setModalImage] = useState<GalleryModalState | null>(null);

  useEffect(() => {
    fetchApi("/api/galleries?category=facility")
      .then((r) => r.json())
      .then(setFacilities)
      .catch((error) => {
        console.error("[IntroSection] Failed to load facility galleries.", error);
      })
      .finally(() => setLoadingFacilities(false));

    fetchApi("/api/galleries?category=tourism")
      .then((r) => r.json())
      .then(setTourism)
      .catch((error) => {
        console.error("[IntroSection] Failed to load tourism galleries.", error);
      })
      .finally(() => setLoadingTourism(false));
  }, []);

  const previousModalImage = getAdjacentGalleryModalState(modalImage, -1);
  const nextModalImage = getAdjacentGalleryModalState(modalImage, 1);

  return (
    <section id="intro" className="section intro-section">
      <div className="container">
        <h2 className="section-title">소개</h2>

        <div className="tabs">
          {INTRO_TABS.map((tab, index) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={`tab-content ${activeTab === 0 ? "active" : ""}`}>
          <div className="intro-info intro-info-about">
            <div className="intro-about-visual">
              <div className="intro-feature-image">
                <Image
                  src="/intro-dayulsoop-scene.jpg"
                  alt="다율숲 전경"
                  fill
                  className="intro-feature-image-element"
                  sizes="(min-width: 1024px) 520px, 100vw"
                />
              </div>
              <p className="intro-feature-caption">숲길, 체험, 쉼이 한 흐름으로 이어지는 다율숲의 전경입니다.</p>
            </div>
            <div className="intro-info-text">
              <div className="intro-mini-logo">
                <Image src="/intro-logo.png" alt="다율숲 로고" width={96} height={96} sizes="96px" />
              </div>
              <h4 className="intro-heading intro-heading-mobile">
                사람과 숲이 함께 숨 쉬며
                <br />
                성장하는 곳, 다율숲입니다
              </h4>
              <h4 className="intro-heading intro-heading-desktop">사람과 숲이 함께 숨 쉬며 성장하는 곳, 다율숲입니다.</h4>
              <div className="intro-info-copy intro-info-copy-mobile">
                <p>
                  다율숲은 단순히 숲을 관찰하는 곳에
                  <br />
                  머물지 않습니다.
                </p>
                <p>
                  생명의 경이로움을
                  <br />
                  과학적으로 탐구하는 <strong>발견</strong>,
                  <br />
                  아이들의 작은 손길로
                  <br />
                  숲의 숨결을 일깨우는 <strong>실천</strong>,
                  <br />
                  그리고 숲의 리듬으로
                  <br />
                  회복을 경험하는 <strong>쉼</strong>이
                  <br />
                  공존하는 공간입니다.
                </p>
                <p>
                  우리 아이들이 자연과 공존하는 지혜를 배우고
                  <br />
                  일상의 스트레스를 비워낼 수 있도록
                  <br />
                  다율숲이 든든한
                  <br />
                  초록빛 쉼표가 되겠습니다.
                </p>
              </div>
              <div className="intro-info-copy intro-info-copy-desktop">
                <p>다율숲은 단순히 숲을 관찰하는 곳에 머물지 않습니다.</p>
                <p>
                  생명의 경이로움을 과학적으로 탐구하는 <strong>발견</strong>,
                  <br />
                  아이들의 작은 손길로 숲의 숨결을 일깨우는 <strong>실천</strong>,
                  <br />
                  그리고 숲의 리듬으로 회복을 경험하는 <strong>쉼</strong>이 공존하는 공간입니다.
                </p>
                <p>
                  우리 아이들이 자연과 공존하는 지혜를 배우고
                  <br />
                  일상의 스트레스를 비워낼 수 있도록
                  <br />
                  다율숲이 든든한 초록빛 쉼표가 되겠습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
          <NaverMap
            active={activeTab === 1}
            latitude={DAYUL_SOOP_COORDS.latitude}
            longitude={DAYUL_SOOP_COORDS.longitude}
            label="다율숲"
          />
        </div>

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
                    const list = facilities.map((item, index) => ({
                      src: item.image_url,
                      alt: getGalleryLabel(item.title, `주요시설 ${index + 1}`),
                    }));
                    setModalImage(buildGalleryModalState(list, i));
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
                    const list = tourism.map((item, index) => ({
                      src: item.image_url,
                      alt: getGalleryLabel(item.title, `주변관광 ${index + 1}`),
                    }));
                    setModalImage(buildGalleryModalState(list, i));
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={spot.image_url}
                    alt={getGalleryLabel(spot.title, `주변관광 ${i + 1}`)}
                    className="facility-card-img"
                    width={240}
                    height={120}
                    sizes="50vw"
                  />
                  <p className="facility-card-name">{getGalleryLabel(spot.title, `주변관광 ${i + 1}`)}</p>
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
        onSlideChange={(index) => {
          setModalImage((current) => buildGalleryModalState(current?.list || [], index));
        }}
        onPrev={previousModalImage ? () => setModalImage(previousModalImage) : undefined}
        onNext={nextModalImage ? () => setModalImage(nextModalImage) : undefined}
      />
    </section>
  );
}
