
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, ShieldCheck, Users, Zap } from "lucide-react"; // Added Zap
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";

// Placeholder for BookOpenText if not available in lucide-react directly
const BookOpenText: LucideIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    <line x1="12" y1="11" x2="12" y2="11.01"></line> {/* Simulating text lines */}
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="15" x2="8" y2="15"></line>
  </svg>
);

// Mock data for achievements
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
}

const mockAchievements: Achievement[] = [
  { id: "ach-1", name: "First Project", description: "Successfully created and published your first project.", icon: Star, unlocked: true },
  { id: "ach-2", name: "Course Completer", description: "Completed your first course on the platform.", icon: BookOpenText, unlocked: true },
  { id: "ach-3", name: "Community Helper", description: "Actively helped others in the community forums.", icon: Users, unlocked: false },
  { id: "ach-4", name: "Top Contributor", description: "Reached the top 10 on the leaderboard.", icon: Award, unlocked: true },
  { id: "ach-5", name: "Beta Tester", description: "Participated in beta testing new features.", icon: ShieldCheck, unlocked: false },
  { id: "ach-6", name: "Power Learner", description: "Completed 5 courses.", icon: Zap, unlocked: true },
];


export function AchievementsWidget() {
  const unlockedAchievements = mockAchievements.filter(ach => ach.unlocked);
  const lockedAchievements = mockAchievements.filter(ach => !ach.unlocked);

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
        {unlockedAchievements.length > 0 && (
          <>
            <h4 className="text-sm font-semibold text-foreground mb-2">Unlocked ({unlockedAchievements.length})</h4>
            <TooltipProvider>
              <div className="flex flex-wrap gap-3">
                {unlockedAchievements.map(ach => {
                  const Icon = ach.icon;
                  return (
                    <Tooltip key={ach.id}>
                      <TooltipTrigger asChild>
                        <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-lg cursor-default">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{ach.name}</p>
                        <p className="text-xs">{ach.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </>
        )}

        {lockedAchievements.length > 0 && (
           <>
            <h4 className="text-sm font-semibold text-muted-foreground mt-4 mb-2">Locked ({lockedAchievements.length})</h4>
            <TooltipProvider>
            <div className="flex flex-wrap gap-3">
                {lockedAchievements.map(ach => {
                  const Icon = ach.icon;
                  return (
                    <Tooltip key={ach.id}>
                      <TooltipTrigger asChild>
                        <div className="p-2.5 bg-muted/50 border border-border rounded-lg cursor-default opacity-60">
                          <Icon className="h-7 w-7 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{ach.name}</p>
                        <p className="text-xs">{ach.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
           </>
        )}
        
        {mockAchievements.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>Start your journey to unlock achievements!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
