import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Heart, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Email and password are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onLogin({ name: "Favio Osorio", email: loginEmail });
    toast({
      title: "Welcome back! 🙏",
      description: "You've successfully signed in to GetBlessed.",
    });
    onClose();
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to create your account.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate signup
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onLogin({ name: signupName, email: signupEmail });
    toast({
      title: "Welcome to GetBlessed! ✨",
      description: "Your account has been created successfully.",
    });
    onClose();
    setIsLoading(false);
  };

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
            <Heart className="h-8 w-8" />
            <h2 className="text-2xl font-serif font-semibold">Join GetBlessed</h2>
          </div>
          <p className="text-primary-foreground/80">Connect your heart with our community</p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl py-3 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Your full name"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="rounded-xl"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl py-3 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;