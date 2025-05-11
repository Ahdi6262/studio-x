
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Projects"
        description="Explore a variety of academic, research, and student-led projects at IIT Delhi."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <Lightbulb className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Project Showcase</h2>
        <p className="text-muted-foreground max-w-xl">
          Detailed information about ongoing and completed projects will be featured here soon. 
          This section will highlight innovative work across various departments and research areas.
        </p>
      </div>
    </div>
  );
}
