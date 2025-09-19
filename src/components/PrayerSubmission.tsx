import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Heart, Sparkles, Forward, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface PrayerSubmissionProps {
  onSubmit: (prayer: {
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
  }) => void;
}

export const PrayerSubmission = ({ onSubmit }: PrayerSubmissionProps) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState<"prayer" | "blessing">("prayer");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [onBehalfOf, setOnBehalfOf] = useState("");
  const [organizationType, setOrganizationType] = useState<"individual" | "organization">("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedScripture, setSuggestedScripture] = useState("");
  const [showScripture, setShowScripture] = useState(false);
  const [includeScripture, setIncludeScripture] = useState(false);
  const [isLoadingScripture, setIsLoadingScripture] = useState(false);
  const [forwardEmail, setForwardEmail] = useState("");
  const [forwardPhone, setForwardPhone] = useState("");
  const [showForward, setShowForward] = useState(false);
  const { toast } = useToast();

  const generateScriptureSuggestion = async (text: string) => {
    if (!text.trim() || text.length < 10) return;
    
    setIsLoadingScripture(true);
    try {
      // Simulated AI scripture suggestion - in real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions = [
        "\"Cast all your anxiety on him because he cares for you.\" - 1 Peter 5:7",
        "\"The Lord is close to the brokenhearted and saves those who are crushed in spirit.\" - Psalm 34:18",
        "\"And we know that in all things God works for the good of those who love him.\" - Romans 8:28",
        "\"Peace I leave with you; my peace I give you.\" - John 14:27",
        "\"Be strong and courageous. Do not be afraid; do not be discouraged.\" - Joshua 1:9",
        "\"May the God of hope fill you with all joy and peace.\" - Romans 15:13"
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setSuggestedScripture(randomSuggestion);
      setShowScripture(true);
    } catch (error) {
      console.error('Error generating scripture:', error);
    } finally {
      setIsLoadingScripture(false);
    }
  };

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
          anonymous,
          urgent,
          onBehalfOf: onBehalfOf.trim(),
          organizationType,
          scripture: includeScripture ? suggestedScripture : "",
          forwardEmail: forwardEmail.trim(),
          forwardPhone: forwardPhone.trim(),
        });

        // Reset form
        setContent("");
        setAuthor("");
        setCategory("");
        setType("prayer");
        setAnonymous(false);
        setUrgent(false);
        setOnBehalfOf("");
        setOrganizationType("individual");
        setSuggestedScripture("");
        setShowScripture(false);
        setIncludeScripture(false);
        setForwardEmail("");
        setForwardPhone("");
        setShowForward(false);
      
      toast({
        title: type === "prayer" ? "Prayer submitted! 🙏" : "Blessing request shared! ✨",
        description: "Your heartfelt message has been shared with the community.",
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
            Submit prayers or ask for blessings from the community
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
              <SelectItem value="prayer">Submit a prayer</SelectItem>
              <SelectItem value="blessing">Ask for a blessing</SelectItem>
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
            onBlur={() => content.length > 10 && !suggestedScripture && generateScriptureSuggestion(content)}
            placeholder={
              type === "prayer" 
                ? "Share your prayer with the community. Your words can bring comfort and hope to others..."
                : "What blessing are you seeking? Share what's on your heart..."
            }
            className="min-h-[120px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <div className="text-right text-primary-foreground/60 text-sm">
              {content.length}/500
            </div>
            {content.length > 10 && !showScripture && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => generateScriptureSuggestion(content)}
                disabled={isLoadingScripture}
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                {isLoadingScripture ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Scripture
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Scripture Suggestion */}
          {showScripture && suggestedScripture && (
            <div className="p-4 bg-primary-foreground/10 rounded-lg border border-primary-foreground/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                  <span className="text-sm font-medium text-primary-foreground">Suggested Scripture</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScripture(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80 italic mb-3">{suggestedScripture}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="includeScripture"
                    checked={includeScripture}
                    onCheckedChange={setIncludeScripture}
                  />
                  <Label htmlFor="includeScripture" className="text-sm text-primary-foreground">
                    Include this scripture
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => generateScriptureSuggestion(content)}
                  disabled={isLoadingScripture}
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Get Another
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Organization Type */}
        <div className="space-y-2">
          <Label htmlFor="organizationType" className="text-primary-foreground font-medium">
            Posting as:
          </Label>
          <Select value={organizationType} onValueChange={(value: "individual" | "organization") => setOrganizationType(value)}>
            <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="organization">Organization/Group</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author" className="text-primary-foreground font-medium">
            {organizationType === "individual" ? "Your name:" : "Organization name:"}
          </Label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={organizationType === "individual" ? "How would you like to be known?" : "Organization or group name"}
            className="w-full px-3 py-2 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            maxLength={50}
          />
        </div>

        {/* On Behalf Of */}
        <div className="space-y-2">
          <Label htmlFor="onBehalfOf" className="text-primary-foreground font-medium">
            On behalf of (optional):
          </Label>
          <input
            id="onBehalfOf"
            value={onBehalfOf}
            onChange={(e) => setOnBehalfOf(e.target.value)}
            placeholder="Who are you praying for or on behalf of?"
            className="w-full px-3 py-2 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            maxLength={100}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between space-x-3">
            <Label htmlFor="anonymous" className="text-primary-foreground text-sm font-medium">
              Post anonymously
            </Label>
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
            />
          </div>
          <div className="flex items-center justify-between space-x-3">
            <Label htmlFor="urgent" className="text-primary-foreground text-sm font-medium">
              Mark as urgent
            </Label>
            <Switch
              id="urgent"
              checked={urgent}
              onCheckedChange={setUrgent}
            />
          </div>
        </div>

        {/* Forward Option */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-primary-foreground text-sm font-medium">
              Forward to someone specific
            </Label>
            <Switch
              checked={showForward}
              onCheckedChange={setShowForward}
            />
          </div>
          
          {showForward && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-primary-foreground/10 rounded-lg border border-primary-foreground/20">
              <div className="space-y-2">
                <Label htmlFor="forwardEmail" className="text-primary-foreground text-sm">
                  Email (optional)
                </Label>
                <input
                  id="forwardEmail"
                  type="email"
                  value={forwardEmail}
                  onChange={(e) => setForwardEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-3 py-2 text-sm rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="forwardPhone" className="text-primary-foreground text-sm">
                  Phone (optional)
                </Label>
                <input
                  id="forwardPhone"
                  type="tel"
                  value={forwardPhone}
                  onChange={(e) => setForwardPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 text-sm rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                />
              </div>
            </div>
          )}
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
              {type === "prayer" ? "Submit Prayer" : "Ask for Blessing"}
            </div>
          )}
        </Button>
      </form>
    </Card>
  );
};