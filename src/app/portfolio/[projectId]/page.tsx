
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/mock-data'; 
import { PageHeader } from '@/components/core/page-header";
import { ArrowLeft, ExternalLink, CalendarDays, UserCircle, Edit } from 'lucide-react'; // Changed User to UserCircle
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "@/lib/firebase";
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/auth-context'; // To check if current user is project author for edit button

// Client component wrapper to use hooks
function ProjectDetailClient({ project }: { project: Project }) {
  const { user } = useAuth();
  const isAuthor = user && user.uid === project.user_id;

  return (
    <article className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-inner">
        <Image
          src={project.image_url || project.imageUrl || 'https://picsum.photos/seed/projectplaceholder/1200/800'}
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
                          <span><strong>Author:</strong> {project.authorName || project.author || 'Unknown'}</span> {/* Fetch author name if needed */}
                      </div>
                      <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span><strong>Published:</strong> {project.published_at ? new Date(project.published_at.seconds * 1000).toLocaleDateString() : (project.date || 'N/A')}</span>
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
  );
}


async function getProjectData(projectId: string): Promise<Project | undefined> {
  console.log(`Fetching project data for ID: ${projectId} from Firebase...`);
  const projectRef = doc(db, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);
  if (projectSnap.exists()) {
    const data = projectSnap.data();
    // Fetch author name if user_id exists
    let authorName = data.author; // Fallback to existing author field
    if (data.user_id) {
        const userRef = doc(db, 'users', data.user_id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            authorName = userSnap.data().name || data.author;
        }
    }
    return { id: projectSnap.id, ...data, authorName } as Project;
  }
  return undefined;
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
      {/* Wrap client-specific logic in a client component */}
      <ProjectDetailClient project={project} />
    </div>
  );
}

export function ProjectDetailSkeleton() { // Keep for loading states with Suspense
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
