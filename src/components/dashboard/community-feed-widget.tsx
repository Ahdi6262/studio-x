
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, FileText, BookOpen, MessageCircle } from "lucide-react"; // Added MessageCircle
import Link from "next/link";

// Mock data for community feed
const mockFeedItems = [
  { id: "feed-1", type: "new_project", user: "Alice Wonderland", userAvatar: "https://picsum.photos/seed/user1/40/40", title: "Launched 'EcoNFTs'", link: "/portfolio/1", time: "2h ago" },
  { id: "feed-2", type: "course_completion", user: "Bob The Builder", userAvatar: "https://picsum.photos/seed/user2/40/40", title: "Completed 'Advanced Next.js'", link: "/courses/2", time: "5h ago" },
  { id: "feed-3", type: "forum_post", user: "Charlie Crypto", userAvatar: "https://picsum.photos/seed/user3/40/40", title: "Started discussion on 'Future of DAOs'", link: "/forum/123", time: "1d ago" },
];

const getIconForType = (type: string) => {
  switch (type) {
    case "new_project":
      return <FileText className="h-4 w-4 text-primary" />;
    case "course_completion":
      return <BookOpen className="h-4 w-4 text-green-500" />;
    case "forum_post":
      return <MessageCircle className="h-4 w-4 text-blue-500" />; // Changed icon
    default:
      return <Users className="h-4 w-4 text-muted-foreground" />;
  }
};

export function CommunityFeedWidget() {
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
        {mockFeedItems.length > 0 ? (
          <ul className="space-y-4">
            {mockFeedItems.map(item => (
              <li key={item.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={item.userAvatar} alt={item.user} data-ai-hint="user avatar community"/>
                  <AvatarFallback>{item.user.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{item.user}</span>
                    {item.type === "new_project" && " launched a new project: "}
                    {item.type === "course_completion" && " completed course: "}
                    {item.type === "forum_post" && " posted in forum: "}
                    <Link href={item.link} className="text-primary hover:underline">
                      {item.title}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {getIconForType(item.type)}
                    <span className="ml-1">{item.time}</span>
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
