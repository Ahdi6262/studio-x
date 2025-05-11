
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Course } from '@/lib/mock-data'; 
import { PageHeader } from '@/components/core/page-header";
import { ArrowLeft, Star, Users, Clock, BookOpen, CheckCircle, PlayCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc, collection, getDocs, orderBy } from "firebase/firestore"; 
import { db } from "@/lib/firebase"; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}
interface CourseLesson {
  id: string;
  title: string;
  content_type: string;
  // Add other lesson-specific fields if needed, e.g., duration
}

async function getCourseData(courseId: string): Promise<(Course & { modules?: CourseModule[] }) | undefined> {
  console.log(`Fetching course data for ID: ${courseId} from Firebase...`);
  const courseRef = doc(db, 'courses', courseId);
  const courseSnap = await getDoc(courseRef);

  if (courseSnap.exists()) {
    const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;

    // Fetch modules and their lessons
    const modulesCol = collection(db, 'courses', courseId, 'course_modules');
    const modulesQuery = query(modulesCol, orderBy("order_index"));
    const modulesSnap = await getDocs(modulesQuery);
    
    const modules: CourseModule[] = await Promise.all(
      modulesSnap.docs.map(async (moduleDoc) => {
        const moduleData = moduleDoc.data();
        const lessonsCol = collection(db, 'courses', courseId, 'course_modules', moduleDoc.id, 'course_lessons');
        const lessonsQuery = query(lessonsCol, orderBy("order_index"));
        const lessonsSnap = await getDocs(lessonsQuery);
        const lessons = lessonsSnap.docs.map(lessonDoc => ({ id: lessonDoc.id, ...lessonDoc.data() } as CourseLesson));
        return { id: moduleDoc.id, title: moduleData.title, lessons };
      })
    );
    
    // Ensure compatibility with CourseCard props for price and image
    const displayPrice = courseData.is_free ? 'Free' : (courseData.price_amount ? `$${(courseData.price_amount / 100).toFixed(2)}` : 'N/A');
    const displayImageUrl = courseData.cover_image_url || courseData.imageUrl || 'https://picsum.photos/seed/courseplaceholder/1280/720';

    return { 
      ...courseData, 
      price: displayPrice, // For display consistency
      imageUrl: displayImageUrl, // For display consistency
      modules 
    };
  }
  return undefined;
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
  
  // Fetch instructor name from users collection if instructor_id exists
  let instructorName = course.instructor || "Expert Instructor"; // Fallback
  if (course.instructor_id) {
      const instructorRef = doc(db, 'users', course.instructor_id);
      const instructorSnap = await getDoc(instructorRef);
      if (instructorSnap.exists()) {
          instructorName = instructorSnap.data().name || instructorName;
      }
  }


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
        <div className="lg:col-span-2 space-y-8">
          <div>
            {course.category && <Badge variant="secondary" className="mb-2">{course.category}</Badge>}
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{course.title}</h1>
            {course.description && <p className="mt-2 text-lg text-muted-foreground">{course.description}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>Taught by: <span className="font-medium text-primary">{instructorName}</span></span>
              {typeof course.rating === 'number' && 
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" /> {course.rating} rating
                </div>
              }
              {typeof course.students === 'number' && 
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" /> {course.students.toLocaleString()} students
                </div>
              }
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src={course.promo_video_url || course.imageUrl || 'https://picsum.photos/seed/courseplaceholder/1280/720'}
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
          {course.long_description && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this course</h2>
              <div className="prose dark:prose-invert max-w-none text-foreground/90">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{course.long_description}</ReactMarkdown>
              </div>
            </div>
          )}
          <Separator />

          {course.learning_objectives && course.learning_objectives.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">What you&apos;ll learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {course.learning_objectives.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            {(course.modules && course.modules.length > 0) ? (
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, index) => (
                  <AccordionItem value={`module-${module.id}`} key={module.id}>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      {module.title} ({module.lessons.length} lessons)
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {module.lessons.map(lesson => (
                          <li key={lesson.id} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                            <PlayCircle className="h-4 w-4 mr-2 text-primary/70" /> {lesson.title} ({lesson.content_type})
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">Course content and syllabus details are being finalized. Check back soon!</p>
            )}
          </div>
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">
                {course.price}
              </CardTitle>
              { course.price !== 'Free' && <CardDescription>One-time payment</CardDescription> }
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
                {course.duration_text && <li className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary" /> {course.duration_text} on-demand video</li>}
                {course.lessons_count && <li className="flex items-center"><BookOpen className="h-4 w-4 mr-2 text-primary" /> {course.lessons_count} lessons & articles</li>}
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

export function CourseDetailSkeleton() { // Keep for Suspense
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-8 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-48 w-full" />
        </div>
        <aside className="lg:col-span-1">
          <Skeleton className="h-96 w-full rounded-lg" />
        </aside>
      </div>
    </div>
  );
}
