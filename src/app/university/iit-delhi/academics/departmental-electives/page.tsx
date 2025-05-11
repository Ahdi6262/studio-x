
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export default function DepartmentalElectivesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Departmental Electives"
        description="Explore elective courses offered within specific departments to specialize your knowledge."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <Layers className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Departmental Electives Details</h2>
        <p className="text-muted-foreground max-w-xl">
          Information on Departmental Electives is being compiled. 
          This section will provide lists of elective courses available for each department, allowing students to deepen their expertise in chosen areas.
        </p>
      </div>
    </div>
  );
}
