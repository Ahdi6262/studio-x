
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MinorDegreesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Minor Degrees"
        description="Learn about the Minor Degree programs offered to broaden your academic horizons."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <p className="text-muted-foreground">
          Details on Minor Degrees will be updated soon. 
          This section will outline the available minor programs, their requirements, and how they can complement your primary field of study.
        </p>
      </div>
    </div>
  );
}
