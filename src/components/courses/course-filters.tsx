
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const categories = ["All", "Blockchain", "Web Development", "Digital Art", "AI", "Marketing"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];
// Price ranges could be more complex (e.g., slider), simplified for now
// const priceRanges = ["All", "Free", "Paid"]; 

interface CourseFiltersProps {
  onFilterChange: (filters: { searchTerm: string; category: string; level: string }) => void;
}

export function CourseFilters({ onFilterChange }: CourseFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    onFilterChange({ searchTerm, category, level });
  }, [searchTerm, category, level, onFilterChange]);

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="space-y-2">
          <label htmlFor="search-courses" className="text-sm font-medium">Search Courses</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              id="search-courses" 
              placeholder="Search by title or instructor..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-filter" className="text-sm font-medium">Category</label>
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
        <div className="space-y-2">
          <label htmlFor="level-filter" className="text-sm font-medium">Level</label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger id="level-filter">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(lvl => (
                <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* "Apply Filters" button removed, filtering happens on change */}
      </div>
    </div>
  );
}

