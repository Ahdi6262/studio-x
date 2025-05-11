
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import type { Course } from '@/lib/mock-data'; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function fetchCoursesFromDB(filters?: { searchTerm?: string; category?: string; level?: string }): Promise<Course[]> {
  console.log("Fetching courses from DB with filters:", filters);
  const coursesCol = collection(db, 'courses');
  let q = query(coursesCol, orderBy("title")); // Default ordering

  // This is a simplified client-side filtering after fetching.
  // For production, implement server-side filtering or more advanced client-side search.
  // Firestore queries for text search are limited. Consider Algolia or similar for full-text search.

  const courseSnapshot = await getDocs(q);
  let courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

  if (filters) {
    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      courseList = courseList.filter(course =>
        course.title.toLowerCase().includes(lowerSearchTerm) ||
        course.instructor.toLowerCase().includes(lowerSearchTerm) ||
        course.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (filters.category && filters.category !== "All") {
      courseList = courseList.filter(course => course.category === filters.category);
    }
    if (filters.level && filters.level !== "All") {
      // Assuming 'level' property exists on Course type
      // courseList = courseList.filter(course => course.level === filters.level);
    }
  }
  
  return courseList;
}


export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All", level: "All" });
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = useCallback(async (currentFilters: typeof filters) => {
    setIsLoading(true);
    try {
      // Pass filters to fetch function if you implement server-side filtering
      const courses = await fetchCoursesFromDB(currentFilters); 
      setAllCourses(courses); // Store all fetched courses (potentially unfiltered if filtering is client-side)
      // Apply initial filtering based on currentFilters
      let coursesToFilter = [...courses];
      if (currentFilters.searchTerm) {
        const lowerSearchTerm = currentFilters.searchTerm.toLowerCase();
        coursesToFilter = coursesToFilter.filter(course =>
          course.title.toLowerCase().includes(lowerSearchTerm) ||
          course.instructor.toLowerCase().includes(lowerSearchTerm) ||
          course.description.toLowerCase().includes(lowerSearchTerm)
        );
      }
      if (currentFilters.category !== "All") {
        coursesToFilter = coursesToFilter.filter(course => course.category === currentFilters.category);
      }
      // if (currentFilters.level !== "All") { ... }
      setFilteredCourses(coursesToFilter);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      // Handle error, e.g., show a toast message
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

