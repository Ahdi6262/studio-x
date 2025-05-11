import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/lib/mock-data';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import React from 'react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = React.memo(function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="relative w-full h-48 md:h-56">
        <Image
          src={course.imageUrl}
          alt={course.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="education learning online"
        />
        <Badge variant="default" className="absolute top-3 right-3 text-sm">
          {course.category}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
          <Link href={`/courses/${course.id}`}>{course.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          By {course.instructor}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-3 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Star className="h-4 w-4 mr-1.5 text-yellow-400 fill-yellow-400" />
          <span>{course.rating}</span>
          <span className="mx-1.5">·</span>
          <Users className="h-4 w-4 mr-1.5" />
          <span>{course.students.toLocaleString()} students</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>{course.duration}</span>
          <span className="mx-1.5">·</span>
           <BookOpen className="h-4 w-4 mr-1.5" />
          <span>{course.lessons} lessons</span>
        </div>
        <p className="text-sm text-foreground/80 line-clamp-2 h-10">{course.description}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">
          {typeof course.price === 'number' ? `$${course.price}` : course.price}
        </p>
        <Button size="sm" asChild>
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
CourseCard.displayName = 'CourseCard';
