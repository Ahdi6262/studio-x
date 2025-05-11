
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { BlogPost } from '@/types/blog';

interface BlogPostRow {
  id: string;
  author_uid: string;
  title: string;
  slug: string;
  excerpt: string;
  content_markdown: string;
  cover_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  category?: string;
  view_count?: number;
  like_count?: number;
  created_at: Date;
  updated_at: Date;
  author_name?: string; // Joined from users table
  tags_list?: string; // Comma-separated from GROUP_CONCAT
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  try {
    const sql = `
      SELECT 
        bp.id, bp.author_uid, bp.title, bp.slug, bp.excerpt, bp.content_markdown, bp.cover_image_url, 
        bp.status, bp.published_at, bp.category, bp.view_count, bp.like_count, bp.created_at, bp.updated_at,
        u.name as author_name,
        GROUP_CONCAT(t.name) as tags_list
      FROM blog_posts bp
      JOIN users u ON bp.author_uid = u.uid
      LEFT JOIN blog_post_tags bpt ON bp.id = bpt.blog_post_id
      LEFT JOIN tags t ON bpt.tag_id = t.id
      WHERE bp.status = 'published'
      GROUP BY bp.id
      ORDER BY bp.published_at DESC
      LIMIT ?;
    `;
    const blogPostRows = await query<BlogPostRow[]>(sql, [limit]);

    const posts: BlogPost[] = blogPostRows.map(row => ({
      id: row.id,
      author_id: row.author_uid,
      authorName: row.author_name || "HEX THE ADD HUB Team",
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content_markdown: row.content_markdown,
      cover_image_url: row.cover_image_url || 'https://picsum.photos/seed/blogdefault/600/400',
      status: row.status,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : undefined, // Ensure ISO string
      tags: row.tags_list ? row.tags_list.split(',') : [],
      category: row.category,
      view_count: row.view_count || 0,
      like_count: row.like_count || 0,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Error fetching blog posts:', error);
    return NextResponse.json({ message: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
