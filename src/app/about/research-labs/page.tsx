import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ResearchLabsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/about">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to About
          </Link>
      </Button>
      <PageHeader
        title="Research Labs"
        description="Discover the cutting-edge research being conducted in our state-of-the-art laboratories."
      />
       <div className="bg-card p-8 rounded-lg shadow-lg">
        <p className="text-muted-foreground">
          Information about our Research Labs is being compiled. 
          This area will provide insights into various research groups, their projects, facilities, and contributions to their respective fields.
        </p>
      </div>
    </div>
  );
}
