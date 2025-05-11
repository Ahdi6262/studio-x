
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Layers, BookOpen, Video, FileText } from "lucide-react"; // Added BookOpen, Video, FileText
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

export default function DeepLearningPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
        <Link href="/university/iit-delhi/artificial-intelligence">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Artificial Intelligence
        </Link>
      </Button>
      <PageHeader
        title="Deep Learning"
        description="Discover neural networks, including convolutional (CNNs) and recurrent (RNNs) networks, and their applications in complex pattern recognition tasks."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Layers className="mr-3 h-6 w-6 text-primary" />
            Deep Learning Resources
          </CardTitle>
          <CardDescription>
            Explore various resources related to Deep Learning.
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
                <div className="p-4 border rounded-md bg-secondary/30 min-h-[200px] flex flex-col items-center justify-center text-center">
                  <category.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {category.title} on Deep Learning
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Specific {category.title.toLowerCase()} related to Deep Learning, including architectures (CNNs, RNNs, Transformers), frameworks, and applications in areas like computer vision and NLP, will be listed here soon.
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

