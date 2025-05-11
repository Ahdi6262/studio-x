
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import { mockCourses, type Course } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All", level: "All" });

  const handleFilterChange = useCallback((newFilters: { searchTerm: string; category: string; level: string }) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    let courses = mockCourses;

    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      courses = courses.filter(course =>
        course.title.toLowerCase().includes(lowerSearchTerm) ||
        course.instructor.toLowerCase().includes(lowerSearchTerm) ||
        course.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (filters.category !== "All") {
      courses = courses.filter(course => course.category === filters.category);
    }

    if (filters.level !== "All") {
      // This assumes course data has a 'level' property.
      // Mock data doesn't have it, so this filter won't do anything for now.
      // To make it work, add a 'level: "Beginner" | "Intermediate" | "Advanced"' to Course interface and mockCourses.
      // For example: courses = courses.filter(course => course.level === filters.level);
    }

    setFilteredCourses(courses);
  }, [filters]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <h2 className="text-2xl font-semibold mb-2">No courses match your criteria!</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters, or check back soon for new learning opportunities.</p>
        </div>
      )}
    </div>
  );
}

