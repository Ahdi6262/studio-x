"use client";

import { useState, useEffect, useCallback } from 'react';
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
import { useAuth } from '@/contexts/auth-context'; // For username/email
import { Skeleton } from '@/components/ui/skeleton';

interface UserSettings {
  username: string;
  email: string;
  notifications: {
    emailUpdates: boolean;
    newCourseAlerts: boolean;
    communityMentions: boolean;
  };
  preferences: {
    language: string;
  };
}

const defaultSettings: UserSettings = {
  username: "",
  email: "",
  notifications: {
    emailUpdates: true,
    newCourseAlerts: false,
    communityMentions: true,
  },
  preferences: {
    language: "en",
  },
};

export default function SettingsPage() {
  const { theme: currentAppliedTheme, setTheme: applyThemePreference } = useTheme();
  const { toast } = useToast();
  const { user, isLoading: authIsLoading } = useAuth();

  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    let initialSettings = defaultSettings;
    if (storedSettings) {
      try {
        initialSettings = { ...defaultSettings, ...JSON.parse(storedSettings) };
      } catch (e) {
        console.error("Failed to parse stored settings:", e);
      }
    }
    
    if (user && !authIsLoading) {
      initialSettings.username = user.name || "";
      initialSettings.email = user.email || "";
      setSettings(initialSettings);
      setIsPageLoading(false);
    } else if (!authIsLoading) {
      // User not loaded or not authenticated, use defaults or stored non-auth data
      setSettings(initialSettings);
      setIsPageLoading(false);
    }

  }, [user, authIsLoading]);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };
  
  const updateNotificationSetting = <K extends keyof UserSettings["notifications"]>(key: K, value: UserSettings["notifications"][K]) => {
    setSettings(prev => {
      const newNotifications = { ...prev.notifications, [key]: value };
      const newSettings = { ...prev, notifications: newNotifications };
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };


  const handleSaveProfile = () => {
    // Profile info (username, email) is primarily managed via AuthContext and profile page
    // This could be used for other profile-related settings if any
    toast({ title: "Profile Settings Saved", description: "Your profile related preferences have been updated." });
  };

  const handleSaveNotifications = () => {
    // Settings are already saved on change by updateNotificationSetting
    toast({ title: "Notifications Updated", description: "Your notification preferences have been saved." });
  };

  const handleThemeChange = (newThemePreference: string) => {
    applyThemePreference(newThemePreference as 'light' | 'dark' | 'system');
    toast({ title: "Appearance Updated", description: `Theme set to ${newThemePreference}.` });
  };
  
  const handleLanguageChange = (newLanguage: string) => {
    updateSetting('preferences', { ...settings.preferences, language: newLanguage });
    // Here you might trigger i18n library to change language
    toast({ title: "Language Updated", description: `Language preference set to ${newLanguage === 'en' ? 'English' : newLanguage === 'es' ? 'Español' : 'Français'}. Full translation coming soon.` });
  };

  if (isPageLoading || authIsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Account Settings" description="Loading your preferences..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside className="md:col-span-1 hidden md:block">
            <Skeleton className="h-40 w-full" />
          </aside>
          <div className="md:col-span-2 space-y-8">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        </div>
      </div>
    );
  }


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
              <CardDescription>Basic account details. For full profile editing, visit your Profile page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={settings.username} disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={settings.email} disabled />
              </div>
              {/* <Button onClick={handleSaveProfile}><Save className="mr-2 h-4 w-4" />Save Profile Changes</Button> */}
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={() => toast({title: "Coming Soon", description: "Password change functionality will be available here."})}>
                Change Password (Placeholder)
              </Button>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                  <p className="font-medium">Two-Factor Authentication (2FA)</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({title: "Coming Soon", description: "2FA setup will be available here."})}>
                    Enable 2FA (Placeholder)
                </Button>
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
                <Label htmlFor="emailUpdates" className="flex flex-col space-y-1 flex-grow cursor-pointer">
                  <span>Email Updates</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive important news and updates via email.
                  </span>
                </Label>
                <Switch
                  id="emailUpdates"
                  checked={settings.notifications.emailUpdates}
                  onCheckedChange={(checked) => updateNotificationSetting('emailUpdates', checked)}
                  aria-label="Email updates"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="newCourseAlerts" className="flex flex-col space-y-1 flex-grow cursor-pointer">
                  <span>New Course Alerts</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get notified when new courses are published.
                  </span>
                </Label>
                <Switch
                  id="newCourseAlerts"
                  checked={settings.notifications.newCourseAlerts}
                  onCheckedChange={(checked) => updateNotificationSetting('newCourseAlerts', checked)}
                  aria-label="New course alerts"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="communityMentions" className="flex flex-col space-y-1 flex-grow cursor-pointer">
                  <span>Community Mentions</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive notifications for mentions in the community.
                  </span>
                </Label>
                <Switch
                  id="communityMentions"
                  checked={settings.notifications.communityMentions}
                  onCheckedChange={(checked) => updateNotificationSetting('communityMentions', checked)}
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
                <Select value={currentAppliedTheme} onValueChange={handleThemeChange}>
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
                 <Select value={settings.preferences.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español (Spanish - Basic)</SelectItem>
                    <SelectItem value="fr">Français (French - Basic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
