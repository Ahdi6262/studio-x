
'use client'; 

import { PageHeader } from "@/components/core/page-header";
import { LeaderboardItem } from "@/components/leaderboard/leaderboard-item";
import { mockLeaderboard as fallbackLeaderboardData, type LeaderboardUser } from "@/lib/mock-data"; // Keep mock as fallback
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
// import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"; // Example for Firebase
// import { db } from "@/lib/firebase"; // Example for Firebase


// Simulate fetching leaderboard data (replace with actual Firebase call)
async function fetchLeaderboardDataFromDB(): Promise<LeaderboardUser[]> {
  console.log("Fetching leaderboard data from DB (simulated)...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // In a real app:
  // const leaderboardCol = collection(db, 'leaderboard'); // Assuming a 'leaderboard' collection
  // const q = query(leaderboardCol, orderBy("points", "desc"), limit(50)); // Example: top 50
  // const leaderboardSnapshot = await getDocs(q);
  // const leaderboardList = leaderboardSnapshot.docs.map((doc, index) => ({
  //   id: doc.id,
  //   rank: index + 1, // Assign rank based on order
  //   ...doc.data()
  // } as LeaderboardUser));
  // return leaderboardList;
  return fallbackLeaderboardData; // Return mock data for now
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

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLeaderboardDataFromDB();
        setLeaderboardData(data.sort((a,b) => a.rank - b.rank));
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
      setIsLoading(false);
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Creator Leaderboard"
        description="See who's making waves in the HEX THE ADD HUB! Points are awarded for contributions, course completions, and community engagement."
        actions={
            <Button variant="outline" onClick={() => { /* Implement refresh logic */ }} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Leaderboard
            </Button>
        }
      />

      <Tabs defaultValue="all-time" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly" disabled>Monthly</TabsTrigger>
          <TabsTrigger value="weekly" disabled>Weekly</TabsTrigger>
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
            Monthly leaderboard coming soon!
          </div>
        </TabsContent>
        <TabsContent value="weekly">
          <div className="text-center py-12 text-muted-foreground">
            Weekly leaderboard coming soon!
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
