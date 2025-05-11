"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpenText, FolderGit2, Activity } from "lucide-react"; // Added Activity as a generic icon
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore"; // Added doc, getDoc
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseProgress {
  id: string;
  title: string;
  progress: number; // Percentage 0-100
}

interface ProjectProgress {
  id: string;
  title: string;
  progress: number; // Percentage 0-100, or a status string
  status?: string; // e.g., 'Planning', 'In Progress', 'Completed'
}

interface ProgressTrackerWidgetProps {
  userId: string;
}

export function ProgressTrackerWidget({ userId }: ProgressTrackerWidgetProps) {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchProgressData = async () => {
      setIsLoading(true);
      try {
        // Fetch Course Progress
        const enrollmentsCol = collection(db, 'course_enrollments');
        const enrollmentsQuery = query(enrollmentsCol, where("user_id", "==", userId), limit(5)); // Limit for display
        const enrollmentsSnap = await getDocs(enrollmentsQuery);
        
        const coursesDataPromises = enrollmentsSnap.docs.map(async (enrollDoc) => {
          const enrollment = enrollDoc.data();
          // To get course title, fetch from 'courses' collection using enrollment.course_id
          const courseRef = doc(db, 'courses', enrollment.course_id);
          const courseSnap = await getDoc(courseRef);
          const courseTitle = courseSnap.exists() ? courseSnap.data().title : `Course ${enrollment.course_id.substring(0,5)}...`;
          
          return {
            id: enrollment.course_id,
            title: courseTitle, 
            progress: enrollment.progress_percentage || 0,
          };
        });
        const courses = await Promise.all(coursesDataPromises);
        setCourseProgress(courses);

        // Fetch Project Progress 
        const projectsCol = collection(db, 'projects');
        // Query projects created by user_id OR where user_id is in a contributors array (if you have that)
        // For simplicity, sticking to user_id as author for now.
        const projectsQuery = query(projectsCol, where("user_id", "==", userId), limit(5)); 
        const projectsSnap = await getDocs(projectsQuery);
        const projectsData = projectsSnap.docs.map(docData => { // Renamed doc to docData to avoid conflict
          const project = docData.data();
          // Assuming 'progress' field or calculate. For now, using status to infer.
          let progressValue = 0;
          if (project.status === 'published') progressValue = 100;
          else if (project.status === 'in_progress') progressValue = 50; // Example
          else if (project.status === 'draft') progressValue = 10; // Example
          // Else, you might need a dedicated progress field or logic based on contributions.
          
          return {
            id: docData.id,
            title: project.title,
            progress: project.progress_percentage || progressValue, // Prefer explicit progress field
            status: project.status || 'Draft', 
          };
        });
        setProjectProgress(projectsData);

      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
      setIsLoading(false);
    };

    fetchProgressData();
  }, [userId]);

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
          <Activity className="mr-2 h-5 w-5 text-primary" /> {/* Using Activity as a generic progress icon */}
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
          {projectProgress.length > 0 ? (
             <ul className="space-y-3">
              {projectProgress.map(project => (
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

