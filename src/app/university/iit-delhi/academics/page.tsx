
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookHeart, BookMarked, Layers, Library } from "lucide-react"; 

export default function AcademicsPage() {
  const academicSubItems = [
    { 
      label: 'Departmental Core (B.Tech)', 
      href: '/university/iit-delhi/academics/departmental-core',
      icon: BookHeart,
      description: "Explore the fundamental courses required for your chosen department."
    },
    { 
      label: 'Minor Degrees', 
      href: '/university/iit-delhi/academics/minor-degrees',
      icon: BookMarked,
      description: "Discover options to specialize in an additional field of study."
    },
    { 
      label: 'Institute Courses (B.Tech)', 
      href: '/university/iit-delhi/academics/institute-courses',
      icon: Library,
      description: "Browse courses offered institute-wide, often covering foundational or interdisciplinary subjects."
    },
    { 
      label: 'Departmental Electives (B.Tech)', 
      href: '/university/iit-delhi/academics/departmental-electives',
      icon: Layers,
      description: "Choose from a range of specialized elective courses within your department."
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Academics at IIT Delhi"
        description="Navigate through the core requirements, elective options, and degree programs available at IIT Delhi."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"> {/* Changed to 2 columns for better display of 4 items */}
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

