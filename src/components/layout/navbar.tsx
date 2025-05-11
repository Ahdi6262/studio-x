
"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react'; // Removed ChevronDown as About dropdown is removed
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// DropdownMenu components are removed as they are no longer used for "About"
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { UserAvatarDropdown } from '@/components/auth/user-avatar-dropdown';

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Courses', href: '/courses' },
];

// These items were previously under a "Cool Dude" conceptual grouping in the prompt,
// but appeared after "About". "Academics" is removed from here.
const otherNavItems = [
  { label: 'People', href: '/people' },
  { label: 'Events', href: '/events' },
  // { label: 'Academics', href: '/academics' }, // Removed as per request
];

const utilityNavItems = [
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Cool Dude', href: '/cool-dude' }, // Link to Cool Dude page
];


export function Navbar() {
  const { isAuthenticated } = useAuth();

  const renderNavItems = (items: {label: string, href: string}[]) => items.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
    >
      {item.label}
    </Link>
  ));

  const renderMobileNavItems = (items: {label: string, href: string}[]) => items.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      className="text-lg font-medium transition-colors hover:text-primary"
    >
      {item.label}
    </Link>
  ));

  // Sub-items for mobile "Academics" - these were formerly for "About"
  const academicsMobileSubItems = [
    { label: 'Departmental Core', href: '/academics/departmental-core' },
    { label: 'Interdisciplinary Initiatives', href: '/academics/interdisciplinary-initiatives' },
    { label: 'Research Labs', href: '/academics/research-labs' },
    { label: 'Minor Degrees', href: '/academics/minor-degrees' },
    { label: 'Academic Sections', href: '/academics/academic-sections' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.Logo className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-xl font-heading">
            CreatorChain Hub
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-4 items-center">
          {renderNavItems(mainNavItems)}
          {/* "About" DropdownMenu removed */}
          {renderNavItems(otherNavItems)}
          {renderNavItems(utilityNavItems)}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {isAuthenticated ? (
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-3 mt-8">
                  {renderMobileNavItems(mainNavItems)}
                  
                  {/* Mobile "Academics" section with sub-items (formerly About) */}
                  {/* This is a conceptual grouping for mobile, actual page is linked from Cool Dude */}
                  <div className="text-lg font-medium">Academics</div>
                  <div className="flex flex-col space-y-2 pl-4">
                    {academicsMobileSubItems.map((subItem) => (
                       <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="text-base font-normal text-foreground/80 transition-colors hover:text-primary"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                  
                  {renderMobileNavItems(otherNavItems)}
                  {renderMobileNavItems(utilityNavItems)}

                  <hr className="my-4 border-border" />
                  {isAuthenticated ? (
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
