
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, FileText, BookOpen, MessageCircle, Rss } from "lucide-react";
import Link from "next/link";
// Firebase imports removed
// import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

// This structure matches the formatted output of /api/users/[userId]/activity-events
interface FormattedActivityEvent {
  type: string;
  data: Record<string, any>;
  timestamp: string; // ISO String
}

// This will be the internal structure after fetching user details
interface EnrichedFeedItem extends FormattedActivityEvent {
  id: string; // We'll use a unique key, perhaps combining user_id and timestamp or using _id from MongoDB if available
  user_id?: string; // Extracted if event_data contains it or if API provides it separately
  user_name?: string;
  user_avatar_url?: string;
}


const getIconForType = (type: string) => {
  switch (type) {
    case "project_created":
    case "project_contribution":
      return <FileText className="h-4 w-4 text-primary" />;
    case "course_enrollment":
    case "lesson_completed":
      return <BookOpen className="h-4 w-4 text-green-500" />;
    case "forum_post":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    default:
      return <Rss className="h-4 w-4 text-muted-foreground" />;
  }
};

const getLinkForEvent = (item: EnrichedFeedItem): string => {
    switch (item.type) {
        case "project_created":
        case "project_contribution":
            return item.data.project_id ? `/portfolio/${item.data.project_id}` : "#";
        case "course_enrollment":
        case "lesson_completed":
            return item.data.course_id ? `/courses/${item.data.course_id}` : "#";
        default:
            return "#";
    }
}

const formatEventTitle = (item: EnrichedFeedItem): string => {
    switch (item.type) {
        case "project_created":
            return item.data.project_title || "a new project";
        case "project_contribution":
            return `contribution to ${item.data.project_title || "a project"}`;
        case "course_enrollment":
            return item.data.course_title || "a new course";
        case "lesson_completed":
            return `lesson in ${item.data.course_title || "a course"}`;
        default:
             return item.data.summary || "an activity"; // Generic fallback
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

interface CommunityFeedWidgetProps {
  userId: string; // For fetching global feed, not specific user's feed (unless that's the intent)
                  // For a "global" feed, this prop might not be used in fetch, or API ignores it.
}


export function CommunityFeedWidget({ userId }: CommunityFeedWidgetProps) {
  const [feedItems, setFeedItems] = useState<EnrichedFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For a community feed, you'd typically fetch global activities, not just for one user.
  // The /api/users/[userId]/activity-events is for a specific user.
  // Let's assume for now we want a specific user's feed, or a generic one.
  // If it's a generic community feed, the API endpoint should be different (e.g., /api/activity-events)

  const fetchFeedItemsFromAPI = useCallback(async () => {
    setIsLoading(true);
    try {
      // If it's a global feed, the API should not require userId or should handle it
      // For now, using the user-specific one as per current setup.
      const response = await fetch(`/api/users/${userId}/activity-events?limit=5`); 
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: response.statusText}));
        throw new Error(`Failed to fetch activity feed: ${errorData.message}`);
      }
      const rawEvents: FormattedActivityEvent[] = await response.json();

      // Enrich events with user details if necessary (API should ideally provide this)
      // This is a simplified enrichment. In a real scenario, the API would join user data.
      const enrichedItems: EnrichedFeedItem[] = await Promise.all(rawEvents.map(async (event, index) => {
        let userName = "User";
        let userAvatar = "";
        let eventUserId = event.data.user_id || userId; // Prioritize user_id from event_data if available

        // This part is a placeholder for fetching user data if your activity API doesn't provide it.
        // Ideally, /api/activity-events (if global) would return events already enriched.
        if (eventUserId) {
            // Example: const userProfile = await fetchUserProfileFromAPI(eventUserId);
            // userName = userProfile?.name || "User"; userAvatar = userProfile?.avatar_url || "";
            // For now, we'll use the current dashboard user's info as a placeholder for actor if not in event
            if (eventUserId === userId && feedItems.find(fi => fi.user_id === userId)) { // Assuming this user has an entry
                const currentUserData = feedItems.find(fi => fi.user_id === userId);
                userName = currentUserData?.user_name || "User";
                userAvatar = currentUserData?.user_avatar_url || "";
            } else {
                // If it's a different user's activity, you'd fetch their profile.
                // This part is complex for a simple widget and usually handled by backend.
                // Let's assume for now, event.data might have actor_name, actor_avatar.
                 userName = event.data.actor_name || "Another User";
                 userAvatar = event.data.actor_avatar_url || "";
            }
        }

        return {
          ...event,
          id: `${eventUserId}-${event.timestamp}-${index}`, // Basic unique ID
          user_id: eventUserId,
          user_name: userName,
          user_avatar_url: userAvatar,
          timestamp: event.timestamp, // Already ISO string
        };
      }));
      
      setFeedItems(enrichedItems);

    } catch (error) {
      console.error("Error fetching community feed from API:", error);
      setFeedItems([]);
    }
    setIsLoading(false);
  }, [userId, feedItems]); // Added feedItems to deps for placeholder name logic, might cause loop if not careful

  useEffect(() => {
    fetchFeedItemsFromAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Fetch only when userId changes, or use a different trigger for global feed


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
                    {` ${getEventActionText(item.type)} `}
                    <Link href={getLinkForEvent(item)} className="text-primary hover:underline">
                      {formatEventTitle(item)}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {getIconForType(item.type)}
                    <span className="ml-1">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(item.timestamp).toLocaleDateString()}</span>
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
