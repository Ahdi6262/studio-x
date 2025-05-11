import { PageHeader } from "@/components/core/page-header";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import { mockCourses } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Explore Courses"
        description="Sharpen your skills and learn from experts. Find courses on blockchain, AI, digital art, and more to accelerate your Web3 journey."
         actions={
          <Button asChild variant="outline">
            <Link href="/courses/teach">
              <PlusCircle className="mr-2 h-4 w-4" /> Become an Instructor
            </Link>
          </Button>
        }
      />

      <CourseFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {mockCourses.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No courses available yet!</h2>
          <p className="text-muted-foreground mb-4">Check back soon for new learning opportunities.</p>
        </div>
      )}
    </div>
  );
}
