
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, GraduationCap, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElementType } from "react";

interface CourseItem {
  id: string;
  name: string;
  credits: string;
}

interface OpenCourseCategory {
  id: string;
  title: string;
  description?: string;
  courses: CourseItem[];
  totalCredits: string;
  icon: ElementType;
  iconLetter?: string; 
}

const openCoursesData: OpenCourseCategory[] = [
  {
    id: "open-electives",
    title: "Open Electives",
    icon: GraduationCap,
    iconLetter: "O",
    description: "Explore interdisciplinary courses open to students from various backgrounds, promoting broad skill development.",
    courses: [
      { id: "oc1", name: "MTL768 - Graph Theory", credits: "3" },
      { id: "oc2", name: "MTL799 - Mathematical Analysis in Learning Theory", credits: "3" },
    ],
    totalCredits: "6",
  }
];

export default function OpenCoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Open Courses"
        description="Explore courses open to all students, promoting interdisciplinary learning and broad skill development."
      />
      
      <Tabs defaultValue={openCoursesData[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 gap-3 mb-8 h-auto"> {/* Single tab, so grid-cols-1 */}
          {openCoursesData.map((category) => (
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

        {openCoursesData.map((category) => {
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
