
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { Button } from "@/components/ui/button";
import { Rss, PlusCircle } from "lucide-react";
import Link from "next/link";
// Firebase imports removed
// import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { BlogPostCard, BlogPostCardSkeleton } from "@/components/blog/blog-post-card";
import type { BlogPost } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';


async function fetchBlogPostsFromAPI(limit: number = 10): Promise<BlogPost[]> {
  console.log("Fetching blog posts from API with limit:", limit);
  try {
    const response = await fetch(`/api/blog?limit=${limit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({message: response.statusText}));
      throw new Error(`Failed to fetch blog posts: ${errorData.message}`);
    }
    const posts: BlogPost[] = await response.json();
    return posts.map(post => ({
        ...post,
        // API should return published_at as ISO string if it's a Date in DB
        published_at: post.published_at ? new Date(post.published_at) : undefined, // Ensure it's a Date object for card
        authorName: post.authorName || "HEX THE ADD HUB", // Ensure authorName if API provides it
    }));
  } catch (error) {
    console.error("Error fetching blog posts from API:", error);
    return [];
  }
}


export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = useCallback(async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await fetchBlogPostsFromAPI();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        setPosts([]);
      }
      setIsLoading(false);
    }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="HEX THE ADD HUB Blog"
        description="Stay updated with the latest news, insights, tutorials, and creator spotlights from the Web3 ecosystem."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/blog/new"> {/* Link to admin/new post page */}
                <PlusCircle className="mr-2 h-4 w-4" /> New Post (Admin)
              </Link>
            </Button>
            <Button variant="outline">
              <Rss className="mr-2 h-4 w-4" /> Subscribe
            </Button>
          </div>
        }
      />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <BlogPostCardSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl shadow-lg">
          <Rss className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-3 text-primary">No Posts Yet!</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Our blog is fresh and ready for content. Check back soon for insightful articles and updates!
          </p>
        </div>
      )}
    </div>
  );
}
