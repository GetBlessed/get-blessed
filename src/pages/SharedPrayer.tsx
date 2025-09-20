import { useParams, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users, Send, Gift, AlertCircle, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthModal } from "@/components/AuthModal";
import { Link } from "react-router-dom";

// Mock data - in a real app this would come from an API
const mockPrayers = {
  "1": {
    id: "1",
    content: "Going through a difficult time with my health. Would appreciate prayers for strength and healing during my treatment journey.",
    type: "prayer" as const,
    author: "Sarah M.",
    supportCount: 24,
    timeAgo: "2 hours ago",
    category: "Health",
    anonymous: false,
    urgent: true,
    organizationType: "individual" as const,
  },
  "2": {
    id: "2",
    content: "Grateful for the wonderful news about my sister's recovery. Sending blessings to everyone who supported us during this time.",
    type: "blessing" as const,
    author: "Michael K.",
    supportCount: 18,
    timeAgo: "4 hours ago",
    category: "Gratitude",
    anonymous: false,
    urgent: false,
    onBehalfOf: "My sister",
    organizationType: "individual" as const,
  },
  "3": {
    id: "3",
    content: "Starting a new job next week and feeling nervous. Prayers for confidence and wisdom would mean the world to me.",
    type: "prayer" as const,
    author: "David L.",
    supportCount: 31,
    timeAgo: "6 hours ago",
    category: "Work",
    anonymous: false,
    urgent: false,
    organizationType: "individual" as const,
  },
  "4": {
    id: "4",
    content: "Blessing everyone who's struggling today. Remember that you are loved, valued, and stronger than you know. Peace be with you all.",
    type: "blessing" as const,
    author: "Hope Community Church",
    supportCount: 42,
    timeAgo: "8 hours ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Our community",
    organizationType: "organization" as const,
  },
  "5": {
    id: "5",
    content: "My family is going through a tough financial situation. Prayers for guidance and opportunities would be deeply appreciated.",
    type: "prayer" as const,
    author: "Anonymous",
    supportCount: 19,
    timeAgo: "12 hours ago",
    category: "Family",
    anonymous: true,
    urgent: false,
    onBehalfOf: "My family",
    organizationType: "individual" as const,
  },
  "6": {
    id: "6",
    content: "Our food bank is organizing a community drive this weekend. Praying for generous hearts and abundant donations to help feed families in need during these challenging times.",
    type: "prayer" as const,
    author: "Community Food Bank",
    supportCount: 67,
    timeAgo: "1 day ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Families in need",
    organizationType: "organization" as const,
  },
  "7": {
    id: "7",
    content: "We are overwhelmed with gratitude! Thanks to our amazing community, we collected over 2,000 pounds of food and raised $15,000 for local families. Your generosity is a true blessing.",
    type: "blessing" as const,
    author: "Helping Hands Nonprofit",
    supportCount: 89,
    timeAgo: "2 days ago",
    category: "Gratitude",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Community donors",
    organizationType: "organization" as const,
  },
  "8": {
    id: "8",
    content: "May all who are seeking healing find comfort and strength today. May your journey be filled with hope, love, and the support of those around you. Blessings to each precious soul.",
    type: "blessing" as const,
    author: "St. Mary's Interfaith Center",
    supportCount: 156,
    timeAgo: "3 days ago",
    category: "Health",
    anonymous: false,
    urgent: false,
    onBehalfOf: "All seeking healing",
    organizationType: "organization" as const,
  },
  "9": {
    id: "9",
    content: "Our local community was affected by recent flooding. We're seeking prayers for recovery, rebuilding, and hope for everyone impacted.",
    type: "prayer" as const,
    author: "Peace Unity Church",
    supportCount: 156,
    timeAgo: "5 hours ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Our community",
    organizationType: "organization" as const,
  },
  "10": {
    id: "10",
    content: "Join us in praying for peace, understanding, and harmony across all nations and communities worldwide.",
    type: "prayer" as const,
    author: "Global Peace Initiative",
    supportCount: 312,
    timeAgo: "12 hours ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "All nations",
    organizationType: "organization" as const,
  }
};

