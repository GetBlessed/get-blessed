import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Users, TrendingUp, Plus, Globe, Activity, MessageCircle, Award, Camera, Edit, Sun, Upload, User, Trophy, Medal, Crown } from "lucide-react";
import { PrayerCard } from "@/components/PrayerCard";
import { PrayerSubmission } from "@/components/PrayerSubmission";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
  onNavigateToHome?: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  profilePicture: string | null;
  joinedDate: string;
}

const Dashboard = ({ user, onNavigateToHome }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPrayerSubmission, setShowPrayerSubmission] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { toast } = useToast();

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user.name,
    email: user.email,
    bio: "Seeking peace, sharing blessings, and connecting with spiritual souls.",
    location: "United States",
    profilePicture: null,
    joinedDate: "January 2024"
  });

  // Dynamic user data based on actual user
  const userData = {
    name: user.name,
    title: "Prayer Giver • Blessed Guardian",
    credibilityScore: 87,
    totalPrayers: 42,
    totalBlessings: 18,
    currentStreak: 7,
    level: "Blessed Guardian"
  };

  // Mock combined prayers and blessings
  const userPrayersAndBlessings = [
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
    },
    {
      id: "user-3",
      content: "Sending strength and healing energy to all those facing health challenges. You are not alone in this journey.",
      type: "blessing" as const,
      author: user.name,
      supportCount: 22,
      timeAgo: "3 days ago",
      category: "Health",
      anonymous: false,
      urgent: false,
      onBehalfOf: "Those in need of healing",
      organizationType: "individual" as const
    }
  ];

  // Leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", score: 245, prayers: 89, icon: Crown, color: "text-yellow-500" },
    { rank: 2, name: "Michael Torres", score: 198, prayers: 76, icon: Trophy, color: "text-gray-400" },
    { rank: 3, name: "David Kim", score: 156, prayers: 62, icon: Medal, color: "text-orange-500" },
    { rank: 4, name: user.name, score: userData.credibilityScore, prayers: userData.totalPrayers, icon: Star, color: "text-purple-500" },
    { rank: 5, name: "Emma Johnson", score: 78, prayers: 34, icon: Star, color: "text-blue-500" },
    { rank: 6, name: "James Wilson", score: 65, prayers: 28, icon: Star, color: "text-green-500" },
    { rank: 7, name: "Lisa Anderson", score: 52, prayers: 23, icon: Star, color: "text-pink-500" },
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
      icon: Sun,
      title: "Total Prayers",
      value: userData.totalPrayers,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: MessageCircle,
      title: "Total Blessings",
      value: userData.totalBlessings,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: TrendingUp,
      title: "Current Streak",
      value: `${userData.currentStreak} days`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
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
      title: "Prayer/Blessing Shared! 🙏",
      description: "Your heartfelt message has been shared with the community"
    });
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfilePicture(result);
        setUserProfile(prev => ({ ...prev, profilePicture: result }));
        toast({
          title: "Profile picture updated! ✨",
          description: "Your new profile picture has been saved."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updatedProfile }));
    setEditingProfile(false);
    toast({
      title: "Profile updated! ✨",
      description: "Your profile information has been saved."
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
                      <h3 className="text-lg font-semibold mb-1">Share Prayer/Blessing</h3>
                      <p className="text-primary-foreground/80 text-sm">Send prayers or share blessings</p>
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
                { action: "Received 5 new prayers", time: "2 hours ago", icon: Sun },
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
              <h2 className="text-2xl font-serif font-semibold text-foreground">My Prayers & Blessings</h2>
              <Button onClick={handleGivePrayer} className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Prayer/Blessing
              </Button>
            </div>
            
            {/* Prayer/Blessing type filter */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
                <TabsTrigger value="prayers" className="rounded-lg">Prayers</TabsTrigger>
                <TabsTrigger value="blessings" className="rounded-lg">Blessings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6 mt-6">
                {userPrayersAndBlessings.map((item) => (
                  <PrayerCard key={item.id} {...item} />
                ))}
              </TabsContent>
              
              <TabsContent value="prayers" className="space-y-6 mt-6">
                {userPrayersAndBlessings.filter(item => item.type === "prayer").map((item) => (
                  <PrayerCard key={item.id} {...item} />
                ))}
              </TabsContent>
              
              <TabsContent value="blessings" className="space-y-6 mt-6">
                {userPrayersAndBlessings.filter(item => item.type === "blessing").map((item) => (
                  <PrayerCard key={item.id} {...item} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-semibold text-foreground">My Profile</h2>
              <Button 
                onClick={() => setEditingProfile(!editingProfile)} 
                variant={editingProfile ? "default" : "outline"}
                className="rounded-xl"
              >
                <Edit className="h-4 w-4 mr-2" />
                {editingProfile ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>

            <Card className="p-8 rounded-2xl border-border/30 shadow-soft">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profilePicture || userProfile.profilePicture || ""} alt={userProfile.name} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {editingProfile && (
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="h-5 w-5 text-primary-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground">{userProfile.name}</h3>
                    <p className="text-muted-foreground">{userData.title}</p>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="flex-1 space-y-6">
                  {editingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                        <Input
                          id="name"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-foreground font-medium">Location</Label>
                        <Input
                          id="location"
                          value={userProfile.location}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-foreground font-medium">Bio</Label>
                        <Textarea
                          id="bio"
                          value={userProfile.bio}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                          className="rounded-xl mt-1 min-h-[100px]"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <Button 
                        onClick={() => handleProfileUpdate(userProfile)}
                        className="w-full rounded-xl"
                      >
                        Save Profile Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Email</h4>
                        <p className="text-muted-foreground">{userProfile.email}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Location</h4>
                        <p className="text-muted-foreground">{userProfile.location}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Bio</h4>
                        <p className="text-muted-foreground">{userProfile.bio}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Member Since</h4>
                        <p className="text-muted-foreground">{userProfile.joinedDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        );

      case "leaderboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-semibold text-foreground">Community Leaderboard</h2>
              <div className="text-sm text-muted-foreground">
                Based on prayer contributions and community engagement
              </div>
            </div>

            <div className="space-y-4">
              {leaderboardData.map((member, index) => (
                <Card 
                  key={index} 
                  className={`p-6 rounded-2xl border-border/30 shadow-soft transition-all ${
                    member.name === user.name 
                      ? 'bg-gradient-primary/5 border-primary/30 shadow-medium' 
                      : 'hover:shadow-medium'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center ${member.color}`}>
                      <member.icon className={`h-6 w-6 ${member.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${member.name === user.name ? 'text-primary' : 'text-foreground'}`}>
                          #{member.rank} {member.name}
                          {member.name === user.name && (
                            <span className="text-sm text-primary ml-2">(You)</span>
                          )}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {member.score} points
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {member.prayers} prayers shared
                        </span>
                      </div>
                    </div>

                    {member.rank <= 3 && (
                      <div className="text-right">
                        <div className={`text-lg font-bold ${member.color}`}>
                          {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : '🥉'}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 rounded-2xl border-border/30 shadow-soft bg-muted/20">
              <div className="text-center">
                <Sun className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Earn More Points</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share prayers, send blessings, and engage with the community to climb the leaderboard!
                </p>
                <Button onClick={handleGivePrayer} className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Prayer/Blessing
                </Button>
              </div>
            </Card>
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
              
              <Card onClick={handleExploreCommunity} className="p-6 rounded-2xl border-border/30 shadow-soft hover:shadow-medium cursor-pointer transition-all">
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
      {/* Top Navigation Bar */}
      <nav className="bg-background border-b border-border/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary">GetBlessed</h1>
            <span className="text-xs text-muted-foreground">• Connecting hearts through prayer</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNavigateToHome}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Community Feed
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {user.name} • Dashboard
            </Button>
          </div>
        </div>
      </nav>

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
              <Avatar className="w-16 h-16 border-2 border-white/30">
                <AvatarImage src={profilePicture || userProfile.profilePicture || ""} alt={userData.name} />
                <AvatarFallback className="text-lg bg-white/20 text-white backdrop-blur-sm">
                  {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
              Give Prayer or Blessing
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs matching reference design */}
        <div className="flex gap-1 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "activity", label: "Activity" },
            { id: "prayers", label: "Prayers & Blessings" },
            { id: "profile", label: "Profile" },
            { id: "leaderboard", label: "Leaderboard" },
            { id: "community", label: "Community" }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 font-medium transition-all whitespace-nowrap ${
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