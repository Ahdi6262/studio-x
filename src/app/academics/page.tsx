
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookHeart } from "lucide-react"; // Using a different icon

export default function AcademicsPage() {
  const academicSubItems = [
    { label: 'Departmental Core', href: '/academics/departmental-core' },
    { label: 'Interdisciplinary Initiatives', href: '/academics/interdisciplinary-initiatives' },
    { label: 'Research Labs', href: '/academics/research-labs' },
    { label: 'Minor Degrees', href: '/academics/minor-degrees' },
    { label: 'Academic Sections', href: '/academics/academic-sections' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Academics"
        description="Explore our academic structure, including departmental cores, interdisciplinary programs, research facilities, and degree options."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academicSubItems.map(item => (
          <div key={item.label} className="bg-card p-6 rounded-lg shadow-md hover:shadow-primary/20 transition-shadow">
            <div className="flex items-center mb-3">
              <BookHeart className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-primary">{item.label}</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Discover more about our {item.label.toLowerCase()}.
            </p>
            <Button asChild variant="link" className="p-0 text-primary">
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
