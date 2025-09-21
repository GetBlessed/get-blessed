import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PrayerCard } from "@/components/PrayerCard";
import { PrayerSubmission } from "@/components/PrayerSubmission";
// import AuthModal from "@/components/AuthModal"; // Hidden but kept for future use
// import PostSubmissionAuthModal from "@/components/PostSubmissionAuthModal"; // Hidden but kept for future use
import WaitlistModal from "@/components/WaitlistModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Heart, Users, User, Home, Gift, Loader2 } from "lucide-react";
import Dashboard from "./Dashboard";
import { getStoredPrayers, storePrayer, initializePrayerStorageAsync, type StoredPrayer } from "@/utils/prayerStorage";
import { subscribeToPrayers } from "@/lib/supabase/prayers";
import { toast } from "sonner";

// Remove empty interface - using StoredPrayer directly

// Default prayers for initialization
const defaultPrayers: StoredPrayer[] = [
  {
    id: "1",
    content: "Going through a difficult time with my health. Would appreciate prayers for strength and healing during my treatment journey.",
    type: "prayer",
    author: "Sarah M.",
    supportCount: 24,
    timeAgo: "2 hours ago",
    category: "Health",
    anonymous: false,
    urgent: true,
    onBehalfOf: "",
    organizationType: "individual",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    content: "Grateful for the wonderful news about my sister's recovery. Sending blessings to everyone who supported us during this time.",
    type: "blessing",
    author: "Michael K.",
    supportCount: 18,
    timeAgo: "4 hours ago",
    category: "Gratitude",
    anonymous: false,
    urgent: false,
    onBehalfOf: "My sister",
    organizationType: "individual",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    content: "Starting a new job next week and feeling nervous. Prayers for confidence and wisdom would mean the world to me.",
    type: "prayer",
    author: "David L.",
    supportCount: 31,
    timeAgo: "6 hours ago",
    category: "Work",
    anonymous: false,
    urgent: false,
    onBehalfOf: "",
    organizationType: "individual",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    content: "Blessing everyone who's struggling today. Remember that you are loved, valued, and stronger than you know. Peace be with you all.",
    type: "blessing",
    author: "Hope Community Church",
    supportCount: 42,
    timeAgo: "8 hours ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Our community",
    organizationType: "organization",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    content: "My family is going through a tough financial situation. Prayers for guidance and opportunities would be deeply appreciated.",
    type: "prayer",
    author: "Anonymous",
    supportCount: 19,
    timeAgo: "12 hours ago",
    category: "Family",
    anonymous: true,
    urgent: false,
    onBehalfOf: "My family",
    organizationType: "individual",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6",
    content: "Our food bank is organizing a community drive this weekend. Praying for generous hearts and abundant donations to help feed families in need during these challenging times.",
    type: "prayer",
    author: "Community Food Bank",
    supportCount: 67,
    timeAgo: "1 day ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Families in need",
    organizationType: "organization",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "7",
    content: "We are overwhelmed with gratitude! Thanks to our amazing community, we collected over 2,000 pounds of food and raised $15,000 for local families. Your generosity is a true blessing.",
    type: "blessing",
    author: "Helping Hands Nonprofit",
    supportCount: 89,
    timeAgo: "2 days ago",
    category: "Gratitude",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Community donors",
    organizationType: "organization",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "8",
    content: "May all who are seeking healing find comfort and strength today. May your journey be filled with hope, love, and the support of those around you. Blessings to each precious soul.",
    type: "blessing",
    author: "St. Mary's Interfaith Center",
    supportCount: 156,
    timeAgo: "3 days ago",
    category: "Health",
    anonymous: false,
    urgent: false,
    onBehalfOf: "All seeking healing",
    organizationType: "organization",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "9",
    content: "Our local community was affected by recent flooding. We're seeking prayers for recovery, rebuilding, and hope for everyone impacted.",
    type: "prayer",
    author: "Peace Unity Church",
    supportCount: 156,
    timeAgo: "5 hours ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "Our community",
    organizationType: "organization",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "10",
    content: "Join us in praying for peace, understanding, and harmony across all nations and communities worldwide.",
    type: "prayer",
    author: "Global Peace Initiative",
    supportCount: 312,
    timeAgo: "12 hours ago",
    category: "General",
    anonymous: false,
    urgent: false,
    onBehalfOf: "All nations",
    organizationType: "organization",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const Index = () => {
  const queryClient = useQueryClient();
  const [showSubmission, setShowSubmission] = useState(false);
  const [activeTab, setActiveTab] = useState("prayers");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentView, setCurrentView] = useState("home");
  // const [showAuthModal, setShowAuthModal] = useState(false); // Hidden but kept for future use
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats] = useState({
    totalPrayers: 1247,
    totalBlessings: 892,
    activeCommunity: 3421
  });

  // Fetch prayers using React Query with async function
  const {
    data: prayers = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['prayers'],
    queryFn: async () => {
      console.log('React Query: Fetching prayers from Supabase...');
      const result = await getStoredPrayers();
      console.log('React Query: Fetched', result.length, 'prayers');
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3, // Retry failed requests
  });

  // Initialize prayers and set up real-time subscription
  useEffect(() => {
    // Initialize prayers asynchronously
    const initializePrayers = async () => {
      try {
        await initializePrayerStorageAsync(defaultPrayers);
        // Invalidate and refetch prayers after initialization
        queryClient.invalidateQueries({ queryKey: ['prayers'] });
      } catch (error) {
        console.error('Error initializing prayers:', error);
        toast.error('Failed to load prayers. Please refresh the page.');
      }
    };

    initializePrayers();

    // Set up real-time subscription
    const unsubscribe = subscribeToPrayers((payload) => {
      console.log('Real-time prayer update:', payload);

      if (payload.eventType === 'INSERT') {
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ['prayers'] });
        toast.success('New prayer added to the community!');
      } else if (payload.eventType === 'UPDATE') {
        // Update specific prayer in cache
        queryClient.invalidateQueries({ queryKey: ['prayers'] });
      } else if (payload.eventType === 'DELETE') {
        // Remove prayer from cache
        queryClient.invalidateQueries({ queryKey: ['prayers'] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const handleNewPrayer = async (newPrayer: {
    content: string;
    type: "prayer" | "blessing";
    category: string;
    author: string;
    anonymous: boolean;
    urgent: boolean;
    onBehalfOf: string;
    organizationType: "individual" | "organization";
    scripture?: string;
    forwardEmail?: string;
    forwardPhone?: string;
    image?: string;
  }) => {
    const prayer: StoredPrayer = {
      id: crypto.randomUUID(),
      ...newPrayer,
      supportCount: 0,
      timeAgo: "Just now",
      createdAt: new Date().toISOString()
    };

    console.log('Creating new prayer:', prayer.id, prayer.type, prayer.content.substring(0, 50));

    try {
      // Store the prayer using the async function
      const savedPrayer = await storePrayer(prayer);
      console.log('Prayer stored successfully:', savedPrayer.id);

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['prayers'] });

      setShowSubmission(false);

      console.log('Prayer stored and queries invalidated');
      console.log('New prayer has image:', !!prayer.image);
      console.log('Image length:', prayer.image?.length || 0);

      // Show success toast
      toast.success(prayer.type === 'prayer' ? 'Prayer shared with the community!' : 'Blessing request shared!');

      // Show waitlist prompt after submission
      setShowWaitlist(true);

      // Handle forwarding if email or phone provided
      if (newPrayer.forwardEmail || newPrayer.forwardPhone) {
        // In real implementation, this would send the prayer via email/SMS
        console.log(`Forwarding to: ${newPrayer.forwardEmail || newPrayer.forwardPhone}`);
        toast.success('Prayer forwarded successfully!');
      }
    } catch (error) {
      console.error('Error saving prayer:', error);
      toast.error('Failed to save prayer. Please try again.');
    }
  };

  const filteredPrayers = prayers.filter(prayer => {
    const typeFilter = activeTab === "prayers" ? prayer.type === "prayer" : prayer.type === "blessing";
    const organizationFilter = activeFilter === "all" ? true : 
      activeFilter === "individual" ? prayer.organizationType === "individual" :
      prayer.organizationType === "organization";
    
    return typeFilter && organizationFilter;
  });

  // Hidden but kept for future use
  // const handleLogin = (userData: { name: string; email: string }) => {
  //   setUser(userData);
  //   setShowWaitlist(false);
  // };

  // const handleLogout = () => {
  //   setUser(null);
  //   setCurrentView("home");
  // };

  // const requireAuth = () => {
  //   if (!user) {
  //     setShowWaitlist(true);
  //     return false;
  //   }
  //   return true;
  // };

  const renderMainNavigation = () => (
    <div className="bg-card border-b border-border/30 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-1 bg-muted/30 p-1 sm:p-1.5 rounded-2xl w-full sm:w-auto">
          <Button
            variant={currentView === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Community</span>
            <span className="sm:hidden">Feed</span>
          </Button>
          <Button
            variant={currentView === "my-prayers" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              // Dashboard temporarily unavailable - show waitlist
              setShowWaitlist(true);
            }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">My Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </Button>
          <Button
            variant={currentView === "gifts" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              // Gifts temporarily unavailable - show waitlist
              setShowWaitlist(true);
            }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Gifts</span>
            <span className="sm:hidden">Gifts</span>
          </Button>
        </div>
      </div>
    </div>
  );

  // Dashboard temporarily hidden
  // if (currentView === "my-prayers" && user) {
  //   return <Dashboard user={user} onNavigateToHome={() => setCurrentView("home")} onLogout={handleLogout} />;
  // }


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-background border-b border-border/50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary">GetBlessed</h1>
            <span className="text-xs text-muted-foreground">• Connecting hearts through prayer</span>
          </div>
          {/* Hidden for now - auth will be added later */}
          {/* {user ? (
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
              <User className="h-4 w-4" />
              {user.name} • Sign Out
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowWaitlist(true)}>
              <User className="h-4 w-4" />
              Join Waitlist
            </Button>
          )} */}
        </div>
      </nav>

      {/* Main Navigation */}
      {renderMainNavigation()}

      {/* Hero Header */}
      <header className="bg-gradient-hero text-primary-foreground py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 px-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight break-words">
            Welcome to GetBlessed
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed px-2 break-words">
            A community where hearts connect through prayer and blessing. 
            Submit prayers to lift others up, ask for blessings when you need support.
          </p>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 pt-4 sm:pt-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">🙏 {stats.totalPrayers.toLocaleString()}</div>
              <div className="text-xs sm:text-sm opacity-80">Prayers Shared</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">✨ {stats.totalBlessings.toLocaleString()}</div>
              <div className="text-xs sm:text-sm opacity-80">Blessings Given</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">🤝 {stats.activeCommunity.toLocaleString()}</div>
              <div className="text-xs sm:text-sm opacity-80">Community Members</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Share Button */}
        <div className="text-center mb-6 sm:mb-8">
          <Button
            onClick={() => setShowSubmission(!showSubmission)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 sm:px-8 py-2.5 sm:py-3 shadow-medium transition-all hover:shadow-elevated w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            {showSubmission ? "Close" : "Share Your Heart"}
          </Button>
        </div>

        {/* Prayer Submission Form */}
        {showSubmission && (
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <PrayerSubmission onSubmit={handleNewPrayer} />
          </div>
        )}

        {/* Community Feed with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="text-center mb-4 sm:mb-6">
            <TabsList className="grid w-full max-w-xs sm:max-w-md mx-auto grid-cols-2 bg-muted h-10 sm:h-auto">
              <TabsTrigger value="prayers" className="text-xs sm:text-sm font-medium py-2 px-2 sm:px-4 flex-1">
                Prayers
              </TabsTrigger>
              <TabsTrigger value="blessings" className="text-xs sm:text-sm font-medium py-2 px-2 sm:px-4 flex-1">
                Blessings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="prayers" className="space-y-6">
            {/* Filter Tabs for Prayers */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="inline-flex rounded-lg border border-border/50 p-0.5 sm:p-1 bg-muted/30 w-full max-w-sm sm:max-w-none sm:w-auto">
                <Button
                  variant={activeFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "individual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("individual")}
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  Individual
                </Button>
                <Button
                  variant={activeFilter === "organization" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("organization")}
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  Organizations
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading prayers...</p>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <p className="text-destructive">Failed to load prayers</p>
                  <Button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['prayers'] })}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredPrayers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No prayers found in this category.</p>
                </div>
              ) : (
                filteredPrayers.map((prayer) => (
                  <PrayerCard
                    key={prayer.id}
                    {...prayer}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="blessings" className="space-y-6">
            {/* Filter Tabs for Blessings */}
            <div className="flex justify-center px-4">
              <div className="inline-flex rounded-lg border border-border/50 p-1 bg-muted/30 w-full sm:w-auto">
                <Button
                  variant={activeFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "individual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("individual")}
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  Individual
                </Button>
                <Button
                  variant={activeFilter === "organization" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("organization")}
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                >
                  <span className="hidden sm:inline">Organizations</span>
                  <span className="sm:hidden">Organizations</span>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading blessings...</p>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <p className="text-destructive">Failed to load blessings</p>
                  <Button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['prayers'] })}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredPrayers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No blessings found in this category.</p>
                </div>
              ) : (
                filteredPrayers.map((prayer) => (
                  <PrayerCard
                    key={prayer.id}
                    {...prayer}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Guidelines */}
        <div className="mt-16 p-6 bg-card rounded-lg border border-border/50 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Community Guidelines
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Share with authenticity and respect</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Support others in their journey</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Keep messages positive and uplifting</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Welcome all faiths and traditions</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 py-6 sm:py-8 px-4 bg-muted/30 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-sm sm:text-base text-muted-foreground">
            Get Blessed - Connecting hearts through prayer and blessing
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            All faiths welcome • Built with love and respect
          </p>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
      />

      {/* Auth Modal - Hidden but kept for future use */}
      {/* <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      /> */}
    </div>
  );
};

export default Index;