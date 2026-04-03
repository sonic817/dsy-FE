import type { NewsItem } from "./types";

export function hasAttachment(item: NewsItem): boolean {
  return Boolean(item.has_attachment || item.attachment_name || item.attachment_url || item.file_name || item.file_url);
}
