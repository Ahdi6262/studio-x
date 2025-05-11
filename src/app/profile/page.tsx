
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/core/page-header";
import { Edit3, Mail, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icons } from "@/components/icons"; // Added import for Icons

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Profile" description="Loading profile..." />
      </div>
    );
  }
  
  const fallbackName = user.name ? user.name.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader 
        title="My Profile" 
        description="Manage your account settings and preferences."
        actions={
          <Button variant="outline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-primary shadow-lg">
              <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
              <AvatarFallback className="text-4xl">{fallbackName}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-2">Change Avatar</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>View and update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
             <div className="flex items-center">
              <Shield className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Password</p>
                <Button variant="link" className="p-0 h-auto text-base text-primary">Change Password</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icons.Google className="mr-2 h-4 w-4" /> Connect Google Account
                </Button>
                 <Button variant="outline" className="w-full justify-start">
                  <Icons.Github className="mr-2 h-4 w-4" /> Connect GitHub Account
                </Button>
                 <Button variant="outline" className="w-full justify-start">
                  <Icons.Metamask className="mr-2 h-5 w-5" /> Link Web3 Wallet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
