
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { Project } from '@/lib/mock-data'; // Assuming Project type is relevant

interface ProjectRow {
  id: string;
  user_uid: string;
  title: string;
  slug?: string;
  description?: string;
  image_url?: string; // From projects table
  project_link?: string;
  status?: 'draft' | 'published' | 'archived';
  published_at?: Date;
  author_name?: string; // Joined from users table
  tags_list?: string; // Comma-separated list from GROUP_CONCAT
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchTerm');
  const category = searchParams.get('category'); // This implies filtering by a tag name

  try {
    let sql = `
      SELECT 
        p.id, p.user_uid, p.title, p.slug, p.description, p.image_url, p.project_link, p.status, p.published_at,
        u.name as author_name,
        GROUP_CONCAT(t.name) as tags_list
      FROM projects p
      JOIN users u ON p.user_uid = u.uid
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.status = 'published'
    `;
    const queryParams: any[] = [];

    if (searchTerm) {
      sql += ` AND (p.title LIKE ? OR p.description LIKE ? OR u.name LIKE ? OR EXISTS (SELECT 1 FROM project_tags pt_search JOIN tags t_search ON pt_search.tag_id = t_search.id WHERE pt_search.project_id = p.id AND t_search.name LIKE ?))`;
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }
    if (category && category !== 'All') {
      // This adds a subquery to check if the project has the specified tag
      sql += ` AND EXISTS (SELECT 1 FROM project_tags pt_cat JOIN tags t_cat ON pt_cat.tag_id = t_cat.id WHERE pt_cat.project_id = p.id AND t_cat.name = ?)`;
      queryParams.push(category);
    }

    sql += ` GROUP BY p.id ORDER BY p.published_at DESC, p.title ASC`; // Add ordering

    const projectRows = await query<ProjectRow[]>(sql, queryParams);

    const projects: Project[] = projectRows.map(row => ({
      id: row.id,
      user_id: row.user_uid,
      title: row.title,
      slug: row.slug,
      description: row.description || '',
      imageUrl: row.image_url || 'https://picsum.photos/seed/defaultproject/600/400',
      project_link: row.project_link,
      tags: row.tags_list ? row.tags_list.split(',') : [],
      author: row.author_name || 'Unknown Creator',
      status: row.status,
      date: row.published_at ? new Date(row.published_at).toLocaleDateString() : 'N/A',
      published_at: row.published_at,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error('API Error fetching projects:', error);
    return NextResponse.json({ message: 'Failed to fetch projects' }, { status: 500 });
  }
}
