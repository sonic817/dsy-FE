"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
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
const TOURISM_OVERVIEW_IMAGE = {
  src: "/intro-tourism-overview-map.png",
  alt: "주변관광 안내 지도",
};

export default function IntroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [facilities, setFacilities] = useState<Gallery[]>([]);
  const [tourism, setTourism] = useState<Gallery[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingTourism, setLoadingTourism] = useState(true);
  const [modalImage, setModalImage] = useState<GalleryModalState | null>(null);
  const [tourismFeatureWidth, setTourismFeatureWidth] = useState<number | null>(null);
  const [tourismPage, setTourismPage] = useState(0);
  const [facilityPage, setFacilityPage] = useState(0);
  const facilitiesGridRef = useRef<HTMLDivElement | null>(null);
  const TOURISM_PER_PAGE = 4;
  const FACILITY_PER_PAGE = 6;

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
  const totalTourismPages = Math.max(1, Math.ceil(tourism.length / TOURISM_PER_PAGE));
  const tourismPreview = tourism.slice(
    tourismPage * TOURISM_PER_PAGE,
    tourismPage * TOURISM_PER_PAGE + TOURISM_PER_PAGE
  );
  const totalFacilityPages = Math.max(1, Math.ceil(facilities.length / FACILITY_PER_PAGE));
  const facilitiesPreview = facilities.slice(
    facilityPage * FACILITY_PER_PAGE,
    facilityPage * FACILITY_PER_PAGE + FACILITY_PER_PAGE
  );
  const tourismLayoutStyle: CSSProperties | undefined = tourismFeatureWidth
    ? { gridTemplateColumns: `${tourismFeatureWidth}px minmax(0, 1fr)` }
    : undefined;
  const tourismFeatureCardStyle: CSSProperties = tourismFeatureWidth
    ? { cursor: "pointer", maxWidth: tourismFeatureWidth }
    : { cursor: "pointer" };
  const tourismFeatureSizes = tourismFeatureWidth
    ? `(min-width: 1024px) ${tourismFeatureWidth}px, 100vw`
    : "(min-width: 1024px) 455px, 100vw";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateTourismFeatureWidth = () => {
      if (window.innerWidth < 1024) {
        setTourismFeatureWidth(null);
        return;
      }

      const grid = facilitiesGridRef.current;
      if (!grid || grid.getClientRects().length === 0) {
        return;
      }

      const images = grid.querySelectorAll<HTMLElement>(".facility-card-img");
      const secondRowImage = images.item(3) || images.item(images.length - 1);
      if (!secondRowImage) {
        return;
      }

      const gridTop = grid.getBoundingClientRect().top;
      const secondRowImageBottom = secondRowImage.getBoundingClientRect().bottom - gridTop;
      const nextWidth = Math.round((secondRowImageBottom * 21) / 23);

      setTourismFeatureWidth((current) => (current === nextWidth ? current : nextWidth));
    };

    const frameId = window.requestAnimationFrame(updateTourismFeatureWidth);
    window.addEventListener("resize", updateTourismFeatureWidth);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateTourismFeatureWidth);
    };
  }, [activeTab, facilities, loadingFacilities, facilityPage]);

  useEffect(() => {
    setTourismPage((p) => Math.min(p, totalTourismPages - 1));
  }, [totalTourismPages]);

  useEffect(() => {
    setFacilityPage((p) => Math.min(p, totalFacilityPages - 1));
  }, [totalFacilityPages]);

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
              {Array.from({ length: FACILITY_PER_PAGE }).map((_, i) => (
                <div key={i} className="gallery-skeleton-item">
                  <div className="skeleton-box skeleton-img" />
                  <div className="skeleton-box skeleton-name" />
                </div>
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <div className="gallery-empty">
              <p>등록된 사진이 없습니다.</p>
            </div>
          ) : (
            <div ref={facilitiesGridRef} className="facility-grid">
              {Array.from({ length: FACILITY_PER_PAGE }).map((_, i) => {
                const facility = facilitiesPreview[i];
                if (!facility) {
                  return (
                    <div
                      key={`facility-placeholder-${i}`}
                      className="facility-card gallery-card-placeholder"
                      aria-hidden="true"
                    >
                      <div className="facility-card-img" />
                      <p className="facility-card-name">&nbsp;</p>
                    </div>
                  );
                }
                const globalIndex = facilityPage * FACILITY_PER_PAGE + i;
                return (
                  <div
                    key={facility.id}
                    className="facility-card"
                    onClick={() => {
                      const list = facilities.map((item, index) => ({
                        src: item.image_url,
                        alt: getGalleryLabel(item.title, `주요시설 ${index + 1}`),
                      }));
                      setModalImage(buildGalleryModalState(list, globalIndex));
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={facility.image_url}
                      alt={getGalleryLabel(facility.title, `주요시설 ${globalIndex + 1}`)}
                      className="facility-card-img"
                      width={240}
                      height={120}
                      sizes="50vw"
                    />
                    <p className="facility-card-name">{getGalleryLabel(facility.title, `주요시설 ${globalIndex + 1}`)}</p>
                  </div>
                );
              })}
              {totalFacilityPages > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-page-nav gallery-page-prev"
                    disabled={facilityPage === 0}
                    onClick={() => setFacilityPage((p) => Math.max(0, p - 1))}
                    aria-label="이전 페이지"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="gallery-page-nav gallery-page-next"
                    disabled={facilityPage >= totalFacilityPages - 1}
                    onClick={() => setFacilityPage((p) => Math.min(totalFacilityPages - 1, p + 1))}
                    aria-label="다음 페이지"
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className={`tab-content ${activeTab === 3 ? "active" : ""}`}>
          {loadingTourism ? (
            <div className="gallery-skeleton">
              {Array.from({ length: TOURISM_PER_PAGE }).map((_, i) => (
                <div key={i} className="gallery-skeleton-item">
                  <div className="skeleton-box skeleton-img" />
                  <div className="skeleton-box skeleton-name" />
                </div>
              ))}
            </div>
          ) : (
            <div className="tourism-layout" style={tourismLayoutStyle}>
              <div
                className="tourism-feature-card"
                onClick={() => {
                  setModalImage(
                    buildGalleryModalState(
                      [{ src: TOURISM_OVERVIEW_IMAGE.src, alt: TOURISM_OVERVIEW_IMAGE.alt }],
                      0
                    )
                  );
                }}
                style={tourismFeatureCardStyle}
              >
                <div className="tourism-feature-image">
                  <Image
                    src={TOURISM_OVERVIEW_IMAGE.src}
                    alt={TOURISM_OVERVIEW_IMAGE.alt}
                    fill
                    className="tourism-feature-image-element"
                    sizes={tourismFeatureSizes}
                  />
                </div>
                <p className="facility-card-name tourism-feature-caption">주변안내</p>
              </div>

              <div className="tourism-right">
                {tourism.length === 0 ? (
                  <div className="gallery-empty">
                    <p>등록된 사진이 없습니다.</p>
                  </div>
                ) : (
                <div className="tourism-grid">
                  {Array.from({ length: TOURISM_PER_PAGE }).map((_, i) => {
                    const spot = tourismPreview[i];
                    if (!spot) {
                      return (
                        <div
                          key={`tourism-placeholder-${i}`}
                          className="facility-card gallery-card-placeholder"
                          aria-hidden="true"
                        >
                          <div className="facility-card-img" />
                          <p className="facility-card-name">&nbsp;</p>
                        </div>
                      );
                    }
                    const globalIndex = tourismPage * TOURISM_PER_PAGE + i;
                    return (
                      <div
                        key={spot.id}
                        className="facility-card"
                        onClick={() => {
                          const list = tourism.map((item, index) => ({
                            src: item.image_url,
                            alt: getGalleryLabel(item.title, `주변관광 ${index + 1}`),
                          }));
                          setModalImage(buildGalleryModalState(list, globalIndex));
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Image
                          src={spot.image_url}
                          alt={getGalleryLabel(spot.title, `주변관광 ${globalIndex + 1}`)}
                          className="facility-card-img"
                          width={240}
                          height={120}
                          sizes="(min-width: 1024px) 300px, 50vw"
                        />
                        <p className="facility-card-name">{getGalleryLabel(spot.title, `주변관광 ${globalIndex + 1}`)}</p>
                      </div>
                    );
                  })}
                  {totalTourismPages > 1 && (
                    <>
                      <button
                        type="button"
                        className="gallery-page-nav gallery-page-prev"
                        disabled={tourismPage === 0}
                        onClick={() => setTourismPage((p) => Math.max(0, p - 1))}
                        aria-label="이전 페이지"
                      >
                        &lt;
                      </button>
                      <button
                        type="button"
                        className="gallery-page-nav gallery-page-next"
                        disabled={tourismPage >= totalTourismPages - 1}
                        onClick={() => setTourismPage((p) => Math.min(totalTourismPages - 1, p + 1))}
                        aria-label="다음 페이지"
                      >
                        &gt;
                      </button>
                    </>
                  )}
                </div>
                )}
              </div>
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
