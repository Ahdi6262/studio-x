
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { Project } from '@/lib/mock-data'; // Assuming Project type is relevant

interface ProjectRow {
  id: string;
  user_uid: string;
  title: string;
  slug?: string;
  description?: string;
  long_description?: string;
  image_url?: string;
  project_link?: string;
  status?: 'draft' | 'published' | 'archived';
  published_at?: Date;
  author_name?: string; // Joined from users table
  tags_list?: string; // Comma-separated list from GROUP_CONCAT
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;
  if (!projectId) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  try {
    const sql = `
      SELECT 
        p.id, p.user_uid, p.title, p.slug, p.description, p.long_description, p.image_url, p.project_link, p.status, p.published_at,
        u.name as author_name,
        GROUP_CONCAT(t.name) as tags_list
      FROM projects p
      JOIN users u ON p.user_uid = u.uid
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ? AND p.status = 'published' 
      GROUP BY p.id;
    `; // Ensure only published projects are fetched, or adjust based on auth
    
    const projectRows = await query<ProjectRow[]>(sql, [projectId]);

    if (projectRows.length === 0) {
      return NextResponse.json({ message: 'Project not found or not published' }, { status: 404 });
    }

    const row = projectRows[0];
    const project: Project = {
      id: row.id,
      user_id: row.user_uid,
      title: row.title,
      slug: row.slug,
      description: row.description || '',
      long_description: row.long_description || '',
      imageUrl: row.image_url || 'https://picsum.photos/seed/projectplaceholder/1200/800',
      project_link: row.project_link,
      tags: row.tags_list ? row.tags_list.split(',') : [],
      author: row.author_name || 'Unknown Creator',
      status: row.status,
      date: row.published_at ? new Date(row.published_at).toLocaleDateString() : 'N/A',
      published_at: row.published_at,
    };

    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching project ${projectId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch project data', error: error.message }, { status: 500 });
  }
}
