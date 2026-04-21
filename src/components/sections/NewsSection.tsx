"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { fetchApi } from "@/lib/api";
import NewsDetailModal from "@/components/modal/NewsDetailModal";
import ImageModal from "@/components/modal/ImageModal";
import NewsDesktopPanel from "@/components/sections/news/NewsDesktopPanel";
import NewsMobileList from "@/components/sections/news/NewsMobileList";
import type { NewsItem } from "@/components/sections/news/types";
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

const NEWS_TABS = ["다율숲소식", "공지·행사", "갤러리"];
const GALLERY_PER_PAGE = 6;
const GALLERY_CACHE_TTL_MS = 60_000;
const GALLERY_TRANSITION_MS = 200;

interface GalleryCacheEntry {
  items: Gallery[];
  total: number;
  fetchedAt: number;
}

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [noticeItems, setNoticeItems] = useState<NewsItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingNotice, setLoadingNotice] = useState(true);
  const [initialLoadingGallery, setInitialLoadingGallery] = useState(true);
  const [transitioningGallery, setTransitioningGallery] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<NewsItem | null>(null);
  const [mobileModalNews, setMobileModalNews] = useState<NewsItem | null>(null);
  const [modalImage, setModalImage] = useState<GalleryModalState | null>(null);
  const [galleryPage, setGalleryPage] = useState(0);
  const [loadedGalleryPage, setLoadedGalleryPage] = useState(0);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [galleryError, setGalleryError] = useState(false);
  const initialLoadingRef = useRef(true);
  const loadedPageRef = useRef(0);
  const galleryCacheRef = useRef<Map<number, GalleryCacheEntry>>(new Map());
  const galleryInFlightRef = useRef<Map<number, Promise<GalleryCacheEntry>>>(new Map());

  useEffect(() => {
    fetchApi("/api/news?category=news")
      .then((r) => r.json())
      .then((data) => {
        setNewsItems(data);
        if (data.length > 0) setSelectedNews(data[0]);
      })
      .catch((error) => {
        console.error("[NewsSection] Failed to load news items.", error);
      })
      .finally(() => setLoadingNews(false));

    fetchApi("/api/news?category=notice")
      .then((r) => r.json())
      .then((data) => {
        setNoticeItems(data);
        if (data.length > 0) setSelectedNotice(data[0]);
      })
      .catch((error) => {
        console.error("[NewsSection] Failed to load notice items.", error);
      })
      .finally(() => setLoadingNotice(false));
  }, []);

  // 캐시/인플라이트 통합 로더: TTL 이내 캐시 히트면 즉시 resolve, 같은 페이지 인플라이트면 promise 공유
  const loadGalleryPage = useCallback((page: number): Promise<GalleryCacheEntry> => {
    const cached = galleryCacheRef.current.get(page);
    if (cached && Date.now() - cached.fetchedAt < GALLERY_CACHE_TTL_MS) {
      return Promise.resolve(cached);
    }
    const existing = galleryInFlightRef.current.get(page);
    if (existing) return existing;

    const promise = fetchApi(
      `/api/galleries?category=gallery&page=${page}&limit=${GALLERY_PER_PAGE}`
    )
      .then((r) => r.json())
      .then((data) => {
        const items = Array.isArray(data?.items) ? data.items : [];
        const total = typeof data?.total === "number" ? data.total : 0;
        const entry: GalleryCacheEntry = { items, total, fetchedAt: Date.now() };
        // total이 달라진 게 관측되면 다른 페이지 캐시도 stale로 간주하고 폐기
        for (const [p, existingEntry] of galleryCacheRef.current.entries()) {
          if (p !== page && existingEntry.total !== total) {
            galleryCacheRef.current.delete(p);
          }
        }
        galleryCacheRef.current.set(page, entry);
        return entry;
      })
      .finally(() => {
        galleryInFlightRef.current.delete(page);
      });

    galleryInFlightRef.current.set(page, promise);
    return promise;
  }, []);

  const prefetchAdjacentGallery = useCallback((currentPage: number, total: number) => {
    const totalPages = Math.max(1, Math.ceil(total / GALLERY_PER_PAGE));
    const prefetch = (page: number) => {
      if (page < 0 || page >= totalPages) return;
      loadGalleryPage(page).catch(() => {
        // prefetch 실패는 조용히 무시 — 실제 이동 시 정상 fetch로 복구
      });
    };
    prefetch(currentPage + 1);
    prefetch(currentPage - 1);
  }, [loadGalleryPage]);

  useEffect(() => {
    const isFirstLoad = initialLoadingRef.current;
    // 첫 로드가 아니면 항상 transition 진입 (캐시 히트 포함) — opacity 중간 반전 방지
    if (!isFirstLoad) {
      setTransitioningGallery(true);
    }
    setGalleryError(false);

    let cancelled = false;
    let swapTimerId: number | null = null;
    const transitionStart = Date.now();

    loadGalleryPage(galleryPage)
      .then((entry) => {
        if (cancelled) return;
        const commitSwap = () => {
          if (cancelled) return;
          setGalleryItems(entry.items);
          setGalleryTotal(entry.total);
          setLoadedGalleryPage(galleryPage);
          loadedPageRef.current = galleryPage;
          setInitialLoadingGallery(false);
          initialLoadingRef.current = false;
          setTransitioningGallery(false);
          prefetchAdjacentGallery(galleryPage, entry.total);
        };

        if (isFirstLoad) {
          commitSwap();
          return;
        }

        // fade-out(opacity 1 → 0.55)이 완료된 뒤에만 items 스왑 → 중간 반전 없이 fade-in으로 이어짐
        const elapsed = Date.now() - transitionStart;
        const remaining = Math.max(0, GALLERY_TRANSITION_MS - elapsed);
        if (remaining === 0) {
          commitSwap();
        } else {
          swapTimerId = window.setTimeout(commitSwap, remaining);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[NewsSection] Failed to load gallery items.", error);
        setGalleryError(true);
        setInitialLoadingGallery(false);
        initialLoadingRef.current = false;
        setTransitioningGallery(false);
        setGalleryPage(loadedPageRef.current);
      });

    return () => {
      cancelled = true;
      if (swapTimerId !== null) window.clearTimeout(swapTimerId);
    };
  }, [galleryPage, loadGalleryPage, prefetchAdjacentGallery]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const renderNewsList = (
    items: NewsItem[],
    loading: boolean,
    selected: NewsItem | null,
    setSelected: (item: NewsItem) => void,
  ) => (
    <>
      <NewsDesktopPanel
        items={items}
        loading={loading}
        selected={selected}
        onSelect={setSelected}
        formatDate={formatDate}
      />
      <NewsMobileList
        items={items}
        loading={loading}
        formatDate={formatDate}
        onOpen={setMobileModalNews}
      />
    </>
  );

  const getMobileModalItems = (): NewsItem[] => {
    if (activeTab === 0) return newsItems;
    if (activeTab === 1) return noticeItems;
    return [];
  };

  const mobileModalItems = getMobileModalItems();
  const mobileModalIndex = mobileModalNews
    ? mobileModalItems.findIndex((item) => item.id === mobileModalNews.id)
    : -1;
  const mobilePrevNews = mobileModalIndex > 0 ? mobileModalItems[mobileModalIndex - 1] : null;
  const mobileNextNews =
    mobileModalIndex >= 0 && mobileModalIndex < mobileModalItems.length - 1
      ? mobileModalItems[mobileModalIndex + 1]
      : null;
  const previousModalImage = getAdjacentGalleryModalState(modalImage, -1);
  const nextModalImage = getAdjacentGalleryModalState(modalImage, 1);
  const totalGalleryPages = Math.max(1, Math.ceil(galleryTotal / GALLERY_PER_PAGE));

  useEffect(() => {
    setGalleryPage((p) => Math.min(p, totalGalleryPages - 1));
  }, [totalGalleryPages]);

  return (
    <section id="news" className="section news-section">
      <div className="container">
        <h2 className="section-title">소식·참여</h2>

        <div className="tabs">
          {NEWS_TABS.map((tab, index) => (
            <button
              key={index}
              className={`tab-btn ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={`tab-content ${activeTab === 0 ? "active" : ""}`}>
          {renderNewsList(newsItems, loadingNews, selectedNews, setSelectedNews)}
        </div>

        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
          {renderNewsList(noticeItems, loadingNotice, selectedNotice, setSelectedNotice)}
        </div>

        <div className={`tab-content ${activeTab === 2 ? "active" : ""}`}>
          {initialLoadingGallery ? (
            <div className="gallery-skeleton">
              {Array.from({ length: GALLERY_PER_PAGE }).map((_, i) => (
                <div key={i} className="gallery-skeleton-item">
                  <div className="skeleton-box skeleton-img" />
                  <div className="skeleton-box skeleton-name" />
                </div>
              ))}
            </div>
          ) : galleryError && galleryItems.length === 0 ? (
            <div className="gallery-empty">
              <p>사진을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
            </div>
          ) : galleryTotal === 0 ? (
            <div className="gallery-empty">
              <p>등록된 사진이 없습니다.</p>
            </div>
          ) : (
            <div className={`facility-grid${transitioningGallery ? " gallery-transitioning" : ""}`}>
              {Array.from({ length: GALLERY_PER_PAGE }).map((_, i) => {
                const item = galleryItems[i];
                if (!item) {
                  return (
                    <div
                      key={`gallery-placeholder-${i}`}
                      className="facility-card gallery-card-placeholder"
                      aria-hidden="true"
                    >
                      <div className="facility-card-img" />
                      <p className="facility-card-name">&nbsp;</p>
                    </div>
                  );
                }
                const globalIndex = loadedGalleryPage * GALLERY_PER_PAGE + i;
                return (
                  <div
                    key={item.id}
                    className="facility-card"
                    onClick={() => {
                      const list = galleryItems.map((g, localIndex) => ({
                        src: g.image_url,
                        alt: getGalleryLabel(
                          g.title,
                          `참여갤러리 ${loadedGalleryPage * GALLERY_PER_PAGE + localIndex + 1}`
                        ),
                      }));
                      setModalImage(buildGalleryModalState(list, i));
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={item.image_url}
                      alt={getGalleryLabel(item.title, `참여갤러리 ${globalIndex + 1}`)}
                      className="facility-card-img"
                      width={240}
                      height={120}
                      sizes="50vw"
                    />
                    <p className="facility-card-name">{getGalleryLabel(item.title, `참여갤러리 ${globalIndex + 1}`)}</p>
                  </div>
                );
              })}
              {totalGalleryPages > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-page-nav gallery-page-prev"
                    disabled={loadedGalleryPage === 0}
                    onClick={() => setGalleryPage(Math.max(0, loadedGalleryPage - 1))}
                    aria-label="이전 페이지"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="gallery-page-nav gallery-page-next"
                    disabled={loadedGalleryPage >= totalGalleryPages - 1}
                    onClick={() => setGalleryPage(Math.min(totalGalleryPages - 1, loadedGalleryPage + 1))}
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

      <NewsDetailModal
        isOpen={mobileModalNews !== null}
        onClose={() => setMobileModalNews(null)}
        title={mobileModalNews?.title || ""}
        date={mobileModalNews ? formatDate(mobileModalNews.created_at) : ""}
        content={mobileModalNews?.content || ""}
        previousTitle={mobilePrevNews?.title || ""}
        nextTitle={mobileNextNews?.title || ""}
        onPrevious={mobilePrevNews ? () => setMobileModalNews(mobilePrevNews) : undefined}
        onNext={mobileNextNews ? () => setMobileModalNews(mobileNextNews) : undefined}
      />

      <ImageModal
        isOpen={modalImage !== null}
        onClose={() => setModalImage(null)}
        src={modalImage?.src || ""}
        alt={modalImage?.alt || ""}
        list={modalImage?.list}
        index={modalImage?.index}
        onSlideChange={(i) => {
          setModalImage((current) => buildGalleryModalState(current?.list || [], i));
        }}
        onPrev={previousModalImage ? () => setModalImage(previousModalImage) : undefined}
        onNext={nextModalImage ? () => setModalImage(nextModalImage) : undefined}
      />
    </section>
  );
}
