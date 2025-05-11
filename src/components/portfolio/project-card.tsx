import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/mock-data';
import { ExternalLink, CalendarDays } from 'lucide-react';
import React from 'react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = React.memo(function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="relative w-full h-48 md:h-56">
        <Image
          src={project.imageUrl}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="technology code abstract"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
          <Link href={`/portfolio/${project.id}`}>{project.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 h-10">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4">
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <CalendarDays className="h-4 w-4 mr-1.5" />
          <span>{project.date}</span>
          <span className="mx-1.5">·</span>
          <span>By {project.author}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags && project.tags.map((tag) => ( // Added check for project.tags
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" asChild className="w-full animate-fill-outline">
          <Link href={`/portfolio/${project.id}`}>
            View Details <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
ProjectCard.displayName = 'ProjectCard';

