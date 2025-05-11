
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function GeneralMathematicsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi/mathematics">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mathematics
        </Link>
      </Button>
      <PageHeader
        title="General Mathematics"
        description="Access foundational mathematical concepts, theories, and introductory materials."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <BookOpen className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Content Coming Soon!</h2>
        <p className="text-muted-foreground max-w-xl">
          This section will soon feature general resources, foundational concepts, and introductory materials related to various branches of mathematics.
        </p>
      </div>
    </div>
  );
}
