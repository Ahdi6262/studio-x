
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate API call to send reset link
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({ 
      title: "Password Reset Email Sent", 
      description: `If an account exists for ${email}, a password reset link has been sent. Please check your inbox (and spam folder).` 
    });
    
    setIsLoading(false);
    // Optionally redirect or clear form
    // router.push('/login'); 
    setEmail('');
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Forgot Your Password?</CardTitle>
        <CardDescription>Enter your email address and we&apos;ll send you a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <Link href="/login" className="text-sm text-primary hover:underline flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}
