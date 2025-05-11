
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectFilters } from "@/components/portfolio/project-filters";
import type { Project } from "@/lib/mock-data"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function fetchProjectsFromDB(filters?: { searchTerm?: string; category?: string }): Promise<Project[]> {
  console.log("Fetching projects from DB with filters:", filters);
  const projectsCol = collection(db, 'projects');
  
  // Base query: fetch published projects, ordered by title (or published_at if available and preferred)
  let q = query(projectsCol, where("status", "==", "published"), orderBy("title")); 

  const projectSnapshot = await getDocs(q);
  let projectList = projectSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      // Ensure date field compatibility if mock data 'date' is different from schema 'published_at'
      date: data.published_at ? data.published_at.toDate().toLocaleDateString() : (data.date || 'N/A'),
      imageUrl: data.image_url || data.imageUrl || 'https://picsum.photos/seed/default/600/400', // Fallback for imageUrl
      tags: data.tags || [],
      author: data.authorName || 'Unknown Creator' // Assuming authorName or similar, or fetch from user_id
    } as Project;
  });

  // Client-side filtering for now. For production, consider server-side or Algolia/Typesense.
  if (filters) {
    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      projectList = projectList.filter(project =>
        project.title.toLowerCase().includes(lowerSearchTerm) ||
        project.description.toLowerCase().includes(lowerSearchTerm) ||
        (project.author && project.author.toLowerCase().includes(lowerSearchTerm)) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
      );
    }
    if (filters.category && filters.category !== "All") {
      projectList = projectList.filter(project => 
        project.tags && project.tags.includes(filters.category)
      );
    }
  }
  return projectList;
}

export default function PortfolioPage() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All" });
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async (currentFilters: typeof filters) => {
    setIsLoading(true);
    try {
      const projects = await fetchProjectsFromDB(currentFilters);
      setFilteredProjects(projects); // fetchProjectsFromDB now handles filtering
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProjects(filters);
  }, [loadProjects, filters]);

  const handleFilterChange = useCallback((newFilters: { searchTerm: string; category: string }) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Creator Portfolios"
        description="Discover innovative projects and skilled creators in the Web3 space. Filter by category, technology, or creator to find what inspires you."
        actions={
          <Button asChild>
            <Link href="/portfolio/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Your Project
            </Link>
          </Button>
        }
      />
      
      <ProjectFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 col-span-full bg-card rounded-xl shadow-lg">
          <FolderOpen className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-3 text-primary">No Projects Found!</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Try adjusting your search filters, or be the first to add a project to this category!
          </p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3 bg-card p-4 rounded-xl shadow">
    <Skeleton className="h-[220px] w-full rounded-lg bg-muted" />
    <div className="space-y-2 pt-2">
      <Skeleton className="h-5 w-3/4 bg-muted" />
      <Skeleton className="h-4 w-full bg-muted" />
      <Skeleton className="h-4 w-5/6 bg-muted" />
    </div>
    <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-16 bg-muted rounded-full" />
        <Skeleton className="h-6 w-20 bg-muted rounded-full" />
    </div>
    <Skeleton className="h-9 w-full mt-2 bg-muted" />
  </div>
);
