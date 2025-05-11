"use client";

import Link from 'next/link';
import { LogOut, UserCircle, LayoutDashboard, Settings, Award, Link2 as LinkIcon } from 'lucide-react'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation'; 
import { Icons } from '../icons'; // For Metamask icon
import { useToast } from '@/hooks/use-toast';

interface UserAvatarDropdownProps {
  isMobile?: boolean;
  closeSheet?: () => void; // For mobile menu
}

export function UserAvatarDropdown({ isMobile = false, closeSheet }: UserAvatarDropdownProps) {
  const { 
    user, 
    logoutUser, 
    isAuthenticated, 
    connectedWalletAddress, 
    connectWallet, 
    isConnectingWallet,
    signInWithWalletSignature 
  } = useAuth(); 
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logoutUser();
    if (closeSheet) closeSheet();
    router.push('/'); 
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({ title: "Wallet Action", description: connectedWalletAddress ? `Wallet ${connectedWalletAddress.substring(0,6)}... connected.` : "Wallet connected." });
    } catch (error: any) {
      toast({ title: "Wallet Connection Failed", description: error.message || "Could not connect wallet.", variant: "destructive" });
    }
    if (closeSheet) closeSheet();
  };
  
  const handleSignInWithWallet = async () => {
    try {
      await signInWithWalletSignature();
      // Success/navigation handled by AuthContext
    } catch (error: any)      {
      toast({ title: "Web3 Login Failed", description: error.message || "Could not sign in with wallet.", variant: "destructive" });
    }
    if (closeSheet) closeSheet();
  };


  if (!isAuthenticated && !isMobile) { // For desktop when not authenticated, show wallet login option
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <UserCircle className="h-5 w-5" /> 
            <span className="ml-2 hidden sm:inline">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem asChild>
              <Link href="/login"><LogOut className="mr-2 h-4 w-4 rotate-180" /> Email/Password Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignInWithWallet} disabled={isConnectingWallet}>
              <Icons.Metamask className="mr-2 h-4 w-4" />
              {isConnectingWallet ? 'Connecting...' : 'Login with Wallet'}
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  if (!user) return null; // Should not happen if isAuthenticated is true, but as a safeguard

  const fallbackName = user.name ? user.name.substring(0, 2).toUpperCase() : (user.email ? user.email.substring(0,2).toUpperCase() : 'U');
  const avatarSrc = user.avatar_url || (user.email ? `https://avatar.vercel.sh/${user.email}.png?size=32` : `https://avatar.vercel.sh/default.png?size=32`);


  if (isMobile) { // This part is for rendering inside the mobile sheet
    return (
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
        <Button variant="ghost" className="w-full justify-start text-lg py-2" asChild onClick={closeSheet}><Link href="/settings"><Settings className="mr-2 h-5 w-5" /> Settings</Link></Button>
        <Separator />
        {!connectedWalletAddress && (
            <Button variant="outline" className="w-full justify-start text-lg py-2" onClick={handleConnectWallet} disabled={isConnectingWallet}>
                <LinkIcon className="mr-2 h-5 w-5" /> {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
            </Button>
        )}
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive text-lg py-2" onClick={handleLogout}>
          <LogOut className="mr-2 h-5 w-5" /> Logout
        </Button>
      </div>
    );
  }
  // Desktop Dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
             <AvatarImage src={avatarSrc} alt={user.name || 'User'} />
            <AvatarFallback>{fallbackName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/certificates"><Award className="mr-2 h-4 w-4" /> My Certificates</Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {!connectedWalletAddress && (
          <DropdownMenuItem onClick={handleConnectWallet} disabled={isConnectingWallet}>
            <LinkIcon className="mr-2 h-4 w-4" />
            {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
          </DropdownMenuItem>
        )}
         {connectedWalletAddress && (
          <DropdownMenuLabel className="font-normal text-xs text-muted-foreground px-2 py-1">
            Wallet: {connectedWalletAddress.substring(0,6)}...{connectedWalletAddress.substring(connectedWalletAddress.length - 4)}
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
