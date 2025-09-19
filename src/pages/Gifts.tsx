import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Coffee, Heart, DollarSign, Star } from "lucide-react";

const Gifts = () => {
  const giftOptions = [
    {
      icon: Coffee,
      title: "Buy a Coffee",
      description: "Send a virtual coffee to brighten someone's day",
      price: "$5",
      color: "bg-amber-50 text-amber-700"
    },
    {
      icon: Heart,
      title: "Send Love",
      description: "Share a heartfelt message with spiritual support",
      price: "$10",
      color: "bg-pink-50 text-pink-700"
    },
    {
      icon: DollarSign,
      title: "Charity Donation",
      description: "Make a donation to a charity on their behalf",
      price: "$25",
      color: "bg-emerald-50 text-emerald-700"
    },
    {
      icon: Star,
      title: "Premium Blessing",
      description: "Send a special prayer with extra spiritual support",
      price: "$50",
      color: "bg-purple-50 text-purple-700"
    }
  ];

  const recentGifts = [
    {
      id: "1",
      from: "Sarah M.",
      to: "Michael K.",
      type: "Coffee",
      amount: "$5",
      date: "2 hours ago"
    },
    {
      id: "2", 
      from: "David L.",
      to: "Anonymous",
      type: "Charity Donation",
      amount: "$25",
      date: "5 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Gift className="h-8 w-8" />
            <h1 className="text-3xl font-serif font-semibold">Spiritual Gifts</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg">
            Show your support and love through meaningful gifts
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Gift Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">Send a Gift</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {giftOptions.map((gift, index) => (
              <Card key={index} className="p-6 rounded-2xl border-border/50 shadow-soft hover:shadow-medium transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${gift.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <gift.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{gift.title}</h3>
                      <span className="text-lg font-semibold text-primary">{gift.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{gift.description}</p>
                    <Button size="sm" className="w-full rounded-xl">
                      Send Gift
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Gifts */}
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">Recent Community Gifts</h2>
          <div className="space-y-4">
            {recentGifts.map((gift) => (
              <Card key={gift.id} className="p-4 rounded-2xl border-border/30 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{gift.from}</span> sent a{" "}
                        <span className="font-medium text-primary">{gift.type}</span> to{" "}
                        <span className="font-medium">{gift.to}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{gift.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">{gift.amount}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gifts;