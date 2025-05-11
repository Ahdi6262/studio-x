import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import { Rss } from "lucide-react";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="HEX THE ADD HUB Blog"
        description="Stay updated with the latest news, insights, tutorials, and creator spotlights from the Web3 ecosystem."
        actions={
          <Button variant="outline">
            <Rss className="mr-2 h-4 w-4" /> Subscribe
          </Button>
        }
      />
      <div className="flex flex-col items-center justify-center text-center py-16 bg-card rounded-xl shadow-lg">
        <Image 
            src="https://picsum.photos/seed/blog/400/300" 
            alt="Blog illustration" 
            width={400} 
            height={300}
            className="rounded-lg mb-8 shadow-md"
            data-ai-hint="writing news article"
        />
        <h2 className="text-4xl font-bold mb-4 text-primary">Coming Soon!</h2>
        <p className="text-xl text-muted-foreground max-w-md">
          Our team is working hard to bring you insightful articles, tutorials, and updates. Stay tuned for our official blog launch!
        </p>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">In the meantime, follow us on social media for the latest news.</p>
          {/* Add social media links here */}
        </div>
      </div>
    </div>
  );
}
