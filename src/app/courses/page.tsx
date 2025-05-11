
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import type { Course } from '@/lib/mock-data'; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react"; 
import { Skeleton } from "@/components/ui/skeleton";
// Firebase imports removed as we are moving to MySQL via API
// import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
// import { db } from "@/lib/firebase";

async function fetchCoursesFromAPI(filters?: { searchTerm?: string; category?: string; level?: string }): Promise<Course[]> {
  console.log("Fetching courses from API with filters:", filters);
  const queryParams = new URLSearchParams();
  if (filters?.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
  if (filters?.category && filters.category !== "All") queryParams.append('category', filters.category);
  if (filters?.level && filters.level !== "All") queryParams.append('level', filters.level);
  
  try {
    const response = await fetch(`/api/courses?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    const courses: Course[] = await response.json();
    // The API should return data already in the Course format, or mapping needs to happen here/in API.
    // For this example, assuming API returns data compatible with Course type.
    return courses;
  } catch (error) {
    console.error("Error fetching courses from API:", error);
    return []; // Return empty array on error
  }
}


export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All", level: "All" });
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = useCallback(async (currentFilters: typeof filters) => {
    setIsLoading(true);
    try {
      const courses = await fetchCoursesFromAPI(currentFilters); 
      setFilteredCourses(courses);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setFilteredCourses([]); // Set to empty on error
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    loadCourses(filters);
  }, [loadCourses, filters]);

  const handleFilterChange = useCallback((newFilters: { searchTerm: string; category: string; level: string }) => {
    setFilters(newFilters);
  }, []);


  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Explore Courses"
        description="Sharpen your skills and learn from experts. Find courses on blockchain, AI, digital art, and more to accelerate your Web3 journey."
         actions={
          <Button asChild> 
            <Link href="/courses/teach">
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
        <div className="text-center py-16 col-span-full bg-card rounded-xl shadow-lg">
          <BookOpen className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-3 text-primary">No Courses Found!</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Try adjusting your search filters, or check back soon for new learning opportunities.
          </p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3 bg-card p-4 rounded-xl shadow">
    <Skeleton className="h-[220px] w-full rounded-lg bg-muted" />
    <div className="space-y-2 pt-2">
      <Skeleton className="h-5 w-3/4 bg-muted" />
      <Skeleton className="h-4 w-1/2 bg-muted" />
      <Skeleton className="h-4 w-full bg-muted" />
    </div>
     <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-1/4 bg-muted" />
        <Skeleton className="h-9 w-1/3 bg-muted rounded-md" />
    </div>
  </div>
);
