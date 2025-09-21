import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Heart, CheckCircle, User, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { signUpUser, signInUser } from "@/lib/supabase/prayers";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export const SignupModal = ({
  isOpen,
  onClose,
  onSuccess
}: SignupModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Required fields",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your name.",
          variant: "destructive",
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { user, error } = await signUpUser({
          email: email.trim(),
          password: password,
          name: name.trim(),
          nickname: nickname.trim() || undefined,
          phone: phone.trim() || undefined,
          organization: organization.trim() || undefined,
        });

        if (error) {
          toast({
            title: "Signup failed",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome to GetBlessed! 🎉",
            description: "Your account has been created successfully.",
          });

          // Refresh user in auth context
          await refreshUser();

          if (onSuccess) {
            onSuccess(user);
          }

          // Reset form and close modal
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setName("");
          setNickname("");
          setPhone("");
          setOrganization("");
          onClose();
        }
      } else {
        // Sign in existing user
        const { user, error } = await signInUser({
          email: email.trim(),
          password: password,
        });

        if (error) {
          toast({
            title: "Login failed",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back! 🙏",
            description: "You've been signed in successfully.",
          });

          // Refresh user in auth context
          await refreshUser();

          if (onSuccess) {
            onSuccess(user);
          }

          // Reset form and close modal
          setEmail("");
          setPassword("");
          onClose();
        }
      }
    } catch (error) {
      console.error('Error with authentication:', error);
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
            {isSignUp ? (
              <>
                <User className="h-8 w-8" />
                <h2 className="text-2xl font-serif font-semibold">Join GetBlessed</h2>
              </>
            ) : (
              <>
                <Heart className="h-8 w-8" />
                <h2 className="text-2xl font-serif font-semibold">Welcome Back</h2>
              </>
            )}
          </div>
          <p className="text-primary-foreground/80">
            {isSignUp ? "Create your account to join our prayer community" : "Sign in to continue your prayer journey"}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required={isSignUp}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname (optional)</Label>
                  <Input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="How you'd like to be called"
                    className="rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">This is how you'll appear in the community</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "At least 6 characters" : "Your password"}
                  required
                  className="rounded-xl pl-10"
                />
              </div>
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required={isSignUp}
                      className="rounded-xl pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
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
              </>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl py-3 font-medium"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {isSubmitting
                ? (isSignUp ? "Creating account..." : "Signing in...")
                : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "New to GetBlessed?"}
            </p>
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                // Reset form
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setName("");
                setNickname("");
                setPhone("");
                setOrganization("");
              }}
              className="text-primary hover:text-primary/80"
            >
              {isSignUp ? "Sign in instead" : "Create a new account"}
            </Button>
          </div>

          {!isSignUp && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our inclusive community guidelines ✨
              </p>
            </div>
          )}
        </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupModal;