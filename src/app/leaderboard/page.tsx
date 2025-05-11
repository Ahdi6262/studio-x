
'use client'; 

import { PageHeader } from "@/components/core/page-header";
import { LeaderboardItem } from "@/components/leaderboard/leaderboard-item";
import type { LeaderboardUser } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from "firebase/firestore"; 
import { db } from "@/lib/firebase"; 

// Function to fetch leaderboard data from user_points and enrich with user details
async function fetchLeaderboardDataFromDB(): Promise<LeaderboardUser[]> {
  console.log("Fetching leaderboard data from DB...");
  
  // Fetch top users from 'user_points' collection, ordered by total_points
  const userPointsCol = collection(db, 'user_points');
  // Fetching top 50 for example. Adjust 'limit' as needed.
  const q = query(userPointsCol, orderBy("total_points", "desc"), limit(50)); 
  const userPointsSnapshot = await getDocs(q);

  const leaderboardListPromises = userPointsSnapshot.docs.map(async (pointDoc, index) => {
    const pointData = pointDoc.data();
    const userId = pointDoc.id;

    // Fetch user details from 'users' collection
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    let userName = 'Anonymous User';
    let userAvatarUrl = ''; // Default avatar or placeholder
    let achievements: string[] = []; // Placeholder for achievements

    if (userSnap.exists()) {
      const userData = userSnap.data();
      userName = userData.name || 'Anonymous User';
      userAvatarUrl = userData.avatar_url || ''; // Use avatar_url from your schema
      // If you store achievements directly on the user document or have a subcollection, fetch here.
      // For simplicity, achievements are mocked or can be fetched from user_achievements
    }
    
    // Simulate achievements for now as schema is complex
    const mockAchievementsList = ["Top Contributor", "Early Bird", "Course Completer"];
    achievements = mockAchievementsList.slice(0, Math.floor(Math.random() * mockAchievementsList.length) +1);


    return {
      id: userId,
      rank: index + 1, // Assign rank based on order from query
      name: userName,
      avatarUrl: userAvatarUrl,
      points: pointData.total_points || 0,
      achievements: achievements, // Replace with actual achievements if fetched
    } as LeaderboardUser;
  });

  const leaderboardList = await Promise.all(leaderboardListPromises);
  return leaderboardList;
}


export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
        setCurrentUserId(user.uid);
    }
  }, [user]);

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboardDataFromDB();
      // Sorting is already done by Firestore query (orderBy total_points)
      setLeaderboardData(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleRefresh = () => {
    loadLeaderboard();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Creator Leaderboard"
        description="See who's making waves in the HEX THE ADD HUB! Points are awarded for contributions, course completions, and community engagement."
        actions={
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Leaderboard
            </Button>
        }
      />

      <Tabs defaultValue="all-time" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly" disabled>Monthly (Soon)</TabsTrigger>
          <TabsTrigger value="weekly" disabled>Weekly (Soon)</TabsTrigger>
        </TabsList>
        <TabsContent value="all-time">
          {isLoading ? (
            <div className="space-y-4 mt-6">
              {[...Array(5)].map((_, i) => <LeaderboardItemSkeleton key={i} />)}
            </div>
          ) : leaderboardData.length > 0 ? (
             <div className="space-y-4 mt-6">
              {leaderboardData.map((userData) => (
                <LeaderboardItem key={userData.id} user={userData} isCurrentUser={userData.id === currentUserId} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">Leaderboard is Empty!</h2>
              <p className="text-muted-foreground">Start contributing to appear on the leaderboard.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="monthly">
          <div className="text-center py-12 text-muted-foreground">
            Monthly leaderboard coming soon! This requires tracking points over specific time periods.
          </div>
        </TabsContent>
        <TabsContent value="weekly">
          <div className="text-center py-12 text-muted-foreground">
            Weekly leaderboard coming soon! Similar to monthly, requires periodic point tracking.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const LeaderboardItemSkeleton = () => (
  <div className="flex items-center p-4 rounded-lg bg-card space-x-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-6 w-16" />
  </div>
);

