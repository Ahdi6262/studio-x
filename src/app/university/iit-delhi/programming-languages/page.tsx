
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Book, BookOpen, Video, FileText, ListTree } from "lucide-react"; // Added ListTree
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

const resourceCategories = [
  { id: "books", title: "Books", icon: BookOpen },
  { id: "lectures", title: "Lectures", icon: Video },
  { id: "libraries", title: "Libraries", icon: ListTree },
  { id: "other-resources", title: "Other Resources", icon: FileText },
];

const languageBooks: Record<string, string[]> = {
  cpp: [
    "The C++ Programming Language",
    "C++ Software Design",
    "C++23 Best Practices",
    "C++ Concurrency in Action"
  ],
  python: [
    "Python Crash Course",
    "Learning Scientific Programming with Python",
    "Python Distilled",
    "Python for Data Analysis"
  ],
  rust: [
    "The Rust Programming Language",
    "Rust for Rustaceans",
    "Idiomatic Rust",
    "Rust by Example",
    "Programming Rust",
    "Rust in Action"
  ],
  r: [
    "The R Programming"
  ],
  latex: [] // No books for LaTeX were provided by the user
};

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
          const LangIconComponent = lang.icon;
          return (
            <TabsContent key={lang.id} value={lang.id}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    {LangIconComponent && <LangIconComponent className="mr-3 h-6 w-6 text-primary" />}
                    {lang.title}
                  </CardTitle>
                  {lang.description && (
                    <CardDescription>{lang.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={resourceCategories[0].id} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-6 h-auto">
                      {resourceCategories.map((category) => (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className="w-full flex flex-col sm:flex-row items-center justify-center p-2 text-xs sm:text-sm h-14 sm:h-12 leading-tight"
                        >
                          <category.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-0 sm:mr-2 mb-1 sm:mb-0 flex-shrink-0" />
                          <span className="truncate text-center sm:text-left flex-grow w-full sm:w-auto">{category.title}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {resourceCategories.map((category) => (
                      <TabsContent key={category.id} value={category.id}>
                        <div className="p-4 border rounded-md bg-secondary/30 min-h-[150px]"> {/* Increased min-h for more space */}
                          <h3 className="text-lg font-semibold mb-3 text-primary flex items-center">
                            <category.icon className="mr-2 h-5 w-5" />
                            {category.title} for {lang.title}
                          </h3>
                          {category.id === 'books' ? (
                            languageBooks[lang.id] && languageBooks[lang.id].length > 0 ? (
                              <ul className="list-disc list-inside space-y-1.5 text-foreground/90"> {/* Increased space-y and changed color */}
                                {languageBooks[lang.id].map((bookTitle, index) => (
                                  <li key={index}>{bookTitle}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground">
                                No specific books listed for {lang.title} yet.
                              </p>
                            )
                          ) : (
                            <p className="text-muted-foreground">
                              Specific {category.title.toLowerCase()} related to {lang.title} will be listed here soon.
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
