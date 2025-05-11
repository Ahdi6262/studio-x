"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

export function ProjectFilters() {
  // Mock categories
  const categories = ["All", "NFT", "AI", "Web3", "Marketplace", "Social Media"];

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <label htmlFor="search-projects" className="text-sm font-medium">Search Projects</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="search-projects" placeholder="Search by title or keyword..." className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-filter" className="text-sm font-medium">Filter by Category</label>
          <Select defaultValue="All">
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="md:mt-auto">
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </div>
    </div>
  );
}
