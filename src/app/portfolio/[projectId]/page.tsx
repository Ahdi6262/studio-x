
"use client"; 

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/mock-data'; 
import { PageHeader } from "@/components/core/page-header";
import { ArrowLeft, ExternalLink, CalendarDays, UserCircle, Edit } from 'lucide-react';
// Firebase imports removed
// import { doc, getDoc } from "firebase/firestore"; 
// import { db } from "@/lib/firebase";
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/auth-context'; 
import { useEffect, useState } from 'react';

async function fetchProjectFromAPI(projectId: string): Promise<Project | null> {
  console.log(`Fetching project data for ID: ${projectId} from API...`);
  try {
    const response = await fetch(`/api/projects/${projectId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to fetch project (${response.status}): ${errorData.message}`);
    }
    const project: Project = await response.json();
    return {
        ...project,
        date: project.published_at ? new Date(project.published_at).toLocaleDateString() : 'N/A',
        imageUrl: project.imageUrl || 'https://picsum.photos/seed/projectplaceholder/1200/800',
        author: project.author || 'Unknown Creator' // author should be part of Project type from API
    };
  } catch (error) {
    console.error("Error fetching project from API:", error);
    return null;
  }
}


export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<Project | undefined | null>(undefined); // undefined: loading, null: not found
  const { user } = useAuth();
  
  useEffect(() => {
    async function loadData() {
        if (params.projectId) {
            const data = await fetchProjectFromAPI(params.projectId);
            setProject(data); 
        } else {
            setProject(null); // No projectId, so not found
        }
    }
    loadData();
  }, [params.projectId]);


  if (project === undefined) { 
    return <ProjectDetailSkeleton />;
  }

  if (project === null) { 
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <PageHeader title="Project Not Found" />
        <p className="text-muted-foreground mb-4">The project you are looking for does not exist or has been moved.</p>
        <Button asChild variant="outline">
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Link>
        </Button>
      </div>
    );
  }

  const isAuthor = user && user.uid === project.user_id;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
            <Link href="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
            </Link>
        </Button>
      </div>
      <article className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-inner">
          <Image
            src={project.imageUrl || 'https://picsum.photos/seed/projectplaceholder/1200/800'}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="project detail main"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{project.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 prose-p:text-foreground/90 prose-headings:text-primary prose-a:text-primary hover:prose-a:underline">
                    <p className="lead text-xl text-muted-foreground">{project.description}</p>
                    {project.long_description ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.long_description}</ReactMarkdown>
                    ) : (
                        <p>No detailed description available for this project.</p>
                    )}
                </div>
                <div className="mt-8 flex gap-4">
                  {project.project_link && (
                      <Button asChild>
                          <a href={project.project_link} target="_blank" rel="noopener noreferrer">
                          Visit Project <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                      </Button>
                  )}
                  {isAuthor && (
                      <Button variant="outline" asChild>
                          <Link href={`/portfolio/${project.id}/edit`}> {/* Placeholder for edit page */}
                              <Edit className="mr-2 h-4 w-4" /> Edit Project
                          </Link>
                      </Button>
                  )}
                </div>
            </div>
            <aside className="md:col-span-1 space-y-6">
                <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-primary">Project Info</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                            <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span><strong>Author:</strong> {project.author}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span><strong>Published:</strong> {project.date}</span>
                        </div>
                        {project.status && (
                          <div className="flex items-center">
                              <Badge variant={project.status === 'published' ? 'default' : 'secondary'} className="capitalize">{project.status}</Badge>
                          </div>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-primary">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                    {(project.tags && project.tags.length > 0) ? project.tags.map((tag) => (
                        <Badge key={tag} variant="default">{tag}</Badge>
                    )) : <p className="text-sm text-muted-foreground">No tags specified.</p>}
                    </div>
                </div>
            </aside>
        </div>
      </article>
    </div>
  );
}

export function ProjectDetailSkeleton() { 
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-8 w-32 mb-8" />
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
        <Skeleton className="h-64 md:h-96 w-full rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="md:col-span-1 space-y-6">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
