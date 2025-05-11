
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Palette, Languages, UserCircle, Save } from "lucide-react";
import { useTheme } from '@/contexts/theme-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock initial settings - in a real app, this would come from user data/API
const initialUserSettings = {
  email: "user@example.com", // This would typically come from auth context
  username: "TestUser", // This would typically come from auth context
  notifications: {
    emailUpdates: true,
    newCourseAlerts: false,
    communityMentions: true,
  },
  privacy: {
    profileVisibility: "public", // public, members, private
  },
  preferences: {
    language: "en", // en, es, fr
  },
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Profile Info State
  const [username, setUsername] = useState(initialUserSettings.username);
  const [email, setEmail] = useState(initialUserSettings.email); // Consider making this read-only or fetched from auth

  // Notification Preferences State
  const [emailUpdates, setEmailUpdates] = useState(initialUserSettings.notifications.emailUpdates);
  const [newCourseAlerts, setNewCourseAlerts] = useState(initialUserSettings.notifications.newCourseAlerts);
  const [communityMentions, setCommunityMentions] = useState(initialUserSettings.notifications.communityMentions);
  
  // Language Preference State
  const [selectedLanguage, setSelectedLanguage] = useState(initialUserSettings.preferences.language);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setUsername(parsed.username || initialUserSettings.username);
      setEmail(parsed.email || initialUserSettings.email);
      setEmailUpdates(parsed.notifications?.emailUpdates ?? initialUserSettings.notifications.emailUpdates);
      setNewCourseAlerts(parsed.notifications?.newCourseAlerts ?? initialUserSettings.notifications.newCourseAlerts);
      setCommunityMentions(parsed.notifications?.communityMentions ?? initialUserSettings.notifications.communityMentions);
      setSelectedLanguage(parsed.preferences?.language || initialUserSettings.preferences.language);
    }
  }, []);

  const saveToLocalStorage = (updatedSettings: Partial<typeof initialUserSettings>) => {
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const newSettings = { ...initialUserSettings, ...currentSettings, ...updatedSettings };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleSaveProfile = () => {
    saveToLocalStorage({ username });
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleSaveNotifications = () => {
     saveToLocalStorage({ 
        notifications: { 
            emailUpdates, 
            newCourseAlerts, 
            communityMentions 
        }
    });
    toast({ title: "Notifications Updated", description: "Your notification preferences have been saved." });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
    toast({ title: "Appearance Updated", description: `Theme set to ${newTheme}.` });
  };
  
  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    saveToLocalStorage({ preferences: { ...initialUserSettings.preferences, language: newLanguage } });
    toast({ title: "Language Updated", description: `Language set to ${newLanguage === 'en' ? 'English' : newLanguage === 'es' ? 'Español' : 'Français'}. Full translation coming soon.` });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Account Settings"
        description="Manage your account preferences, notifications, and privacy settings."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 hidden md:block">
          <nav className="space-y-1 sticky top-24">
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

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support for assistance.</p>
              </div>
              <Button onClick={handleSaveProfile}><Save className="mr-2 h-4 w-4" />Save Profile Changes</Button>
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
                <Label htmlFor="emailUpdates" className="flex flex-col space-y-1 flex-grow">
                  <span>Email Updates</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive important news and updates via email.
                  </span>
                </Label>
                <Switch
                  id="emailUpdates"
                  checked={emailUpdates}
                  onCheckedChange={setEmailUpdates}
                  aria-label="Email updates"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="newCourseAlerts" className="flex flex-col space-y-1 flex-grow">
                  <span>New Course Alerts</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get notified when new courses are published.
                  </span>
                </Label>
                <Switch
                  id="newCourseAlerts"
                  checked={newCourseAlerts}
                  onCheckedChange={setNewCourseAlerts}
                  aria-label="New course alerts"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="communityMentions" className="flex flex-col space-y-1 flex-grow">
                  <span>Community Mentions</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive notifications for mentions in the community.
                  </span>
                </Label>
                <Switch
                  id="communityMentions"
                  checked={communityMentions}
                  onCheckedChange={setCommunityMentions}
                  aria-label="Community mentions"
                />
              </div>
              <Button onClick={handleSaveNotifications}><Save className="mr-2 h-4 w-4" />Save Notification Settings</Button>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Set your preferred language. Full translation support is in progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="language">Language</Label>
                 <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español (Spanish - Coming Soon)</SelectItem>
                    <SelectItem value="fr">Français (French - Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Add more regional settings like timezone if needed later */}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

    