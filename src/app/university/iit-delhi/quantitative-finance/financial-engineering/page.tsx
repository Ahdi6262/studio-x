
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function FinancialEngineeringPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi/quantitative-finance">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quantitative Finance
        </Link>
      </Button>
      <PageHeader
        title="Financial Engineering"
        description="Learn about the design, development, and implementation of innovative financial products and processes."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <Briefcase className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Content Coming Soon!</h2>
        <p className="text-muted-foreground max-w-xl">
          This section will cover topics in financial engineering, such as derivatives pricing, risk management strategies, portfolio optimization, and the creation of structured financial products.
        </p>
      </div>
    </div>
  );
}
