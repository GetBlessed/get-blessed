import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrayerSubmissionProps {
  onSubmit: (prayer: {
    content: string;
    type: "prayer" | "blessing";
    category: string;
    author: string;
  }) => void;
}

export const PrayerSubmission = ({ onSubmit }: PrayerSubmissionProps) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState<"prayer" | "blessing">("prayer");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !author.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both your message and name are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate submission
      
      onSubmit({
        content: content.trim(),
        type,
        category: category || "General",
        author: author.trim(),
      });

      // Reset form
      setContent("");
      setAuthor("");
      setCategory("");
      setType("prayer");
      
      toast({
        title: type === "prayer" ? "Prayer shared" : "Blessing sent",
        description: "Your message has been shared with the community.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-hero shadow-elevated border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Share Your Heart
          </h2>
          <p className="text-primary-foreground/80">
            Request prayers or offer blessings to the community
          </p>
        </div>

        {/* Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-primary-foreground font-medium">
            I want to:
          </Label>
          <Select value={type} onValueChange={(value: "prayer" | "blessing") => setType(value)}>
            <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prayer">Request a prayer</SelectItem>
              <SelectItem value="blessing">Share a blessing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-primary-foreground font-medium">
            Category (optional):
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Health">Health & Healing</SelectItem>
              <SelectItem value="Family">Family & Relationships</SelectItem>
              <SelectItem value="Work">Work & Career</SelectItem>
              <SelectItem value="Gratitude">Gratitude & Thanks</SelectItem>
              <SelectItem value="Guidance">Guidance & Wisdom</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-primary-foreground font-medium">
            Your message:
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === "prayer" 
                ? "Share what's on your heart. The community is here to support you..."
                : "Share your blessing or words of encouragement..."
            }
            className="min-h-[120px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 resize-none"
            maxLength={500}
          />
          <div className="text-right text-primary-foreground/60 text-sm">
            {content.length}/500
          </div>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author" className="text-primary-foreground font-medium">
            Your name:
          </Label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="How would you like to be known?"
            className="w-full px-3 py-2 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            maxLength={50}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium py-3 transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              Sharing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {type === "prayer" ? <Heart className="h-5 w-5" /> : <Send className="h-5 w-5" />}
              {type === "prayer" ? "Share Prayer" : "Send Blessing"}
            </div>
          )}
        </Button>
      </form>
    </Card>
  );
};