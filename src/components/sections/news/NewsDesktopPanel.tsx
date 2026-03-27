"use client";

import type { NewsItem } from "./types";

interface NewsDesktopPanelProps {
  items: NewsItem[];
  loading: boolean;
  selected: NewsItem | null;
  onSelect: (item: NewsItem) => void;
  formatDate: (dateStr: string) => string;
}

export default function NewsDesktopPanel({
  items,
  loading,
  selected,
  onSelect,
  formatDate,
}: NewsDesktopPanelProps) {
  return (
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
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`news-panel-item ${selected?.id === item.id ? "active" : ""}`}
              onClick={() => onSelect(item)}
            >
              <p className="news-item-title">{item.title}</p>
              <p className="news-item-date">{formatDate(item.created_at)}</p>
            </div>
          ))
        )}
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
  );
}
