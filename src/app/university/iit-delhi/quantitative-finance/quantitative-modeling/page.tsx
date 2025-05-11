
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";

export default function QuantitativeModelingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi/quantitative-finance">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quantitative Finance
        </Link>
      </Button>
      <PageHeader
        title="Quantitative Modeling"
        description="Exploring mathematical and statistical models used to analyze financial markets and make investment decisions."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <Calculator className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Content Coming Soon!</h2>
        <p className="text-muted-foreground max-w-xl">
          This section will soon feature detailed information on quantitative modeling techniques, including stochastic calculus, time series analysis, and simulation methods used in finance.
        </p>
      </div>
    </div>
  );
}
