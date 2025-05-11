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
import { BookOpen, FolderKanban, Settings, User, Trophy, Edit, LayoutGrid, type LucideIcon, Award } from "lucide-react"; // Added Award
import { Skeleton } from "@/components/ui/skeleton";
import { doc, getDoc, collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

async function fetchDashboardData(userId: string): Promise<{ stats: UserStats, quickLinks: QuickLinkItemData[] }> {
  console.log(`Fetching dashboard data for user: ${userId} from Firebase...`);

  let userStats: UserStats = {
    points: 0,
    leaderboardRank: 'N/A',
    coursesEnrolled: 0,
    projectsCreated: 0,
  };

  const userPointsRef = doc(db, 'user_points', userId);
  const userPointsSnap = await getDoc(userPointsRef);
  if (userPointsSnap.exists()) {
    const data = userPointsSnap.data();
    userStats.points = data.total_points || 0;
    userStats.leaderboardRank = data.rank_all_time ? `#${data.rank_all_time}` : (data.total_points > 0 ? 'Calculating...' : 'N/A');
  }

  const enrollmentsCol = collection(db, 'course_enrollments');
  const enrollmentsQuery = query(enrollmentsCol, where("user_id", "==", userId));
  const enrollmentsSnap = await getCountFromServer(enrollmentsQuery);
  userStats.coursesEnrolled = enrollmentsSnap.data().count;

  const projectsCol = collection(db, 'projects');
  const projectsQuery = query(projectsCol, where("user_id", "==", userId), where("status", "==", "published"));
  const projectsSnap = await getCountFromServer(projectsQuery);
  userStats.projectsCreated = projectsSnap.data().count;
  
  const quickLinks: QuickLinkItemData[] = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/courses", label: "My Courses", icon: BookOpen }, // Assuming this page shows enrolled courses
    { href: "/portfolio", label: "My Portfolio", icon: FolderKanban }, // Changed from My Projects for consistency
    { href: "/settings", label: "Account Settings", icon: Settings },
  ];
  
  return { stats: userStats, quickLinks };
}


export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState<UserStats | null>(null);
  const [quickLinksData, setQuickLinksData] = useState<QuickLinkItemData[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  useEffect(() => {
    if (!authIsLoading &amp;&amp; !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (isAuthenticated &amp;&amp; user?.uid) {
      const loadData = async () => {
        setIsDashboardLoading(true);
        try {
          const data = await fetchDashboardData(user.uid);
          setDashboardStats(data.stats);
          setQuickLinksData(data.quickLinks);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        }
        setIsDashboardLoading(false);
      };
      loadData();
    } else if (!authIsLoading &amp;&amp; !isAuthenticated) {
        setIsDashboardLoading(false);
    }
  }, [isAuthenticated, user, authIsLoading]);

  if (authIsLoading || isDashboardLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Dashboard" description="Loading your personalized dashboard..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg bg-card" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 lg:col-span-2 rounded-lg bg-card" /> {/* Increased height for ActivityChart */}
            <div className="space-y-6">
                <Skeleton className="h-48 rounded-lg bg-card" /> {/* QuickLinks placeholder */}
                <Skeleton className="h-48 rounded-lg bg-card" /> {/* Another widget placeholder */}
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

    {dashboardStats &amp;&amp; (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
                title="Total Points"
                value={dashboardStats.points.toLocaleString()}
                icon={Award} // Changed from Star
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
            {quickLinksData.length > 0 &amp;&amp; <QuickLinks title="Quick Links" links={quickLinksData} /> }
            <AchievementsWidget userId={user.uid} />
            <CommunityFeedWidget />
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

