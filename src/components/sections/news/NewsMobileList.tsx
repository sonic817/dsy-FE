"use client";

import MobileInfoCard from "@/components/common/MobileInfoCard";
import type { NewsItem } from "./types";

interface NewsMobileListProps {
  items: NewsItem[];
  loading: boolean;
  formatDate: (dateStr: string) => string;
  onOpen: (item: NewsItem) => void;
}

export default function NewsMobileList({
  items,
  loading,
  formatDate,
  onOpen,
}: NewsMobileListProps) {
  return (
    <div className="news-mobile-list program-select-list">
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
          <MobileInfoCard
            key={item.id}
            className="news-item"
            title={item.title}
            subtitle={formatDate(item.created_at)}
            titleClassName="news-item-title"
            subtitleClassName="news-item-date"
            onClick={() => onOpen(item)}
          />
        ))
      )}
    </div>
  );
}
