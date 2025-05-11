import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PlusSquare } from "lucide-react";

export default function NewProjectPage() {
  // In a real app, this would involve a form and interaction with useAuth for user_id
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Link>
        </Button>
      </div>
      <PageHeader
        title="Add New Project"
        description="Showcase your latest work to the community. (Login Required)"
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusSquare className="mr-3 h-6 w-6 text-primary" />
            Project Submission Form
          </CardTitle>
          <CardDescription>
            Provide details about your project. This feature is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 bg-secondary/30 rounded-lg">
            <p className="text-2xl font-semibold text-foreground mb-3">Project Creation - Coming Soon!</p>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The interface for adding new projects to your portfolio is being built. 
              You'll be able to add titles, descriptions, images, links, tags, and more.
            </p>
            {/* Placeholder for a form component */}
            <div className="mt-8 space-y-4 max-w-md mx-auto">
                <input type="text" placeholder="Project Title" className="w-full p-3 border rounded-md bg-background" disabled />
                <textarea placeholder="Project Description..." className="w-full p-3 border rounded-md bg-background h-32" disabled />
                <input type="text" placeholder="Tags (comma-separated)" className="w-full p-3 border rounded-md bg-background" disabled />
                <Button disabled>Submit Project (Disabled)</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

