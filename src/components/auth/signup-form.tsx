"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export function SignupForm() {
  const router = useRouter();
  const { signupUser, signInWithGoogle, signInWithGithub, signInWithFacebook, signInWithWalletSignature } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Signup Failed", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await signupUser(name, email, password);
      toast({ title: "Signup Successful", description: "Welcome to HEX THE ADD HUB!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast({ title: "Signup Failed", description: error.message || "Could not create account.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleSocialSignup = async (provider: 'google' | 'github' | 'facebook') => {
    setIsSocialLoading(provider);
    try {
      let socialSignupMethod;
      if (provider === 'google') socialSignupMethod = signInWithGoogle;
      else if (provider === 'github') socialSignupMethod = signInWithGithub;
      else if (provider === 'facebook') socialSignupMethod = signInWithFacebook;
       else {
        toast({title: "Error", description: "Unknown social provider", variant: "destructive"});
        setIsSocialLoading(null);
        return;
      }

      await socialSignupMethod(); // This will handle creating/linking the user
      toast({ title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Signup Successful`, description: "Welcome!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(`${provider} signup failed:`, error);
      toast({ title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Signup Failed`, description: error.message || "Could not sign up.", variant: "destructive" });
    }
    setIsSocialLoading(null);
  }

  const handleWeb3Signup = async () => {
    setIsSocialLoading('wallet');
    try {
        await signInWithWalletSignature();
        // Success/failure toasts are expected to be handled within signInWithWalletSignature or AuthContext.
    } catch (error: any) {
        toast({title: "Web3 Signup Failed", description: error.message || "Failed to sign up with wallet.", variant: "destructive"});
    }
    setIsSocialLoading(null);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
        <CardDescription>Join HEX THE ADD HUB and start your journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading || !!isSocialLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || !!isSocialLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || !!isSocialLoading}
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading || !!isSocialLoading}
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !!isSocialLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4">
           <Button variant="outline" onClick={() => handleSocialSignup('google')} disabled={isLoading || !!isSocialLoading}>
            {isSocialLoading === 'google' ? <Icons.Logo className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Google className="mr-2 h-4 w-4" />}
             Google
          </Button>
          <Button variant="outline" onClick={() => handleSocialSignup('github')} disabled={isLoading || !!isSocialLoading}>
            {isSocialLoading === 'github' ? <Icons.Logo className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Github className="mr-2 h-4 w-4" />}
             GitHub
          </Button>
          <Button variant="outline" onClick={() => handleSocialSignup('facebook')} disabled={isLoading || !!isSocialLoading}>
             {isSocialLoading === 'facebook' ? <Icons.Logo className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Facebook className="mr-2 h-4 w-4" />}
             Facebook
          </Button>
        </div>
         <Button variant="outline" className="w-full mt-4" onClick={handleWeb3Signup} disabled={isLoading || !!isSocialLoading}>
            {isSocialLoading === 'wallet' ? <Icons.Logo className="mr-2 h-5 w-5 animate-spin" /> : <Icons.Metamask className="mr-2 h-5 w-5" />}
             Sign Up with Wallet
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
