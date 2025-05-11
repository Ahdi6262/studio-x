
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
  icon: React.ElementType; // Icon for the Card Header
  iconLetter: string; // Letter for the Tab Trigger
}

const instituteCourseData: CourseCategory[] = [
  {
    id: "basic-sciences",
    title: "Institute Core: Basic Sciences",
    icon: BookOpen,
    iconLetter: "B",
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
    iconLetter: "E",
    description: "Core engineering disciplines and visualization skills.",
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
    icon: Library, 
    iconLetter: "P",
    description: "Specialized core courses linked to specific engineering programs.",
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
    iconLetter: "H",
    description: "Courses fostering critical thinking and communication skills.",
    courses: [
      { id: "hss1", name: "HUL212 Microeconomics", credits: 4 },
      { id: "hss2", name: "HUL256 Critical Thinking", credits: 4 },
      { id: "hss3", name: "HUL101 English in Practice", credits: 3 },
      { id: "hss4", name: "HUL243 Language and Communication", credits: 4 },
    ],
    totalCredits: 15, 
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
        <TabsList className="grid grid-cols-2 gap-3 mb-8 h-auto"> {/* Adjusted to 2x2 grid, gap, and h-auto */}
          {instituteCourseData.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id} 
              className="w-full flex flex-col sm:flex-row items-center justify-center p-3 text-xs sm:text-sm h-20 sm:h-16 leading-tight truncate" // Added truncate for long text
            >
              <div className="relative mr-0 sm:mr-2 mb-1 sm:mb-0 flex-shrink-0">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> 
                <span 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] text-[0.5rem] sm:text-[0.6rem] font-bold text-primary-foreground"
                  style={{ lineHeight: 1 }}
                >
                  {category.iconLetter}
                </span>
              </div>
              <span className="truncate text-center sm:text-left flex-grow w-full sm:w-auto">{category.title}</span>
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

