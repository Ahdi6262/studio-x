
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/types/blog'; // Create this type
import { CalendarDays, UserCircle, Eye } from 'lucide-react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard = React.memo(function BlogPostCard({ post }: BlogPostCardProps) {
  const authorName = post.authorName || "HEX THE ADD HUB"; // Fallback author name

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      {post.cover_image_url && (
        <Link href={`/blog/${post.slug}`} className="block relative w-full h-48 md:h-56 group">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="article cover blog"
          />
        </Link>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        {post.category && <Badge variant="outline" className="mt-1 w-fit">{post.category}</Badge>}
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-3 space-y-2">
        <p className="text-sm text-foreground/80 line-clamp-3 h-[60px]">{post.excerpt}</p>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          <UserCircle className="h-4 w-4 mr-1.5" />
          <span>{authorName}</span>
          {post.published_at && (
            <>
              <span className="mx-1.5">·</span>
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.published_at.seconds * 1000).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <Link href={`/blog/${post.slug}`} className="text-sm text-primary hover:underline font-medium">
          Read More &rarr;
        </Link>
        {typeof post.view_count === 'number' && (
            <div className="flex items-center text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5 mr-1" /> {post.view_count.toLocaleString()}
            </div>
        )}
      </CardFooter>
    </Card>
  );
});
BlogPostCard.displayName = 'BlogPostCard';


export const BlogPostCardSkeleton = () => (
  <Card className="flex flex-col h-full overflow-hidden">
    <Skeleton className="w-full h-48 md:h-56" />
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-3/4 mb-1" />
      <Skeleton className="h-4 w-1/4" />
    </CardHeader>
    <CardContent className="flex-grow pt-0 pb-3 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2 mt-2" />
    </CardContent>
    <CardFooter className="pt-0">
      <Skeleton className="h-5 w-20" />
    </CardFooter>
  </Card>
);
