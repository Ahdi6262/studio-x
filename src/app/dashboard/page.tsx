
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/core/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FolderKanban, CalendarClock, Award, MessageSquare, Settings, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Mock data - replace with actual data fetching
  const userStats = {
    points: 1250, // Example from mockLeaderboard or user profile
    coursesEnrolled: 3,
    projectsCreated: 2,
    upcomingEvents: 1,
  };

  const quickLinksData = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/courses", label: "My Courses", icon: BookOpen }, // Assuming a "My Courses" page or filter
    { href: "/portfolio", label: "My Projects", icon: FolderKanban }, // Assuming a "My Projects" page or filter
    { href: "/settings", label: "Account Settings", icon: Settings }, // Assuming a general settings page
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}!`}
        description="Here's a quick overview of your activity and progress."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Points"
          value={userStats.points.toLocaleString()}
          icon={Award}
          description="Earned from contributions"
        />
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
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        
        <div className="space-y-8">
            <QuickLinks title="Quick Links" links={quickLinksData} />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-primary" /> Recent Activity
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
