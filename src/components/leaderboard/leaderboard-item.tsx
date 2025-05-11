import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { LeaderboardUser } from '@/lib/mock-data';
import { Trophy, Award, Sparkles } from 'lucide-react';
import React from 'react';

interface LeaderboardItemProps {
  user: LeaderboardUser;
  isCurrentUser?: boolean;
}

export const LeaderboardItem = React.memo(function LeaderboardItem({ user, isCurrentUser = false }: LeaderboardItemProps) {
  const rankColor = () => {
    if (user.rank === 1) return 'text-yellow-400';
    if (user.rank === 2) return 'text-gray-400';
    if (user.rank === 3) return 'text-orange-400';
    return 'text-muted-foreground';
  };

  const rankIcon = () => {
    if (user.rank === 1) return <Trophy className="h-5 w-5 fill-yellow-400 text-yellow-500" />;
    if (user.rank === 2) return <Award className="h-5 w-5 fill-gray-400 text-gray-500" />;
    if (user.rank === 3) return <Sparkles className="h-5 w-5 fill-orange-400 text-orange-500" />;
    return <span className={`font-semibold ${rankColor()}`}>{user.rank}</span>;
  };

  const fallbackName = user.name ? user.name.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className={`flex items-center p-4 rounded-lg transition-colors ${isCurrentUser ? 'bg-primary/10 shadow-md' : 'bg-card hover:bg-secondary/50'}`}>
      <div className={`w-10 text-center text-lg font-bold ${rankColor()}`}>
        {rankIcon()}
      </div>
      <div className="flex items-center flex-1 ml-4">
        <Avatar className="h-12 w-12 mr-4 border-2 border-primary/50">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile user avatar" />
          <AvatarFallback>{fallbackName}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.achievements.slice(0, 2).map(ach => (
              <Badge key={ach} variant="outline" className="text-xs">{ach}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-primary">{user.points.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Points</p>
      </div>
    </div>
  );
});

LeaderboardItem.displayName = 'LeaderboardItem';
