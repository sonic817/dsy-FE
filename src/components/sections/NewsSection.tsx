"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchApi } from "@/lib/api";
import NewsDetailModal from "@/components/modal/NewsDetailModal";
import ImageModal from "@/components/modal/ImageModal";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Gallery {
  id: number;
  title: string;
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
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; list?: { src: string; alt: string }[]; index?: number } | null>(null);

  useEffect(() => {
    fetchApi("/api/news?category=news")
      .then((r) => r.json())
      .then((data) => {
        setNewsItems(data);
        if (data.length > 0) setSelectedNews(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoadingNews(false));

    fetchApi("/api/news?category=notice")
      .then((r) => r.json())
      .then((data) => {
        setNoticeItems(data);
        if (data.length > 0) setSelectedNotice(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoadingNotice(false));

    fetchApi("/api/galleries?category=gallery")
      .then((r) => r.json())
      .then(setGalleryItems)
      .catch(() => {})
      .finally(() => setLoadingGallery(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const renderNewsList = (items: NewsItem[], loading: boolean, selected: NewsItem | null, setSelected: (item: NewsItem) => void) => (
    <>
      {/* 데스크톱: 두 패널 */}
      <div className="news-panel-layout">
        <div className="news-panel-list">
          {loading ? (
            <div className="news-skeleton">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="news-skeleton-item">
                  <div className="skeleton-box skeleton-title" />
                  <div className="skeleton-box skeleton-date" />
                </div>
              ))}
            </div>
          ) : items.map((item) => (
            <div
              key={item.id}
              className={`news-panel-item ${selected?.id === item.id ? "active" : ""}`}
              onClick={() => setSelected(item)}
            >
              <p className="news-item-title">{item.title}</p>
              <p className="news-item-date">{formatDate(item.created_at)}</p>
            </div>
          ))}
        </div>
        <div className="news-panel-detail">
          {selected ? (
            <>
              <h3 className="news-panel-detail-title">{selected.title}</h3>
              <p className="news-panel-detail-date">{formatDate(selected.created_at)}</p>
              <div className="news-panel-detail-content">{selected.content}</div>
            </>
          ) : (
            <p className="news-panel-detail-empty">소식을 선택해주세요.</p>
          )}
        </div>
      </div>

      {/* 모바일: 카드 리스트 */}
      <div className="news-mobile-list">
        {loading ? (
          <div className="news-skeleton">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="news-skeleton-item">
                <div className="skeleton-box skeleton-title" />
                <div className="skeleton-box skeleton-date" />
              </div>
            ))}
          </div>
        ) : items.map((item) => (
          <div
            key={item.id}
            className="news-item"
            onClick={() => setMobileModalNews(item)}
            style={{ cursor: "pointer" }}
          >
            <p className="news-item-title">{item.title}</p>
            <p className="news-item-date">{formatDate(item.created_at)}</p>
          </div>
        ))}
      </div>
    </>
  );

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

        {/* 다율숲소식 */}
        <div className={`tab-content ${activeTab === 0 ? "active" : ""}`}>
          {renderNewsList(newsItems, loadingNews, selectedNews, setSelectedNews)}
        </div>

        {/* 공지·행사 */}
        <div className={`tab-content ${activeTab === 1 ? "active" : ""}`}>
          {renderNewsList(noticeItems, loadingNotice, selectedNotice, setSelectedNotice)}
        </div>

        {/* 갤러리 */}
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
                    const list = galleryItems.map(g => ({ src: g.image_url, alt: g.title }));
                    setModalImage({ src: item.image_url, alt: item.title, list, index: i });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Image src={item.image_url} alt={item.title} className="facility-card-img" width={240} height={120} sizes="50vw" />
                  <p className="facility-card-name">{item.title}</p>
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
      />

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
