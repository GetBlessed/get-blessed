import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users, Send, Gift, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface PrayerCardProps {
  id: string;
  content: string;
  type: "prayer" | "blessing";
  author: string;
  supportCount: number;
  timeAgo: string;
  category?: string;
  anonymous?: boolean;
  urgent?: boolean;
  onBehalfOf?: string;
  organizationType?: "individual" | "organization";
}

export const PrayerCard = ({ 
  content, 
  type, 
  author, 
  supportCount: initialSupportCount, 
  timeAgo,
  category,
  anonymous = false,
  urgent = false,
  onBehalfOf,
  organizationType = "individual"
}: PrayerCardProps) => {
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [prayingCount, setPrayingCount] = useState(Math.floor(Math.random() * 15) + 5);
  const [loveCount, setLoveCount] = useState(Math.floor(Math.random() * 10) + 2);
  const [hasSupported, setHasSupported] = useState(false);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [hasSentLove, setHasSentLove] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleSupport = () => {
    if (!hasSupported) {
      setSupportCount(prev => prev + 1);
      setHasSupported(true);
    }
  };

  const handlePraying = () => {
    if (!hasPrayed) {
      setPrayingCount(prev => prev + 1);
      setHasPrayed(true);
    }
  };

  const handleSendLove = () => {
    if (!hasSentLove) {
      setLoveCount(prev => prev + 1);
      setHasSentLove(true);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={`p-6 transition-all duration-300 hover:shadow-medium ${
      type === 'prayer' 
        ? 'bg-gradient-prayer border-prayer/20' 
        : 'bg-gradient-blessing border-blessing/20'
    } ${urgent ? 'ring-2 ring-red-400 ring-opacity-50' : ''}`}>
      <div className="space-y-4">
        {/* Header with Category Badge and Urgent Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {category && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-soft text-primary">
                {category}
              </div>
            )}
            {organizationType === "organization" && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Organization
              </div>
            )}
          </div>
          {urgent && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Urgent</span>
            </div>
          )}
        </div>
        
        {/* Prayer Content */}
        <p className="text-foreground leading-relaxed font-medium">
          {content}
        </p>

        {/* On Behalf Of */}
        {onBehalfOf && (
          <div className="text-sm text-muted-foreground italic">
            On behalf of: {onBehalfOf}
          </div>
        )}
        
        {/* Author & Time with Avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={anonymous ? "Anonymous" : author} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {anonymous ? "?" : getInitials(author)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">
                {anonymous ? "Anonymous" : author}
              </span>
              <span className="ml-2">{timeAgo}</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Support Actions */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between gap-2">
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
              <span className="text-xs font-medium">I'm with you!</span>
              <span className="text-xs">{supportCount}</span>
            </Button>
            
            {type === "prayer" && (
              <Button
                variant="ghost"
                size="sm" 
                onClick={handlePraying}
                className={`flex items-center gap-2 transition-colors ${
                  hasPrayed 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'hover:text-blue-600 hover:bg-blue-50'
                }`}
                disabled={hasPrayed}
              >
                <Users className={`h-4 w-4 ${hasPrayed ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">Praying for you</span>
                <span className="text-xs">{prayingCount}</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendLove}
              className={`flex items-center gap-2 transition-colors ${
                hasSentLove 
                  ? 'text-pink-600 bg-pink-50' 
                  : 'hover:text-pink-600 hover:bg-pink-50'
              }`}
              disabled={hasSentLove}
            >
              <Send className={`h-4 w-4 ${hasSentLove ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">Sending love</span>
              <span className="text-xs">{loveCount}</span>
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-primary hover:bg-primary/5"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Comment</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-green-600 hover:bg-green-50"
            >
              <Gift className="h-4 w-4" />
              <span className="text-xs font-medium">Send Gift</span>
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-foreground">Sarah M.</span>
                  <span className="text-muted-foreground ml-2">Sending prayers your way 🙏</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-foreground">Michael K.</span>
                  <span className="text-muted-foreground ml-2">You're in my thoughts</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm" variant="outline">Post</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};