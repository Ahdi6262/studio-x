import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

export default function NewBlogPostPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
      <PageHeader
        title="Create New Blog Post"
        description="Share your insights, tutorials, or news with the community. (Admin Access Required)"
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="mr-3 h-6 w-6 text-primary" />
            Blog Post Editor
          </CardTitle>
          <CardDescription>
            This interface is for administrators to create and publish new blog content. 
            A rich text editor and content management tools will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 bg-secondary/30 rounded-lg">
            <p className="text-2xl font-semibold text-foreground mb-3">Content Creation Interface - Coming Soon!</p>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The admin-only blog post creation and management system is under development. 
              It will include features like a WYSIWYG editor, image uploads, tagging, and scheduling.
            </p>
            {/* Placeholder for a form or editor component */}
             <div className="mt-8 space-y-4 max-w-md mx-auto">
                <input type="text" placeholder="Post Title" className="w-full p-3 border rounded-md bg-background" disabled />
                <textarea placeholder="Start writing your amazing content here..." className="w-full p-3 border rounded-md bg-background h-40" disabled />
                <Button disabled>Publish Post (Disabled)</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

