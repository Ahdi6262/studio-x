import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const aboutSubItems = [
    { label: 'Departmental Core', href: '/about/departmental-core' },
    { label: 'Interdisciplinary Initiatives', href: '/about/interdisciplinary-initiatives' },
    { label: 'Research Labs', href: '/about/research-labs' },
    { label: 'Minor Degrees', href: '/about/minor-degrees' },
    { label: 'Academic Sections', href: '/about/academic-sections' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="About"
        description="Learn more about our mission, vision, and the core areas of our work."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aboutSubItems.map(item => (
          <div key={item.label} className="bg-card p-6 rounded-lg shadow-md hover:shadow-primary/20 transition-shadow">
            <h2 className="text-xl font-semibold mb-3 text-primary">{item.label}</h2>
            <p className="text-muted-foreground mb-4">
              Explore the details of {item.label.toLowerCase()}.
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
