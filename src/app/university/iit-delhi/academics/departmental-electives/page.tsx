
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ElementType } from "react";

interface CourseItem {
  id: string;
  name: string;
  credits: string; 
}

interface DepartmentalElectivesInfo {
  id: string;
  title: string;
  description?: string;
  courses: CourseItem[];
  totalCredits: string;
  icon: ElementType;
}

const departmentalElectivesData: DepartmentalElectivesInfo = {
  id: "departmental-electives",
  title: "Departmental Electives",
  icon: Layers,
  description: "Choose from a range of specialized elective courses within your department to deepen your expertise.",
  courses: [
    { id: "de1", name: "MTL265 Mathematical Programming Techniques", credits: "3" },
    { id: "de2", name: "MTL270 Measure Integral and Probability", credits: "3" }, // Assuming 3 credits as not specified
  ],
  totalCredits: "6", // Sum of credits
};

export default function DepartmentalElectivesPage() {
  const IconComponent = departmentalElectivesData.icon;

  return (
    <div className="container mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/university/iit-delhi/academics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
          </Link>
      </Button>
      <PageHeader
        title={departmentalElectivesData.title}
        description={departmentalElectivesData.description || "Explore elective courses offered within your department."}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            {IconComponent && <IconComponent className="mr-3 h-6 w-6 text-primary" />}
            {departmentalElectivesData.title}
          </CardTitle>
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
              {departmentalElectivesData.courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell className="text-right">{course.credits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 text-right">
            <p className="text-lg font-semibold text-foreground">
              Total Credits: <span className="text-primary">{departmentalElectivesData.totalCredits}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

