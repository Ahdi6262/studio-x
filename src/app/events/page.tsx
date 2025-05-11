import { PageHeader } from "@/components/core/page-header";
import { CalendarDays } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Events"
        description="Stay updated with our upcoming workshops, seminars, conferences, and other events."
      />
      <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <CalendarDays className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Events Calendar Coming Soon!</h2>
        <p className="text-muted-foreground max-w-xl">
          We are currently curating our events schedule. Please check back shortly for a list of exciting upcoming activities, including academic conferences, guest lectures, student workshops, and community gatherings.
        </p>
      </div>
    </div>
  );
}
