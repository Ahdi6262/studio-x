
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FunctionSquare, BookOpen, Video, FileText } from "lucide-react"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ElementType } from "react";

interface ResourceCategory {
  id: string;
  title: string;
  icon: ElementType;
}

const resourceCategories: ResourceCategory[] = [
  { id: "books", title: "Books", icon: BookOpen },
  { id: "lectures", title: "Lectures", icon: Video },
  { id: "other-resources", title: "Other Resources", icon: FileText },
];

export default function AlgebraPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi/mathematics">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mathematics
        </Link>
      </Button>
      <PageHeader
        title="Algebra"
        description="Explore fundamental algebraic structures, equations, and their applications."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <FunctionSquare className="mr-3 h-6 w-6 text-primary" />
            Algebra Resources
          </CardTitle>
          <CardDescription>
            Explore various resources related to Algebra.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={resourceCategories[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3 mb-8 h-auto">
              {resourceCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="w-full flex flex-col sm:flex-row items-center justify-center p-3 text-xs sm:text-sm h-16 sm:h-14 leading-tight"
                >
                  <category.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-0 sm:mr-2 mb-1 sm:mb-0 flex-shrink-0" />
                  <span className="truncate text-center sm:text-left flex-grow w-full sm:w-auto">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {resourceCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                 <div className="p-4 border rounded-md bg-secondary/30 min-h-[200px]">
                  <h3 className="text-lg font-semibold mb-3 text-primary flex items-center">
                    <category.icon className="mr-2 h-5 w-5" />
                    {category.title} for Algebra
                  </h3>
                  <div className="flex flex-col items-center justify-center text-center min-h-[150px]">
                      <category.icon className="w-10 h-10 text-primary mb-3" />
                      <p className="text-muted-foreground max-w-md">
                       Specific {category.title.toLowerCase()} related to Algebra, including topics like group theory, ring theory, linear algebra, and abstract algebra, will be listed here soon.
                      </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
