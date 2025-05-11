
'use client'; 

import { PageHeader } from "@/components/core/page-header";
import { LeaderboardItem } from "@/components/leaderboard/leaderboard-item";
import type { LeaderboardUser } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
// Firebase imports removed
// import { collection, getDocs, query, orderBy, limit, doc, getDoc, where } from "firebase/firestore"; 
// import { db } from "@/lib/firebase"; 

async function fetchLeaderboardDataFromAPI(period: 'all-time' | 'monthly' | 'weekly' = 'all-time'): Promise<LeaderboardUser[]> {
  console.log(`Fetching ${period} leaderboard data from API...`);
  try {
    const response = await fetch(`/api/leaderboard?period=${period}`);
    if (!response.ok) {
      const errorData = await response.json().catch(()=>({message: response.statusText}));
      throw new Error(`Failed to fetch leaderboard: ${errorData.message}`);
    }
    const data: LeaderboardUser[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard data from API:", error);
    return [];
  }
}


export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');

  useEffect(() => {
    if (user?.uid) {
        setCurrentUserId(user.uid);
    }
  }, [user]);

  const loadLeaderboard = useCallback(async (period: 'all-time' | 'monthly' | 'weekly') => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboardDataFromAPI(period);
      setLeaderboardData(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
      setLeaderboardData([]);
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    loadLeaderboard(activeTab);
  }, [loadLeaderboard, activeTab]);

  const handleRefresh = () => {
    loadLeaderboard(activeTab);
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

      <Tabs defaultValue="all-time" className="w-full mb-8" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        {(['all-time', 'monthly', 'weekly'] as const).map(tabValue => (
            <TabsContent key={tabValue} value={tabValue}>
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
                <div className="text-center py-16 bg-card rounded-xl shadow-lg">
                    <Trophy className="mx-auto h-16 w-16 text-primary mb-6" />
                    <h2 className="text-3xl font-bold mb-3 text-primary">Leaderboard is Empty!</h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Start contributing to appear on the {tabValue.replace('-', ' ')} leaderboard.
                    </p>
                </div>
            )}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const LeaderboardItemSkeleton = () => (
  <div className="flex items-center p-4 rounded-lg bg-card space-x-4 shadow">
    <Skeleton className="h-8 w-8 rounded-md" /> {/* Rank icon placeholder */}
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/5" />
      <div className="flex gap-1">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
    </div>
    <div className="text-right">
        <Skeleton className="h-6 w-16 mb-1" />
        <Skeleton className="h-3 w-12" />
    </div>
  </div>
);
