import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockCourses, type Course } from '@/lib/mock-data';
import { PageHeader } from '@/components/core/page-header';
import { ArrowLeft, Star, Users, Clock, BookOpen, CheckCircle, PlayCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

async function getCourseData(courseId: string): Promise<Course | undefined> {
  return mockCourses.find(c => c.id === courseId);
}

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = await getCourseData(params.courseId);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <PageHeader title="Course Not Found" />
        <p className="text-muted-foreground mb-4">The course you are looking for does not exist.</p>
        <Button asChild variant="outline">
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  const mockSyllabus = [
    { title: "Module 1: Introduction", lessons: ["Welcome to the course", "Core concepts", "Setting up your environment"] },
    { title: "Module 2: Fundamentals", lessons: ["Basic syntax", "Key principles", "Hands-on exercise 1"] },
    { title: "Module 3: Advanced Topics", lessons: ["Advanced techniques", "Best practices", "Project work"] },
    { title: "Module 4: Capstone Project", lessons: ["Project planning", "Development", "Final presentation"] },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
       <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
            <Link href="/courses">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Badge variant="secondary" className="mb-2">{course.category}</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{course.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{course.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>Taught by: <span className="font-medium text-primary">{course.instructor}</span></span>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" /> {course.rating} rating
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" /> {course.students.toLocaleString()} students
              </div>
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src={course.imageUrl}
              alt={`Promo image for ${course.title}`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="course promo video"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <PlayCircle className="h-20 w-20 text-white/80 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
          
          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">What you&apos;ll learn</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {["Core concepts of the technology", "Practical application skills", "Industry best practices", "How to build real-world projects", "Advanced problem-solving", "Career advancement tips"].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            <Accordion type="single" collapsible className="w-full">
              {mockSyllabus.map((module, index) => (
                <AccordionItem value={`item-${index}`} key={module.title}>
                  <AccordionTrigger className="text-lg hover:no-underline">
                    {module.title} ({module.lessons.length} lessons)
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-4">
                      {module.lessons.map(lesson => (
                        <li key={lesson} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                          <PlayCircle className="h-4 w-4 mr-2 text-primary/70" /> {lesson}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">
                {typeof course.price === 'number' ? `$${course.price}` : course.price}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="lg" className="w-full">Enroll Now</Button>
              <Button variant="outline" size="lg" className="w-full">Add to Cart</Button>
              <p className="text-xs text-muted-foreground text-center">30-Day Money-Back Guarantee</p>
            </CardContent>
            <Separator className="my-4" />
            <CardContent>
              <h3 className="font-semibold mb-2">This course includes:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary" /> {course.duration} on-demand video</li>
                <li className="flex items-center"><BookOpen className="h-4 w-4 mr-2 text-primary" /> {course.lessons} lessons & articles</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-primary" /> Full lifetime access</li>
                <li className="flex items-center"><Users className="h-4 w-4 mr-2 text-primary" /> Access on mobile and TV</li>
                <li className="flex items-center"><Badge variant="outline" className="mr-2">Certificate</Badge> of completion</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
