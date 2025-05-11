
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Briefcase, Sigma, DollarSign } from "lucide-react"; // Added Calculator, Briefcase, Sigma
import type { ElementType } from "react";

interface QFSubTopic {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  actionText: string;
}

const qfSubTopicsData: QFSubTopic[] = [
  {
    title: "Quantitative Modeling",
    description: "Explore mathematical and statistical models used to analyze financial markets and make investment decisions.",
    href: "/university/iit-delhi/quantitative-finance/quantitative-modeling",
    icon: Calculator,
    actionText: "Explore Modeling"
  },
  {
    title: "Financial Engineering",
    description: "Learn about the design, development, and implementation of innovative financial products and processes.",
    href: "/university/iit-delhi/quantitative-finance/financial-engineering",
    icon: Briefcase,
    actionText: "Explore Engineering"
  },
  {
    title: "Mathematics in Finance",
    description: "Understand the core mathematical theories and techniques that form the backbone of quantitative finance.",
    href: "/university/iit-delhi/quantitative-finance/mathematics",
    icon: Sigma,
    actionText: "Explore Math"
  }
];

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
        description="Exploring the application of mathematical and statistical methods in finance. Delve into modeling, engineering, and core mathematical principles."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qfSubTopicsData.map(item => (
          <Link href={item.href} key={item.title} className="block hover:no-underline group">
            <div className="bg-card p-6 rounded-lg shadow-md group-hover:shadow-primary/20 transition-shadow flex flex-col h-full">
              <div className="flex items-center mb-3">
                <item.icon className="h-7 w-7 text-primary mr-3 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-primary">{item.title}</h2>
              </div>
              <p className="text-muted-foreground mb-4 text-sm flex-grow min-h-[80px]">
                {item.description}
              </p>
              <div className="mt-auto self-start text-primary text-sm font-medium group-hover:underline">
                {item.actionText} &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
