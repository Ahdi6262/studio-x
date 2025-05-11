
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookMarked } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElementType } from "react";

interface CourseItem {
  id: string;
  name: string;
  credits: string;
}

interface MinorDegreeCategory {
  id: string;
  title: string;
  description?: string;
  courses: CourseItem[];
  totalCredits: string;
  icon: ElementType;
  iconLetter?: string; 
}

const minorDegreesData: MinorDegreeCategory[] = [
  {
    id: "cs-minor",
    title: "Minor Area Core: Computer Science",
    icon: BookMarked,
    iconLetter: "CS",
    description: "Core courses required for a Minor Degree in Computer Science.",
    courses: [
      { id: "col226", name: "COL226 - Programming Languages", credits: "5" },
      { id: "col333", name: "COL333 - Principles of AI", credits: "4" },
      { id: "col341", name: "COL341 - Machine Learning", credits: "4" },
      { id: "col756", name: "COL756 - Mathematical Programming", credits: "3" },
      { id: "col774", name: "COL774 - Machine Learning", credits: "4" },
      { id: "cov879", name: "COV879 - Special Module in Financial Algorithms", credits: "1" },
    ],
    totalCredits: "21",
  }
];

export default function MinorDegreesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Minor Degrees"
        description="Learn about the Minor Degree programs offered to broaden your academic horizons."
      />
      
      <Tabs defaultValue={minorDegreesData[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 gap-3 mb-8 h-auto"> {/* Single tab, so grid-cols-1 */}
          {minorDegreesData.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id} 
              className="w-full flex flex-col sm:flex-row items-center justify-center p-3 text-xs sm:text-sm h-16 sm:h-14 leading-tight truncate"
            >
               <div className="relative mr-0 sm:mr-2 mb-1 sm:mb-0 flex-shrink-0">
                <category.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> 
                {category.iconLetter && (
                  <span 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] text-[0.5rem] sm:text-[0.6rem] font-bold text-primary-foreground"
                    style={{ lineHeight: 1 }}
                  >
                    {category.iconLetter}
                  </span>
                )}
              </div>
              <span className="truncate text-center sm:text-left flex-grow w-full sm:w-auto">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {minorDegreesData.map((category) => {
          const IconComponent = category.icon;
          return (
            <TabsContent key={category.id} value={category.id}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    {IconComponent && <IconComponent className="mr-3 h-6 w-6 text-primary" />}
                    {category.title}
                  </CardTitle>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70%]">Course Name</TableHead>
                        <TableHead className="text-right">Credits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell className="text-right">{course.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-6 text-right">
                    <p className="text-lg font-semibold text-foreground">
                      Total Credits: <span className="text-primary">{category.totalCredits}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

