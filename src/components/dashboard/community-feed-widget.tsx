
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, FileText, BookOpen, MessageCircle, Rss } from "lucide-react"; // Added Rss as default
import Link from "next/link";
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedItem {
  id: string;
  user_id: string; // User who performed the action
  user_name?: string; // Denormalized or fetched
  user_avatar_url?: string; // Denormalized or fetched
  event_type: string; // e.g., 'course_enrollment', 'project_created'
  event_data: { // Contextual data
    course_id?: string;
    course_title?: string;
    project_id?: string;
    project_title?: string;
    forum_post_title?: string; // Example for forum
    // Add other relevant fields based on event_type
  };
  timestamp: any; // Firestore Timestamp
}

const getIconForType = (type: string) => {
  switch (type) {
    case "project_created":
    case "project_contribution":
      return <FileText className="h-4 w-4 text-primary" />;
    case "course_enrollment":
    case "lesson_completed":
      return <BookOpen className="h-4 w-4 text-green-500" />;
    case "forum_post": // Assuming this event_type
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    default:
      return <Rss className="h-4 w-4 text-muted-foreground" />; // Generic feed icon
  }
};

const getLinkForEvent = (item: FeedItem): string => {
    switch (item.event_type) {
        case "project_created":
        case "project_contribution":
            return item.event_data.project_id ? `/portfolio/${item.event_data.project_id}` : "#";
        case "course_enrollment":
        case "lesson_completed":
            return item.event_data.course_id ? `/courses/${item.event_data.course_id}` : "#";
        // Add cases for other event types like forum posts
        default:
            return "#";
    }
}

const formatEventTitle = (item: FeedItem): string => {
    switch (item.event_type) {
        case "project_created":
            return item.event_data.project_title || "a new project";
        case "project_contribution":
            return `contribution to ${item.event_data.project_title || "a project"}`;
        case "course_enrollment":
            return item.event_data.course_title || "a new course";
        case "lesson_completed":
            return `lesson in ${item.event_data.course_title || "a course"}`;
        // Add cases for other event types
        default:
            return "an activity";
    }
}

const getEventActionText = (type: string): string => {
    switch (type) {
        case "project_created": return "created";
        case "project_contribution": return "contributed to";
        case "course_enrollment": return "enrolled in";
        case "lesson_completed": return "completed a lesson in";
        default: return "performed";
    }
}


export function CommunityFeedWidget() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedItems = async () => {
      setIsLoading(true);
      try {
        const activityCol = collection(db, 'user_activity_events');
        // Fetch recent 5-10 items, ordered by timestamp
        const q = query(activityCol, orderBy("timestamp", "desc"), limit(5));
        const activitySnapshot = await getDocs(q);

        const itemsPromises = activitySnapshot.docs.map(async (activityDoc) => {
          const data = activityDoc.data() as Omit<FeedItem, 'id' | 'user_name' | 'user_avatar_url'>;
          
          // Fetch user details for avatar and name
          let userName = "User";
          let userAvatar = "";
          if (data.user_id) {
            const userRef = doc(db, 'users', data.user_id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              userName = userSnap.data().name || "User";
              userAvatar = userSnap.data().avatar_url || "";
            }
          }
          
          return {
            id: activityDoc.id,
            ...data,
            user_name: userName,
            user_avatar_url: userAvatar,
            timestamp: data.timestamp.toDate() // Convert Firestore Timestamp to JS Date
          } as FeedItem;
        });

        const resolvedItems = await Promise.all(itemsPromises);
        setFeedItems(resolvedItems);

      } catch (error) {
        console.error("Error fetching community feed:", error);
      }
      setIsLoading(false);
    };

    fetchFeedItems();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Community Buzz</CardTitle>
          <CardDescription>Loading latest happenings...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="h-8 w-8 rounded-full mt-1" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Community Buzz
        </CardTitle>
        <CardDescription>Latest happenings from the HEX THE ADD HUB community.</CardDescription>
      </CardHeader>
      <CardContent>
        {feedItems.length > 0 ? (
          <ul className="space-y-4">
            {feedItems.map(item => (
              <li key={item.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={item.user_avatar_url} alt={item.user_name || 'User'} data-ai-hint="user avatar community"/>
                  <AvatarFallback>{(item.user_name || "U").substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{item.user_name || 'A user'}</span>
                    {` ${getEventActionText(item.event_type)} `}
                    <Link href={getLinkForEvent(item)} className="text-primary hover:underline">
                      {formatEventTitle(item)}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {getIconForType(item.event_type)}
                    <span className="ml-1">{item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {item.timestamp.toLocaleDateString()}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>The community is quiet right now. Be the first to make some noise!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
