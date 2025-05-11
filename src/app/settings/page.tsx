
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Palette, Languages, UserCircle } from "lucide-react";

export default function SettingsPage() {
  // Mock settings state - in a real app, this would come from user data/API
  const userSettings = {
    email: "user@example.com",
    username: "TestUser",
    notifications: {
      emailUpdates: true,
      newCourseAlerts: false,
      communityMentions: true,
    },
    privacy: {
      profileVisibility: "public", // public, members, private
    },
    preferences: {
      theme: "dark", // dark, light, system
      language: "en", // en, es, fr
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Account Settings"
        description="Manage your account preferences, notifications, and privacy settings."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar (Optional - for navigation within settings) */}
        <aside className="md:col-span-1 hidden md:block">
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10">
              <UserCircle className="mr-2 h-4 w-4" /> Account
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" /> Security
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Palette className="mr-2 h-4 w-4" /> Appearance
            </Button>
             <Button variant="ghost" className="w-full justify-start">
              <Languages className="mr-2 h-4 w-4" /> Language
            </Button>
          </nav>
        </aside>

        {/* Main Settings Content */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={userSettings.username} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={userSettings.email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support for assistance.</p>
              </div>
              <Button>Save Profile Changes</Button>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Change Password</Button>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                  <p className="font-medium">Two-Factor Authentication (2FA)</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
          
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailUpdates" className="flex flex-col space-y-1">
                  <span>Email Updates</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive important news and updates via email.
                  </span>
                </Label>
                <Switch
                  id="emailUpdates"
                  defaultChecked={userSettings.notifications.emailUpdates}
                  aria-label="Email updates"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="newCourseAlerts" className="flex flex-col space-y-1">
                  <span>New Course Alerts</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get notified when new courses are published.
                  </span>
                </Label>
                <Switch
                  id="newCourseAlerts"
                  defaultChecked={userSettings.notifications.newCourseAlerts}
                  aria-label="New course alerts"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="communityMentions" className="flex flex-col space-y-1">
                  <span>Community Mentions</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive notifications for mentions in the community.
                  </span>
                </Label>
                <Switch
                  id="communityMentions"
                  defaultChecked={userSettings.notifications.communityMentions}
                  aria-label="Community mentions"
                />
              </div>
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
