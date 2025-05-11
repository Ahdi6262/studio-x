
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import { mockCourses as fallbackCourses, type Course } from "@/lib/mock-data"; // Keep mock as fallback
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { collection, getDocs } from "firebase/firestore"; // Example for Firebase
// import { db } from "@/lib/firebase"; // Example for Firebase

// Simulate fetching courses (replace with actual Firebase call)
async function fetchCoursesFromDB(): Promise<Course[]> {
  console.log("Fetching courses from DB (simulated)...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // In a real app:
  // const coursesCol = collection(db, 'courses');
  // const courseSnapshot = await getDocs(coursesCol);
  // const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  // return courseList;
  return fallbackCourses; // Return mock data for now
}


export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All", level: "All" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const courses = await fetchCoursesFromDB();
        setAllCourses(courses);
        setFilteredCourses(courses); // Initially, all courses are shown
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        // Handle error, e.g., show a toast message
      }
      setIsLoading(false);
    };
    loadCourses();
  }, []);

  const handleFilterChange = useCallback((newFilters: { searchTerm: string; category: string; level: string }) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    let coursesToFilter = [...allCourses];

    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      coursesToFilter = coursesToFilter.filter(course =>
        course.title.toLowerCase().includes(lowerSearchTerm) ||
        course.instructor.toLowerCase().includes(lowerSearchTerm) ||
        course.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (filters.category !== "All") {
      coursesToFilter = coursesToFilter.filter(course => course.category === filters.category);
    }

    // Assuming courses might have a 'level' property in the future
    if (filters.level !== "All") {
       // coursesToFilter = coursesToFilter.filter(course => course.level === filters.level);
    }

    setFilteredCourses(coursesToFilter);
  }, [filters, allCourses]);

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Explore Courses"
        description="Sharpen your skills and learn from experts. Find courses on blockchain, AI, digital art, and more to accelerate your Web3 journey."
         actions={
          <Button asChild variant="outline">
            <Link href="/courses/teach"> {/* Assuming a page for instructors */}
              <PlusCircle className="mr-2 h-4 w-4" /> Become an Instructor
            </Link>
          </Button>
        }
      />

      <CourseFilters onFilterChange={handleFilterChange} />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 col-span-full">
          <h2 className="text-2xl font-semibold mb-2">No courses match your criteria!</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters, or check back soon for new learning opportunities.</p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[220px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);
