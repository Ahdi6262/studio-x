
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Users, BookOpen, Library, Users2, CalendarDays, Rss, Activity } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why HEX THE ADD HUB?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/portfolio" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Showcase Your Work</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Build a stunning portfolio to display your projects, skills, and expertise to the Web3 world. Attract collaborators and opportunities.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  View Portfolios <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/courses" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Learn & Grow</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Access a wide range of courses tailored for Web3 creators. From smart contracts to DAO governance, level up your knowledge.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  Browse Courses <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/leaderboard" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Engage & Compete</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Join a vibrant community, contribute to projects, earn points, and climb the leaderboard. Get recognized for your achievements.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  See Leaderboard <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/university/iit-delhi" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Library className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">My Knowledge</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Explore a structured overview of academic knowledge, research areas, and programming skills.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  Explore Knowledge <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/people" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Users2 className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">People</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Meet the talented individuals who form our community, from instructors to creators and contributors.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  Meet the Team <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/events" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <CalendarDays className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Events</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Stay updated with our upcoming workshops, seminars, conferences, and community gatherings.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  View Events Calendar <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/blog" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Rss className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Blog</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Read the latest news, insights, tutorials, and creator spotlights from the Web3 ecosystem.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  Read Our Blog <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/life-tracking" className="block hover:no-underline group">
            <Card className="shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Activity className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Life Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <CardDescription>
                  Visualize your journey and track your life progress, one week at a time.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <div className="mt-4 text-primary font-medium text-sm group-hover:underline">
                  Track Your Life <ArrowRight className="ml-1 h-4 w-4 inline" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-secondary/50 rounded-xl my-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Join the Revolution?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Become a part of the HEX THE ADD HUB community today and take your Web3 journey to the next level.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Sign Up Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
