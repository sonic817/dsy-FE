export interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  attachment_name?: string | null;
  attachment_url?: string | null;
  file_name?: string | null;
  file_url?: string | null;
  has_attachment?: boolean | null;
  view_count?: number | null;
  views?: number | null;
}
