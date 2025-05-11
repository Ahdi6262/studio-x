'use client';

import { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { GeometricFluidAnimation } from '@/components/animations/geometric-fluid-animation';
import { AnimatedTextWord, AnimatedTextCharacter } from '@/components/home/animated-text';

export const HeroSection = memo(function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted on client before starting animations
    // to prevent hydration mismatch.
    const timer = setTimeout(() => setIsMounted(true), 100); // Small delay to ensure styles are loaded
    return () => clearTimeout(timer);
  }, []);

  // Static render for SSR and when not mounted to avoid layout shift / provide base content
  const staticContent = (
    <>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
        Welcome to <span className="text-primary">HEX THE ADD HUB</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        The ultimate platform for Web3 creators. Showcase your portfolio, learn new skills, connect with the community, and climb the leaderboard.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" asChild className="animate-fill">
          <Link href="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="animate-fill-outline">
          <Link href="/courses">Explore Courses</Link>
        </Button>
      </div>
      <div className="mt-16 relative">
        <Image 
          src="https://picsum.photos/seed/hero/1200/600" 
          alt="HEX THE ADD HUB platform showcase" 
          width={1200} 
          height={600}
          className="rounded-xl shadow-2xl mx-auto object-cover"
          data-ai-hint="futuristic digital abstract"
          priority // LCP candidate
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-xl"></div>
      </div>
    </>
  );

  return (
    <section className="relative text-center py-16 md:py-24 overflow-hidden">
      <GeometricFluidAnimation />
      
      <div className="relative z-10">
        {!isMounted ? (
          staticContent
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              <AnimatedTextWord text="Welcome to" el="span" className="block" delay={0.1} stagger={0.15}/>
              <AnimatedTextCharacter text="HEX THE ADD HUB" el="span" className="text-primary block mt-1 md:mt-2" delay={0.5} stagger={0.04} />
            </h1>
            <p 
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp" 
              style={{ animationDelay: '1.2s', opacity: 0 }} // Initial opacity 0 for animation
            >
              The ultimate platform for Web3 creators. Showcase your portfolio, learn new skills, connect with the community, and climb the leaderboard.
            </p>
            <div 
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp" 
              style={{ animationDelay: '1.5s', opacity: 0 }} // Initial opacity 0 for animation
            >
              <Button size="lg" asChild className="animate-fill">
                <Link href="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="animate-fill-outline">
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
            <div 
              className="mt-16 relative animate-fadeInUp" 
              style={{ animationDelay: '1.8s', opacity: 0 }} // Initial opacity 0 for animation
            >
              <Image 
                src="https://picsum.photos/seed/hero/1200/600" 
                alt="HEX THE ADD HUB platform showcase" 
                width={1200} 
                height={600}
                className="rounded-xl shadow-2xl mx-auto object-cover"
                data-ai-hint="futuristic digital abstract"
                priority // LCP candidate
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-xl"></div>
            </div>
          </>
        )}
      </div>
    </section>
  );
});
HeroSection.displayName = 'HeroSection';

