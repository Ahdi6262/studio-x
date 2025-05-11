
import type { Timestamp } from "firebase/firestore";

export interface Project {
  id: string;
  user_id: string; // Added: Foreign Key to users.uid
  title: string;
  slug?: string; // Added: for SEO-friendly URLs
  description: string;
  long_description?: string; // Retained
  imageUrl: string; // Should be cover_image_url as per schema
  gallery_image_urls?: string[]; // Added
  project_link?: string; // Retained
  tags: string[];
  author: string; // This might become redundant if user_id is used to fetch author details
  status?: 'draft' | 'published' | 'archived'; // Added
  date: string; // Consider renaming to published_at (Timestamp) for consistency
  published_at?: Timestamp | any; // Added to match schema
  created_at?: Timestamp | any;
  updated_at?: Timestamp | any;
}

export interface Course {
  id: string;
  instructor_id: string; // Added: Foreign Key to users.uid
  title: string;
  slug?: string; // Added
  instructor: string; // Might be redundant if instructor_id is used
  imageUrl: string; // Should be cover_image_url
  promo_video_url?: string; // Added
  price: number | 'Free'; // Consider storing as price_amount and price_currency
  price_amount?: number;
  price_currency?: string;
  is_free?: boolean; // Added
  rating: number;
  students: number;
  category: string;
  description: string; // Short description
  long_description?: string; // Added
  duration: string; // Should be duration_text
  lessons: number; // Should be lessons_count
  lessons_count?: number; // Added
  level?: string; // Added
  status?: 'draft' | 'published' | 'archived'; // Added
  published_at?: Timestamp | any; // Added
  tags?: string[]; // Added
  learning_objectives?: string[]; // Added
  target_audience?: string; // Added
  token_gating_rules?: any; // Added
  created_at?: Timestamp | any;
  updated_at?: Timestamp | any;
}


export interface LeaderboardUser {
  id: string; // user_id
  rank: number;
  name: string;
  avatarUrl: string; // avatar_url
  points: number; // total_points
  achievements: string[]; // Fetched and mapped from user_achievements
}

// Mock data might need to be adjusted or removed as Firestore becomes the source of truth.
// For now, keeping them as a reference.

export const mockProjects: Project[] = [
  {
    id: '1',
    user_id: 'mockUserId1',
    title: 'Decentralized Art Marketplace',
    slug: 'decentralized-art-marketplace',
    description: 'A platform for artists to mint and sell their digital art as NFTs.',
    imageUrl: 'https://picsum.photos/seed/project1/600/400',
    tags: ['NFT', 'Marketplace', 'Solidity', 'React'],
    author: 'Alice Wonderland',
    date: '2023-10-15', // This would be published_at
    status: 'published',
    longDescription: 'This project aims to empower artists by providing a decentralized platform to showcase and monetize their work. Built using cutting-edge blockchain technology.',
    project_link: '#',
  },
  // ... other mock projects
];

export const mockCourses: Course[] = [
  {
    id: '1',
    instructor_id: 'mockInstructorId1',
    title: 'Introduction to Solidity Programming',
    slug: 'intro-to-solidity',
    instructor: 'Prof. Eth Dev',
    imageUrl: 'https://picsum.photos/seed/course1/600/400',
    price: 49.99,
    price_amount: 4999,
    price_currency: 'USD',
    is_free: false,
    rating: 4.8,
    students: 1250,
    category: 'Blockchain',
    description: 'Learn the fundamentals of Solidity and start building your own smart contracts.',
    duration: '6 weeks', // duration_text
    lessons: 24, // lessons_count
    level: 'Beginner',
    status: 'published',
  },
  // ... other mock courses
];

export const mockLeaderboard: LeaderboardUser[] = [
  {
    id: 'user1',
    rank: 1,
    name: 'CryptoKing88',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    points: 15200,
    achievements: ['Top Contributor', 'Early Adopter'],
  },
  // ... other mock leaderboard users
];
