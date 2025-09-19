import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Heart, Users, TrendingUp, Plus, Globe, Activity, MessageCircle } from "lucide-react";
import { PrayerCard } from "@/components/PrayerCard";
import { PrayerSubmission } from "@/components/PrayerSubmission";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
  onNavigateToHome?: () => void;
}

const Dashboard = ({ user, onNavigateToHome }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPrayerSubmission, setShowPrayerSubmission] = useState(false);
  const { toast } = useToast();

  // Dynamic user data based on actual user
  const userData = {
    name: user.name,
    title: "Prayer Giver • Blessed Guardian",
    credibilityScore: 87,
    totalPrayers: 42,
    currentStreak: 7,
    level: "Blessed Guardian"
  };

  // Mock user's prayers
  const userPrayers = [
    {
      id: "user-1",
      content: "Grateful for all the blessings in my life. Sharing love and light with everyone who needs it today.",
      type: "blessing" as const,
      author: user.name,
      supportCount: 15,
      timeAgo: "2 hours ago",
      category: "Gratitude",
      anonymous: false,
      urgent: false,
      onBehalfOf: "",
      organizationType: "individual" as const
    },
    {
      id: "user-2", 
      content: "Please keep my family in your prayers as we navigate through some challenging times. Your support means everything.",
      type: "prayer" as const,
      author: user.name,
      supportCount: 28,
      timeAgo: "1 day ago",
      category: "Family",
      anonymous: false,
      urgent: true,
      onBehalfOf: "My family",
      organizationType: "individual" as const
    }
  ];

  const stats = [
    {
      icon: Star,
      title: "Credibility Score",
      value: userData.credibilityScore,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Heart,
      title: "Total prayers shared",
      value: userData.totalPrayers,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: TrendingUp,
      title: "Current Streak",
      value: `${userData.currentStreak} days`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Users,
      title: "Level",
      value: userData.level,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const handleGivePrayer = () => {
    setShowPrayerSubmission(true);
  };

  const handleExploreCommunity = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
      toast({
        title: "Redirected to Community",
        description: "Explore and connect with other blessed souls"
      });
    }
  };

  const handleNewPrayer = (newPrayer: any) => {
    setShowPrayerSubmission(false);
    toast({
      title: "Prayer Shared! 🙏",
      description: "Your prayer has been shared with the community"
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 rounded-2xl border-border/30 shadow-soft hover:shadow-medium transition-all bg-card">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  onClick={handleGivePrayer}
                  className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground border-0 shadow-elevated hover:shadow-elevated cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Send Prayer</h3>
                      <p className="text-primary-foreground/80 text-sm">Share your spiritual gifts</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  onClick={handleExploreCommunity}
                  className="p-6 rounded-2xl border-border/30 shadow-soft hover:shadow-medium cursor-pointer transition-all group bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Explore Community</h3>
                      <p className="text-muted-foreground text-sm">Connect with other blessed souls</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        );

      case "activity":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-foreground">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: "Received 5 new prayers", time: "2 hours ago", icon: Heart },
                { action: "Sent blessing to Sarah M.", time: "4 hours ago", icon: Plus },
                { action: "Joined new prayer circle", time: "1 day ago", icon: Users },
                { action: "Reached 7-day streak", time: "2 days ago", icon: TrendingUp }
              ].map((activity, index) => (
                <Card key={index} className="p-4 rounded-xl border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "prayers":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-semibold text-foreground">My Prayers</h2>
              <Button onClick={handleGivePrayer} className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Prayer
              </Button>
            </div>
            <div className="space-y-6">
              {userPrayers.map((prayer) => (
                <PrayerCard key={prayer.id} {...prayer} />
              ))}
            </div>
          </div>
        );

      case "community":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-foreground">Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-border/30 shadow-soft hover:shadow-medium cursor-pointer transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Prayer Circles</h3>
                    <p className="text-sm text-muted-foreground">Join active circles</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Connect with like-minded souls in dedicated prayer groups</p>
              </Card>
              
              <Card className="p-6 rounded-2xl border-border/30 shadow-soft hover:shadow-medium cursor-pointer transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Community Feed</h3>
                    <p className="text-sm text-muted-foreground">Latest prayers & blessings</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">See what the community is sharing and praying for</p>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient background matching reference */}
      <div 
        className="text-white px-6 py-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Welcome back, {userData.name}</h1>
                <p className="text-white/80 text-lg">{userData.title}</p>
              </div>
            </div>
            <Button 
              onClick={handleGivePrayer}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl px-6 py-3 font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Give Prayer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs matching reference design */}
        <div className="flex gap-1 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
          {[
            { id: "overview", label: "Overview" },
            { id: "activity", label: "Activity" },
            { id: "prayers", label: "Prayers" },
            { id: "community", label: "Community" }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-6 py-2.5 font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Prayer Submission Modal */}
      {showPrayerSubmission && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <PrayerSubmission onSubmit={handleNewPrayer} />
            <Button
              variant="ghost"
              onClick={() => setShowPrayerSubmission(false)}
              className="mt-4 w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;