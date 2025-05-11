
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Admin Dashboard"
        description="Manage users, content, and platform settings."
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-3 h-6 w-6 text-primary" />
            Platform Administration
          </CardTitle>
          <CardDescription>
            This area is restricted to administrators. Full admin functionality is under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-foreground">Admin Dashboard - Coming Soon!</p>
            <p className="mt-2 text-muted-foreground">
              Features for managing users, courses, projects, blog posts, and site settings will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
