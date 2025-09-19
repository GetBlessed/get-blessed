import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users } from "lucide-react";
import { useState } from "react";

interface PrayerCardProps {
  id: string;
  content: string;
  type: "prayer" | "blessing";
  author: string;
  supportCount: number;
  timeAgo: string;
  category?: string;
}

export const PrayerCard = ({ 
  content, 
  type, 
  author, 
  supportCount: initialSupportCount, 
  timeAgo,
  category 
}: PrayerCardProps) => {
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [hasSupported, setHasSupported] = useState(false);

  const handleSupport = () => {
    if (!hasSupported) {
      setSupportCount(prev => prev + 1);
      setHasSupported(true);
    }
  };

  return (
    <Card className={`p-6 transition-all duration-300 hover:shadow-medium ${
      type === 'prayer' 
        ? 'bg-gradient-prayer border-prayer/20' 
        : 'bg-gradient-blessing border-blessing/20'
    }`}>
      <div className="space-y-4">
        {/* Category Badge */}
        {category && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-soft text-primary">
            {category}
          </div>
        )}
        
        {/* Prayer Content */}
        <p className="text-foreground leading-relaxed font-medium">
          {content}
        </p>
        
        {/* Author & Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>— {author}</span>
          <span>{timeAgo}</span>
        </div>
        
        {/* Support Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSupport}
            className={`flex items-center gap-2 transition-colors ${
              hasSupported 
                ? 'text-primary bg-primary/10' 
                : 'hover:text-primary hover:bg-primary/5'
            }`}
            disabled={hasSupported}
          >
            <Heart className={`h-4 w-4 ${hasSupported ? 'fill-current' : ''}`} />
            <span className="font-medium">
              {hasSupported ? "You're with them" : "I'm with you!"}
            </span>
          </Button>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{supportCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};