
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface QuickLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface QuickLinksProps {
  title: string;
  links: QuickLinkItem[];
}

export const QuickLinks = React.memo(function QuickLinks({ title, links }: QuickLinksProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Quickly access important areas of your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <Button key={link.href} variant="outline" className="w-full justify-start text-base py-6 group" asChild>
              <Link href={link.href}>
                <IconComponent className="mr-3 h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                <span className="flex-grow">{link.label}</span>
                <ArrowRight className="ml-auto h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:text-primary-foreground transition-opacity" />
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
});

QuickLinks.displayName = 'QuickLinks';
