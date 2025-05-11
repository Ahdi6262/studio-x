import type { Timestamp } from "firebase/firestore";

export interface BlogPost {
  id: string;
  author_id: string;
  authorName?: string; // Denormalized or fetched separately
  title: string;
  slug: string;
  excerpt: string;
  content_markdown: string;
  cover_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: Timestamp | any; // Firestore Timestamp or allow for JS Date post-fetch
  tags?: string[];
  category?: string;
  view_count?: number;
  like_count?: number;
  created_at: Timestamp | any;
  updated_at: Timestamp | any;
}

