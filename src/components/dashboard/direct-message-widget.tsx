"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageSnippet {
  id: string; // Conversation ID
  other_user_id: string;
  other_user_name?: string;
  other_user_avatar_url?: string;
  last_message_snippet: string;
  last_message_timestamp: any; // Firestore Timestamp
  unread_count?: number; // From unread_counts map in schema
}

interface DirectMessageWidgetProps {
  userId: string;
}

export function DirectMessageWidget({ userId }: DirectMessageWidgetProps) {
  const [messages, setMessages] = useState<MessageSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const conversationsCol = collection(db, 'direct_messages');
        // Query conversations where the current user is a participant
        const q = query(
          conversationsCol,
          where("participants", "array-contains", userId),
          orderBy("last_message_timestamp", "desc"),
          limit(5) // Fetch recent 5 conversations
        );
        const conversationsSnap = await getDocs(q);

        const messageSnippetsPromises = conversationsSnap.docs.map(async (convDoc) => {
          const conversation = convDoc.data();
          const otherUserId = conversation.participants.find((pId: string) => pId !== userId);
          
          let otherUserName = "User";
          let otherUserAvatar = "";

          if (otherUserId) {
            const userRef = doc(db, 'users', otherUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              otherUserName = userSnap.data().name || "User";
              otherUserAvatar = userSnap.data().avatar_url || "";
            }
          }
          
          return {
            id: convDoc.id,
            other_user_id: otherUserId || "",
            other_user_name: otherUserName,
            other_user_avatar_url: otherUserAvatar,
            last_message_snippet: conversation.last_message_snippet || "No messages yet.",
            last_message_timestamp: conversation.last_message_timestamp?.toDate(), // Convert to JS Date
            unread_count: conversation.unread_counts?.[userId] || 0, // Get unread count for current user
          };
        });

        const resolvedSnippets = await Promise.all(messageSnippetsPromises);
        setMessages(resolvedSnippets.filter(snippet => snippet.other_user_id)); // Ensure other user exists

      } catch (error) {
        console.error("Error fetching direct messages:", error);
      }
      setIsLoading(false);
    };

    fetchMessages();
  }, [userId]);

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
              <li key={msg.id} className={`flex items-center space-x-3 p-2 rounded-md hover:bg-secondary/50 ${msg.unread_count &amp;&amp; msg.unread_count > 0 ? 'bg-primary/5' : ''}`}>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={msg.other_user_avatar_url} alt={msg.other_user_name || 'User'} data-ai-hint="user message avatar"/>
                  <AvatarFallback>{(msg.other_user_name || "U").substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${msg.unread_count &amp;&amp; msg.unread_count > 0 ? 'text-primary' : 'text-foreground'}`}>{msg.other_user_name || 'User'}</span>
                    {msg.last_message_timestamp &amp;&amp; <span className="text-xs text-muted-foreground">{msg.last_message_timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.last_message_snippet}</p>
                </div>
                {msg.unread_count &amp;&amp; msg.unread_count > 0 &amp;&amp; (
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

