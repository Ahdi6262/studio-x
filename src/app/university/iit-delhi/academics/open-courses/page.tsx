
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function OpenCoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Open Courses"
        description="Explore courses open to all students, promoting interdisciplinary learning and broad skill development."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <GraduationCap className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Open Course Catalog</h2>
        <p className="text-muted-foreground max-w-xl">
          Information on Open Courses is being updated. 
          This section will feature a variety of courses available across different departments, designed to foster a broad understanding and interdisciplinary skills. Check back soon for the full list.
        </p>
      </div>
    </div>
  );
}
