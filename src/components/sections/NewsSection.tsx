"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import NewsDetailModal from "@/components/modal/NewsDetailModal";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [mobileModalNews, setMobileModalNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchApi("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        if (data.length > 0) setSelectedNews(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <section id="news" className="section news-section">
      <div className="container">
        <h2 className="section-title">다율숲 소식</h2>

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
                className={`news-panel-item ${selectedNews?.id === item.id ? "active" : ""}`}
                onClick={() => setSelectedNews(item)}
              >
                <p className="news-item-title">{item.title}</p>
                <p className="news-item-date">{formatDate(item.created_at)}</p>
              </div>
            ))}
          </div>
          <div className="news-panel-detail">
            {selectedNews ? (
              <>
                <h3 className="news-panel-detail-title">{selectedNews.title}</h3>
                <p className="news-panel-detail-date">{formatDate(selectedNews.created_at)}</p>
                <div className="news-panel-detail-content">{selectedNews.content}</div>
              </>
            ) : (
              <p className="news-panel-detail-empty">소식을 선택해주세요.</p>
            )}
          </div>
        </div>

        {/* 모바일: 기존 카드 리스트 */}
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
      </div>

      {/* 모바일에서만 모달 사용 */}
      <NewsDetailModal
        isOpen={mobileModalNews !== null}
        onClose={() => setMobileModalNews(null)}
        title={mobileModalNews?.title || ""}
        date={mobileModalNews ? formatDate(mobileModalNews.created_at) : ""}
        content={mobileModalNews?.content || ""}
      />
    </section>
  );
}
