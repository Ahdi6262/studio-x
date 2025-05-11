"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const router = useRouter();
  const { loginUser, signInWithGoogle, signInWithGithub, signInWithFacebook, signInWithWalletSignature } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null); // To track specific social provider loading

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(email, password, keepLoggedIn);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({ title: "Login Failed", description: error.message || "Invalid email or password.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setIsSocialLoading(provider);
    try {
      let socialLoginMethod;
      if (provider === 'google') socialLoginMethod = signInWithGoogle;
      else if (provider === 'github') socialLoginMethod = signInWithGithub;
      else if (provider === 'facebook') socialLoginMethod = signInWithFacebook;
      else {
        toast({title: "Error", description: "Unknown social provider", variant: "destructive"});
        setIsSocialLoading(null);
        return;
      }

      await socialLoginMethod();
      toast({ title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Successful`, description: "Welcome!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      toast({ title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Failed`, description: error.message || "Could not sign in.", variant: "destructive" });
    }
    setIsSocialLoading(null);
  }

  const handleWeb3Login = async () => {
    setIsSocialLoading('wallet');
    try {
        await signInWithWalletSignature();
        // Assuming signInWithWalletSignature handles navigation or auth state updates that trigger navigation
        // If it returns a user, you might want to navigate here or show a success toast.
        // For now, success/failure toasts are expected to be handled within signInWithWalletSignature or AuthContext.
    } catch (error: any) {
        toast({title: "Web3 Login Failed", description: error.message || "Failed to sign in with wallet.", variant: "destructive"});
    }
    setIsSocialLoading(null);
  };

  const handleKeepLoggedInChange = (checked: boolean | 'indeterminate') => {
    setKeepLoggedIn(checked as boolean);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="keep-logged-in" 
                checked={keepLoggedIn}
                onCheckedChange={handleKeepLoggedInChange}
                disabled={isLoading || !!isSocialLoading}
              />
              <Label htmlFor="keep-logged-in" className="text-sm font-normal">Keep me signed in</Label>
            </div>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !!isSocialLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4">
          <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading || !!isSocialLoading}>
            {isSocialLoading === 'google' ? <Icons.Logo className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Google className="mr-2 h-4 w-4" />}
             Google
          </Button>
          <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isLoading || !!isSocialLoading}>
            {isSocialLoading === 'github' ? <Icons.Logo className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Github className="mr-2 h-4 w-4" />}
             GitHub
          </Button>
          <Button variant="outline" onClick={() => handleSocialLogin('facebook')} disabled={isLoading || !!isSocialLoading}>
            {isSocialLoading === 'facebook' ? <Icons.Logo className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Facebook className="mr-2 h-4 w-4" />}
             Facebook
          </Button>
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={handleWeb3Login} disabled={isLoading || !!isSocialLoading}>
          {isSocialLoading === 'wallet' ? <Icons.Logo className="mr-2 h-5 w-5 animate-spin" /> : <Icons.Metamask className="mr-2 h-5 w-5" />}
           Login with Wallet
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
