
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockProjects as fallbackProjects, type Project } from '@/lib/mock-data'; // Keep mock as fallback
import { PageHeader } from '@/components/core/page-header';
import { ArrowLeft, ExternalLink, CalendarDays, User } from 'lucide-react';
// import { doc, getDoc } from "firebase/firestore"; // Example for Firebase
// import { db } from "@/lib/firebase"; // Example for Firebase

async function getProjectData(projectId: string): Promise<Project | undefined> {
  console.log(`Fetching project data for ID: ${projectId} (simulated)...`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // In a real app:
  // const projectRef = doc(db, 'projects', projectId);
  // const projectSnap = await getDoc(projectRef);
  // if (projectSnap.exists()) {
  //   return { id: projectSnap.id, ...projectSnap.data() } as Project;
  // }
  // return undefined;
  return fallbackProjects.find(p => p.id === projectId); // Return mock data for now
}

export default async function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const project = await getProjectData(params.projectId);

  if (!project) {
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
            src={project.imageUrl}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="project detail main"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
           <div className="absolute bottom-0 left-0 p-6">
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{project.title}</h1>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <div className="prose prose-invert max-w-none dark:prose-invert prose-lg text-foreground/90">
                    <p className="lead text-xl text-muted-foreground">{project.description}</p>
                    {project.longDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: project.longDescription.replace(/\n/g, '<br />') }} />
                    ) : (
                        <p>No detailed description available for this project.</p>
                    )}
                </div>
                 {project.link && (
                  <Button asChild className="mt-8">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Visit Project <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
            </div>
            <aside className="md:col-span-1 space-y-6">
                <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-primary">Project Info</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span><strong>Author:</strong> {project.author}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span><strong>Published:</strong> {project.date}</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-primary">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <Badge key={tag} variant="default">{tag}</Badge>
                    ))}
                    </div>
                </div>
            </aside>
        </div>
      </article>
    </div>
  );
}
