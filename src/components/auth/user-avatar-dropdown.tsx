
"use client";

import Link from 'next/link';
import { LogOut, UserCircle, LayoutDashboard, Settings } from 'lucide-react'; // Added Settings
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation'; 

interface UserAvatarDropdownProps {
  isMobile?: boolean;
}

export function UserAvatarDropdown({ isMobile = false }: UserAvatarDropdownProps) {
  const { user, logoutUser } = useAuth(); // Changed to logoutUser
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/'); // Redirect to home page after logout
  };

  if (!user) return null;

  const fallbackName = user.name ? user.name.substring(0, 2).toUpperCase() : 'U';
  const avatarSrc = user.avatar || (user.email ? `https://avatar.vercel.sh/${user.email}.png?size=32` : undefined);


  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 p-2">
          <Avatar>
            <AvatarImage src={avatarSrc} alt={user.name || 'User'} />
            <AvatarFallback>{fallbackName}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
        </Button>
         <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
             <AvatarImage src={avatarSrc} alt={user.name || 'User'} />
            <AvatarFallback>{fallbackName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
        </DropdownMenuItem>
         <DropdownMenuItem asChild>
          <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
