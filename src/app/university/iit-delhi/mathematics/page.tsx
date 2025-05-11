
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sigma, Calculator, LineChart, Binary, Orbit, Shapes, BookOpen, FunctionSquare } from "lucide-react";
import type { ElementType } from "react";

interface MathSubTopic {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  actionText: string;
}

const mathSubTopicsData: MathSubTopic[] = [
  {
    title: "Algebra",
    description: "Explore fundamental algebraic structures, equations, and their applications in various mathematical fields.",
    href: "/university/iit-delhi/mathematics/algebra",
    icon: FunctionSquare,
    actionText: "Explore Algebra"
  },
  {
    title: "Calculus",
    description: "Dive into the concepts of limits, derivatives, integrals, and their use in modeling change and motion.",
    href: "/university/iit-delhi/mathematics/calculus",
    icon: Calculator,
    actionText: "Explore Calculus"
  },
  {
    title: "Analysis",
    description: "Understand rigorous concepts of real and complex analysis, including sequences, series, and continuity.",
    href: "/university/iit-delhi/mathematics/analysis",
    icon: LineChart,
    actionText: "Explore Analysis"
  },
  {
    title: "Discrete Mathematics",
    description: "Study mathematical structures that are fundamentally discrete rather than continuous, crucial for computer science.",
    href: "/university/iit-delhi/mathematics/discrete-mathematics",
    icon: Binary,
    actionText: "Explore Discrete Math"
  },
  {
    title: "Dynamics",
    description: "Investigate systems that evolve over time, including differential equations and chaos theory.",
    href: "/university/iit-delhi/mathematics/dynamics",
    icon: Orbit,
    actionText: "Explore Dynamics"
  },
  {
    title: "Geometry",
    description: "Explore the properties of space, shapes, sizes, and positions of figures.",
    href: "/university/iit-delhi/mathematics/geometry",
    icon: Shapes,
    actionText: "Explore Geometry"
  },
  {
    title: "General Mathematics",
    description: "Access foundational mathematical concepts, theories, and introductory materials.",
    href: "/university/iit-delhi/mathematics/general",
    icon: BookOpen,
    actionText: "Explore General Topics"
  }
];

export default function MathematicsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Knowledge
        </Link>
      </Button>
      <PageHeader
        title="Mathematics"
        description="Delving into various branches of mathematics and their applications. Explore foundational concepts and advanced theories."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mathSubTopicsData.map(item => (
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

