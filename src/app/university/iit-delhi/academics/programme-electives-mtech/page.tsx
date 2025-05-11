
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ListPlus } from "lucide-react";

export default function ProgrammeElectivesMtechPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Programme Electives (M.Tech)"
        description="Explore elective courses offered for M.Tech programmes to specialize your knowledge."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <ListPlus className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">M.Tech Programme Electives</h2>
        <p className="text-muted-foreground max-w-xl">
          Information on M.Tech Programme Electives is being compiled. 
          This section will provide lists of elective courses available for various M.Tech specializations, allowing students to deepen their expertise.
        </p>
      </div>
    </div>
  );
}
