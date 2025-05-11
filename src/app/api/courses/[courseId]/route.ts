
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { Course } from '@/lib/mock-data'; // Assuming Course type is relevant

interface CourseRow {
  id: string;
  instructor_uid: string;
  title: string;
  slug?: string;
  description?: string;
  long_description?: string;
  cover_image_url?: string;
  promo_video_url?: string;
  price_amount?: number;
  price_currency?: string;
  is_free?: boolean;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_text?: string;
  lessons_count?: number;
  status?: 'draft' | 'published' | 'archived';
  published_at?: Date;
  learning_objectives?: string; // JSON stored as string
  target_audience?: string;
  instructor_name?: string;
  // avg_rating?: number; // Calculate or join
  // enrollment_count?: number; // Calculate or join
}

interface ModuleRow {
    id: string;
    title: string;
    description?: string;
    order_index: number;
}

interface LessonRow {
    id: string;
    title: string;
    content_type: string;
    order_index: number;
    estimated_duration_minutes?: number;
    is_previewable?: boolean;
}


export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const courseId = params.courseId;
  if (!courseId) {
    return NextResponse.json({ message: 'Course ID is required' }, { status: 400 });
  }

  try {
    const courseSql = `
      SELECT 
        c.*,
        u.name as instructor_name
        -- Add subqueries or joins for avg_rating, enrollment_count if needed
      FROM courses c
      JOIN users u ON c.instructor_uid = u.uid
      WHERE c.id = ? AND c.status = 'published'; 
    `;
    const courseRows = await query<CourseRow[]>(courseSql, [courseId]);

    if (courseRows.length === 0) {
      return NextResponse.json({ message: 'Course not found or not published' }, { status: 404 });
    }
    const row = courseRows[0];

    // Fetch modules for the course
    const modulesSql = `SELECT id, title, description, order_index FROM course_modules WHERE course_id = ? ORDER BY order_index ASC`;
    const moduleRows = await query<ModuleRow[]>(modulesSql, [courseId]);

    const modulesWithLessons = await Promise.all(moduleRows.map(async (moduleRow) => {
        const lessonsSql = `SELECT id, title, content_type, order_index, estimated_duration_minutes, is_previewable FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC`;
        const lessonRows = await query<LessonRow[]>(lessonsSql, [moduleRow.id]);
        return {
            ...moduleRow,
            lessons: lessonRows
        };
    }));

    const course: Course & { modules?: any[] } = {
      id: row.id,
      instructor_id: row.instructor_uid,
      title: row.title,
      slug: row.slug,
      instructor: row.instructor_name || 'Expert Instructor',
      imageUrl: row.cover_image_url || 'https://picsum.photos/seed/courseplaceholder/1280/720',
      promo_video_url: row.promo_video_url,
      price: row.is_free ? 'Free' : (row.price_amount != null ? `$${Number(row.price_amount).toFixed(2)}` : 'N/A'),
      price_amount: row.price_amount,
      price_currency: row.price_currency,
      is_free: !!row.is_free,
      rating: 0, // Placeholder - calculate this (e.g., AVG(course_ratings.rating))
      students: 0, // Placeholder - calculate this (e.g., COUNT(course_enrollments.user_uid))
      category: row.category || 'General',
      description: row.description || '',
      long_description: row.long_description || '',
      duration: row.duration_text || 'N/A',
      lessons_count: row.lessons_count || 0,
      lessons: row.lessons_count || 0, // For compatibility with mock data Course type
      level: row.level || 'Beginner',
      status: row.status,
      published_at: row.published_at ? new Date(row.published_at) : undefined,
      learning_objectives: row.learning_objectives ? JSON.parse(row.learning_objectives) : [],
      target_audience: row.target_audience,
      modules: modulesWithLessons,
    };

    return NextResponse.json(course, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching course ${courseId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch course data', error: error.message }, { status: 500 });
  }
}

