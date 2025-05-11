
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Sigma } from "lucide-react";

export default function QFMathematicsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi/quantitative-finance">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quantitative Finance
        </Link>
      </Button>
      <PageHeader
        title="Mathematics in Finance"
        description="Understand the core mathematical theories and techniques that form the backbone of quantitative finance."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <Sigma className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Content Coming Soon!</h2>
        <p className="text-muted-foreground max-w-xl">
          This section will detail the mathematical concepts crucial for quantitative finance, including probability theory, stochastic processes, optimization, and numerical methods.
        </p>
      </div>
    </div>
  );
}
