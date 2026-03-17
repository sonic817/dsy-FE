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
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchApi("/api/news")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <section id="news" className="section news-section">
      <div className="container">
        <h2 className="section-title">다율숲 소식</h2>
        <div className="news-list">
          {items.map((item) => (
            <div
              key={item.id}
              className="news-item"
              onClick={() => setSelectedNews(item)}
              style={{ cursor: "pointer" }}
            >
              <p className="news-item-title">{item.title}</p>
              <p className="news-item-date">{formatDate(item.created_at)}</p>
            </div>
          ))}
        </div>
      </div>

      <NewsDetailModal
        isOpen={selectedNews !== null}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title || ""}
        date={selectedNews ? formatDate(selectedNews.created_at) : ""}
        content={selectedNews?.content || ""}
      />
    </section>
  );
}
