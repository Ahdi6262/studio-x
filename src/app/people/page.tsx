import { PageHeader } from "@/components/core/page-header";

export default function PeoplePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="People"
        description="Meet our talented team of faculty, researchers, and staff."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center">
        <p className="text-2xl text-muted-foreground">
          Our team directory is coming soon!
        </p>
        <p className="mt-4 text-lg">
          We are working on showcasing the brilliant minds that make our institution thrive. 
          Check back later to learn more about our dedicated professionals.
        </p>
      </div>
    </div>
  );
}
