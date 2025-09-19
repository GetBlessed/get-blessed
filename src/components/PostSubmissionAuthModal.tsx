import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, CheckCircle } from "lucide-react";

interface PostSubmissionAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
}

export const PostSubmissionAuthModal = ({ 
  isOpen, 
  onClose, 
  onSignUp, 
  onSignIn 
}: PostSubmissionAuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border shadow-elevated rounded-2xl overflow-hidden">
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
              Would you like to create an account to track your prayers and connect with our community?
            </p>
            <p className="text-sm text-muted-foreground">
              You can always do this later - no worries!
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onSignUp}
              className="w-full rounded-xl py-3 font-medium"
            >
              <Heart className="h-4 w-4 mr-2" />
              Create Account
            </Button>
            
            <Button
              onClick={onSignIn}
              variant="outline"
              className="w-full rounded-xl py-3 font-medium"
            >
              Sign In to Existing Account
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full rounded-xl py-3 font-medium text-muted-foreground"
            >
              Skip for Now
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Your prayer is already live and being supported by our community ✨
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostSubmissionAuthModal;