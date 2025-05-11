
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookHeart, BookMarked, Layers, Library, BookCopy, ListPlus } from "lucide-react"; 

export default function AcademicsPage() {
  const academicSubItems = [
    { 
      label: 'Departmental Core (B.Tech)', 
      href: '/university/iit-delhi/academics/departmental-core',
      icon: BookHeart,
      description: "Explore the fundamental courses required for your chosen B.Tech department."
    },
    { 
      label: 'Minor Degrees', 
      href: '/university/iit-delhi/academics/minor-degrees',
      icon: BookMarked,
      description: "Discover options to specialize in an additional field of study alongside your main degree."
    },
    { 
      label: 'Institute Courses (B.Tech)', 
      href: '/university/iit-delhi/academics/institute-courses',
      icon: Library,
      description: "Browse B.Tech courses offered institute-wide, often covering foundational or interdisciplinary subjects."
    },
    { 
      label: 'Departmental Electives (B.Tech)', 
      href: '/university/iit-delhi/academics/departmental-electives',
      icon: Layers,
      description: "Choose from a range of specialized B.Tech elective courses within your department."
    },
    { 
      label: 'Programme Core (M.Tech)', 
      href: '/university/iit-delhi/academics/programme-core-mtech',
      icon: BookCopy, // Example icon, replace if needed
      description: "Delve into the core courses for various M.Tech specializations."
    },
    { 
      label: 'Programme Electives (M.Tech)', 
      href: '/university/iit-delhi/academics/programme-electives-mtech',
      icon: ListPlus, // Example icon, replace if needed
      description: "Explore elective options available for M.Tech programmes to deepen your expertise."
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Academics at IIT Delhi"
        description="Navigate through the core requirements, elective options, and degree programs available at IIT Delhi."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted to lg:grid-cols-3 for better display of 6 items */}
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

