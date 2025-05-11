
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookHeart, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElementType } from "react";

interface CourseItem {
  id: string;
  name: string;
  credits: string; 
}

interface DepartmentCourseCategory {
  id: string;
  title: string;
  description?: string;
  courses: CourseItem[];
  totalCredits: string;
  icon: ElementType;
}

const departmentBTechData: DepartmentCourseCategory[] = [
  {
    id: "departmental-core",
    title: "Departmental Core",
    icon: BookHeart,
    description: "Fundamental courses and requirements specific to the department.",
    courses: [
      { id: "dc1", name: "ELL305 Computer Architecture", credits: "3" },
      { id: "dc2", name: "ELP305 Design and System Laboratory", credits: "3" },
      { id: "dc3", name: "MTL102 Differential Equations", credits: "3" },
      { id: "dc4", name: "MTL103 Optimization Methods and Applications", credits: "3" },
      { id: "dc5", name: "MTL104 Linear Algebra and Applications", credits: "3" },
      { id: "dc6", name: "MTL105 Algebra", credits: "3" },
      { id: "dc7", name: "MTL106 Probability and Stochastic Processes", credits: "4" },
      { id: "dc8", name: "MTL107 Numerical Methods and Computations", credits: "3" },
      { id: "dc9", name: "MTL122 Real and Complex Analysis", credits: "4" },
      { id: "dc10", name: "MTL180 Discrete Mathematical Structures", credits: "4" },
      { id: "dc11", name: "MTP290 Computing Laboratory", credits: "2" },
      { id: "dc12", name: "MTL342 Analysis and Design of Algorithms", credits: "4" },
      { id: "dc13", name: "MTL783 Theory of Computation", credits: "3" },
      { id: "dc14", name: "MTL390 Statistical Methods", credits: "4" },
      { id: "dc15", name: "MTL411 Functional Analysis", credits: "3" },
      { id: "dc16", name: "MTD411 B.Tech. Project", credits: "4" }, // From "0 0 8 4", simplified for credit display
      { id: "dc17", name: "MTL421 Functional Analysis", credits: "N/A" },
      { id: "dc18", name: "MTL445 Computational Methods for Differential Equations", credits: "4" },
      { id: "dc19", name: "MTL712 Computational Methods for Differential Equations", credits: "4" },
      { id: "dc20", name: "MTL782 Data Mining", credits: "4" },
    ],
    totalCredits: "59.5",
  },
  {
    id: "departmental-electives",
    title: "Departmental Electives",
    icon: Layers,
    description: "Choose from a range of specialized elective courses within your department to deepen your expertise.",
    courses: [
      { id: "de1", name: "MTL265 Mathematical Programming Techniques", credits: "3" },
      { id: "de2", name: "MTL270 Measure Integral and Probability", credits: "3" },
    ],
    totalCredits: "6",
  }
];

export default function DepartmentBTechPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Departmental Courses (B.Tech)"
        description="Explore core and elective courses specific to B.Tech studies within the department."
      />
      
      <Tabs defaultValue={departmentBTechData[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-3 mb-8 h-auto">
          {departmentBTechData.map((category) => (
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

        {departmentBTechData.map((category) => {
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
