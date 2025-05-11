
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
import { doc, getDoc, collection, query, where, getDocs,getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserStats {
  points: number;
  leaderboardRank: number | string; // Can be 'N/A' or a number
  coursesEnrolled: number;
  projectsCreated: number;
  // upcomingEvents: number; // This would require an 'events' collection and user RSVPs
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

  // Fetch points and rank from 'user_points'
  const userPointsRef = doc(db, 'user_points', userId);
  const userPointsSnap = await getDoc(userPointsRef);
  if (userPointsSnap.exists()) {
    userStats.points = userPointsSnap.data().total_points || 0;
    // Leaderboard rank would typically be calculated server-side or via a more complex query.
    // For simplicity, we'll just show points. A full rank would need to query all users and sort.
    // As a placeholder, if you store monthly/weekly rank, you could fetch that.
    userStats.leaderboardRank = `#${userPointsSnap.data().rank || 'N/A'}`; // Assuming rank is stored
  }

  // Fetch enrolled courses count
  const enrollmentsCol = collection(db, 'course_enrollments');
  const enrollmentsQuery = query(enrollmentsCol, where("user_id", "==", userId));
  const enrollmentsSnap = await getCountFromServer(enrollmentsQuery);
  userStats.coursesEnrolled = enrollmentsSnap.data().count;


  // Fetch created projects count
  const projectsCol = collection(db, 'projects');
  const projectsQuery = query(projectsCol, where("user_id", "==", userId));
  const projectsSnap = await getCountFromServer(projectsQuery);
  userStats.projectsCreated = projectsSnap.data().count;
  
  // Upcoming events would require an 'events' collection and a way to track user RSVPs or interest.
  // For now, this is omitted from UserStats.

  const quickLinks: QuickLinkItemData[] = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/courses", label: "My Courses", icon: BookOpen },
    { href: "/portfolio", label: "My Projects", icon: FolderKanban },
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
    if (!authIsLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      const loadData = async () => {
        setIsDashboardLoading(true);
        try {
          const data = await fetchDashboardData(user.uid);
          setDashboardStats(data.stats);
          setQuickLinksData(data.quickLinks);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            // Potentially set an error state to display to the user
        }
        setIsDashboardLoading(false);
      };
      loadData();
    } else if (!authIsLoading && !isAuthenticated) {
        setIsDashboardLoading(false);
    }
  }, [isAuthenticated, user, authIsLoading]);


  if (authIsLoading || isDashboardLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Dashboard" description="Loading your dashboard..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-8"> {/* Adjusted to 4 for stats */}
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
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
            <Button variant="outline" disabled> {/* Implement customization later */}
                <LayoutGrid className="mr-2 h-4 w-4" /> Customize Layout (Soon)
            </Button>
        }
      />

    {dashboardStats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-8"> {/* Adjusted to 4 for stats */}
            <StatCard
            title="Total Points"
            value={dashboardStats.points.toLocaleString()}
            icon={Award}
            description="Earned from contributions"
            />
            <StatCard
                title="Leaderboard Rank"
                value={dashboardStats.leaderboardRank.toString()} // Ensure it's a string
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
            {/* Upcoming Events StatCard removed for now, pending data source
            <StatCard
            title="Upcoming Events"
            value={dashboardStats.upcomingEvents.toString()}
            icon={CalendarClock}
            description="Stay connected"
            /> 
            */}
        </div>
    )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <ActivityChart /> {/* Ensure this component fetches or receives real data */}
          <RecommendationsWidget /> {/* This will use Genkit and Firebase data */}
          <ProgressTrackerWidget userId={user.uid}/> {/* Pass userId to fetch specific progress */}
        </div>
        
        {/* Sidebar Column */}
        <div className="space-y-8">
            {quickLinksData.length > 0 && <QuickLinks title="Quick Links" links={quickLinksData} /> }
            <AchievementsWidget userId={user.uid} /> {/* Pass userId to fetch specific achievements */}
            <CommunityFeedWidget /> {/* This will fetch community events */}
            <DirectMessageWidget userId={user.uid} /> {/* Pass userId for context */}
            
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
            {/* Old Recent Activity placeholder - can be removed or repurposed */}
        </div>
      </div>
    </div>
  );
}
