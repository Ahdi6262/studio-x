import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, BookOpen, FolderKanban, BarChart3, Settings2, Rss } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Admin Dashboard"
        description="Manage users, content, platform settings, and view analytics."
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
          <div className="text-center py-10">
            <p className="text-2xl font-semibold text-foreground">Admin Dashboard - Under Construction</p>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              This central hub will soon provide tools for comprehensive platform management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              { title: "User Management", icon: Users, desc: "View, edit, and manage user accounts, roles, and permissions." },
              { title: "Course Management", icon: BookOpen, desc: "Create, update, and publish courses, modules, and lessons." },
              { title: "Project Management", icon: FolderKanban, desc: "Oversee user-submitted projects, feature or moderate content." },
              { title: "Blog &amp; Content", icon: Rss, desc: "Manage blog posts, static pages, and other platform content." },
              { title: "Analytics &amp; Reporting", icon: BarChart3, desc: "Access key metrics, user engagement data, and platform performance." },
              { title: "Site Settings", icon: Settings2, desc: "Configure platform-wide settings, integrations, and feature flags." },
            ].map(item => (
              <Card key={item.title} className="bg-secondary/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <item.icon className="mr-2 h-5 w-5 text-primary" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc} (Coming Soon)</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

