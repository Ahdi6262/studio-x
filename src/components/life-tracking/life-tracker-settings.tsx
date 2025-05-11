
"use client";

import type { FormEvent } from 'react';
import { useState, useEffect, memo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { LifeTrackerSettingsData } from '@/types/life-tracking';
import { CalendarIcon, Target, Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';


interface LifeTrackerSettingsDialogProps {
  currentSettings: LifeTrackerSettingsData;
  onSave: (settings: LifeTrackerSettingsData) => void;
  onOpenChange: (open: boolean) => void;
}

export const LifeTrackerSettingsDialog = memo(function LifeTrackerSettingsDialog({ currentSettings, onSave, onOpenChange }: LifeTrackerSettingsDialogProps) {
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    currentSettings.birthDate ? parseISO(currentSettings.birthDate) : undefined
  );
  const [lifeExpectancy, setLifeExpectancy] = useState(currentSettings.lifeExpectancy);
  const [enableNotifications, setEnableNotifications] = useState(currentSettings.enableNotifications);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    setBirthDate(currentSettings.birthDate ? parseISO(currentSettings.birthDate) : undefined);
    setLifeExpectancy(currentSettings.lifeExpectancy);
    setEnableNotifications(currentSettings.enableNotifications);
  }, [currentSettings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
        alert("Please select a birth date."); // Or use a toast
        return;
    }
    onSave({
      birthDate: format(birthDate, 'yyyy-MM-dd'),
      lifeExpectancy,
      enableNotifications,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Life Tracker Settings</DialogTitle>
          <DialogDescription>
            Personalize your life tracking experience. Changes will be saved locally.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthDate" className="text-right col-span-1">
              <CalendarIcon className="inline-block mr-1 h-4 w-4" /> Birthday
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={(date) => {
                    setBirthDate(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lifeExpectancy" className="text-right col-span-1">
              <Target className="inline-block mr-1 h-4 w-4" /> Life Expectancy
            </Label>
            <div className="col-span-3 flex items-center gap-3">
              <Slider
                id="lifeExpectancy"
                min={20}
                max={120}
                step={1}
                value={[lifeExpectancy]}
                onValueChange={(value) => setLifeExpectancy(value[0])}
                className="flex-grow"
              />
              <span className="text-sm w-12 text-center">{lifeExpectancy} yrs</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notifications" className="text-right col-span-1">
              <Bell className="inline-block mr-1 h-4 w-4" /> Weekly Notifications
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="notifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
               <span className="ml-3 text-sm text-muted-foreground">
                Receive a weekly notification with your current life progress.
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
LifeTrackerSettingsDialog.displayName = 'LifeTrackerSettingsDialog';
