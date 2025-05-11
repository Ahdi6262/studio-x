
"use client";

import { useMemo, useState, useEffect, memo } from 'react';
import { differenceInWeeks, getYear, addYears, parseISO, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';

interface YearCalendarProps {
  birthDate: string;
}

const WEEKS_IN_YEAR_DISPLAY = 52; // Typically 52 weeks displayed

export const YearCalendar = memo(function YearCalendar({ birthDate }: YearCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Ensures `new Date()` is client-side only after mount
    setCurrentDate(new Date());
  }, []);
  
  const { weeksUntilNextBday, yearProgressPercent, weeksPassedThisBirthYear, nextBirthdayDateFormatted } = useMemo(() => {
    if (!birthDate || !currentDate) { // Wait for currentDate to be set
        return { weeksUntilNextBday: 0, yearProgressPercent: 0, weeksPassedThisBirthYear: 0, nextBirthdayDateFormatted: 'Calculating...' };
    }

    const dob = parseISO(birthDate);
    const currentYearVal = getYear(currentDate);
    
    let nextBday = new Date(currentYearVal, dob.getMonth(), dob.getDate());
    if (nextBday < currentDate) {
      nextBday = addYears(nextBday, 1);
    }

    const weeksUntil = differenceInWeeks(nextBday, currentDate);
    const totalWeeksInCurrentBirthYear = WEEKS_IN_YEAR_DISPLAY; // approx
    const passedThisBirthYear = totalWeeksInCurrentBirthYear - weeksUntil;
    
    const progress = totalWeeksInCurrentBirthYear > 0 ? (passedThisBirthYear / totalWeeksInCurrentBirthYear) * 100 : 0;
    
    return {
      weeksUntilNextBday: Math.max(0, weeksUntil),
      yearProgressPercent: parseFloat(Math.min(100, Math.max(0, progress)).toFixed(2)),
      weeksPassedThisBirthYear: Math.max(0, passedThisBirthYear),
      nextBirthdayDateFormatted: format(nextBday, "MMMM do, yyyy")
    };
  }, [birthDate, currentDate]);

  if (!birthDate) {
    return <Card><CardContent><p className="text-muted-foreground p-4">Please set your birth date in settings.</p></CardContent></Card>;
  }

  if (!currentDate) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Year Progress: Calculating...</CardTitle>
          <CardDescription>Loading year calendar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Year Progress: {yearProgressPercent}%</CardTitle>
        <CardDescription>
          {weeksUntilNextBday} weeks until your next birthday on {nextBirthdayDateFormatted}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))`}} // 13 columns * 4 rows ~ 52 weeks
            aria-label={`Year progress calendar showing ${WEEKS_IN_YEAR_DISPLAY} weeks.`}
          >
            {Array.from({ length: WEEKS_IN_YEAR_DISPLAY }).map((_, index) => {
              const isWeekPassed = index < weeksPassedThisBirthYear;
              const bgColorClass = isWeekPassed 
                ? 'bg-amber-500/80 hover:bg-amber-500' 
                : 'bg-muted/60 hover:bg-muted';
              const tooltipText = isWeekPassed 
                ? `Week ${index + 1} of current birth year - Passed` 
                : `Week ${index + 1} of current birth year - Upcoming`;

              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={`aspect-square rounded-sm transition-colors duration-150 ${bgColorClass}`}
                       aria-label={tooltipText}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
});
YearCalendar.displayName = 'YearCalendar';
