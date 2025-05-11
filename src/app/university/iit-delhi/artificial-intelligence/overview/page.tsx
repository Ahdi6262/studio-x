
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";

export default function AIOverviewPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi/artificial-intelligence">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Artificial Intelligence
        </Link>
      </Button>
      <PageHeader
        title="Artificial Intelligence Overview"
        description="Understand the core concepts, history, and broad applications of Artificial Intelligence. Explore foundational principles and ethical considerations."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <Brain className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Content Coming Soon!</h2>
        <p className="text-muted-foreground max-w-xl">
          This section will soon feature detailed information and resources related to the overview of Artificial Intelligence, covering its history, subfields, ethical implications, and future trends.
        </p>
      </div>
    </div>
  );
}
