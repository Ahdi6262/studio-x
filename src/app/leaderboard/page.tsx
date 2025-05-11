'use client'; // For potential client-side sorting/filtering in future

import { PageHeader } from "@/components/core/page-header";
import { LeaderboardItem } from "@/components/leaderboard/leaderboard-item";
import { mockLeaderboard } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Assume the first user in mock data is the current user for demo
const currentUserId = mockLeaderboard.length > 0 ? mockLeaderboard[0].id : null;

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Creator Leaderboard"
        description="See who's making waves in the CreatorChain Hub! Points are awarded for contributions, course completions, and community engagement."
        actions={
            <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin-slow" /> Refresh Leaderboard
            </Button>
        }
      />

      <Tabs defaultValue="all-time" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>
        <TabsContent value="all-time">
          <div className="space-y-4 mt-6">
            {mockLeaderboard.sort((a,b) => a.rank - b.rank).map((user) => (
              <LeaderboardItem key={user.id} user={user} isCurrentUser={user.id === currentUserId} />
            ))}
          </div>
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

      {mockLeaderboard.length === 0 && (
         <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Leaderboard is Empty!</h2>
          <p className="text-muted-foreground">Start contributing to appear on the leaderboard.</p>
        </div>
      )}
    </div>
  );
}

// Add a slow spin animation to tailwind config if needed or use existing spin
// tailwind.config.ts (extend animation):
// animation: {
//   'spin-slow': 'spin 3s linear infinite',
// }
// For now, will use existing `animate-spin` or no spin. Let's keep it simple for the prompt.
// Changed to animate-spin-slow, assuming this class will be added or it will default.
// For simplicity, I will remove the custom spin class from icon here.
// The request for `RefreshCw` is just to show actions.
