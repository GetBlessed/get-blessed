import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Calendar, TrendingUp } from "lucide-react";

const MyPrayers = () => {
  const [myPrayers] = useState([
    {
      id: "1",
      content: "Please pray for my job interview tomorrow. I'm feeling nervous but hopeful.",
      type: "prayer" as const,
      date: "2 hours ago",
      responses: 12,
      supports: 23
    },
    {
      id: "2", 
      content: "Thank you all for the prayers! I got the job! Blessing everyone who supported me.",
      type: "blessing" as const,
      date: "1 day ago",
      responses: 8,
      supports: 45
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Stats Header */}
      <div className="bg-gradient-primary text-primary-foreground px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-semibold mb-6">My Prayer Journey</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-semibold">42</p>
                  <p className="text-sm opacity-80">Prayers Shared</p>
                </div>
              </div>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground p-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-semibold">128</p>
                  <p className="text-sm opacity-80">Responses Received</p>
                </div>
              </div>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-semibold">7 days</p>
                  <p className="text-sm opacity-80">Current Streak</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* My Prayers List */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-semibold">Recent Activity</h2>
          <Button className="bg-primary hover:bg-primary/90">Share New Prayer</Button>
        </div>

        <div className="space-y-6">
          {myPrayers.map((prayer) => (
            <Card key={prayer.id} className={`p-6 rounded-2xl border shadow-soft hover:shadow-medium transition-all ${
              prayer.type === 'prayer' 
                ? 'bg-gradient-prayer border-prayer/30' 
                : 'bg-gradient-blessing border-blessing/30'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                    prayer.type === 'prayer'
                      ? 'bg-prayer text-prayer-foreground'
                      : 'bg-blessing text-blessing-foreground'
                  }`}>
                    {prayer.type === 'prayer' ? 'Prayer Request' : 'Blessing Shared'}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    {prayer.date}
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed font-medium">
                  {prayer.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{prayer.supports} supports</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{prayer.responses} responses</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPrayers;