
"use client";

import Link from 'next/link';
import { Menu, Settings as SettingsIcon, Link2, Search, Bell, Coins, Landmark } from 'lucide-react'; // Added Coins, Landmark
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
  const { user, isAuthenticated, isLoading: authIsLoading, connectWallet: connectWalletContext } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
      setConnectedWalletAddress(window.ethereum.selectedAddress);
    }
    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setConnectedWalletAddress(accounts[0]);
        } else {
          setConnectedWalletAddress(null);
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }

  }, []);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnectingWallet(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setConnectedWalletAddress(address);
          if (user) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            await connectWalletContext(address, chainId);
            toast({ title: "Wallet Connected", description: `Address: ${address.substring(0,6)}...${address.substring(address.length - 4)} linked to your profile.` });
          } else {
            toast({ title: "Wallet Connected", description: `Address: ${address.substring(0,6)}...${address.substring(address.length - 4)}. Log in to link to profile.` });
          }
        }
      } catch (error: any) {
        console.error("Failed to connect wallet:", error);
        toast({ title: "Wallet Connection Failed", description: error.message || "Could not connect to wallet.", variant: "destructive" });
      } finally {
        setIsConnectingWallet(false);
      }
    } else {
      toast({ title: "MetaMask Not Found", description: "Please install MetaMask or another Ethereum wallet.", variant: "destructive" });
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
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center",
          isActive ? "text-primary bg-primary/10 px-3 py-1.5 rounded-md" : "text-foreground/70 px-3 py-1.5"
        )}
      >
        {IconComponent && <IconComponent className="mr-1.5 h-4 w-4" />}
        {item.label}
      </Link>
    );
  }), [pathname, isAuthenticated, authIsLoading]);

  const renderMobileNavItems = useCallback((items: {label: string, href: string, requiresAuth?: boolean, icon?: any}[], closeSheetFn: () => void ) => items.map((item) => {
     if (item.requiresAuth && !isAuthenticated && !authIsLoading) { // Check authIsLoading here too
      return null;
    }
     if (item.requiresAuth && authIsLoading) { // Show skeleton/placeholder while auth is loading
        return <div key={item.label} className="h-10 bg-muted/50 rounded-md animate-pulse w-full"></div>;
    }
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    const IconComponent = item.icon;
    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={closeSheetFn}
        className={cn(
          "text-lg font-medium transition-colors hover:text-primary hover:bg-primary/5 py-2 px-3 rounded-md block flex items-center",
          isActive ? "text-primary bg-primary/10" : ""
        )}
      >
        {IconComponent && <IconComponent className="mr-2 h-5 w-5" />}
        {item.label}
      </Link>
    );
  }), [pathname, isAuthenticated, authIsLoading]);

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
              disabled={isConnectingWallet || !!connectedWalletAddress}
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
              </nav>
            )
          ) : (
            <nav className="hidden md:flex items-center space-x-2">
              <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse"></div> {/* Avatar placeholder */}
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
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <Link href="/" onClick={closeSheet} className="mt-4 mb-6 flex items-center space-x-2">
                  <Icons.Logo className="h-7 w-7 text-primary" />
                  <span className="font-bold text-2xl font-heading">
                    HEX THE ADD HUB
                  </span>
                </Link>
                <div className="relative my-4">
                  <Input type="search" placeholder="Search..." className="h-10 pl-10 pr-3 w-full text-base peer" />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
                </div>
                <nav className="flex flex-col space-y-2 mt-6">
                  {renderMobileNavItems(mainNavItems, closeSheet)}
                  {renderMobileNavItems(otherNavItems, closeSheet)}
                  {renderMobileNavItems(utilityNavItems, closeSheet)}

                  <hr className="my-4 border-border" />
                  
                  {isMounted && (
                    <Button
                      variant="outline"
                      className="w-full justify-start py-2 text-lg"
                      onClick={() => { handleConnectWallet(); closeSheet(); }}
                      disabled={isConnectingWallet || !!connectedWalletAddress}
                    >
                      <Link2 className="mr-2 h-5 w-5" />
                      {isConnectingWallet ? "Connecting..." : connectedWalletAddress ? `${connectedWalletAddress.substring(0,6)}...` : "Connect Wallet"}
                    </Button>
                  )}

                  {isMounted && !authIsLoading ? (
                    isAuthenticated && user ? (
                     <UserAvatarDropdown isMobile={true} />
                    ) : (
                      <>
                       <Button variant="outline" className="w-full py-2 text-lg" asChild>
                        <Link href="/login" onClick={closeSheet}>Login</Link>
                      </Button>
                      <Button className="w-full py-2 text-lg" asChild>
                        <Link href="/signup" onClick={closeSheet}>Sign Up</Link>
                      </Button>
                      </>
                    )
                  ) : (
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
