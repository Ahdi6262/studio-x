export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  author: string;
  longDescription?: string;
  link?: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
  price: number | 'Free';
  rating: number;
  students: number;
  category: string;
  description: string;
  duration: string;
  lessons: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  points: number;
  achievements: string[];
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Decentralized Art Marketplace',
    description: 'A platform for artists to mint and sell their digital art as NFTs.',
    imageUrl: 'https://picsum.photos/seed/project1/600/400',
    tags: ['NFT', 'Marketplace', 'Solidity', 'React'],
    author: 'Alice Wonderland',
    date: '2023-10-15',
    longDescription: 'This project aims to empower artists by providing a decentralized platform to showcase and monetize their work. Built using cutting-edge blockchain technology.',
    link: '#',
  },
  {
    id: '2',
    title: 'AI-Powered Content Creation Tool',
    description: 'Generate engaging blog posts and social media content using AI.',
    imageUrl: 'https://picsum.photos/seed/project2/600/400',
    tags: ['AI', 'Content Creation', 'Python', 'Next.js'],
    author: 'Bob The Builder',
    date: '2023-11-01',
    longDescription: 'Leveraging advanced NLP models, this tool helps creators overcome writer\'s block and produce high-quality content efficiently.',
    link: '#',
  },
  {
    id: '3',
    title: 'Web3 Social Network',
    description: 'A decentralized social media platform focused on user privacy and data ownership.',
    imageUrl: 'https://picsum.photos/seed/project3/600/400',
    tags: ['Web3', 'Social Media', 'IPFS', 'Ceramic'],
    author: 'Charlie Crypto',
    date: '2024-01-20',
  },
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Solidity Programming',
    instructor: 'Prof. Eth Dev',
    imageUrl: 'https://picsum.photos/seed/course1/600/400',
    price: 49.99,
    rating: 4.8,
    students: 1250,
    category: 'Blockchain',
    description: 'Learn the fundamentals of Solidity and start building your own smart contracts.',
    duration: '6 weeks',
    lessons: 24,
  },
  {
    id: '2',
    title: 'Advanced Next.js for Web3 Developers',
    instructor: 'Jane Frontend',
    imageUrl: 'https://picsum.photos/seed/course2/600/400',
    price: 79.99,
    rating: 4.9,
    students: 850,
    category: 'Web Development',
    description: 'Master Next.js techniques for building high-performance Web3 applications.',
    duration: '8 weeks',
    lessons: 32,
  },
  {
    id: '3',
    title: 'NFT Art Creation Masterclass',
    instructor: 'Pixel Picasso',
    imageUrl: 'https://picsum.photos/seed/course3/600/400',
    price: 'Free',
    rating: 4.5,
    students: 5200,
    category: 'Digital Art',
    description: 'Unlock your creativity and learn to design unique NFT art collections.',
    duration: '4 weeks',
    lessons: 15,
  },
];

export const mockLeaderboard: LeaderboardUser[] = [
  {
    id: '1',
    rank: 1,
    name: 'CryptoKing88',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    points: 15200,
    achievements: ['Top Contributor', 'Early Adopter'],
  },
  {
    id: '2',
    rank: 2,
    name: 'NFTQueen',
    avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    points: 14800,
    achievements: ['Community Helper', 'Prolific Creator'],
  },
  {
    id: '3',
    rank: 3,
    name: 'DevWizard',
    avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    points: 13500,
    achievements: ['Bug Bounty Hunter', 'Code Master'],
  },
  {
    id: '4',
    rank: 4,
    name: 'ArtInnovator',
    avatarUrl: 'https://picsum.photos/seed/user4/100/100',
    points: 12000,
    achievements: ['Visionary Artist'],
  },
];
