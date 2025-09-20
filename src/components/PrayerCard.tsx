import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users, Send, Gift, AlertCircle, Share2 } from "lucide-react";
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
  id,
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
  const [comments, setComments] = useState([
    { id: 1, author: "Sarah M.", text: "Sending prayers your way 🙏", timeAgo: "5m ago" },
    { id: 2, author: "Michael K.", text: "You're in my thoughts", timeAgo: "12m ago" }
  ]);
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
    
    const comment = {
      id: Date.now(),
      author: "You",
      text: newComment.trim(),
      timeAgo: "Just now"
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment("");
    
    toast({
      title: "Comment added! 💬",
      description: "Your comment has been shared.",
    });
  };

  const handleCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(e);
    }
  };

  const handleShare = async () => {
    console.log('=== SHARE FUNCTION CALLED ===');
    console.log('Prayer data for sharing:', { 
      id, content: content.substring(0, 50), type, author, anonymous, 
      supportCount, timeAgo, category, urgent, onBehalfOf, organizationType, image 
    });
    
    // Encode prayer data in URL for cross-domain sharing
    const prayerData = {
      id,
      content,
      type,
      author: anonymous ? "Anonymous" : author,
      supportCount,
      timeAgo,
      category,
      anonymous,
      urgent,
      onBehalfOf: onBehalfOf || "",
      organizationType,
      image: image || undefined
    };
    
    console.log('Prepared prayer data:', prayerData);
    
    // Encode the prayer data as base64 URL parameter
    const jsonString = JSON.stringify(prayerData);
    console.log('JSON string length:', jsonString.length);
    
    const encodedData = btoa(jsonString);
    console.log('Encoded data length:', encodedData.length);
    console.log('Encoded data preview:', encodedData.substring(0, 100) + '...');
    
    const shareUrl = `${window.location.origin}/${type}/${id}?data=${encodedData}`;
    const shareText = `Sharing a ${type} with you: ${shareUrl}`;
    
    console.log('Final share URL:', shareUrl);
    console.log('URL length:', shareUrl.length);
    
    // Try native Web Share API first (works better on mobile)
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `Shared ${type}`,
          text: `Someone shared a ${type} with you`,
          url: shareUrl,
        });
        toast({
          title: "Shared! 📱",
          description: "Link shared successfully.",
        });
        console.log('Share URL shared using Web Share API');
        return;
      } catch (shareErr) {
        console.log('Web Share API failed or cancelled:', shareErr);
        // Continue to clipboard methods
      }
    }
    
    // Try clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Link copied! 🔗",
          description: "Share this with others to spread the love.",
        });
        console.log('Share URL copied to clipboard successfully');
        return;
      } catch (clipboardErr) {
        console.error('Clipboard API failed:', clipboardErr);
        // Continue to fallback
      }
    }
    
    // Fallback method with better error detection
    try {
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast({
          title: "Link copied! 🔗",
          description: "Share this with others to spread the love.",
        });
        console.log('Share URL copied using fallback method');
      } else {
        throw new Error('execCommand returned false');
      }
    } catch (fallbackErr) {
      console.error('All clipboard methods failed:', fallbackErr);
      
      // Show the URL in a dialog as last resort
      const userCopy = prompt(`Copy this ${type} link to share:\n\n(Tap and hold to select all, then copy)`, shareUrl);
      
      if (userCopy !== null) {
        toast({
          title: "Please copy manually 📋",
          description: "Select and copy the link that was shown.",
        });
      } else {
        toast({
          title: "Share failed ❌",
          description: "Unable to copy link. Try using a different browser.",
          variant: "destructive"
        });
      }
    }
    console.log('=== SHARE FUNCTION COMPLETED ===');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={`p-6 transition-all duration-300 hover:shadow-medium rounded-2xl ${
      type === 'prayer' 
        ? 'bg-gradient-prayer border-prayer/30' 
        : 'bg-gradient-blessing border-blessing/30'
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
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                Organization
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
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
        <p className="text-foreground leading-relaxed font-medium break-words hyphens-auto overflow-wrap-anywhere">
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
        <div className="space-y-3 pt-4 border-t border-border/30">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSupport}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 text-xs w-full ${
                hasSupported 
                  ? 'text-primary bg-primary/10 animate-celebrate shadow-sm' 
                  : 'hover:text-primary hover:bg-primary/5 hover:shadow-sm'
              }`}
            >
              <Heart className={`h-4 w-4 transition-all ${hasSupported ? 'fill-current animate-heart-beat' : ''}`} />
              <span className="font-medium truncate">
                {type === "prayer" ? "Here with you" : "Holding you"}
              </span>
              <span className="font-semibold">{supportCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm" 
              onClick={handlePraying}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 text-xs w-full ${
                hasPrayed 
                  ? 'text-blue-600 bg-blue-50 animate-bounce-gentle shadow-sm' 
                  : 'hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm'
              }`}
            >
              <Users className={`h-4 w-4 ${hasPrayed ? 'fill-current' : ''}`} />
              <span className="font-medium truncate">
                {type === "prayer" ? "Praying" : "Cheering"}
              </span>
              <span className="font-semibold">{prayingCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendLove}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 text-xs w-full ${
                hasSentLove 
                  ? 'text-pink-600 bg-pink-50 animate-pulse-love shadow-sm' 
                  : 'hover:text-pink-600 hover:bg-pink-50 hover:shadow-sm'
              }`}
            >
              <Send className={`h-4 w-4 ${hasSentLove ? 'fill-current' : ''}`} />
              <span className="font-medium truncate">
                {type === "prayer" ? "Love" : "Strength"}
              </span>
              <span className="font-semibold">{loveCount}</span>
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center justify-center gap-1 px-2 py-2.5 rounded-xl hover:text-primary hover:bg-primary/5 hover:shadow-sm transition-all text-xs w-full"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center justify-center gap-1 px-2 py-2.5 rounded-xl hover:text-purple-600 hover:bg-purple-50 hover:shadow-sm transition-all text-xs w-full"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-medium">Share</span>
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGiftOptions(!showGiftOptions)}
                className="flex items-center justify-center gap-1 px-2 py-2.5 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm transition-all text-xs w-full"
              >
                <Gift className="h-4 w-4" />
                <span className="font-medium">Gift</span>
              </Button>
              
              {showGiftOptions && (
                <div className="absolute bottom-full mb-2 left-0 bg-card border border-border/50 rounded-xl shadow-elevated p-2 space-y-1 min-w-[160px] z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGift("$5 Coffee")}
                    className="w-full justify-start text-xs rounded-lg hover:bg-muted/50"
                  >
                    ☕ $5 Coffee
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGift("$10 Meal")}
                    className="w-full justify-start text-xs rounded-lg hover:bg-muted/50"
                  >
                    🍽️ $10 Meal
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGift("Charity Donation")}
                    className="w-full justify-start text-xs rounded-lg hover:bg-muted/50"
                  >
                    💝 Charity Donation
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 p-4 bg-muted/20 rounded-xl border border-border/30">
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 p-3 bg-background/60 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {comment.author === "You" ? "You" : comment.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleCommentKeyPress}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-border/50 bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
                <Button type="submit" size="sm" className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  Post
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};