
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
// Assuming UserProjectActivitySchema from dashboard recommendations is the target structure
// import type { UserProjectActivitySchema } from '@/ai/flows/dashboard-recommendations-flow'; 

interface ProjectRow {
    id: string;
    title: string;
    tags?: string; // Assuming tags are stored comma-separated or fetched via join
    status: string;
    updated_at: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    // This query fetches projects created by the user. 
    // If "contributed projects" means something different (e.g., via a junction table), this query needs adjustment.
    const sql = `
      SELECT 
        p.id as projectId,
        p.title,
        p.status, -- Could be used to determine role or contribution status indirectly
        p.updated_at as lastContribution, -- Using updated_at as a placeholder
        GROUP_CONCAT(t.name) as tags
      FROM projects p
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.user_uid = ?
      GROUP BY p.id
      ORDER BY p.updated_at DESC;
    `;
    const userProjects = await query<ProjectRow[]>(sql, [userId]);

    const formattedProjects = userProjects.map(project => ({
        projectId: project.id,
        title: project.title,
        tags: project.tags ? project.tags.split(',') : [],
        role: 'creator', // Assuming 'creator' if user_uid matches. Adjust if roles are stored.
        lastContribution: project.updated_at ? new Date(project.updated_at).toISOString() : undefined,
    }));

    return NextResponse.json(formattedProjects, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching projects for user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch user projects', error: error.message }, { status: 500 });
  }
}
