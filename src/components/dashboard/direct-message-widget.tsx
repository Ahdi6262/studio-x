
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
// Firebase imports removed. Direct Message functionality via API is complex and not yet built.
// import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageSnippet {
  id: string; 
  other_user_id: string;
  other_user_name?: string;
  other_user_avatar_url?: string;
  last_message_snippet: string;
  last_message_timestamp: Date; // JS Date object
  unread_count?: number;
}

interface DirectMessageWidgetProps {
  userId: string;
}

// Placeholder fetch function as DM API is not ready
async function fetchMessagesFromAPI(userId: string): Promise<MessageSnippet[]> {
  console.warn("Direct Message API not implemented. Using placeholder data.");
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: "conv1",
      other_user_id: "user2",
      other_user_name: "Alice Wonderland",
      other_user_avatar_url: "https://picsum.photos/seed/alice/40/40",
      last_message_snippet: "Hey, saw your new project, looks great!",
      last_message_timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      unread_count: 2,
    },
    {
      id: "conv2",
      other_user_id: "user3",
      other_user_name: "Bob The Builder",
      other_user_avatar_url: "https://picsum.photos/seed/bob/40/40",
      last_message_snippet: "Sure, I can help with that. When are you free?",
      last_message_timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unread_count: 0,
    },
  ];
}


export function DirectMessageWidget({ userId }: DirectMessageWidgetProps) {
  const [messages, setMessages] = useState<MessageSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMessages = useCallback(async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedMessages = await fetchMessagesFromAPI(userId); // Using placeholder
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching direct messages:", error);
        setMessages([]);
      }
      setIsLoading(false);
  }, [userId]);
  
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary" /> Direct Messages</CardTitle>
          <CardDescription>Loading your recent conversations...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 mb-4">
           {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-primary" />
          Direct Messages
        </CardTitle>
        <CardDescription>Your recent conversations. Full messaging feature coming soon!</CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length > 0 ? (
          <ul className="space-y-3 mb-4">
            {messages.map(msg => (
              <li key={msg.id} className={`flex items-center space-x-3 p-2 rounded-md hover:bg-secondary/50 ${msg.unread_count && msg.unread_count > 0 ? 'bg-primary/5' : ''}`}>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={msg.other_user_avatar_url} alt={msg.other_user_name || 'User'} data-ai-hint="user message avatar"/>
                  <AvatarFallback>{(msg.other_user_name || "U").substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${msg.unread_count && msg.unread_count > 0 ? 'text-primary' : 'text-foreground'}`}>{msg.other_user_name || 'User'}</span>
                    {msg.last_message_timestamp && <span className="text-xs text-muted-foreground">{msg.last_message_timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.last_message_snippet}</p>
                </div>
                {msg.unread_count && msg.unread_count > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground font-semibold px-1.5 py-0.5 rounded-full">{msg.unread_count}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No messages yet.</p>
          </div>
        )}
        <div className="flex space-x-2">
          <Input placeholder="Type a message to search user..." className="flex-1" disabled />
          <Button size="icon" disabled>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Full chat functionality is under development.</p>
      </CardContent>
    </Card>
  );
}
