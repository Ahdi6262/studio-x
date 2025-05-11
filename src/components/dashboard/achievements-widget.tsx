
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, BookOpenText as BookIcon, Users, ShieldCheck, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";
// Firebase imports removed
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface AchievementDefinitionAPI {
  name: string;
  description: string;
  icon_name: string; 
  achieved_at: string; // ISO Date string from API
  // points_value?: number; // If API returns this
}

interface UserAchievement {
  id: string; // Could be achievement name or a unique ID if API provides one
  definition: AchievementDefinitionAPI;
  unlocked: boolean; 
}

const iconMap: Record<string, LucideIcon> = {
  Star,
  BookIcon,
  Users,
  Award,
  ShieldCheck,
  Zap,
  Default: Award, 
};

interface AchievementsWidgetProps {
  userId: string;
}

export function AchievementsWidget({ userId }: AchievementsWidgetProps) {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievementsFromAPI = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/achievements`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: response.statusText}));
        throw new Error(`Failed to fetch achievements: ${errorData.message}`);
      }
      const apiAchievements: AchievementDefinitionAPI[] = await response.json();
      
      const userAchievements: UserAchievement[] = apiAchievements.map((ach, index) => ({
        id: `${ach.name}-${index}`, // Create a simple unique ID
        definition: ach,
        unlocked: true, // All achievements from this API are unlocked
      }));
      
      // Sort by achieved_at date, most recent first
      userAchievements.sort((a,b) => new Date(b.definition.achieved_at).getTime() - new Date(a.definition.achieved_at).getTime());
      setAchievements(userAchievements);

    } catch (error) {
      console.error("Error fetching achievements from API:", error);
      setAchievements([]);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchAchievementsFromAPI();
  }, [fetchAchievementsFromAPI]);


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Your Achievements</CardTitle>
          <CardDescription>Loading your milestones...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-12 rounded-lg" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Your Achievements
        </CardTitle>
        <CardDescription>Showcasing your milestones and contributions.</CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <>
            <h4 className="text-sm font-semibold text-foreground mb-2">Unlocked ({achievements.length})</h4>
            <TooltipProvider>
              <div className="flex flex-wrap gap-3">
                {achievements.map(ach => {
                  const IconComponent = iconMap[ach.definition.icon_name] || iconMap.Default;
                  return (
                    <Tooltip key={ach.id}>
                      <TooltipTrigger asChild>
                        <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-lg cursor-default">
                          <IconComponent className="h-7 w-7 text-primary" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{ach.definition.name}</p>
                        <p className="text-xs">{ach.definition.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Unlocked: {new Date(ach.definition.achieved_at).toLocaleDateString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Start your journey to unlock achievements!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
