
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { LifeTrackerSettingsDialog } from '@/components/life-tracking/life-tracker-settings';
import type { LifeTrackerSettingsData } from '@/types/life-tracking';
import { LifeCalendar } from '@/components/life-tracking/life-calendar';
import { YearCalendar } from '@/components/life-tracking/year-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DEFAULT_BIRTH_DATE = "2008-03-30";
const DEFAULT_LIFE_EXPECTANCY = 80; // Default to a more common life expectancy

export default function LifeTrackingPage() {
  const [settings, setSettings] = useState<LifeTrackerSettingsData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem('lifeTrackerSettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        // Validate parsed settings
        if (parsedSettings.birthDate && parsedSettings.lifeExpectancy) {
           setSettings(parsedSettings);
        } else {
          throw new Error("Invalid stored settings");
        }
      } catch (error) {
        console.warn("Failed to parse stored life tracker settings, using defaults.", error);
        initializeDefaultSettings();
      }
    } else {
      initializeDefaultSettings();
    }
  }, []);

  const initializeDefaultSettings = () => {
    const defaultSettings: LifeTrackerSettingsData = {
      birthDate: DEFAULT_BIRTH_DATE,
      lifeExpectancy: DEFAULT_LIFE_EXPECTANCY,
      enableNotifications: false,
    };
    setSettings(defaultSettings);
    localStorage.setItem('lifeTrackerSettings', JSON.stringify(defaultSettings));
  };
  
  const handleSaveSettings = useCallback((newSettings: LifeTrackerSettingsData) => {
    setSettings(newSettings);
    localStorage.setItem('lifeTrackerSettings', JSON.stringify(newSettings));
    setIsSettingsOpen(false);
  }, []);

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Life Tracking Dashboard" description="Loading your life tracking data..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Life Tracking Dashboard"
        description="Visualize your journey, one week at a time."
        actions={
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings2 className="mr-2 h-4 w-4" /> Settings
          </Button>
        }
      />

      {isSettingsOpen && (
        <LifeTrackerSettingsDialog
          currentSettings={settings}
          onSave={handleSaveSettings}
          onOpenChange={setIsSettingsOpen}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LifeCalendar birthDate={settings.birthDate} lifeExpectancyYears={settings.lifeExpectancy} />
        </div>
        <div>
          <YearCalendar birthDate={settings.birthDate} />
           <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">User Settings Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Your Birthday:</strong> {new Date(settings.birthDate).toLocaleDateString()}</p>
              <p><strong>Life Expectancy:</strong> {settings.lifeExpectancy} years</p>
              <p><strong>Weekly Notifications:</strong> {settings.enableNotifications ? 'Enabled' : 'Disabled'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
