
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Cpu, Layers } from "lucide-react";
import type { ElementType } from "react";

interface AISubTopic {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  actionText: string;
}

const aiSubTopicsData: AISubTopic[] = [
  {
    title: "Artificial Intelligence Overview",
    description: "Understand the core concepts, history, and broad applications of Artificial Intelligence. Explore foundational principles and ethical considerations.",
    href: "/university/iit-delhi/artificial-intelligence/overview",
    icon: Brain,
    actionText: "Explore Overview"
  },
  {
    title: "Machine Learning",
    description: "Dive into algorithms, statistical models, and techniques that enable computer systems to learn from and make decisions based on data.",
    href: "/university/iit-delhi/artificial-intelligence/machine-learning",
    icon: Cpu,
    actionText: "Explore ML"
  },
  {
    title: "Deep Learning",
    description: "Discover neural networks, including convolutional (CNNs) and recurrent (RNNs) networks, and their applications in complex pattern recognition tasks.",
    href: "/university/iit-delhi/artificial-intelligence/deep-learning",
    icon: Layers,
    actionText: "Explore DL"
  }
];

export default function ArtificialIntelligencePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Knowledge
        </Link>
      </Button>
      <PageHeader
        title="Artificial Intelligence"
        description="Explore the various facets of Artificial Intelligence, from fundamental concepts to advanced techniques in Machine Learning and Deep Learning."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiSubTopicsData.map(item => (
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
