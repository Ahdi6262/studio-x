
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookHeart, BookMarked, Layers, Library, BookCopy, ListPlus, GraduationCap, Lightbulb, NotebookPen, Layers3 } from "lucide-react"; 

export default function AcademicsPage() {
  const academicSubItems = [
    { 
      label: 'Institute Courses (B.Tech)', 
      href: '/university/iit-delhi/academics/institute-courses',
      icon: Library,
      description: "Browse B.Tech courses offered institute-wide, often covering foundational or interdisciplinary subjects."
    },
    { 
      label: 'Department (B.Tech)', 
      href: '/university/iit-delhi/academics/department-btech',
      icon: NotebookPen,
      description: "Explore core and elective courses specific to B.Tech departmental studies."
    },
    { 
      label: 'Programme (M.Tech)', 
      href: '/university/iit-delhi/academics/programme-mtech',
      icon: Layers3, 
      description: "Delve into the core and elective courses for various M.Tech specializations."
    },
    { 
      label: 'Minor Degrees', 
      href: '/university/iit-delhi/academics/minor-degrees',
      icon: BookMarked,
      description: "Discover options to specialize in an additional field of study alongside your main degree."
    },
    {
      label: 'Open Courses',
      href: '/university/iit-delhi/academics/open-courses',
      icon: GraduationCap,
      description: "Access a selection of courses open to all students, fostering interdisciplinary learning."
    },
    {
      label: 'Projects',
      href: '/university/iit-delhi/academics/projects',
      icon: Lightbulb,
      description: "Explore various academic and research projects undertaken at the institute."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Academics at IIT Delhi"
        description="Navigate through the core requirements, elective options, and degree programs available at IIT Delhi."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academicSubItems.map(item => (
          <div key={item.label} className="bg-card p-6 rounded-lg shadow-md hover:shadow-primary/20 transition-shadow flex flex-col">
            <div className="flex items-center mb-3">
              <item.icon className="h-7 w-7 text-primary mr-3 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-primary">{item.label}</h2>
            </div>
            <p className="text-muted-foreground mb-4 text-sm flex-grow min-h-[60px]">
              {item.description}
            </p>
            <Button asChild variant="link" className="p-0 text-primary mt-auto self-start">
              <Link href={item.href}>
                Learn More &rarr;
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

