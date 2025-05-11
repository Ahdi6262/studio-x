"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/core/page-header";
import { Edit3, Mail, User, Shield, UploadCloud, Save, BookUser, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ChangeEvent, useState, type FormEvent } from "react";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { 
    user, 
    isAuthenticated, 
    updateUserAvatar, 
    updateUserProfile, 
    signInWithGoogle, 
    signInWithGithub, 
    signInWithFacebook,
    isLoading: authIsLoading,
    connectedWalletAddress, // For display
    connectWallet, // To initiate connection if not already via navbar
  } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setDisplayName(user.name || '');
      setBio(user.bio || '');
      setIsPageLoading(false);
    } else if (!authIsLoading && !user) {
      setIsPageLoading(false); 
    }
  }, [isAuthenticated, user, router, authIsLoading]);

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "File too large", description: "Please select an image smaller than 2MB.", variant: "destructive" });
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        toast({ title: "Invalid file type", description: "Please select a PNG, JPG, or GIF image.", variant: "destructive" });
        return;
      }

      setIsSaving(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string; 
        try {
          await updateUserAvatar(dataUrl); 
          toast({ title: "Avatar Updated", description: "Your new avatar has been set." });
        } catch (error: any) {
           toast({ title: "Avatar Update Failed", description: error.message || "Could not update avatar.", variant: "destructive" });
        } finally {
            setIsSaving(false);
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
        await updateUserProfile(displayName.trim(), bio.trim());
        toast({title: "Profile Updated", description: "Your profile information has been saved."});
        setIsEditing(false);
    } catch (error: any) {
        toast({title: "Update Failed", description: error.message || "Could not update profile.", variant: "destructive"});
    }
    setIsSaving(false);
  };

  const handleSocialLink = async (providerName: 'google' | 'github' | 'facebook') => {
    setIsSaving(true);
    try {
        let linkMethod;
        if (providerName === 'google') linkMethod = signInWithGoogle; 
        else if (providerName === 'github') linkMethod = signInWithGithub;
        else if (providerName === 'facebook') linkMethod = signInWithFacebook;
        else return;

        await linkMethod(); 
        toast({ title: `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} Account Action Successful`, description: `Successfully interacted with ${providerName}. Check your provider list.` });
    } catch (error: any) {
        console.error(`Error with ${providerName} account:`, error);
        toast({ title: `Failed to process ${providerName}`, description: error.message || "An error occurred.", variant: "destructive"});
    }
    setIsSaving(false);
  };

  if (authIsLoading || isPageLoading || !user) { 
    return (
      <div className="container mx-auto px-4 py-12">
        <PageHeader title="Profile" description="Loading profile..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full mt-2" />
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader>
                    <Skeleton className="h-7 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/3" />
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }
  
  const fallbackName = user.name ? user.name.substring(0, 2).toUpperCase() : (user.email ? user.email.substring(0,2).toUpperCase() : 'U');
  const avatarSrc = user.avatar_url || (user.email ? `https://avatar.vercel.sh/${user.email}.png?size=128` : `https://avatar.vercel.sh/default.png?size=128`);


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
              <AvatarImage src={avatarSrc} alt={user.name || "User avatar"} data-ai-hint="user profile picture"/>
              <AvatarFallback className="text-4xl">{fallbackName}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{displayName || 'User'}</CardTitle>
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
              <UploadCloud className="mr-2 h-4 w-4" /> {isSaving && fileInputRef.current?.files?.length ? 'Uploading...' : 'Change Avatar'}
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
                        <Label htmlFor="displayName"><User className="inline-block mr-1 h-4 w-4" /> Full Name</Label>
                        <Input 
                            id="displayName" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                    <div>
                        <Label htmlFor="bio"><BookUser className="inline-block mr-1 h-4 w-4" /> Bio</Label>
                        <Textarea 
                            id="bio"
                            placeholder="Tell us a bit about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={isSaving}
                            rows={4}
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
                        <Button variant="outline" onClick={() => { setIsEditing(false); setDisplayName(user.name || ''); setBio(user.bio || ''); }} disabled={isSaving}>
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
                            <p className="font-medium">{displayName || 'Not set'}</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <BookUser className="h-5 w-5 mr-3 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">Bio</p>
                            <p className="font-medium whitespace-pre-wrap">{bio || 'No bio set.'}</p>
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
                <Button variant="link" className="p-0 h-auto text-base text-primary" onClick={() => router.push('/forgot-password?email=' + encodeURIComponent(user.email || ''))}>Change Password</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSocialLink('google')} disabled={isSaving}>
                  <Icons.Google className="mr-2 h-4 w-4" /> 
                  {user.auth_providers_linked?.some(p => p.provider_name === 'google.com') ? 'Refresh Google Link' : 'Link Google Account'}
                </Button>
                 <Button variant="outline" className="w-full justify-start" onClick={() => handleSocialLink('github')} disabled={isSaving}>
                  <Icons.Github className="mr-2 h-4 w-4" /> 
                  {user.auth_providers_linked?.some(p => p.provider_name === 'github.com') ? 'Refresh GitHub Link' : 'Link GitHub Account'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSocialLink('facebook')} disabled={isSaving}>
                  <Icons.Facebook className="mr-2 h-4 w-4" /> 
                  {user.auth_providers_linked?.some(p => p.provider_name === 'facebook.com') ? 'Refresh Facebook Link' : 'Link Facebook Account'}
                </Button>
                 <Button variant="outline" className="w-full justify-start" onClick={connectWallet} disabled={!!connectedWalletAddress}>
                  <Link2 className="mr-2 h-5 w-5" /> 
                  {connectedWalletAddress ? `Linked: ${connectedWalletAddress.substring(0,6)}...` : 'Link Web3 Wallet'}
                </Button>
                {user.web3_wallets && user.web3_wallets.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                        <p>Linked Wallets:</p>
                        <ul className="list-disc pl-5">
                            {user.web3_wallets.map(wallet => (
                                <li key={wallet.address}>{wallet.address.substring(0,10)}... ({wallet.chain_id}) {wallet.is_primary ? '(Primary)' : ''}</li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
