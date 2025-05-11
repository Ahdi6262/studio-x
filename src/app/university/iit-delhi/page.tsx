
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { School, DollarSign, Brain, Code2 as Code, Sigma } from "lucide-react"; 

interface KnowledgeArea {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
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
      href: "#", // No specific page for this topic yet
      icon: DollarSign,
      actionText: "Learn More"
    },
    {
      title: "Artificial Intelligence",
      description: "Explore the fascinating world of AI, including machine learning, deep learning, and natural language processing. Relevant courses can be found within Minor Degrees.",
      href: "/university/iit-delhi/academics/minor-degrees", // CS Minor includes AI/ML courses
      icon: Brain,
      actionText: "Learn More"
    },
    {
      title: "Programming Languages",
      description: "Master various programming paradigms and languages. Relevant courses can be found within Minor Degrees and Institute Courses.",
      href: "/university/iit-delhi/academics/minor-degrees", // CS Minor includes Programming Languages course
      icon: Code,
      actionText: "Learn More"
    },
    {
      title: "Mathematics",
      description: "Deepen your understanding of core mathematical concepts. Many foundational and advanced math courses are part of the B.Tech departmental curriculum.",
      href: "/university/iit-delhi/academics/department-btech", // B.Tech Departmental courses are math-heavy
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
          <div key={area.title} className="bg-card p-6 rounded-lg shadow-md hover:shadow-primary/20 transition-shadow flex flex-col">
            <div className="flex items-center mb-3">
              <area.icon className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-primary">{area.title}</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4 flex-grow min-h-[80px]"> 
              {area.description}
            </p>
            <Button asChild variant="link" className="p-0 text-primary mt-auto self-start">
              <Link href={area.href}>
                {area.actionText} &rarr;
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

