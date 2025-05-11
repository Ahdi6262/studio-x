"use client";

import Link from 'next/link';
import { Menu, Settings as SettingsIcon, Link2, Search, Bell, Coins, Landmark, UserCircle, LayoutDashboard, Award, LogOut } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { UserAvatarDropdown } from '@/components/auth/user-avatar-dropdown';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Courses', href: '/courses' },
  { label: 'My Knowledge', href: '/university/iit-delhi' },
  { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
];

const otherNavItems = [
  { label: 'People', href: '/people' },
  { label: 'Events', href: '/events' },
];

const utilityNavItems = [
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Life Tracking', href: '/life-tracking'},
  { label: 'Community Token', href: '/community-token', icon: Coins },
  { label: 'Governance', href: '/governance', icon: Landmark },
];


export function Navbar() {
  const { 
    user, 
    isAuthenticated, 
    isLoading: authIsLoading, 
    connectWallet, 
    connectedWalletAddress, 
    isConnectingWallet,
    signInWithWalletSignature, // Added
    logoutUser // Added for mobile menu
  } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({ title: "Wallet Action", description: connectedWalletAddress ? `Wallet ${connectedWalletAddress.substring(0,6)}... connected.` : "Wallet connected." });
    } catch (error: any) {
      toast({ title: "Wallet Connection Failed", description: error.message || "Could not connect to wallet.", variant: "destructive" });
    }
  };

  const handleWeb3Login = async () => {
    try {
      await signInWithWalletSignature();
      // Success toast will be handled by auth context or after successful login
    } catch (error: any) {
      toast({ title: "Web3 Login Failed", description: error.message || "Could not sign in with wallet.", variant: "destructive" });
    }
  };


  const renderNavItems = useCallback((items: {label: string, href: string, requiresAuth?: boolean, icon?: any}[]) => items.map((item) => {
    if (item.requiresAuth && !isAuthenticated && !authIsLoading) {
      return null;
    }
    if (item.requiresAuth && authIsLoading) {
        return <div key={item.label} className="h-6 w-20 bg-muted/50 rounded-md animate-pulse px-3 py-1.5"></div>;
    }
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    const IconComponent = item.icon;
    return (
      <Button
        key={item.label}
        variant="ghost"
        asChild
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center px-3 py-1.5",
          isActive ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-primary"
        )}
      >
        <Link href={item.href}>
          {IconComponent && <IconComponent className="mr-1.5 h-4 w-4" />}
          {item.label}
        </Link>
      </Button>
    );
  }), [pathname, isAuthenticated, authIsLoading]);

  const renderMobileNavItems = useCallback((items: {label: string, href: string, requiresAuth?: boolean, icon?: any}[], closeSheetFn: () => void ) => items.map((item) => {
     if (item.requiresAuth && !isAuthenticated && !authIsLoading) { 
      return null;
    }
     if (item.requiresAuth && authIsLoading) { 
        return <div key={item.label} className="h-10 bg-muted/50 rounded-md animate-pulse w-full"></div>;
    }
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    const IconComponent = item.icon;
    return (
      <Button
        key={item.label}
        variant="ghost"
        asChild
        onClick={closeSheetFn}
        className={cn(
          "text-lg font-medium transition-colors hover:text-primary hover:bg-primary/5 py-2 px-3 rounded-md block w-full justify-start flex items-center",
          isActive ? "text-primary bg-primary/10" : ""
        )}
      >
        <Link href={item.href}>
         {IconComponent && <IconComponent className="mr-2 h-5 w-5" />}
         {item.label}
        </Link>
      </Button>
    );
  }), [pathname, isAuthenticated, authIsLoading]);
  
  const fallbackName = user?.name ? user.name.substring(0, 2).toUpperCase() : (user?.email ? user.email.substring(0,2).toUpperCase() : 'U');
  const avatarSrc = user?.avatar_url || (user?.email ? `https://avatar.vercel.sh/${user.email}.png?size=32` : `https://avatar.vercel.sh/default.png?size=32`);


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

        <div className="flex flex-1 items-center justify-end space-x-2">
           <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Input type="search" placeholder="Search..." className="h-9 pl-8 pr-2 w-40 lg:w-64 text-sm peer" />
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
           {isMounted && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectWallet}
              disabled={isConnectingWallet} // Disable only while actively connecting
            >
              <Link2 className="mr-2 h-4 w-4" />
              {isConnectingWallet ? "Connecting..." : connectedWalletAddress ? `${connectedWalletAddress.substring(0,6)}...${connectedWalletAddress.substring(connectedWalletAddress.length - 4)}` : "Connect Wallet"}
            </Button>
          )}
          </div>
          {isMounted && !authIsLoading ? (
            isAuthenticated && user ? (
              <UserAvatarDropdown />
            ) : (
              <nav className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleWeb3Login} disabled={isConnectingWallet}>
                    <Icons.Metamask className="mr-2 h-5 w-5" /> Login with Wallet
                </Button>
              </nav>
            )
          ) : ( 
            <nav className="hidden md:flex items-center space-x-2">
              <div className="h-9 w-16 bg-muted/50 rounded-md animate-pulse"></div>
              <div className="h-9 w-20 bg-muted/50 rounded-md animate-pulse"></div>
              <div className="h-9 w-32 bg-muted/50 rounded-md animate-pulse"></div>
              <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse"></div> 
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
                <SheetHeader className="mb-4 border-b pb-4">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle> 
                  <Link href="/" onClick={closeSheet} className="flex items-center space-x-2">
                    <Icons.Logo className="h-7 w-7 text-primary" />
                    <span className="font-bold text-xl font-heading">
                      HEX THE ADD HUB
                    </span>
                  </Link>
                </SheetHeader>
                <div className="relative my-4">
                  <Input type="search" placeholder="Search..." className="h-10 pl-10 pr-3 w-full text-base peer" />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
                </div>
                <nav className="flex flex-col space-y-2 mt-6">
                  {renderMobileNavItems(mainNavItems, closeSheet)}
                  {renderMobileNavItems(otherNavItems, closeSheet)}
                  {renderMobileNavItems(utilityNavItems, closeSheet)}

                  <Separator className="my-3" />
                  
                  {isMounted && (
                    <Button
                      variant="outline"
                      className="w-full justify-start py-2 text-lg"
                      onClick={() => { handleConnectWallet(); closeSheet(); }}
                      disabled={isConnectingWallet}
                    >
                      <Link2 className="mr-2 h-5 w-5" />
                      {isConnectingWallet ? "Connecting..." : connectedWalletAddress ? `${connectedWalletAddress.substring(0,6)}...` : "Connect Wallet"}
                    </Button>
                  )}

                  {isMounted && !authIsLoading ? (
                    isAuthenticated && user ? (
                     <div className="flex flex-col space-y-1 pt-2">
                        <div className="flex items-center space-x-3 p-2 mb-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={avatarSrc} alt={user.name || 'User'} />
                            <AvatarFallback>{fallbackName}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{user.name || "User"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Separator />
                        <Button variant="ghost" className="w-full justify-start text-lg py-2" asChild onClick={closeSheet}><Link href="/profile"><UserCircle className="mr-2 h-5 w-5" /> Profile</Link></Button>
                        <Button variant="ghost" className="w-full justify-start text-lg py-2" asChild onClick={closeSheet}><Link href="/dashboard"><LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard</Link></Button>
                        <Button variant="ghost" className="w-full justify-start text-lg py-2" asChild onClick={closeSheet}><Link href="/profile/certificates"><Award className="mr-2 h-5 w-5" /> Certificates</Link></Button>
                        <Button variant="ghost" className="w-full justify-start text-lg py-2" asChild onClick={closeSheet}><Link href="/settings"><SettingsIcon className="mr-2 h-5 w-5" /> Settings</Link></Button>
                        <Separator />
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive text-lg py-2" onClick={() => { logoutUser(); closeSheet(); }}><LogOut className="mr-2 h-5 w-5" /> Logout</Button>
                      </div>
                    ) : (
                      <>
                       <Button variant="outline" className="w-full py-2 text-lg" asChild onClick={closeSheet}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button className="w-full py-2 text-lg" asChild onClick={closeSheet}>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                       <Button variant="outline" className="w-full justify-start py-2 text-lg" onClick={() => { handleWeb3Login(); closeSheet(); }} disabled={isConnectingWallet}>
                          <Icons.Metamask className="mr-2 h-5 w-5" /> Login with Wallet
                       </Button>
                      </>
                    )
                  ) : (
                    <div className="space-y-2">
                      <div className="h-10 bg-muted/50 rounded-md animate-pulse w-full"></div>
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
