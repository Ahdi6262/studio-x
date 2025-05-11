"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { UserAvatarDropdown } from '@/components/auth/user-avatar-dropdown';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; // Import useState and useEffect

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Courses', href: '/courses' },
];

const otherNavItems = [
  { label: 'People', href: '/people' },
  { label: 'Events', href: '/events' },
];

const utilityNavItems = [
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Cool Dude', href: '/cool-dude' }, 
];


export function Navbar() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false); // Add mounted state

  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts
  }, []);


  const renderNavItems = (items: {label: string, href: string}[]) => items.map((item) => {
    const isActive = pathname === item.href;
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
  });

  const renderMobileNavItems = (items: {label: string, href: string}[]) => items.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          "text-lg font-medium transition-colors hover:text-primary hover:bg-primary/5 py-2 px-3 rounded-md block",
          isActive ? "text-primary bg-primary/10" : ""
        )}
      >
        {item.label}
      </Link>
    );
  });

  const academicsMobileSubItems = [
    { label: 'Departmental Core', href: '/academics/departmental-core' },
    { label: 'Interdisciplinary Initiatives', href: '/academics/interdisciplinary-initiatives' },
    { label: 'Research Labs', href: '/academics/research-labs' },
    { label: 'Minor Degrees', href: '/academics/minor-degrees' },
    { label: 'Academic Sections', href: '/academics/academic-sections' },
  ];
  
  const isAcademicsSectionActive = academicsMobileSubItems.some(item => pathname === item.href) || pathname === '/academics';


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.Logo className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-xl font-heading">
            CreatorChain Hub
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-1 items-center"> {/* Reduced gap slightly for tighter nav items */}
          {renderNavItems(mainNavItems)}
          {renderNavItems(otherNavItems)}
          {renderNavItems(utilityNavItems)}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Auth section: Defer rendering until mounted */}
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
            // Placeholder for desktop to prevent layout shift
            <nav className="hidden md:flex items-center space-x-2">
              <div className="h-9 w-[60px] bg-muted/50 rounded-md animate-pulse"></div> {/* Approx size of Login button */}
              <div className="h-10 w-[88px] bg-muted/50 rounded-md animate-pulse"></div> {/* Approx size of Sign Up button */}
            </nav>
          )}
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <Link href="/" className="mb-6 flex items-center space-x-2">
                  <Icons.Logo className="h-7 w-7 text-primary" />
                  <span className="font-bold text-2xl font-heading">
                    CreatorChain Hub
                  </span>
                </Link>
                <nav className="flex flex-col space-y-2 mt-6">
                  {renderMobileNavItems(mainNavItems)}
                  
                  <div>
                    <Link
                        href="/academics"
                        className={cn(
                        "text-lg font-medium py-2 px-3 rounded-md block hover:bg-primary/5",
                        isAcademicsSectionActive ? "text-primary bg-primary/10" : ""
                      )}
                    >
                      Academics
                    </Link>
                    <div className="flex flex-col space-y-1 pl-5 mt-1">
                      {academicsMobileSubItems.map((subItem) => {
                        const isSubItemActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={cn(
                              "text-base font-normal text-foreground/80 transition-colors hover:text-primary hover:bg-primary/5 py-1.5 px-2 rounded-md block",
                              isSubItemActive ? "text-primary bg-primary/10 font-medium" : ""
                            )}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  
                  {renderMobileNavItems(otherNavItems)}
                  {renderMobileNavItems(utilityNavItems)}

                  <hr className="my-4 border-border" />
                   {/* Auth section in mobile menu: Defer rendering until mounted */}
                  {isMounted ? ( 
                    isAuthenticated ? (
                     <UserAvatarDropdown isMobile={true} />
                    ) : (
                      <>
                       <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                      </>
                    )
                  ) : (
                    // Placeholder for mobile auth buttons
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
