
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
import type { MockRegisteredUser } from '@/types/auth';

const MOCK_USERS_STORAGE_KEY = 'mockRegisteredUsers';

export function SignupForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Signup Failed", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock signup logic
    try {
      const storedUsersRaw = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      let users: MockRegisteredUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      if (!Array.isArray(users)) users = []; // Ensure it's an array

      if (users.find(u => u.email === email)) {
        toast({ title: "Signup Failed", description: "Email already registered.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const newUserAvatar = `https://avatar.vercel.sh/${email}.png?size=128`;
      const newUser: MockRegisteredUser = { name, email, password, avatar: newUserAvatar };
      users.push(newUser);
      localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Auto-login after signup
      login({ name, email, avatar: newUserAvatar }); 
      toast({ title: "Signup Successful", description: "Welcome to HEX THE ADD HUB!" });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error during mock signup:", error);
      toast({ title: "Signup Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    console.log("Attempting Google signup...");
    setTimeout(() => {
      toast({ title: "Google Signup", description: "Google signup functionality coming soon!" });
      setIsLoading(false);
    }, 1500);
  };

  const handleGithubSignup = () => {
    setIsLoading(true);
    console.log("Attempting GitHub signup...");
    setTimeout(() => {
      toast({ title: "GitHub Signup", description: "GitHub signup functionality coming soon!" });
      setIsLoading(false);
    }, 1500);
  };

  const handleFacebookSignup = () => {
    setIsLoading(true);
    console.log("Attempting Facebook signup...");
    setTimeout(() => {
      toast({ title: "Facebook Signup", description: "Facebook signup functionality coming soon!" });
      setIsLoading(false);
    }, 1500);
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
              disabled={isLoading}
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
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
          <Button variant="outline" onClick={handleGoogleSignup} disabled={isLoading}>
            <Icons.Google className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button variant="outline" onClick={handleGithubSignup} disabled={isLoading}>
            <Icons.Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" onClick={handleFacebookSignup} disabled={isLoading}>
            <Icons.Facebook className="mr-2 h-4 w-4" /> Facebook
          </Button>
        </div>
         <Button variant="outline" className="w-full mt-4" disabled={isLoading}>
          <Icons.Metamask className="mr-2 h-5 w-5" /> Connect Wallet (Web3)
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
