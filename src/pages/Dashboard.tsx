import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Heart, Users, TrendingUp, Plus, Globe } from "lucide-react";

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  // Dynamic user data based on actual user
  const userData = {
    name: user.name,
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
              <h1 className="text-3xl font-serif font-semibold">Welcome back, {userData.name}</h1>
              <p className="text-primary-foreground/80 text-lg">{userData.title}</p>
            </div>
          </div>
          <Button className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30 rounded-xl px-6 py-3">
            <Plus className="h-4 w-4 mr-2" />
            Give Prayer
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-primary/10 p-2 rounded-2xl w-fit">
          <Button variant="default" size="sm" className="rounded-xl bg-primary text-primary-foreground px-6">Overview</Button>
          <Button variant="ghost" size="sm" className="rounded-xl px-6">Activity</Button>
          <Button variant="ghost" size="sm" className="rounded-xl px-6">Prayers</Button>
          <Button variant="ghost" size="sm" className="rounded-xl px-6">Community</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 rounded-2xl border-border/50 shadow-soft hover:shadow-medium transition-all bg-card">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl ${stat.color} bg-current/10 flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 rounded-2xl bg-gradient-primary text-primary-foreground border-0 shadow-elevated hover:shadow-elevated cursor-pointer transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Send Prayer</h3>
                  <p className="text-primary-foreground/80">Share your spiritual gifts</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 rounded-2xl border-border/50 shadow-soft hover:shadow-medium cursor-pointer transition-all group bg-card">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Explore Community</h3>
                  <p className="text-muted-foreground">Connect with other blessed souls</p>
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