"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/core/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
// import { QuickLinks } from "@/components/dashboard/quick-links"; // Keep if small/static or make dynamic
// import { ActivityChart } from "@/components/dashboard/activity-chart";
// import { RecommendationsWidget } from "@/components/dashboard/recommendations-widget";
// import { ProgressTrackerWidget } from "@/components/dashboard/progress-tracker-widget";
// import { CommunityFeedWidget } from "@/components/dashboard/community-feed-widget";
// import { AchievementsWidget } from "@/components/dashboard/achievements-widget";
// import { DirectMessageWidget } from "@/components/dashboard/direct-message-widget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FolderKanban, Settings, User, Trophy, Edit, LayoutGrid, type LucideIcon, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const QuickLinks = dynamic(() => import('@/components/dashboard/quick-links').then(mod => mod.QuickLinks));
const ActivityChart = dynamic(() => import('@/components/dashboard/activity-chart').then(mod => mod.ActivityChart));
const RecommendationsWidget = dynamic(() => import('@/components/dashboard/recommendations-widget').then(mod => mod.RecommendationsWidget));
const ProgressTrackerWidget = dynamic(() => import('@/components/dashboard/progress-tracker-widget').then(mod => mod.ProgressTrackerWidget));
const CommunityFeedWidget = dynamic(() => import('@/components/dashboard/community-feed-widget').then(mod => mod.CommunityFeedWidget));
const AchievementsWidget = dynamic(() => import('@/components/dashboard/achievements-widget').then(mod => mod.AchievementsWidget));
const DirectMessageWidget = dynamic(() => import('@/components/dashboard/direct-message-widget').then(mod => mod.DirectMessageWidget));


interface UserStats {
  points: number;
  leaderboardRank: string; 
  coursesEnrolled: number;
  projectsCreated: number;
}

interface QuickLinkItemData {
  href: string;
  label: string;
  icon: LucideIcon;
}

async function fetchDashboardStatsFromAPI(userId: string): Promise<UserStats> {
  console.log(`Fetching dashboard stats for user: ${userId} from API...`);
  let stats: UserStats = {
    points: 0,
    leaderboardRank: 'N/A',
    coursesEnrolled: 0,
    projectsCreated: 0,
  };

  try {
    // Fetch points and rank
    const pointsResponse = await fetch(`/api/users/${userId}/points`);
    if (pointsResponse.ok) {
      const pointsData = await pointsResponse.json();
      stats.points = pointsData.total_points || 0;
      stats.leaderboardRank = pointsData.rank_all_time ? `#${pointsData.rank_all_time}` : (stats.points > 0 ? 'Calculating...' : 'N/A');
    }

    // Fetch enrolled courses count (simplified, could get from /api/users/[userId]/enrolled-courses length)
    const enrollmentsResponse = await fetch(`/api/users/${userId}/enrolled-courses`);
    if (enrollmentsResponse.ok) {
      const enrolledCourses = await enrollmentsResponse.json();
      stats.coursesEnrolled = enrolledCourses.length;
    }

    // Fetch created projects count (simplified, could get from /api/users/[userId]/projects length)
    const projectsResponse = await fetch(`/api/users/${userId}/projects?role=creator`); // Assuming API can filter by role
    if (projectsResponse.ok) {
      const createdProjects = await projectsResponse.json();
      stats.projectsCreated = createdProjects.length;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats from API:", error);
    // Return default/empty stats on error
  }
  return stats;
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

  const loadDashboardData = useCallback(async () => {
    if (isAuthenticated && user?.uid) {
      setIsDashboardLoading(true);
      try {
        const stats = await fetchDashboardStatsFromAPI(user.uid);
        setDashboardStats(stats);
        
        // Quick links are static for now, can be dynamic later
        setQuickLinksData([
          { href: "/profile", label: "My Profile", icon: User },
          { href: "/courses", label: "My Courses", icon: BookOpen },
          { href: "/portfolio", label: "My Portfolio", icon: FolderKanban },
          { href: "/settings", label: "Account Settings", icon: Settings },
        ]);

      } catch (error) {
          console.error("Failed to load dashboard data:", error);
          // Set to default error state if needed
      }
      setIsDashboardLoading(false);
    } else if (!authIsLoading && !isAuthenticated) {
        setIsDashboardLoading(false); // Not logged in, stop loading
    }
  }, [isAuthenticated, user, authIsLoading]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);


  if (authIsLoading || isDashboardLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Dashboard" description="Loading your personalized dashboard..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg bg-card" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 lg:col-span-2 rounded-lg bg-card" />
            <div className="space-y-6">
                <Skeleton className="h-48 rounded-lg bg-card" />
                <Skeleton className="h-48 rounded-lg bg-card" />
            </div>
        </div>
         <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-lg bg-card" />
          <Skeleton className="h-64 rounded-lg bg-card" />
          <Skeleton className="h-64 rounded-lg bg-card" />
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
                title="Total Points"
                value={dashboardStats.points.toLocaleString()}
                icon={Award}
                description="Earned from contributions"
            />
            <StatCard
                title="Leaderboard Rank"
                value={dashboardStats.leaderboardRank}
                icon={Trophy}
                description="All-time ranking"
            />
            <StatCard
                title="Courses Enrolled"
                value={dashboardStats.coursesEnrolled.toString()}
                icon={BookOpen}
                description="Keep learning and growing"
            />
            <StatCard
                title="Published Projects"
                value={dashboardStats.projectsCreated.toString()}
                icon={FolderKanban}
                description="Showcasing your skills"
            />
        </div>
    )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ActivityChart />
          <RecommendationsWidget />
          <ProgressTrackerWidget userId={user.uid}/>
        </div>
        
        <div className="space-y-8">
            {quickLinksData.length > 0 && <QuickLinks title="Quick Links" links={quickLinksData} /> }
            <AchievementsWidget userId={user.uid} />
            <CommunityFeedWidget userId={user.uid} /> 
            <DirectMessageWidget userId={user.uid} />
            
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
                        <LayoutGrid className="mx-auto h-12 w-12 text-primary/50 mb-4" />
                        <p>Personalize your dashboard by arranging widgets to best suit your workflow. This feature is under development.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

