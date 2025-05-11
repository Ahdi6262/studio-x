
import { PageHeader } from "@/components/core/page-header";
import { CalendarDays } from "lucide-react";

export default function EventsPage() {
  // Replace with your actual Google Calendar Embed URL
  // To get this URL:
  // 1. Go to Google Calendar (calendar.google.com).
  // 2. On the left, under "My calendars", hover over the calendar you want to embed.
  // 3. Click the three dots (Options) and select "Settings and sharing".
  // 4. In the left menu, click "Integrate calendar".
  // 5. Copy the "Embed code" (it's an iframe). You only need the URL from the `src` attribute of the iframe.
  // 6. Make sure your calendar's access permissions are set to "Make available to public" if you want everyone to see it.
  const calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=your_calendar_id%40group.calendar.google.com&ctz=America%2FNew_York"; // Replace with your calendar ID and timezone

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Events Calendar"
        description="Stay updated with our upcoming workshops, seminars, conferences, and community gatherings."
      />
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-xl">
        <div className="aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[16/6] w-full border border-border/40 rounded-lg overflow-hidden">
          <iframe
            src={calendarEmbedUrl}
            style={{ 
              borderWidth: 0,
              filter: 'invert(1) hue-rotate(180deg)' 
            }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            title="Events Calendar"
            className="rounded-md" // iframe itself can also have rounded corners if its content supports it
          ></iframe>
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          <strong>Note:</strong> This is a placeholder calendar. Please replace the embed URL in the code with your actual public Google Calendar. The dark mode is simulated with a CSS filter and may not be perfect.
        </p>
      </div>
    </div>
  );
}

