
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectFilters } from "@/components/portfolio/project-filters";
import { mockProjects as fallbackProjects, type Project } from "@/lib/mock-data"; // Keep mock as fallback
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { collection, getDocs } from "firebase/firestore"; // Example for Firebase
// import { db } from "@/lib/firebase"; // Example for Firebase

// Simulate fetching projects (replace with actual Firebase call)
async function fetchProjectsFromDB(): Promise<Project[]> {
  console.log("Fetching projects from DB (simulated)...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // In a real app:
  // const projectsCol = collection(db, 'projects');
  // const projectSnapshot = await getDocs(projectsCol);
  // const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  // return projectList;
  return fallbackProjects; // Return mock data for now
}

export default function PortfolioPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const projects = await fetchProjectsFromDB();
        setAllProjects(projects);
        setFilteredProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
      setIsLoading(false);
    };
    loadProjects();
  }, []);

  const handleFilterChange = useCallback((newFilters: { searchTerm: string; category: string }) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    let projectsToFilter = [...allProjects];

    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      projectsToFilter = projectsToFilter.filter(project =>
        project.title.toLowerCase().includes(lowerSearchTerm) ||
        project.description.toLowerCase().includes(lowerSearchTerm) ||
        project.author.toLowerCase().includes(lowerSearchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (filters.category !== "All") {
      projectsToFilter = projectsToFilter.filter(project => 
        project.tags.includes(filters.category)
      );
    }

    setFilteredProjects(projectsToFilter);
  }, [filters, allProjects]);

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Creator Portfolios"
        description="Discover innovative projects and skilled creators in the Web3 space. Filter by category, technology, or creator to find what inspires you."
        actions={
          <Button asChild>
            <Link href="/portfolio/new"> {/* Assuming a page for creating new projects */}
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
        <div className="text-center py-12 col-span-full">
          <h2 className="text-2xl font-semibold mb-2">No projects match your criteria!</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[220px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);
