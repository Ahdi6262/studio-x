
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles } from "lucide-react";

// Mock data for recommendations
const mockRecommendations = [
  { id: "course-rec-1", type: "Course", title: "Advanced Solidity Masterclass", reason: "Based on your interest in Blockchain." },
  { id: "project-rec-1", type: "Project", title: "DeFi Lending Protocol", reason: "Relevant to your project 'Decentralized Art Marketplace'." },
  { id: "user-rec-1", type: "User", title: "Jane Frontend", reason: "Works on similar Web3 projects." },
];

export function RecommendationsWidget() {
  const handleGetRecommendations = async () => {
    // Placeholder for actual Genkit flow call
    alert("Fetching fresh recommendations... (Genkit flow integration coming soon!)");
    // In a real app:
    // try {
    //   const recommendations = await getDashboardRecommendations({ userId: 'currentUserId', userActivity: {} });
    //   // Update state with recommendations
    // } catch (error) {
    //   console.error("Failed to get recommendations:", error);
    //   // Show error toast
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          Recommended for You
        </CardTitle>
        <CardDescription>Personalized suggestions to help you grow and connect.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockRecommendations.length > 0 ? (
          <ul className="space-y-3">
            {mockRecommendations.map(rec => (
              <li key={rec.id} className="p-3 bg-secondary/50 rounded-md">
                <h4 className="font-semibold text-foreground">{rec.title} <span className="text-xs text-muted-foreground">({rec.type})</span></h4>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recommendations available yet. Engage more to get personalized suggestions!</p>
          </div>
        )}
        <Button onClick={handleGetRecommendations} className="mt-4 w-full" variant="outline">
          <Sparkles className="mr-2 h-4 w-4" /> Get Fresh Recommendations
        </Button>
         <p className="text-xs text-muted-foreground mt-2 text-center">Powered by Genkit AI</p>
      </CardContent>
    </Card>
  );
}
