import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Heart, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addToWaitlist } from "@/lib/supabase/prayers";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal = ({ 
  isOpen, 
  onClose 
}: WaitlistModalProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase waitlist table
      await addToWaitlist({
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined,
        organization: organization.trim() || undefined,
      });

      toast({
        title: "You're on the list! 🎉",
        description: "We'll notify you when new features are available.",
      });

      // Reset form and close modal
      setEmail("");
      setName("");
      setPhone("");
      setOrganization("");
      onClose();
    } catch (error) {
      console.error('Error adding to waitlist:', error);

      // Check if it's a duplicate email error
      const errorMessage = error instanceof Error && error.message.includes('already on the waitlist')
        ? "This email is already on the waitlist!"
        : "Please try again in a moment.";

      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-md bg-card border shadow-elevated rounded-2xl overflow-hidden relative">
        <div className="relative bg-gradient-primary text-primary-foreground p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-8 w-8" />
            <h2 className="text-2xl font-serif font-semibold">Prayer Shared!</h2>
          </div>
          <p className="text-primary-foreground/80">Your heart has been heard by our community</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <p className="text-foreground mb-2">
              We're building amazing new features for our prayer community!
            </p>
            <p className="text-sm text-muted-foreground">
              Join our waitlist to get early access and updates
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization (optional)</Label>
              <Input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Your organization or church"
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl py-3 font-medium"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Adding you..." : "Join Waitlist"}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Your prayer is already live and being supported by our community ✨
            </p>
          </div>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default WaitlistModal;