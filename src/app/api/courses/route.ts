
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql'; // Your MySQL connection utility
import type { Course } from '@/lib/mock-data'; // Assuming Course type is still relevant

// Define a type for the raw MySQL row for courses, adjust based on your actual MySQL schema
interface CourseRow {
  id: string;
  instructor_uid: string;
  title: string;
  slug?: string;
  description?: string;
  cover_image_url?: string;
  price_amount?: number;
  price_currency?: string;
  is_free?: boolean;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_text?: string;
  lessons_count?: number;
  status?: 'draft' | 'published' | 'archived';
  published_at?: Date;
  // Add other fields from your courses table
  instructor_name?: string; // If joining with users table
  avg_rating?: number; // If calculating
  enrollment_count?: number; // If calculating or storing
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchTerm');
  const category = searchParams.get('category');
  const level = searchParams.get('level');
  // Add other filters as needed (e.g., limit, offset for pagination)

  try {
    // Basic query, you'll need to make this more dynamic based on filters
    let sql = `
      SELECT 
        c.id, c.title, c.slug, c.description, c.cover_image_url, c.price_amount, c.price_currency, c.is_free, c.category, c.level, c.duration_text, c.lessons_count, c.status, c.published_at,
        u.name as instructor_name 
        -- Potentially add subqueries or joins for average rating, student count etc.
      FROM courses c
      JOIN users u ON c.instructor_uid = u.uid
      WHERE c.status = 'published'
    `;
    const queryParams: any[] = [];

    if (searchTerm) {
      sql += ` AND (c.title LIKE ? OR c.description LIKE ? OR u.name LIKE ?)`;
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }
    if (category && category !== 'All') {
      sql += ` AND c.category = ?`;
      queryParams.push(category);
    }
    if (level && level !== 'All') {
      sql += ` AND c.level = ?`;
      queryParams.push(level);
    }

    sql += ` ORDER BY c.title`; // Add ordering, pagination (LIMIT, OFFSET)


    const courseRows = await query<CourseRow[]>(sql, queryParams);

    // Map MySQL rows to your Course type (adjust as needed)
    const courses: Course[] = courseRows.map(row => ({
      id: row.id,
      instructor_id: row.instructor_uid, // This might not be needed by frontend if instructor_name is present
      title: row.title,
      slug: row.slug,
      instructor: row.instructor_name || 'Expert Instructor', // Fallback
      imageUrl: row.cover_image_url || 'https://picsum.photos/seed/defaultcourse/600/400',
      price: row.is_free ? 'Free' : (row.price_amount !== null && row.price_amount !== undefined ? `$${Number(row.price_amount).toFixed(2)}` : 'N/A'),
      price_amount: row.price_amount,
      price_currency: row.price_currency,
      is_free: row.is_free,
      rating: row.avg_rating || 0, // Placeholder, calculate or fetch this
      students: row.enrollment_count || 0, // Placeholder
      category: row.category || 'General',
      description: row.description || '',
      long_description: '', // Fetch if available
      duration: row.duration_text || 'N/A',
      lessons: row.lessons_count || 0,
      level: row.level || 'Beginner',
      status: row.status,
      published_at: row.published_at,
      // Ensure all fields from Course type are mapped
    }));

    return NextResponse.json(courses);
  } catch (error) {
    console.error('API Error fetching courses:', error);
    return NextResponse.json({ message: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST, PUT, DELETE methods would be similar, taking data in the request body
// and executing INSERT, UPDATE, DELETE SQL queries.
// Ensure proper validation and error handling.
// Example:
// export async function POST(request: NextRequest) {
//   try {
//     const courseData = await request.json();
//     // Validate courseData
//     // const result = await query('INSERT INTO courses SET ?', courseData);
//     // return NextResponse.json({ message: 'Course created', id: result.insertId }, { status: 201 });
//     return NextResponse.json({ message: 'POST not fully implemented' }, { status: 501 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to create course' }, { status: 500 });
//   }
// }
