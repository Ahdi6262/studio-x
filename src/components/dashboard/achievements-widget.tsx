
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, ShieldCheck, Users, Zap, BookOpenText as BookIcon } from "lucide-react"; // Using BookOpenText for BookIcon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface AchievementDefinition {
  id: string; // key from achievement_definitions
  name: string;
  description: string;
  icon_name: string; // Lucide icon name string
  points_value?: number;
}

interface UserAchievement {
  id: string; // Document ID from user_achievements
  definition: AchievementDefinition; // Enriched with definition details
  achieved_at: Date; // Timestamp converted to Date
  unlocked: boolean; // Always true if fetched from user_achievements
}

const iconMap: Record<string, LucideIcon> = {
  Star,
  BookIcon, // Renamed from BookOpenText
  Users,
  Award,
  ShieldCheck,
  Zap,
  // Add other icons you use in achievement_definitions.icon_name
  Default: Award, // Fallback icon
};

interface AchievementsWidgetProps {
  userId: string;
}

export function AchievementsWidget({ userId }: AchievementsWidgetProps) {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch user's achieved achievement keys
        const userAchievementsCol = collection(db, 'user_achievements');
        const userAchievementsQuery = query(userAchievementsCol, where("user_id", "==", userId));
        const userAchievementsSnap = await getDocs(userAchievementsQuery);

        const fetchedAchievementsPromises = userAchievementsSnap.docs.map(async (achDoc) => {
          const userAchData = achDoc.data();
          const achievementKey = userAchData.achievement_key;

          // 2. Fetch the definition for each achieved key
          const achDefRef = doc(db, 'achievement_definitions', achievementKey);
          const achDefSnap = await getDoc(achDefRef);

          if (achDefSnap.exists()) {
            const defData = achDefSnap.data() as Omit<AchievementDefinition, 'id'>;
            return {
              id: achDoc.id,
              definition: { id: achievementKey, ...defData },
              achieved_at: userAchData.achieved_at.toDate(), // Convert Firestore Timestamp to Date
              unlocked: true,
            };
          }
          return null; 
        });
        
        const resolvedAchievements = (await Promise.all(fetchedAchievementsPromises)).filter(Boolean) as UserAchievement[];
        setAchievements(resolvedAchievements.sort((a,b) => b.achieved_at.getTime() - a.achieved_at.getTime())); // Sort by most recent

      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
      setIsLoading(false);
    };

    fetchAchievements();
  }, [userId]);


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
                        <p className="text-xs text-muted-foreground mt-1">Unlocked: {ach.achieved_at.toLocaleDateString()}</p>
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
        {/* Placeholder for locked achievements if you implement that logic */}
      </CardContent>
    </Card>
  );
}
