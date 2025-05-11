"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'; // Added SheetHeader, SheetTitle
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { UserAvatarDropdown } from '@/components/auth/user-avatar-dropdown';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Courses', href: '/courses' },
  { label: 'My Knowledge', href: '/university/iit-delhi' }, 
];

const otherNavItems = [
  { label: 'People', href: '/people' },
  { label: 'Events', href: '/events' },
];

const utilityNavItems = [
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Life Tracking', href: '/life-tracking'},
];


export function Navbar() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const renderNavItems = useCallback((items: {label: string, href: string}[]) => items.map((item) => {
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    return (
      <Link
        key={item.label} 
        href={item.href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary bg-primary/10 px-3 py-1.5 rounded-md" : "text-foreground/70 px-3 py-1.5"
        )}
      >
        {item.label}
      </Link>
    );
  }), [pathname]);

  const renderMobileNavItems = useCallback((items: {label: string, href: string}[], closeSheetFn: () => void ) => items.map((item) => {
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={closeSheetFn}
        className={cn(
          "text-lg font-medium transition-colors hover:text-primary hover:bg-primary/5 py-2 px-3 rounded-md block",
          isActive ? "text-primary bg-primary/10" : ""
        )}
      >
        {item.label}
      </Link>
    );
  }), [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.Logo className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-xl font-heading">
            HEX THE ADD HUB
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-1 items-center">
          {renderNavItems(mainNavItems)}
          {renderNavItems(otherNavItems)}
          {renderNavItems(utilityNavItems)}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {isMounted ? ( 
            isAuthenticated ? (
              <UserAvatarDropdown />
            ) : (
              <nav className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </nav>
            )
          ) : (
            // Skeleton loaders for auth buttons
            <nav className="hidden md:flex items-center space-x-2">
              <div className="h-9 w-[60px] bg-muted/50 rounded-md animate-pulse"></div>
              <div className="h-10 w-[88px] bg-muted/50 rounded-md animate-pulse"></div>
            </nav>
          )}
          
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader className="sr-only"> {/* Visually hide header but provide for accessibility */}
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <Link href="/" onClick={closeSheet} className="mt-4 mb-6 flex items-center space-x-2"> {/* Adjusted margin for header */}
                  <Icons.Logo className="h-7 w-7 text-primary" />
                  <span className="font-bold text-2xl font-heading">
                    HEX THE ADD HUB
                  </span>
                </Link>
                <nav className="flex flex-col space-y-2 mt-6">
                  {renderMobileNavItems(mainNavItems, closeSheet)}
                  {renderMobileNavItems(otherNavItems, closeSheet)}
                  {renderMobileNavItems(utilityNavItems, closeSheet)}

                  <hr className="my-4 border-border" />
                  {isMounted ? ( 
                    isAuthenticated ? (
                     <UserAvatarDropdown isMobile={true} />
                    ) : (
                      <>
                       <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={closeSheet}>Login</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/signup" onClick={closeSheet}>Sign Up</Link>
                      </Button>
                      </>
                    )
                  ) : (
                     // Skeleton loaders for mobile auth buttons
                    <div className="space-y-2">
                      <div className="h-10 bg-muted/50 rounded-md animate-pulse w-full"></div>
                      <div className="h-10 bg-muted/50 rounded-md animate-pulse w-full"></div>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
