"use client";

import { useState, useEffect } from "react";
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

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [noticeItems, setNoticeItems] = useState<NewsItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingNotice, setLoadingNotice] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<NewsItem | null>(null);
  const [mobileModalNews, setMobileModalNews] = useState<NewsItem | null>(null);
  const [modalImage, setModalImage] = useState<GalleryModalState | null>(null);

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

    fetchApi("/api/galleries?category=gallery")
      .then((r) => r.json())
      .then(setGalleryItems)
      .catch((error) => {
        console.error("[NewsSection] Failed to load gallery items.", error);
      })
      .finally(() => setLoadingGallery(false));
  }, []);

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
          {loadingGallery ? (
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
              {galleryItems.map((item, i) => (
                <div
                  key={item.id}
                  className="facility-card"
                  onClick={() => {
                    const list = galleryItems.map((g, index) => ({
                      src: g.image_url,
                      alt: getGalleryLabel(g.title, `참여갤러리 ${index + 1}`),
                    }));
                    setModalImage(buildGalleryModalState(list, i));
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={item.image_url}
                    alt={getGalleryLabel(item.title, `참여갤러리 ${i + 1}`)}
                    className="facility-card-img"
                    width={240}
                    height={120}
                    sizes="50vw"
                  />
                  <p className="facility-card-name">{getGalleryLabel(item.title, `참여갤러리 ${i + 1}`)}</p>
                </div>
              ))}
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
