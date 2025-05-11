
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/core/page-header";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectFilters } from "@/components/portfolio/project-filters";
import { mockProjects, type Project } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function PortfolioPage() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All" });

  const handleFilterChange = useCallback((newFilters: { searchTerm: string; category: string }) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    let projects = mockProjects;

    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      projects = projects.filter(project =>
        project.title.toLowerCase().includes(lowerSearchTerm) ||
        project.description.toLowerCase().includes(lowerSearchTerm) ||
        project.author.toLowerCase().includes(lowerSearchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (filters.category !== "All") {
      projects = projects.filter(project => 
        project.tags.includes(filters.category)
      );
    }

    setFilteredProjects(projects);
  }, [filters]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <h2 className="text-2xl font-semibold mb-2">No projects match your criteria!</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

