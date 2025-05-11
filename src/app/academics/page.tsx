import { PageHeader } from "@/components/core/page-header";
import { BookOpen } from "lucide-react";

export default function AcademicsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Academics"
        description="Explore our diverse range of academic programs, courses, and research opportunities."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <BookOpen className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Academic Information Hub</h2>
        <p className="text-muted-foreground max-w-xl">
          Detailed information about our academic offerings is being organized and will be available soon. 
          This section will provide comprehensive details on degree programs, course catalogs, faculty profiles, and research areas.
        </p>
        <p className="mt-4 text-muted-foreground max-w-xl">
          Whether you are a prospective student, current student, or researcher, you will find valuable resources here to guide your academic journey.
        </p>
      </div>
    </div>
  );
}
