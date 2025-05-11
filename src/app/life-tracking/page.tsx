
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import Image from "next/image";

export default function LifeTrackingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Life Tracking Dashboard"
        description="Monitor your habits, goals, and personal growth. Visualize your progress and stay motivated."
        actions={
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" /> Add New Tracker
          </Button>
        }
      />
      <div className="flex flex-col items-center justify-center text-center py-16 bg-card rounded-xl shadow-lg">
        <Image 
            src="https://picsum.photos/seed/lifetracking/400/300" 
            alt="Life tracking illustration" 
            width={400} 
            height={300}
            className="rounded-lg mb-8 shadow-md"
            data-ai-hint="personal growth dashboard"
        />
        <h2 className="text-4xl font-bold mb-4 text-primary">Coming Soon!</h2>
        <p className="text-xl text-muted-foreground max-w-md">
          Our Life Tracking feature is under development. Soon you'll be able to track various aspects of your life to achieve your goals.
        </p>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Stay tuned for updates on this exciting new feature!</p>
        </div>
      </div>
    </div>
  );
}
