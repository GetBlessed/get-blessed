import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users, Send, Gift, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  image?: string;
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
  organizationType = "individual",
  image
}: PrayerCardProps) => {
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [prayingCount, setPrayingCount] = useState(Math.floor(Math.random() * 15) + 5);
  const [loveCount, setLoveCount] = useState(Math.floor(Math.random() * 10) + 2);
  const [hasSupported, setHasSupported] = useState(false);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [hasSentLove, setHasSentLove] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showGiftOptions, setShowGiftOptions] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleSupport = () => {
    if (hasSupported) {
      setSupportCount(prev => prev - 1);
      setHasSupported(false);
    } else {
      setSupportCount(prev => prev + 1);
      setHasSupported(true);
      toast({
        title: "Support sent! 💙",
        description: "Your support means the world to them.",
      });
    }
  };

  const handlePraying = () => {
    if (hasPrayed) {
      setPrayingCount(prev => prev - 1);
      setHasPrayed(false);
    } else {
      setPrayingCount(prev => prev + 1);
      setHasPrayed(true);
      toast({
        title: "Prayer sent! 🙏",
        description: "Your prayers are lifting them up.",
      });
    }
  };

  const handleSendLove = () => {
    if (hasSentLove) {
      setLoveCount(prev => prev - 1);
      setHasSentLove(false);
    } else {
      setLoveCount(prev => prev + 1);
      setHasSentLove(true);
      toast({
        title: "Love sent! ❤️",
        description: "Your love is spreading hope.",
      });
    }
  };

  const handleGift = (giftType: string) => {
    toast({
      title: `${giftType} sent! 🎁`,
      description: "Your generosity will make a difference.",
    });
    setShowGiftOptions(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment added! 💬",
      description: "Your comment has been shared.",
    });
    setNewComment("");
  };

  const handleCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(e);
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
    }`}>
      <div className="space-y-4">
        {/* Header with Category Badge and Urgent Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {category && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-soft text-primary">
                {category}
              </div>
            )}
            {organizationType === "organization" ? (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Organization
              </div>
            ) : (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Individual
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

        {/* Image Display */}
        {image && (
          <div className="mt-3">
            <img 
              src={image} 
              alt="Prayer/blessing image" 
              className="w-full max-h-64 object-cover rounded-lg border border-border/50"
            />
          </div>
        )}

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
              className={`flex items-center gap-2 transition-all duration-300 ${
                hasSupported 
                  ? 'text-primary bg-primary/10 animate-celebrate' 
                  : 'hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Heart className={`h-4 w-4 transition-all ${hasSupported ? 'fill-current animate-heart-beat' : ''}`} />
              <span className="text-xs font-medium">I'm with you!</span>
              <span className="text-xs">{supportCount}</span>
            </Button>
            
            {type === "prayer" && (
              <Button
                variant="ghost"
                size="sm" 
                onClick={handlePraying}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  hasPrayed 
                    ? 'text-blue-600 bg-blue-50 animate-bounce-gentle' 
                    : 'hover:text-blue-600 hover:bg-blue-50'
                }`}
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
              className={`flex items-center gap-2 transition-all duration-300 ${
                hasSentLove 
                  ? 'text-pink-600 bg-pink-50 animate-pulse-love' 
                  : 'hover:text-pink-600 hover:bg-pink-50'
              }`}
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
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGiftOptions(!showGiftOptions)}
                className="flex items-center gap-2 hover:text-green-600 hover:bg-green-50"
              >
                <Gift className="h-4 w-4" />
                <span className="text-xs font-medium">Send Gift</span>
              </Button>
              
              {showGiftOptions && (
                <div className="absolute bottom-full mb-2 left-0 bg-background border border-border rounded-lg shadow-lg p-2 space-y-1 min-w-[140px] z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGift("$5 Coffee")}
                    className="w-full justify-start text-xs"
                  >
                    ☕ $5 Coffee
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGift("$10 Meal")}
                    className="w-full justify-start text-xs"
                  >
                    🍽️ $10 Meal
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGift("Charity Donation")}
                    className="w-full justify-start text-xs"
                  >
                    💝 Charity Donation
                  </Button>
                </div>
              )}
            </div>
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
                <form onSubmit={handleAddComment} className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleCommentKeyPress}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button type="submit" size="sm" variant="outline">Post</Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};