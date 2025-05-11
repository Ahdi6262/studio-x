
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpenText, FolderGit2, Activity } from "lucide-react";
// Firebase imports removed
// import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseProgressAPI {
  courseId: string; // from API, was id
  title: string;
  progress: number; 
}

interface ProjectProgressAPI {
  projectId: string; // from API, was id
  title: string;
  progress?: number; // May not exist if status is used
  status?: string;
}

interface ProgressTrackerWidgetProps {
  userId: string;
}

export function ProgressTrackerWidget({ userId }: ProgressTrackerWidgetProps) {
  const [courseProgress, setCourseProgress] = useState<CourseProgressAPI[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgressAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgressDataFromAPI = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Fetch Course Progress from API
      const coursesResponse = await fetch(`/api/users/${userId}/enrolled-courses?limit=5`);
      if (coursesResponse.ok) {
        const courses: CourseProgressAPI[] = await coursesResponse.json();
        setCourseProgress(courses);
      } else {
        console.error("Failed to fetch course progress from API");
        setCourseProgress([]);
      }

      // Fetch Project Progress from API
      const projectsResponse = await fetch(`/api/users/${userId}/projects?limit=5`); // Adjust API if it provides progress directly
      if (projectsResponse.ok) {
        const projects: ProjectProgressAPI[] = await projectsResponse.json();
        // API might return status; map to progress percentage if needed
        const formattedProjects = projects.map(p => {
            let calculatedProgress = p.progress || 0;
            if (p.status === 'published') calculatedProgress = 100;
            else if (p.status === 'in_progress') calculatedProgress = 50; // Example
            else if (p.status === 'draft') calculatedProgress = 10; // Example
            return { ...p, progress: calculatedProgress };
        });
        setProjectProgress(formattedProjects);
      } else {
        console.error("Failed to fetch project progress from API");
        setProjectProgress([]);
      }

    } catch (error) {
      console.error("Error fetching progress data from API:", error);
      setCourseProgress([]);
      setProjectProgress([]);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProgressDataFromAPI();
  }, [fetchProgressDataFromAPI]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" /> Your Progress
          </CardTitle>
          <CardDescription>Loading your learning and project development...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BookOpenText className="mr-2 h-5 w-5 text-primary/80" /> Course Progress
            </h3>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FolderGit2 className="mr-2 h-5 w-5 text-primary/80" /> Project Progress
            </h3>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
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
          {courseProgress.length > 0 ? (
            <ul className="space-y-3">
              {courseProgress.map(course => (
                <li key={course.courseId}>
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
          {projectProgress.length > 0 ? (
             <ul className="space-y-3">
              {projectProgress.map(project => (
                <li key={project.projectId}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{project.title}</span>
                    <span className="text-xs text-muted-foreground">{project.status || 'Status N/A'} - {project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className={project.status === "Planning" ? "bg-secondary" : ""} aria-label={`${project.title} progress ${project.progress || 0}%`} />
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
