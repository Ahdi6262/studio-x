
import { PageHeader } from "@/components/core/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Info } from "lucide-react";

export default function ContactPage() {
  // Basic form handling would be client-side here, or use server actions
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle form submission here (e.g., send to an API endpoint or email service)
    alert("Thank you for your message! This is a placeholder form.");
    (event.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Get In Touch"
        description="Have questions, feedback, or partnership inquiries? We'd love to hear from you."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Send className="mr-3 h-6 w-6 text-primary" /> Send Us a Message
            </CardTitle>
            <CardDescription>
              Fill out the form below, and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Regarding..." required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message here..." rows={5} required />
              </div>
              <Button type="submit" className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Info className="mr-3 h-6 w-6 text-primary" /> Contact Information
            </CardTitle>
            <CardDescription>
              Other ways to reach out or find information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <div>
              <h3 className="font-semibold">General Inquiries:</h3>
              <p className="text-muted-foreground">For general questions about HEX THE ADD HUB.</p>
              <a href="mailto:info@hextheaddhub.com" className="text-primary hover:underline">info@hextheaddhub.com</a> (Placeholder)
            </div>
            <div>
              <h3 className="font-semibold">Support:</h3>
              <p className="text-muted-foreground">Need help with the platform?</p>
              <a href="mailto:support@hextheaddhub.com" className="text-primary hover:underline">support@hextheaddhub.com</a> (Placeholder)
            </div>
            <div>
              <h3 className="font-semibold">Community & Socials:</h3>
              <p className="text-muted-foreground">Join our community discussions (Links coming soon).</p>
              {/* Add social media links here later */}
            </div>
             <div>
              <h3 className="font-semibold">Address:</h3>
              <p className="text-muted-foreground">Our virtual headquarters is everywhere the blockchain is!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
