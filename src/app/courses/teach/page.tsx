import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ChalkboardTeacher, BookOpenCheck } from "lucide-react";

export default function TeachPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Link>
        </Button>
      </div>
      <PageHeader
        title="Become an Instructor"
        description="Share your expertise and passion with a global community of Web3 learners. Create impactful courses on HEX THE ADD HUB."
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <ChalkboardTeacher className="mr-3 h-7 w-7 text-primary" />
            Teach on HEX THE ADD HUB
          </CardTitle>
          <CardDescription>
            Empower others by creating and selling courses on our platform. This feature is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-12 bg-secondary/30 rounded-lg">
            <BookOpenCheck className="mx-auto h-16 w-16 text-primary mb-6" />
            <h2 className="text-3xl font-semibold text-foreground mb-3">Instructor Portal - Coming Soon!</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              We're building a comprehensive suite of tools for instructors to create, manage, and monetize their courses. 
              You'll be able to upload video content, create quizzes, manage enrollments, and much more.
            </p>
            <p className="text-muted-foreground">
              If you're interested in becoming an instructor, please <Link href="/contact" className="text-primary hover:underline">contact us</Link> for early access and more information.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 text-foreground/90">
            <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Why Teach With Us?</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Reach a dedicated audience of Web3 enthusiasts.</li>
                    <li>Utilize powerful tools for course creation and management.</li>
                    <li>Flexible monetization options (fixed price, token-gated).</li>
                    <li>Contribute to the growth of the decentralized ecosystem.</li>
                    <li>Become a recognized expert in your field.</li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">What You'll Need</h3>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Expertise in your chosen subject area.</li>
                    <li>High-quality course content (videos, articles, quizzes).</li>
                    <li>A passion for teaching and sharing knowledge.</li>
                    <li>Commitment to providing value to students.</li>
                </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

