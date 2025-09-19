import { useState } from "react";
import { PrayerCard } from "@/components/PrayerCard";
import { PrayerSubmission } from "@/components/PrayerSubmission";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Heart, Users, User } from "lucide-react";

interface Prayer {
  id: string;
  content: string;
  type: "prayer" | "blessing";
  author: string;
  supportCount: number;
  timeAgo: string;
  category: string;
  anonymous: boolean;
  urgent: boolean;
  onBehalfOf: string;
  organizationType: "individual" | "organization";
  scripture?: string;
  image?: string;
}

// Mock data for initial prayers with more community samples
const initialPrayers: Prayer[] = [
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
    organizationType: "individual"
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
    organizationType: "individual"
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
    organizationType: "individual"
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
    organizationType: "organization"
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
    organizationType: "individual"
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
    organizationType: "organization"
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
    organizationType: "organization"
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
    organizationType: "organization"
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
    organizationType: "organization"
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
    organizationType: "organization"
  }
];

const Index = () => {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [showSubmission, setShowSubmission] = useState(false);
  const [activeTab, setActiveTab] = useState("prayers");
  const [activeFilter, setActiveFilter] = useState("all");
  const [stats] = useState({
    totalPrayers: 1247,
    totalBlessings: 892,
    activeCommunity: 3421
  });

  const handleNewPrayer = (newPrayer: {
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
    const prayer = {
      id: Date.now().toString(),
      ...newPrayer,
      supportCount: 0,
      timeAgo: "Just now"
    };
    
    setPrayers(prev => [prayer, ...prev]);
    setShowSubmission(false);

    // Handle forwarding if email or phone provided
    if (newPrayer.forwardEmail || newPrayer.forwardPhone) {
      // In real implementation, this would send the prayer via email/SMS
      console.log(`Forwarding to: ${newPrayer.forwardEmail || newPrayer.forwardPhone}`);
    }
  };

  const filteredPrayers = prayers.filter(prayer => {
    const typeFilter = activeTab === "prayers" ? prayer.type === "prayer" : prayer.type === "blessing";
    const organizationFilter = activeFilter === "all" ? true : 
      activeFilter === "individual" ? prayer.organizationType === "individual" :
      prayer.organizationType === "organization";
    
    return typeFilter && organizationFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-background border-b border-border/50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary">GetBlessed</h1>
            <span className="text-xs text-muted-foreground">• Connecting hearts through prayer</span>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Create Profile
          </Button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-gradient-hero text-primary-foreground py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-serif font-semibold tracking-tight">
            Welcome to GetBlessed
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            A community where hearts connect through prayer and blessing. 
            Submit prayers to lift others up, ask for blessings when you need support.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalPrayers.toLocaleString()}</div>
              <div className="text-sm opacity-80">Prayers Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalBlessings.toLocaleString()}</div>
              <div className="text-sm opacity-80">Blessings Given</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.activeCommunity.toLocaleString()}</div>
              <div className="text-sm opacity-80">Community Members</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Share Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowSubmission(!showSubmission)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 shadow-medium transition-all hover:shadow-elevated"
          >
            <Plus className="h-5 w-5 mr-2" />
            {showSubmission ? "Close" : "Share Your Heart"}
          </Button>
        </div>

        {/* Prayer Submission Form */}
        {showSubmission && (
          <div className="mb-8">
            <PrayerSubmission onSubmit={handleNewPrayer} />
          </div>
        )}

        {/* Community Feed with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              See how our community lifts each other up through submitted prayers and blessing requests
            </h2>
            
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted">
              <TabsTrigger value="prayers" className="text-sm font-medium">
                Submitted Prayers
              </TabsTrigger>
              <TabsTrigger value="blessings" className="text-sm font-medium">
                Blessing Requests
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="prayers" className="space-y-6">
            {/* Filter Tabs for Prayers */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-border/50 p-1 bg-muted/30">
                <Button
                  variant={activeFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="text-sm"
                >
                  All Submitted
                </Button>
                <Button
                  variant={activeFilter === "individual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("individual")}
                  className="text-sm"
                >
                  Individual
                </Button>
                <Button
                  variant={activeFilter === "organization" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("organization")}
                  className="text-sm"
                >
                  Groups & Organizations
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredPrayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  {...prayer}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blessings" className="space-y-6">
            {/* Filter Tabs for Blessings */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-border/50 p-1 bg-muted/30">
                <Button
                  variant={activeFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="text-sm"
                >
                  All Requests
                </Button>
                <Button
                  variant={activeFilter === "individual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("individual")}
                  className="text-sm"
                >
                  Individual
                </Button>
                <Button
                  variant={activeFilter === "organization" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("organization")}
                  className="text-sm"
                >
                  Groups & Organizations
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredPrayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  {...prayer}
                />
              ))}
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
      <footer className="mt-16 py-8 px-4 bg-muted/30 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            Get Blessed - Connecting hearts through prayer and blessing
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            All faiths welcome • Built with love and respect
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;