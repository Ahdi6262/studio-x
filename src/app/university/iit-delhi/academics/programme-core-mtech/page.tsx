
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookCopy } from "lucide-react";

export default function ProgrammeCoreMtechPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Programme Core (M.Tech)"
        description="Information about core subjects and curriculum for M.Tech programmes."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <BookCopy className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">M.Tech Programme Core Details</h2>
        <p className="text-muted-foreground max-w-xl">
          Detailed content for M.Tech Programme Core courses will be available here soon. 
          This section will cover the fundamental courses and requirements specific to each M.Tech specialization.
        </p>
      </div>
    </div>
  );
}
