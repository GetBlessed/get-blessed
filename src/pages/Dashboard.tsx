import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Heart, Users, TrendingUp, Plus, Globe } from "lucide-react";

const Dashboard = () => {
  // Mock user data
  const userData = {
    name: "Nicole Davis",
    title: "Prayer Giver • Blessed Guardian",
    credibilityScore: 87,
    totalPrayers: 42,
    currentStreak: 7,
    level: "Blessed Guardian"
  };

  const stats = [
    {
      icon: Star,
      title: "Credibility Score",
      value: userData.credibilityScore,
      color: "text-purple-600"
    },
    {
      icon: Heart,
      title: "Total prayers shared",
      value: userData.totalPrayers,
      color: "text-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Current Streak",
      value: `${userData.currentStreak} days`,
      color: "text-emerald-600"
    },
    {
      icon: Users,
      title: "Level",
      value: userData.level,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-semibold">Welcome back, {userData.name}</h1>
              <p className="text-primary-foreground/80">{userData.title}</p>
            </div>
          </div>
          <Button className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30">
            <Plus className="h-4 w-4 mr-2" />
            Give Prayer
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-muted/50 p-2 rounded-2xl w-fit">
          <Button variant="default" size="sm" className="rounded-xl">Overview</Button>
          <Button variant="ghost" size="sm" className="rounded-xl">Activity</Button>
          <Button variant="ghost" size="sm" className="rounded-xl">Prayers</Button>
          <Button variant="ghost" size="sm" className="rounded-xl">Community</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 rounded-2xl border-border/50 shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} bg-current/10 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground border-0 shadow-elevated hover:shadow-elevated cursor-pointer transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Send Prayer</h3>
                  <p className="text-primary-foreground/80 text-sm">Share your spiritual gifts</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border-border/50 shadow-soft hover:shadow-medium cursor-pointer transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Explore Community</h3>
                  <p className="text-muted-foreground text-sm">Connect with other blessed souls</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;