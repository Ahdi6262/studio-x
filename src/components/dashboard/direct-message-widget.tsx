
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// Mock data for recent messages
const mockMessages = [
  { id: "msg-1", sender: "Jane Frontend", senderAvatar: "https://picsum.photos/seed/user2/40/40", snippet: "Hey, about that Next.js course...", time: "10m ago", unread: true },
  { id: "msg-2", sender: "System Admin", senderAvatar: "https://picsum.photos/seed/admin/40/40", snippet: "Welcome to the platform! Check out these resources...", time: "1h ago", unread: false },
];

export function DirectMessageWidget() {
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
        {mockMessages.length > 0 ? (
          <ul className="space-y-3 mb-4">
            {mockMessages.map(msg => (
              <li key={msg.id} className={`flex items-center space-x-3 p-2 rounded-md hover:bg-secondary/50 ${msg.unread ? 'bg-primary/5' : ''}`}>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={msg.senderAvatar} alt={msg.sender} data-ai-hint="user message avatar"/>
                  <AvatarFallback>{msg.sender.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${msg.unread ? 'text-primary' : 'text-foreground'}`}>{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.snippet}</p>
                </div>
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
