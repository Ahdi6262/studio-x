import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AcademicSectionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/about">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to About
          </Link>
      </Button>
      <PageHeader
        title="Academic Sections"
        description="Overview of different academic sections and their specializations."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <p className="text-muted-foreground">
          Information on Academic Sections is being prepared. 
          This part of the website will detail various academic units, their faculty, course offerings, and areas of expertise.
        </p>
      </div>
    </div>
  );
}
