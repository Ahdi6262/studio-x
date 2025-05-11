import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Users, BookOpen } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section'; // Import the new HeroSection

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why CreatorChain Hub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Showcase Your Work</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Build a stunning portfolio to display your projects, skills, and expertise to the Web3 world. Attract collaborators and opportunities.
              </CardDescription>
              <Button variant="link" className="mt-4 text-primary" asChild>
                <Link href="/portfolio">View Portfolios <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Learn & Grow</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Access a wide range of courses tailored for Web3 creators. From smart contracts to DAO governance, level up your knowledge.
              </CardDescription>
              <Button variant="link" className="mt-4 text-primary" asChild>
                <Link href="/courses">Browse Courses <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Engage & Compete</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Join a vibrant community, contribute to projects, earn points, and climb the leaderboard. Get recognized for your achievements.
              </CardDescription>
              <Button variant="link" className="mt-4 text-primary" asChild>
                <Link href="/leaderboard">See Leaderboard <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-secondary/50 rounded-xl my-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Join the Revolution?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Become a part of the CreatorChain Hub community today and take your Web3 journey to the next level.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Sign Up Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
