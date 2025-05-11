
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/core/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecommendationsWidget } from "@/components/dashboard/recommendations-widget";
import { ProgressTrackerWidget } from "@/components/dashboard/progress-tracker-widget";
import { CommunityFeedWidget } from "@/components/dashboard/community-feed-widget";
import { AchievementsWidget } from "@/components/dashboard/achievements-widget";
import { DirectMessageWidget } from "@/components/dashboard/direct-message-widget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FolderKanban, CalendarClock, Award, MessageSquare, Settings, User, Trophy, Edit, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { mockLeaderboard, type LeaderboardUser } from '@/lib/mock-data';
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authIsLoading, router]);

  if (authIsLoading || !isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Dashboard" description="Loading your dashboard..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
        </div>
         <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  let currentUserBoardData: LeaderboardUser | undefined = undefined;
  if (mockLeaderboard.length > 0) {
    currentUserBoardData = mockLeaderboard.find(lbUser => lbUser.name === user.name) || mockLeaderboard[0];
  }

  const userStats = {
    points: currentUserBoardData ? currentUserBoardData.points : 0,
    coursesEnrolled: 3, 
    projectsCreated: 2, 
    upcomingEvents: 1,  
  };

  const quickLinksData = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/courses", label: "My Courses", icon: BookOpen },
    { href: "/portfolio", label: "My Projects", icon: FolderKanban },
    { href: "/settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}!`}
        description="Here's a quick overview of your activity and progress."
        actions={
            <Button variant="outline">
                <LayoutGrid className="mr-2 h-4 w-4" /> Customize Layout (Soon)
            </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-8">
        <StatCard
          title="Total Points"
          value={userStats.points.toLocaleString()}
          icon={Award}
          description="Earned from contributions"
        />
        {currentUserBoardData ? (
          <StatCard
            title="Leaderboard Rank"
            value={`#${currentUserBoardData.rank}`}
            icon={Trophy}
            description="Keep climbing!"
          />
        ) : (
          <StatCard
            title="Leaderboard Rank"
            value="N/A"
            icon={Trophy}
            description="Get started to rank up!"
          />
        )}
        <StatCard
          title="Courses Enrolled"
          value={userStats.coursesEnrolled.toString()}
          icon={BookOpen}
          description="Keep learning and growing"
        />
        <StatCard
          title="Projects Created"
          value={userStats.projectsCreated.toString()}
          icon={FolderKanban}
          description="Showcasing your skills"
        />
        <StatCard
          title="Upcoming Events"
          value={userStats.upcomingEvents.toString()}
          icon={CalendarClock}
          description="Stay connected"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <ActivityChart />
          <RecommendationsWidget />
          <ProgressTrackerWidget />
        </div>
        
        {/* Sidebar Column */}
        <div className="space-y-8">
            <QuickLinks title="Quick Links" links={quickLinksData} />
            <AchievementsWidget />
            <CommunityFeedWidget />
            <DirectMessageWidget />
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Edit className="mr-2 h-5 w-5 text-primary" /> Customizable Layout
                    </CardTitle>
                    <CardDescription>
                        Drag and drop widgets to personalize your dashboard view. (Feature coming soon!)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Layout customization is under development.</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-primary" /> Old Recent Activity
                    </CardTitle>
                    <CardDescription>
                        Latest updates and notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No new activity to show right now.</p>
                        <p className="text-sm">Check back later for updates!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
