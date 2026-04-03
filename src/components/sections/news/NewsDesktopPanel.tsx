"use client";

import type { NewsItem } from "./types";
import { hasAttachment } from "./utils";

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
  const selectedIndex = selected ? items.findIndex((item) => item.id === selected.id) : -1;
  const previousItem = selectedIndex > 0 ? items[selectedIndex - 1] : null;
  const nextItem = selectedIndex >= 0 && selectedIndex < items.length - 1 ? items[selectedIndex + 1] : null;

  return (
    <div className="news-panel-layout">
      <div className="news-panel-detail">
        {selected ? (
          <>
            <h3 className="news-panel-detail-title">{selected.title}</h3>
            <p className="news-panel-detail-date">{formatDate(selected.created_at)}</p>
            <div className="news-panel-detail-content">{selected.content}</div>
            <div className="news-detail-nav">
              <button
                type="button"
                className={`news-detail-nav-item ${previousItem ? "" : "disabled"}`}
                onClick={() => previousItem && onSelect(previousItem)}
                disabled={!previousItem}
              >
                <span className="news-detail-nav-label">이전글</span>
                <span className="news-detail-nav-title">
                  {previousItem ? previousItem.title : "이전글이 없습니다."}
                </span>
              </button>
              <button
                type="button"
                className={`news-detail-nav-item ${nextItem ? "" : "disabled"}`}
                onClick={() => nextItem && onSelect(nextItem)}
                disabled={!nextItem}
              >
                <span className="news-detail-nav-label">다음글</span>
                <span className="news-detail-nav-title">
                  {nextItem ? nextItem.title : "다음글이 없습니다."}
                </span>
              </button>
            </div>
          </>
        ) : (
          <p className="news-panel-detail-empty">소식을 선택해 주세요.</p>
        )}
      </div>

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
                  className={`news-board-row news-board-item ${selected?.id === item.id ? "active" : ""}`}
                  onClick={() => onSelect(item)}
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
