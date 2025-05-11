
"use client";

import { useState, type FormEvent } from 'react';
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
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login logic
    if (email === 'user@example.com' && password === 'password') {
      login({ name: 'Test User', email }, keepLoggedIn);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/profile'); 
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Placeholder for Google login API call
    console.log("Attempting Google login...");
    // Example: window.location.href = '/api/auth/google';
    setTimeout(() => {
      toast({ title: "Google Login", description: "Google login functionality coming soon!" });
      setIsLoading(false);
    }, 1500);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    // Placeholder for GitHub login API call
    console.log("Attempting GitHub login...");
    // Example: window.location.href = '/api/auth/github';
    setTimeout(() => {
      toast({ title: "GitHub Login", description: "GitHub login functionality coming soon!" });
      setIsLoading(false);
    }, 1500);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    // Placeholder for Facebook login API call
    console.log("Attempting Facebook login...");
    // Example: window.location.href = '/api/auth/facebook';
    setTimeout(() => {
      toast({ title: "Facebook Login", description: "Facebook login functionality coming soon!" });
      setIsLoading(false);
    }, 1500);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="keep-logged-in" 
                checked={keepLoggedIn}
                onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="keep-logged-in" className="text-sm font-normal">Keep me signed in</Label>
            </div>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
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
          <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
            <Icons.Google className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button variant="outline" onClick={handleGithubLogin} disabled={isLoading}>
            <Icons.Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" onClick={handleFacebookLogin} disabled={isLoading}>
            <Icons.Facebook className="mr-2 h-4 w-4" /> Facebook
          </Button>
        </div>
        <Button variant="outline" className="w-full mt-4" disabled={isLoading}>
          <Icons.Metamask className="mr-2 h-5 w-5" /> Connect Wallet (Web3)
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
