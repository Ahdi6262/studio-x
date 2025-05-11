
"use client";

import { useMemo, useState, useEffect, memo } from 'react';
import { differenceInWeeks, parseISO, getYear } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';

interface LifeCalendarProps {
  birthDate: string;
  lifeExpectancyYears: number;
}

const WEEKS_IN_YEAR = 52;
const MAX_COLUMNS = 52; // Display 52 weeks (1 year) per row

// Define life stage colors based on age in years
const getLifeStageColor = (ageInYears: number): string => {
  if (ageInYears < 1) return 'bg-yellow-400/70 hover:bg-yellow-400'; // First year
  if (ageInYears < 13) return 'bg-amber-500/70 hover:bg-amber-500'; // Childhood (1-12)
  if (ageInYears < 20) return 'bg-lime-500/70 hover:bg-lime-500';    // Adolescence (13-19)
  if (ageInYears < 40) return 'bg-sky-500/70 hover:bg-sky-500';      // Young Adult (20-39)
  if (ageInYears < 60) return 'bg-indigo-500/70 hover:bg-indigo-500';  // Mid Adult (40-59)
  return 'bg-purple-500/70 hover:bg-purple-500'; // Late Adult (60+)
};

export const LifeCalendar = memo(function LifeCalendar({ birthDate, lifeExpectancyYears }: LifeCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // This ensures `new Date()` is only called on the client after hydration
    setCurrentDate(new Date());
  }, []);


  const { weeksSpent, totalWeeks, weeksLeft, lifeProgressPercent } = useMemo(() => {
    if (!birthDate || !currentDate) { // Wait for currentDate to be set
        return { weeksSpent: 0, totalWeeks: lifeExpectancyYears * WEEKS_IN_YEAR, weeksLeft: lifeExpectancyYears * WEEKS_IN_YEAR, lifeProgressPercent: 0 };
    }
    
    const dob = parseISO(birthDate);
    const spent = differenceInWeeks(currentDate, dob);
    const total = lifeExpectancyYears * WEEKS_IN_YEAR;
    const left = Math.max(0, total - spent);
    const progress = total > 0 ? Math.min(100, (spent / total) * 100) : 0;

    return {
      weeksSpent: spent,
      totalWeeks: total,
      weeksLeft: left,
      lifeProgressPercent: parseFloat(progress.toFixed(2)),
    };
  }, [birthDate, lifeExpectancyYears, currentDate]);


  if (!birthDate) {
    return <Card><CardContent><p className="text-muted-foreground p-4">Please set your birth date in settings.</p></CardContent></Card>;
  }
  
  const dobYear = currentDate ? getYear(parseISO(birthDate)) : 0;

  if (!currentDate) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Life Progress: Calculating...</CardTitle>
          <CardDescription>
            Loading your life calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Life Progress: {lifeProgressPercent}%</CardTitle>
        <CardDescription>
          {weeksSpent.toLocaleString()} weeks spent • {weeksLeft.toLocaleString()} weeks left (Total: {totalWeeks.toLocaleString()} weeks based on {lifeExpectancyYears} years)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div 
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${MAX_COLUMNS}, minmax(0, 1fr))`}}
            aria-label={`Life calendar representing ${lifeExpectancyYears} years, with ${weeksSpent} weeks spent.`}
          >
            {Array.from({ length: totalWeeks }).map((_, index) => {
              const weekNumber = index + 1;
              const yearOfThisWeek = dobYear + Math.floor(index / WEEKS_IN_YEAR);
              const ageInYearsAtThisWeek = Math.floor(index / WEEKS_IN_YEAR);
              
              let bgColorClass;
              let tooltipContent;

              if (index < weeksSpent) {
                bgColorClass = getLifeStageColor(ageInYearsAtThisWeek);
                tooltipContent = `Week ${weekNumber} (Age ${ageInYearsAtThisWeek}, Year ${yearOfThisWeek}) - Spent`;
              } else if (index === weeksSpent) {
                bgColorClass = 'bg-primary/70 animate-pulse hover:bg-primary'; // Current week
                tooltipContent = `Week ${weekNumber} (Age ${ageInYearsAtThisWeek}, Year ${yearOfThisWeek}) - Current Week`;
              } else {
                bgColorClass = 'bg-muted/50 hover:bg-muted'; // Future week
                tooltipContent = `Week ${weekNumber} (Age ${ageInYearsAtThisWeek}, Year ${yearOfThisWeek}) - Future`;
              }

              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={`aspect-square rounded-sm transition-colors duration-150 ${bgColorClass}`}
                      aria-label={tooltipContent}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-yellow-400 mr-1.5"></span>First Year</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-amber-500 mr-1.5"></span>Childhood</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-lime-500 mr-1.5"></span>Adolescence</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-sky-500 mr-1.5"></span>Young Adult</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-indigo-500 mr-1.5"></span>Mid Adult</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-purple-500 mr-1.5"></span>Late Adult</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-primary mr-1.5"></span>Current Week</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-muted mr-1.5"></span>Future</div>
        </div>
      </CardContent>
    </Card>
  );
});
LifeCalendar.displayName = 'LifeCalendar';
