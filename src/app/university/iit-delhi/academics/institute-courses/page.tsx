
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Library, BookOpen, Users, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CourseItem {
  id: string;
  name: string;
  credits: number | string;
}

interface CourseCategory {
  id: string;
  title: string;
  description?: string;
  courses: CourseItem[];
  totalCredits: number | string;
  icon?: React.ElementType;
}

const instituteCourseData: CourseCategory[] = [
  {
    id: "basic-sciences",
    title: "Institute Core: Basic Sciences",
    icon: BookOpen,
    description: "Fundamental scientific principles for engineers.",
    courses: [
      { id: "bs1", name: "CML101 Introduction to Chemistry", credits: 4 },
      { id: "bs2", name: "CMP100 Chemistry Laboratory", credits: 2 },
      { id: "bs3", name: "MTL100 Calculus", credits: 4 },
      { id: "bs4", name: "MTL101 Linear Algebra and Differential Equations", credits: 4 },
      { id: "bs5", name: "PYL101 Electromagnetism & Quantum Mechanics", credits: 4 },
      { id: "bs6", name: "PYP100 Physics Laboratory", credits: 2 },
      { id: "bs7", name: "SBL100 Introductory Biology for Engineers", credits: 4 },
    ],
    totalCredits: 24,
  },
  {
    id: "engineering-arts-sciences",
    title: "Institute Core: Engineering Arts and Sciences",
    icon: ClipboardList,
    description: "Core engineering disciplines and visualization skills.",
    // Credits for individual courses in this section were not explicitly specified in the prompt.
    // Listing them as TBD. User should verify/update.
    courses: [
      { id: "eas1", name: "APL100 Engineering Mechanics", credits: "TBD" },
      { id: "eas2", name: "COL100 Introduction to Computer Science", credits: "TBD" },
      { id: "eas3", name: "CVL100 Environmental Science", credits: "TBD" },
      { id: "eas4", name: "ELL101 Introduction to Electrical Engineering", credits: "TBD" },
      { id: "eas5", name: "ELP101 Introduction to Electrical Engineering (Lab)", credits: "TBD" },
      { id: "eas6", name: "MCP100 Introduction to Engineering Visualization", credits: "TBD" },
      { id: "eas7", name: "MCP101 Product Realization through Manufacturing", credits: "TBD" },
    ],
    totalCredits: 19,
  },
  {
    id: "programme-linked-core",
    title: "Programme-Linked Basic / Engineering Arts / Sciences Core",
    icon: Library, // Using Library as a generic icon
    description: "Specialized core courses linked to specific engineering programs.",
     // Credits for individual courses in this section were not explicitly specified in the prompt.
    courses: [
      { id: "plc1", name: "COL106 Data Structures and Algorithms", credits: "TBD" },
      { id: "plc2", name: "ELL201 Digital Electronics", credits: "TBD" },
      { id: "plc3", name: "PYL102 Principles of Electronic Materials", credits: "TBD" },
    ],
    totalCredits: "12.5",
  },
  {
    id: "humanities-social-sciences",
    title: "Humanities and Social Sciences Courses",
    icon: Users,
    description: "Courses fostering critical thinking and communication skills.",
    courses: [
      { id: "hss1", name: "HUL212 Microeconomics", credits: 4 },
      { id: "hss2", name: "HUL256 Critical Thinking", credits: 4 },
      { id: "hss3", name: "HUL101 English in Practice", credits: 3 },
      { id: "hss4", name: "HUL243 Language and Communication", credits: 4 },
    ],
    totalCredits: 15, // Sum of 4+4+3+4
  },
];

export default function InstituteCoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title="Institute Courses"
        description="Detailed breakdown of institute-level courses, categorized for clarity."
      />
      
      <Tabs defaultValue={instituteCourseData[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {instituteCourseData.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
              {category.icon && <category.icon className="mr-2 h-4 w-4 flex-shrink-0" />}
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {instituteCourseData.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  {category.icon && <category.icon className="mr-3 h-6 w-6 text-primary" />}
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
        ))}
      </Tabs>
    </div>
  );
}
