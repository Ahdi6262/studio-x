
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookCopy, ListPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElementType } from "react";

interface CourseItem {
  id: string;
  name: string;
  credits: string; 
  notes?: string;
}

interface ProgrammeCourseCategory {
  id: string;
  title: string;
  description?: string;
  courses: CourseItem[];
  totalCredits: string;
  icon: ElementType;
  footerNote?: string;
}

const programmeMTechData: ProgrammeCourseCategory[] = [
  {
    id: "programme-core",
    title: "Programme Core",
    icon: BookCopy,
    description: "Fundamental courses and requirements for M.Tech specializations.",
    courses: [
      { id: "pc1", name: "MTL766 Multivariate Statistical Methods", credits: "3" },
      { id: "pc2", name: "MTL781 Finite Elements and Applications", credits: "3" },
      { id: "pc3", name: "MTD851 Major Project Part-I (MT)", credits: "6" },
      { id: "pc4", name: "MTD852 Major Project Part-II (MT)", credits: "12" },
      { id: "pc5", name: "MTD853* Major Project Part-I", credits: "4" }, 
      { id: "pc6", name: "MTD854* Major Project Part-II", credits: "14" },
    ],
    totalCredits: "22",
    footerNote: "*MTD853 and MTD854 together are alternatives to MTD851 and MTD852",
  },
  {
    id: "programme-electives",
    title: "Programme Electives",
    icon: ListPlus,
    description: "Choose from a range of specialized elective courses to deepen your M.Tech expertise.",
    courses: [
      { id: "pe1", name: "MTL725 Stochastic Processes and its Applications", credits: "3" },
      { id: "pe2", name: "MTL794 Advanced Probability Theory", credits: "3" },
      { id: "pe3", name: "MTL795 Numerical Method for Partial Differential Equations", credits: "4" },
      { id: "pe4", name: "MTL732 Financial Mathematics", credits: "3" },
      { id: "pe5", name: "MTL733 Stochastic of Finance", credits: "3" },
      { id: "pe6", name: "MTL762 Probability Theory", credits: "3" },
    ],
    totalCredits: "19", // Sum of 3+3+4+3+3+3
  }
];

export default function ProgrammeMTechPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Programme Courses (M.Tech)"
        description="Explore core and elective courses for M.Tech studies."
      />
      
      <Tabs defaultValue={programmeMTechData[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-3 mb-8 h-auto">
          {programmeMTechData.map((category) => (
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

        {programmeMTechData.map((category) => {
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
                    {category.footerNote && (
                        <p className="text-xs text-muted-foreground mt-1">{category.footerNote}</p>
                    )}
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
