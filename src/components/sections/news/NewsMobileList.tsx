"use client";

import type { NewsItem } from "./types";
import { hasAttachment } from "./utils";

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
    <div className="news-mobile-list">
      <div className="news-board">
        <div className="news-board-scroll">
          <div className="news-board-table">
            <div className="news-board-row news-board-header">
              <span className="news-board-cell news-board-cell-number">번호</span>
              <span className="news-board-cell news-board-cell-title">제목</span>
              <span className="news-board-cell news-board-cell-attachment">첨부</span>
              <span className="news-board-cell news-board-cell-date">작성일</span>
            </div>

            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="news-board-row news-board-row-skeleton">
                  <div className="skeleton-box news-board-skeleton news-board-skeleton-number" />
                  <div className="skeleton-box news-board-skeleton news-board-skeleton-title" />
                  <div className="skeleton-box news-board-skeleton news-board-skeleton-attachment" />
                  <div className="skeleton-box news-board-skeleton news-board-skeleton-date" />
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className="news-board-row news-board-item"
                  onClick={() => onOpen(item)}
                >
                  <span className="news-board-cell news-board-cell-number">{items.length - index}</span>
                  <span className="news-board-cell news-board-cell-title" title={item.title}>
                    {item.title}
                  </span>
                  <span className="news-board-cell news-board-cell-attachment">{hasAttachment(item) ? "Y" : "-"}</span>
                  <span className="news-board-cell news-board-cell-date">{formatDate(item.created_at)}</span>
                </button>
              ))
            ) : (
              <div className="news-board-empty">게시물이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
