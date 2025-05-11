
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { School, DollarSign, Brain, Code2 as Code, Sigma } from "lucide-react"; 
import type { ElementType } from "react";

interface KnowledgeArea {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  actionText: string;
}

export default function UniversityIITDelhiPage() {
  const knowledgeAreas: KnowledgeArea[] = [
    {
      title: "IIT Delhi",
      description: "IIT Delhi offers a unique opportunity to learn and evolve with its comprehensive B.Tech and M.Tech programs.",
      href: "/university/iit-delhi/academics",
      icon: School,
      actionText: "Explore Academics"
    },
    {
      title: "Quantitative Finance",
      description: "Delve into the intersection of finance, mathematics, and computational techniques to model and manage risk.",
      href: "/university/iit-delhi/quantitative-finance", 
      icon: DollarSign,
      actionText: "Learn More"
    },
    {
      title: "Artificial Intelligence",
      description: "Explore the fascinating world of AI, including machine learning, deep learning, and natural language processing. Relevant courses can be found within Minor Degrees.",
      href: "/university/iit-delhi/artificial-intelligence", 
      icon: Brain,
      actionText: "Learn More"
    },
    {
      title: "Programming Languages",
      description: "I have learned C++, Rust, Python, R, and their respected libraries.",
      href: "/university/iit-delhi/programming-languages", 
      icon: Code,
      actionText: "Learn More"
    },
    {
      title: "Mathematics",
      description: "Deepen your understanding of core mathematical concepts. Many foundational and advanced math courses are part of the B.Tech departmental curriculum.",
      href: "/university/iit-delhi/mathematics", 
      icon: Sigma,
      actionText: "Learn More"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="My knowledge"
        description="This section outlines the diverse sources of my learning, including foundational academic knowledge from institutions like IIT Delhi, and ongoing exploration of various research areas."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeAreas.map((area) => (
          <Link href={area.href} key={area.title} className="block hover:no-underline group">
            <div className="bg-card p-6 rounded-lg shadow-md group-hover:shadow-primary/20 transition-shadow flex flex-col h-full">
              <div className="flex items-center mb-3">
                <area.icon className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-primary">{area.title}</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4 flex-grow min-h-[80px]"> 
                {area.description}
              </p>
              <div className="mt-auto self-start text-primary text-sm font-medium group-hover:underline">
                {area.actionText} &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
