
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

interface UserAchievementRow {
    name: string; // From achievement_definitions
    description: string; // From achievement_definitions
    icon_name: string; // From achievement_definitions
    achieved_at: Date; // From user_achievements
    // Add other fields if needed for dashboard display
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
    const sql = `
      SELECT 
        ad.name,
        ad.description,
        ad.icon_name,
        ua.achieved_at
      FROM user_achievements ua
      JOIN achievement_definitions ad ON ua.achievement_id = ad.id
      WHERE ua.user_uid = ?
      ORDER BY ua.achieved_at DESC;
    `;
    const achievements = await query<UserAchievementRow[]>(sql, [userId]);

    // The dashboard recommendations flow expects an array of achievement names (strings).
    // For the dashboard widget, you might want the full objects.
    // For now, returning the full objects. The flow can map it if needed.
    // If the flow specifically needs just names: return achievements.map(ach => ach.name);
    return NextResponse.json(achievements, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching achievements for user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch user achievements', error: error.message }, { status: 500 });
  }
}
