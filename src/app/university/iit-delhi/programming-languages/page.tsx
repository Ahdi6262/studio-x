
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Book } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ElementType } from "react";

interface LanguageTab {
  id: string;
  title: string;
  icon: ElementType;
  description?: string;
}

const programmingLanguagesData: LanguageTab[] = [
  { id: "cpp", title: "C++", icon: Book, description: "Explore details and resources for C++ programming." },
  { id: "rust", title: "Rust", icon: Book, description: "Explore details and resources for Rust programming." },
  { id: "python", title: "Python", icon: Book, description: "Explore details and resources for Python programming." },
  { id: "latex", title: "LaTeX", icon: Book, description: "Explore details and resources for LaTeX document preparation." },
  { id: "r", title: "R", icon: Book, description: "Explore details and resources for R statistical programming." },
];

export default function ProgrammingLanguagesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Knowledge
        </Link>
      </Button>
      <PageHeader
        title="Programming Languages Proficiency"
        description="Overview of various programming languages and tools I have experience with. This includes C++, Rust, Python, R and their respective libraries, alongside LaTeX for document preparation."
      />

      <Tabs defaultValue={programmingLanguagesData[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8 h-auto">
          {programmingLanguagesData.map((lang) => (
            <TabsTrigger
              key={lang.id}
              value={lang.id}
              className="w-full flex flex-col sm:flex-row items-center justify-center p-3 text-xs sm:text-sm h-16 sm:h-14 leading-tight"
            >
              <lang.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-0 sm:mr-2 mb-1 sm:mb-0 flex-shrink-0" />
              <span className="truncate text-center sm:text-left flex-grow w-full sm:w-auto">{lang.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {programmingLanguagesData.map((lang) => {
          const IconComponent = lang.icon;
          return (
            <TabsContent key={lang.id} value={lang.id}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    {IconComponent && <IconComponent className="mr-3 h-6 w-6 text-primary" />}
                    {lang.title}
                  </CardTitle>
                  {lang.description && (
                    <CardDescription>{lang.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detailed information, projects, and resources related to {lang.title} will be available here soon.
                  </p>
                  {/* Placeholder for future content specific to each language */}
                  {/* For example:
                  <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Key concepts in {lang.title}</li>
                    <li>Relevant libraries and frameworks</li>
                    <li>Example projects</li>
                  </ul>
                  */}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
