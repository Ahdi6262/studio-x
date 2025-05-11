
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, ExternalLink, BookOpenText, FolderGit2, Users, MessageCircle } from "lucide-react";
import { getDashboardRecommendations, type DashboardRecommendationsOutput } from "@/ai/flows/dashboard-recommendations-flow";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to map recommendation type to an icon
const RecommendationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'course': return <BookOpenText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
    case 'project': return <FolderGit2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />;
    case 'user_to_connect': return <Users className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />;
    case 'community_content': return <MessageCircle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />;
    case 'feature_tip': return <Lightbulb className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />;
    default: return <Sparkles className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />;
  }
};


export function RecommendationsWidget() {
  const { user } = useAuth();
  const [recommendationsData, setRecommendationsData] = useState<DashboardRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!user?.uid) {
      // Don't set error if user is not yet loaded/authenticated
      // setError("User not authenticated."); 
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboardRecommendations(user.uid); 
      setRecommendationsData(result);
    } catch (err: any) {
      console.error("Failed to get recommendations:", err);
      setError(err.message || "Failed to load recommendations.");
      setRecommendationsData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.uid) {
      fetchRecommendations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          Recommended for You
        </CardTitle>
        <CardDescription>Personalized suggestions to help you grow and connect. Powered by Genkit AI.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 bg-secondary/30 rounded-md space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-3 w-1/2 mt-1" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && error && (
          <div className="text-center py-6 text-destructive">
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && recommendationsData && recommendationsData.recommendations.length > 0 && (
          <>
            <ul className="space-y-3">
              {recommendationsData.recommendations.map(rec => (
                <li key={rec.itemId || rec.title} className="p-3 bg-secondary/50 rounded-md hover:bg-secondary/70 transition-colors">
                  <div className="flex items-start">
                    <RecommendationIcon type={rec.type} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground flex items-center">
                        {rec.link ? (
                          <Link href={rec.link} passHref legacyBehavior>
                            <a target={rec.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="hover:underline">
                              {rec.title} <ExternalLink className="inline-block h-3 w-3 ml-1" />
                            </a>
                          </Link>
                        ) : (
                          rec.title
                        )}
                        <span className="ml-2 text-xs text-muted-foreground">({rec.type})</span>
                      </h4>
                      {rec.description && <p className="text-sm text-muted-foreground mt-0.5">{rec.description}</p>}
                      {rec.reason && <p className="text-xs text-primary/80 mt-1 italic">Reason: {rec.reason}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {recommendationsData.explanation && <p className="text-xs text-muted-foreground mt-4 italic">AI Explanation: {recommendationsData.explanation}</p>}
          </>
        )}
        {!isLoading && !error && (!recommendationsData || recommendationsData.recommendations.length === 0) && (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recommendations available yet. Engage more to get personalized suggestions!</p>
          </div>
        )}
        <Button onClick={fetchRecommendations} className="mt-4 w-full" variant="outline" disabled={isLoading || !user?.uid}>
          <Sparkles className="mr-2 h-4 w-4" /> {isLoading ? 'Refreshing...' : 'Get Fresh Recommendations'}
        </Button>
      </CardContent>
    </Card>
  );
}
