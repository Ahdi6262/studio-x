import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function UserCertificatesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
        </Button>
      </div>
      <PageHeader
        title="My Certificates"
        description="View and manage your course completion certificates, both standard and NFT-based."
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-3 h-6 w-6 text-primary" />
            Your Achievements
          </CardTitle>
          <CardDescription>
            This section will display all the certificates you have earned.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 bg-secondary/30 rounded-lg">
            <p className="text-2xl font-semibold text-foreground mb-3">Certificates - Coming Soon!</p>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Once you complete courses, your certificates (PDF and NFT) will appear here.
              You'll be able to view, download, and share them.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
