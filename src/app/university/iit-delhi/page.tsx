
import { PageHeader } from "@/components/core/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { School } from "lucide-react"; 

export default function UniversityIITDelhiPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="University IIT Delhi"
        description="Explore information related to IIT Delhi, including academic programs, research, and more."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-primary/20 transition-shadow">
          <div className="flex items-center mb-3">
            <School className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold text-primary">IIT Delhi</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            IIT Delhi offers a unique opportunity to learn and evolve with its comprehensive B.Tech and M.Tech programs.
          </p>
          <Button asChild variant="link" className="p-0 text-primary">
            <Link href="/university/iit-delhi/academics">
              Explore Academics &rarr;
            </Link>
          </Button>
        </div>
        {/* Add other sections related to University IIT Delhi here if needed in the future */}
      </div>
    </div>
  );
}

