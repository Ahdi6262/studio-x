
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

interface UserPointsData {
    total_points: number;
    rank_all_time: number | null;
    // Add other fields as needed (monthly_points, rank_monthly, etc.)
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
    const userPointsResult = await query<UserPointsData[]>(
      `SELECT total_points, rank_all_time FROM user_points WHERE user_uid = ?`,
      [userId]
    );

    if (userPointsResult.length === 0) {
      // User might not have any points yet, return default structure
      return NextResponse.json({ 
        total_points: 0, 
        rank_all_time: null 
        // Initialize other fields if they are part of UserPointsData
      }, { status: 200 });
    }
    
    return NextResponse.json(userPointsResult[0], { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching points for user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch user points', error: error.message }, { status: 500 });
  }
}