export default function SharedPrayer() {
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Extract type from pathname
  const type = location.pathname.startsWith('/blessing/') ? 'blessing' : 'prayer';
  
  // Debug logging
  console.log('SharedPrayer Debug:', { type, id, pathname: location.pathname, mockPrayers: Object.keys(mockPrayers) });
  
  const prayer = mockPrayers[id as keyof typeof mockPrayers];
  
  console.log('Found prayer:', prayer);
  console.log('Prayer type matches URL type:', prayer?.type === type);
  
  if (!prayer) {
    console.log('Prayer not found - ID not in mockPrayers');
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Prayer not found</h1>
          <p className="text-muted-foreground">This prayer or blessing may have been removed or the link is incorrect.</p>
          <p className="text-sm text-muted-foreground">Debug: ID={id}, Type={type}</p>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (prayer.type !== type) {
    console.log('Prayer type mismatch - prayer type:', prayer.type, 'URL type:', type);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Prayer not found</h1>
          <p className="text-muted-foreground">This prayer or blessing may have been removed or the link is incorrect.</p>
          <p className="text-sm text-muted-foreground">Debug: Prayer type mismatch - Expected: {type}, Got: {prayer.type}</p>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInteraction = () => {
    setShowAuthModal(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Back to Community</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Shared {prayer.type}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {prayer.type === 'prayer' ? '🙏 Shared Prayer' : '✨ Shared Blessing'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Someone wanted to share this {prayer.type} with you
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            <Link to="/prayer/1" className="underline mr-4">Test Prayer Link</Link>
            <Link to="/blessing/2" className="underline">Test Blessing Link</Link>
          </div>
        </div>

        <Card className={`p-4 sm:p-6 transition-all duration-300 hover:shadow-medium rounded-2xl ${
          prayer.type === 'prayer' 
            ? 'bg-gradient-prayer border-prayer/30' 
            : 'bg-gradient-blessing border-blessing/30'
        }`}>
          <div className="space-y-4">
            {/* Header with Category Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {prayer.category && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-soft text-primary">
                    {prayer.category}
                  </div>
                )}
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Individual
                </div>
              </div>
              {prayer.urgent && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Urgent</span>
                </div>
              )}
            </div>
            
            {/* Prayer Content */}
            <p className="text-foreground leading-relaxed font-medium text-base sm:text-lg break-words hyphens-auto overflow-wrap-anywhere">
              {prayer.content}
            </p>
            
            {/* Author & Time */}
            <div className="flex items-center gap-3 pt-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={prayer.author} />
                <AvatarFallback className="text-sm bg-primary/10 text-primary">
                  {getInitials(prayer.author)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {prayer.author}
                </span>
                <span className="ml-2">{prayer.timeAgo}</span>
              </div>
            </div>
            
            {/* Support Actions */}
            <div className="space-y-3 sm:space-y-4 pt-4 border-t border-border/30">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInteraction}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl hover:text-primary hover:bg-primary/5 hover:shadow-sm transition-all"
                >
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {prayer.type === "prayer" ? "Here with you" : "Holding you in prayer"}
                  </span>
                  <span className="text-xs font-semibold">{prayer.supportCount}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm" 
                  onClick={handleInteraction}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {prayer.type === "prayer" ? "Praying with you" : "Cheering you on"}
                  </span>
                  <span className="text-xs font-semibold">{Math.floor(Math.random() * 15) + 5}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInteraction}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl hover:text-pink-600 hover:bg-pink-50 hover:shadow-sm transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {prayer.type === "prayer" ? "Sending love" : "Sending strength"}
                  </span>
                  <span className="text-xs font-semibold">{Math.floor(Math.random() * 10) + 2}</span>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInteraction}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl hover:text-primary hover:bg-primary/5 hover:shadow-sm transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Comment</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInteraction}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm transition-all"
                >
                  <Gift className="h-4 w-4" />
                  <span className="text-xs font-medium">Send Gift</span>
                </Button>
              </div>
            </div>

            {/* Join Community CTA */}
            <div className="mt-4 sm:mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center space-y-3">
              <h3 className="font-semibold text-foreground">Join the GetBlessed Community</h3>
              <p className="text-sm text-muted-foreground">
                Share your prayers, offer blessings, and connect with a supportive community.
              </p>
              <Button onClick={() => setShowAuthModal(true)} className="w-full">
                Join Community
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={() => setShowAuthModal(false)}
      />
    </div>
  );
}