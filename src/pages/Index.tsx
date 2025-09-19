import { useState } from "react";
import { PrayerCard } from "@/components/PrayerCard";
import { PrayerSubmission } from "@/components/PrayerSubmission";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Users } from "lucide-react";

// Mock data for initial prayers
const initialPrayers = [
  {
    id: "1",
    content: "Going through a difficult time with my health. Would appreciate prayers for strength and healing during my treatment journey.",
    type: "prayer" as const,
    author: "Sarah M.",
    supportCount: 24,
    timeAgo: "2 hours ago",
    category: "Health"
  },
  {
    id: "2",
    content: "Grateful for the wonderful news about my sister's recovery. Sending blessings to everyone who supported us during this time.",
    type: "blessing" as const,
    author: "Michael K.",
    supportCount: 18,
    timeAgo: "4 hours ago",
    category: "Gratitude"
  },
  {
    id: "3",
    content: "Starting a new job next week and feeling nervous. Prayers for confidence and wisdom would mean the world to me.",
    type: "prayer" as const,
    author: "David L.",
    supportCount: 31,
    timeAgo: "6 hours ago",
    category: "Work"
  },
  {
    id: "4",
    content: "Blessing everyone who's struggling today. Remember that you are loved, valued, and stronger than you know. Peace be with you all.",
    type: "blessing" as const,
    author: "Maria G.",
    supportCount: 42,
    timeAgo: "8 hours ago",
    category: "General"
  },
  {
    id: "5",
    content: "My family is going through a tough financial situation. Prayers for guidance and opportunities would be deeply appreciated.",
    type: "prayer" as const,
    author: "James R.",
    supportCount: 19,
    timeAgo: "12 hours ago",
    category: "Family"
  }
];

const Index = () => {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [showSubmission, setShowSubmission] = useState(false);
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
  }) => {
    const prayer = {
      id: Date.now().toString(),
      ...newPrayer,
      supportCount: 0,
      timeAgo: "Just now"
    };
    
    setPrayers(prev => [prayer, ...prev]);
    setShowSubmission(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="bg-gradient-hero text-primary-foreground py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Get Blessed
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            A community where hearts connect through prayer and blessing. 
            Share your burdens, celebrate your joys, and find strength together.
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

        {/* Community Feed */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Community Feed
            </h2>
            <p className="text-muted-foreground">
              Recent prayers and blessings from our community
            </p>
          </div>

          {prayers.map((prayer) => (
            <PrayerCard
              key={prayer.id}
              {...prayer}
            />
          ))}
        </div>

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