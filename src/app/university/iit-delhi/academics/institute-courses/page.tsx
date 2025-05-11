
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Library } from "lucide-react";

export default function InstituteCoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Institute Courses"
        description="Information about courses offered at the institute level, including foundational and interdisciplinary subjects."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <Library className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Institute Courses Information</h2>
        <p className="text-muted-foreground max-w-xl">
          Detailed content for Institute Courses will be available here soon. 
          This section will list courses that are common across various departments or are part of general academic requirements.
        </p>
      </div>
    </div>
  );
}
