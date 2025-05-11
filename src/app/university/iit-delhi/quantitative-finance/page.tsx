
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react";

export default function QuantitativeFinancePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Knowledge
        </Link>
      </Button>
      <PageHeader
        title="Quantitative Finance"
        description="Exploring the application of mathematical and statistical methods in finance."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <TrendingUp className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Content Coming Soon!</h2>
        <p className="text-muted-foreground max-w-xl">
          Detailed information, resources, and insights related to Quantitative Finance will be available here shortly. This section will cover topics such as financial modeling, risk management, algorithmic trading, and more.
        </p>
      </div>
    </div>
  );
}
