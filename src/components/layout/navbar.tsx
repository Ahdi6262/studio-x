
"use client";

import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { UserAvatarDropdown } from '@/components/auth/user-avatar-dropdown';

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Courses', href: '/courses' },
];

const coolDudeNavItems = [
  { label: 'People', href: '/people' },
  { label: 'Events', href: '/events' },
  { label: 'Academics', href: '/academics' },
];

const aboutSubItems = [
  { label: 'Departmental Core', href: '/about/departmental-core' },
  { label: 'Interdisciplinary Initiatives', href: '/about/interdisciplinary-initiatives' },
  { label: 'Research Labs', href: '/about/research-labs' },
  { label: 'Minor Degrees', href: '/about/minor-degrees' },
  { label: 'Academic Sections', href: '/about/academic-sections' },
];

const utilityNavItems = [
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Cool Dude', href: '/cool-dude' },
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground px-0">
                About <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {aboutSubItems.map((subItem) => (
                <DropdownMenuItem key={subItem.label} asChild>
                  <Link href={subItem.href}>{subItem.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {renderNavItems(coolDudeNavItems)}
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
                  
                  {/* Mobile "About" with sub-items */}
                  <div className="text-lg font-medium">About</div>
                  <div className="flex flex-col space-y-2 pl-4">
                    {aboutSubItems.map((subItem) => (
                       <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="text-base font-normal text-foreground/80 transition-colors hover:text-primary"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                  
                  {renderMobileNavItems(coolDudeNavItems)}
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
