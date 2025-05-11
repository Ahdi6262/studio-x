
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpenText, FolderGit2 } from "lucide-react";

// Mock data for progress
const mockCourseProgress = [
  { id: "course-1", title: "Introduction to Solidity", progress: 75 },
  { id: "course-2", title: "Advanced Next.js", progress: 40 },
];

const mockProjectProgress = [
  { id: "project-1", title: "DeFi Lending Protocol", progress: 60, status: "In Progress" },
  { id: "project-2", title: "NFT Marketplace V2", progress: 20, status: "Planning" },
];

export function ProgressTrackerWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FolderGit2 className="mr-2 h-5 w-5 text-primary" /> {/* Changed icon */}
          Your Progress
        </CardTitle>
        <CardDescription>Keep track of your learning and project development.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <BookOpenText className="mr-2 h-5 w-5 text-primary/80" />
            Course Progress
          </h3>
          {mockCourseProgress.length > 0 ? (
            <ul className="space-y-3">
              {mockCourseProgress.map(course => (
                <li key={course.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{course.title}</span>
                    <span className="text-xs text-muted-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} aria-label={`${course.title} progress ${course.progress}%`} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No active courses. Start learning today!</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FolderGit2 className="mr-2 h-5 w-5 text-primary/80" />
            Project Progress
          </h3>
          {mockProjectProgress.length > 0 ? (
             <ul className="space-y-3">
              {mockProjectProgress.map(project => (
                <li key={project.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{project.title}</span>
                    <span className="text-xs text-muted-foreground">{project.status} - {project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className={project.status === "Planning" ? "bg-secondary" : ""} aria-label={`${project.title} progress ${project.progress}%`} />
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-muted-foreground">No active projects. Start building something amazing!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
