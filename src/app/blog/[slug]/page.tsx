import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, UserCircle, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// Firebase imports removed
// import { doc, getDocs, query, where, collection, limit } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import type { BlogPost } from '@/types/blog'; 
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm'; 

async function getPostBySlugFromAPI(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/${slug}`); 
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to fetch blog post (${response.status}): ${errorData.message}`);
    }
    const post: BlogPost = await response.json();
     return {
        ...post,
        // API returns ISO string, new Date() parses it for consistent client-side Date object
        published_at: post.published_at ? new Date(post.published_at) : undefined, 
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug} from API:`, error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlugFromAPI(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <PageHeader title="Post Not Found" />
        <p className="text-muted-foreground mb-4">The blog post you are looking for does not exist or has been moved.</p>
        <Button asChild variant="outline" className="animate-fill-outline">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
    );
  }
  
  const authorName = post.authorName || "HEX THE ADD HUB Team"; 

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild className="animate-fill-outline">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>

      <article className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
        {post.cover_image_url && (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 shadow-inner">
            <Image
              src={post.cover_image_url}
              alt={`Cover image for ${post.title}`}
              layout="fill"
              objectFit="cover"
              priority // LCP candidate
              data-ai-hint="blog article cover"
            />
          </div>
        )}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" /> {authorName}
            </div>
            {post.published_at && (
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
            )}
          </div>
        </header>
        
        <Separator className="my-6" />

        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/90 prose-headings:text-primary prose-a:text-primary hover:prose-a:underline">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content_markdown}
          </ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <>
            <Separator className="my-8" />
            <footer className="mt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-primary" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </footer>
          </>
        )}
      </article>
    </div>
  );
}

export function BlogPostSkeleton() { 
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Skeleton className="h-8 w-32 mb-8" />
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
        <Skeleton className="h-64 md:h-80 w-full rounded-lg mb-8" />
        <Skeleton className="h-10 w-3/4 mb-3" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Separator className="my-6" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

