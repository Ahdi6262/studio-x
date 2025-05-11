
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { UserCourseActivitySchema } from '@/ai/flows/dashboard-recommendations-flow'; // Assuming this schema matches what's needed

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const sql = `
      SELECT 
        ce.course_id as courseId,
        c.title,
        c.category,
        ce.progress_percentage as progress,
        ce.enrolled_at as lastAccessed -- Using enrolled_at as a placeholder for lastAccessed
      FROM course_enrollments ce
      JOIN courses c ON ce.course_id = c.id
      WHERE ce.user_uid = ?
      ORDER BY ce.enrolled_at DESC; 
    `;
    // The UserCourseActivitySchema expects lastAccessed as datetime string.
    // MySQL TIMESTAMP will be returned as JS Date by mysql2, then JSON.stringify will convert to ISO string.
    const enrolledCourses = await query<any[]>(sql, [userId]);

    // Map to ensure structure matches UserCourseActivitySchema if necessary
    const formattedCourses = enrolledCourses.map(course => ({
        ...course,
        progress: course.progress || 0,
        lastAccessed: course.lastAccessed ? new Date(course.lastAccessed).toISOString() : undefined,
    }));


    return NextResponse.json(formattedCourses, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching enrolled courses for user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch enrolled courses', error: error.message }, { status: 500 });
  }
}
