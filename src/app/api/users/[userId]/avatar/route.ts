
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { avatar_url } = body;

    if (avatar_url === undefined) { // Allow null to clear avatar
      return NextResponse.json({ message: 'avatar_url is required' }, { status: 400 });
    }

    const result = await query<any>(
      'UPDATE users SET avatar_url = ?, updated_at = ? WHERE uid = ?',
      [avatar_url, new Date(), userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found or avatar not changed' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Avatar updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`API Error updating avatar for user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to update avatar', error: error.message }, { status: 500 });
  }
}
