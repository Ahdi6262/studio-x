
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/core/page-header";
import { Edit3, Mail, User, Shield, UploadCloud, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ChangeEvent, useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function ProfilePage() {
  const { user, isAuthenticated, updateUserAvatar, updateUserProfile, signInWithGoogle, signInWithGithub, signInWithFacebook } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) { // check isLoading from auth context
      router.push('/login');
    }
    if (user) {
        setDisplayName(user.name || '');
    }
  }, [isAuthenticated, user, router]); // Add isLoading to dependency if used from context

  const { isLoading } = useAuth(); // Destructure isLoading here

  if (isLoading || !user) { // Use isLoading from context
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Profile" description="Loading profile..." />
         <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  const fallbackName = user.name ? user.name.substring(0, 2).toUpperCase() : 'U';
  const avatarSrc = user.avatar || (user.email ? `https://avatar.vercel.sh/${user.email}.png?size=128` : `https://avatar.vercel.sh/default.png?size=128`);


  const handleSocialLink = async (providerName: 'google' | 'github' | 'facebook') => {
    setIsSaving(true); // Generic loading state
    try {
        let linkMethod;
        if (providerName === 'google') linkMethod = signInWithGoogle; // These will re-authenticate and link if provider supports it, or sign in.
        else if (providerName === 'github') linkMethod = signInWithGithub;
        else if (providerName === 'facebook') linkMethod = signInWithFacebook;
        else return;

        await linkMethod(); // This might re-trigger auth state change.
        toast({ title: `${providerName} Account Linked/Refreshed`, description: `Successfully connected with ${providerName}.` });
    } catch (error: any) {
        console.error(`Error linking ${providerName} account:`, error);
        toast({ title: `Failed to link ${providerName}`, description: error.message || "An error occurred.", variant: "destructive"});
    }
    setIsSaving(false);
  };
  
  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a PNG, JPG, or GIF image.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        // Simulate upload and update context
        try {
          await updateUserAvatar(dataUrl); // This should ideally upload to Firebase Storage and save URL to Firestore/Auth profile
          toast({
            title: "Avatar Updated",
            description: "Your new avatar has been set.",
          });
        } catch (error: any) {
           toast({
            title: "Avatar Update Failed",
            description: error.message || "Could not update avatar.",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
        toast({title: "Name Required", description: "Please enter a display name.", variant: "destructive"});
        return;
    }
    setIsSaving(true);
    try {
        await updateUserProfile(displayName.trim());
        toast({title: "Profile Updated", description: "Your profile information has been saved."});
        setIsEditing(false);
    } catch (error: any) {
        toast({title: "Update Failed", description: error.message || "Could not update profile.", variant: "destructive"});
    }
    setIsSaving(false);
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader 
        title="My Profile" 
        description="Manage your account settings and preferences."
        actions={
          !isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-primary shadow-lg">
              <AvatarImage src={avatarSrc} alt={user.name || "User avatar"} />
              <AvatarFallback className="text-4xl">{fallbackName}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.name || 'User'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange} 
            />
            <Button className="w-full mt-2" onClick={handleAvatarUploadClick} disabled={isSaving}>
              <UploadCloud className="mr-2 h-4 w-4" /> Change Avatar
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>View and update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                    <div>
                        <Label htmlFor="displayName">Full Name</Label>
                        <Input 
                            id="displayName" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                     <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => { setIsEditing(false); setDisplayName(user.name || ''); }} disabled={isSaving}>
                            Cancel
                        </Button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.name || 'Not set'}</p>
                    </div>
                    </div>
                    <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                    </div>
                </>
            )}
             <div className="flex items-center">
              <Shield className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Password</p>
                <Button variant="link" className="p-0 h-auto text-base text-primary" onClick={() => router.push('/forgot-password?email=' + user.email)}>Change Password</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSocialLink('google')} disabled={isSaving}>
                  <Icons.Google className="mr-2 h-4 w-4" /> Connect Google Account
                </Button>
                 <Button variant="outline" className="w-full justify-start" onClick={() => handleSocialLink('github')} disabled={isSaving}>
                  <Icons.Github className="mr-2 h-4 w-4" /> Connect GitHub Account
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSocialLink('facebook')} disabled={isSaving}>
                  <Icons.Facebook className="mr-2 h-4 w-4" /> Connect Facebook Account
                </Button>
                 <Button variant="outline" className="w-full justify-start" disabled>
                  <Icons.Metamask className="mr-2 h-5 w-5" /> Link Web3 Wallet (Coming Soon)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
