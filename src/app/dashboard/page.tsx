
"use client";

import { useEffect, useState } from "react";
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
import { BookOpen, FolderKanban, CalendarClock, Award, MessageSquare, Settings, User, Trophy, Edit, LayoutGrid, LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { doc, getDoc } from "firebase/firestore"; // Example for Firebase
// import { db } from "@/lib/firebase"; // Example for Firebase

interface UserStats {
  points: number;
  leaderboardRank: number | string;
  coursesEnrolled: number;
  projectsCreated: number;
  upcomingEvents: number;
}

interface QuickLinkItemData {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Simulate fetching dashboard data
async function fetchDashboardData(userId: string | undefined): Promise<{ stats: UserStats, quickLinks: QuickLinkItemData[] }> {
  console.log(`Fetching dashboard data for user: ${userId} (simulated)...`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  // In a real app, fetch this data from Firebase based on userId
  // For example, get user_points, count enrolled courses, projects etc.
  const mockStats: UserStats = {
    points: Math.floor(Math.random() * 20000), // Example dynamic data
    leaderboardRank: Math.floor(Math.random() * 50) + 1,
    coursesEnrolled: Math.floor(Math.random() * 5) + 1,
    projectsCreated: Math.floor(Math.random() * 3) + 1,
    upcomingEvents: Math.floor(Math.random() * 2),
  };

  const mockQuickLinks: QuickLinkItemData[] = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/courses", label: "My Courses", icon: BookOpen },
    { href: "/portfolio", label: "My Projects", icon: FolderKanban },
    { href: "/settings", label: "Account Settings", icon: Settings },
  ];
  
  return { stats: mockStats, quickLinks: mockQuickLinks };
}


export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState<UserStats | null>(null);
  const [quickLinksData, setQuickLinksData] = useState<QuickLinkItemData[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);


  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      const loadData = async () => {
        setIsDashboardLoading(true);
        const data = await fetchDashboardData(user.uid);
        setDashboardStats(data.stats);
        setQuickLinksData(data.quickLinks);
        setIsDashboardLoading(false);
      };
      loadData();
    } else if (!authIsLoading && !isAuthenticated) {
        // If not authenticated and auth is not loading, ensure dashboard loading stops
        setIsDashboardLoading(false);
    }
  }, [isAuthenticated, user, authIsLoading]);


  if (authIsLoading || isDashboardLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Dashboard" description="Loading your dashboard..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-8">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-2 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
        </div>
         <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title={`Welcome back, ${user.name ? user.name.split(' ')[0] : 'Creator'}!`}
        description="Here's a quick overview of your activity and progress."
        actions={
            <Button variant="outline" disabled>
                <LayoutGrid className="mr-2 h-4 w-4" /> Customize Layout (Soon)
            </Button>
        }
      />

    {dashboardStats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-8">
            <StatCard
            title="Total Points"
            value={dashboardStats.points.toLocaleString()}
            icon={Award}
            description="Earned from contributions"
            />
            <StatCard
                title="Leaderboard Rank"
                value={typeof dashboardStats.leaderboardRank === 'number' ? `#${dashboardStats.leaderboardRank}` : dashboardStats.leaderboardRank}
                icon={Trophy}
                description="Keep climbing!"
            />
            <StatCard
            title="Courses Enrolled"
            value={dashboardStats.coursesEnrolled.toString()}
            icon={BookOpen}
            description="Keep learning and growing"
            />
            <StatCard
            title="Projects Created"
            value={dashboardStats.projectsCreated.toString()}
            icon={FolderKanban}
            description="Showcasing your skills"
            />
            <StatCard
            title="Upcoming Events"
            value={dashboardStats.upcomingEvents.toString()}
            icon={CalendarClock}
            description="Stay connected"
            />
        </div>
    )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <ActivityChart />
          <RecommendationsWidget />
          <ProgressTrackerWidget />
        </div>
        
        {/* Sidebar Column */}
        <div className="space-y-8">
            {quickLinksData.length > 0 && <QuickLinks title="Quick Links" links={quickLinksData} /> }
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
