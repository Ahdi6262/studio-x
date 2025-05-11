
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { LeaderboardUser } from '@/lib/mock-data';

interface LeaderboardRow {
  user_uid: string;
  total_points: number;
  rank_all_time: number | null;
  monthly_points: number;
  rank_monthly: number | null;
  weekly_points: number;
  rank_weekly: number | null;
  user_name: string;
  avatar_url?: string;
}

interface AchievementRow {
    name: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'all-time'; // 'all-time', 'monthly', 'weekly'
  const limit = 50; // Default limit

  let pointsField = "up.total_points";
  let rankField = "up.rank_all_time";

  if (period === 'monthly') {
    pointsField = "up.monthly_points";
    rankField = "up.rank_monthly";
  } else if (period === 'weekly') {
    pointsField = "up.weekly_points";
    rankField = "up.rank_weekly";
  }
  
  try {
    // Subquery to rank users. MySQL 8+ supports window functions like RANK()
    // For older MySQL, you might need a more complex query or to calculate rank in application code if rank fields are not pre-calculated.
    // Assuming rank_all_time, rank_monthly, rank_weekly are potentially pre-calculated by a background job.
    // If not, the query needs to be more complex to calculate rank on the fly.
    // This query assumes ranks are either pre-calculated or you can order by points and assign rank in application.
    
    // Simple query assuming ranks are somewhat managed or we assign them based on order:
    const sql = `
      SELECT 
        up.user_uid,
        ${pointsField} as points,
        u.name as user_name,
        u.avatar_url
        -- We will assign rank based on order if rank fields are null
      FROM user_points up
      JOIN users u ON up.user_uid = u.uid
      WHERE ${pointsField} > 0 -- Only show users with points
      ORDER BY ${pointsField} DESC
      LIMIT ?;
    `;
    
    const leaderboardRows = await query<LeaderboardRow[]>(sql, [limit]);

    const leaderboardUsers: LeaderboardUser[] = await Promise.all(
        leaderboardRows.map(async (row, index) => {
            // Fetch top 2 achievements for display
            const achievementsSql = `
                SELECT ad.name 
                FROM user_achievements ua
                JOIN achievement_definitions ad ON ua.achievement_id = ad.id
                WHERE ua.user_uid = ? 
                ORDER BY ua.achieved_at DESC 
                LIMIT 2;
            `;
            const achievementResults = await query<AchievementRow[]>(achievementsSql, [row.user_uid]);
            const achievements = achievementResults.map(ar => ar.name);

            return {
              id: row.user_uid,
              // Use pre-calculated rank if available and matches period, otherwise use index+1
              // This logic can be complex if ranks are not consistently updated.
              // For simplicity, we'll use index+1 here.
              rank: index + 1, 
              name: row.user_name,
              avatarUrl: row.avatar_url || `https://picsum.photos/seed/${row.user_uid}/100/100`,
              points: Number(row.points) || 0, // Ensure points is a number
              achievements: achievements,
            };
        })
    );

    return NextResponse.json(leaderboardUsers);
  } catch (error) {
    console.error('API Error fetching leaderboard:', error);
    return NextResponse.json({ message: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
}
