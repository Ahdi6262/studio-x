
"use client";

import { useState, useEffect, memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Project } from "@/lib/mock-data";

// Mock categories, could be dynamic in a real app
const categories = ["All", "NFT", "AI", "Web3", "Marketplace", "Social Media", "Solidity", "React", "Python", "Next.js", "IPFS", "Ceramic"];


interface ProjectFiltersProps {
  onFilterChange: (filters: { searchTerm: string; category: string }) => void;
}

export const ProjectFilters = memo(function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    onFilterChange({ searchTerm, category });
  }, [searchTerm, category, onFilterChange]);

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <label htmlFor="search-projects" className="text-sm font-medium">Search Projects</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              id="search-projects" 
              placeholder="Search by title, description, or tag..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-filter" className="text-sm font-medium">Filter by Category/Technology</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* "Apply Filters" button removed, filtering happens on change */}
      </div>
    </div>
  );
});
ProjectFilters.displayName = 'ProjectFilters';

