
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DepartmentalCorePage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Departmental Core"
        description="Information about departmental core subjects and curriculum."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <p className="text-muted-foreground">
          Detailed content for Departmental Core will be available here soon. 
          This section will cover the fundamental courses and requirements specific to each department.
        </p>
      </div>
    </div>
  );
}
