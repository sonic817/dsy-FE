"use client";

import { useState } from "react";
import { NEWS_ITEMS } from "@/constants";
import NewsDetailModal from "@/components/modal/NewsDetailModal";

export default function NewsSection() {
  const [selectedNews, setSelectedNews] = useState<typeof NEWS_ITEMS[number] | null>(null);

  return (
    <section id="news" className="section news-section">
      <div className="container">
        <h2 className="section-title">다율숲 소식</h2>
        <div className="news-list">
          {NEWS_ITEMS.map((item, index) => (
            <div
              key={index}
              className="news-item"
              onClick={() => setSelectedNews(item)}
              style={{ cursor: "pointer" }}
            >
              <p className="news-item-title">{item.title}</p>
              <p className="news-item-date">{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      <NewsDetailModal
        isOpen={selectedNews !== null}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title || ""}
        date={selectedNews?.date || ""}
        content={selectedNews?.content || ""}
      />
    </section>
  );
}
