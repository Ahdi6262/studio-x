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
import { Filter, Search, ListFilter } from "lucide-react";

export function CourseFilters() {
  const categories = ["All", "Blockchain", "Web Development", "Digital Art", "AI", "Marketing"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const priceRanges = ["All", "Free", "Paid"];

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label htmlFor="search-courses" className="text-sm font-medium">Search Courses</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="search-courses" placeholder="Search by title or instructor..." className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-filter" className="text-sm font-medium">Category</label>
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
        <div className="space-y-2">
          <label htmlFor="level-filter" className="text-sm font-medium">Level</label>
          <Select defaultValue="All">
            <SelectTrigger id="level-filter">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full lg:mt-auto">
          <ListFilter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </div>
    </div>
  );
}
