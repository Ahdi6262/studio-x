
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InterdisciplinaryInitiativesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Interdisciplinary Initiatives"
        description="Explore our collaborative projects and programs that span across multiple disciplines."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <p className="text-muted-foreground">
          Content regarding Interdisciplinary Initiatives is currently under development. 
          This section will highlight programs that foster collaboration and innovation by integrating knowledge from various fields.
        </p>
      </div>
    </div>
  );
}
