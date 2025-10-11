// Authentication Modal Component
// Two-step flow: Method Selection → Authentication Form

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  User, 
  Heart, 
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { 
  SignupFormData, 
  LoginFormData, 
  OnboardingFormData, 
  PasswordResetFormData,
  FaithView,
  PasswordRequirements 
} from '@/lib/auth/types';
import { FAITH_VIEW_OPTIONS } from '@/lib/auth/types';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  redirectAfterAuth?: string;
}

type AuthStep = 'method' | 'login' | 'signup' | 'forgot-password' | 'email-verification' | 'onboarding';

export function AuthModal({ 
  isOpen, 
  onClose, 
  defaultMode = 'login',
  redirectAfterAuth 
}: AuthModalProps) {
  const { signUp, signIn, resetPassword, completeOnboarding, user, loading } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('method');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data states
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [onboardingData, setOnboardingData] = useState<OnboardingFormData>({
    first_name: '',
    faith_view: undefined,
    alias: '',
    incognito: false
  });

  const [forgotPasswordData, setForgotPasswordData] = useState<PasswordResetFormData>({
    email: ''
  });

  // Password strength validation
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(defaultMode === 'signup' ? 'signup' : 'method');
      resetForms();
    }
  }, [isOpen, defaultMode]);

  // Handle successful auth - check if onboarding needed
  useEffect(() => {
    if (user && !user.onboarding_completed && step !== 'onboarding') {
      setStep('onboarding');
    } else if (user && user.onboarding_completed) {
      handleClose();
    }
  }, [user, step]);

  const resetForms = () => {
    setLoginData({ email: '', password: '', rememberMe: false });
    setSignupData({ email: '', password: '', confirmPassword: '' });
    setOnboardingData({ first_name: '', faith_view: undefined, alias: '', incognito: false });
    setForgotPasswordData({ email: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordRequirements({
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSymbol: false
    });
  };

  const handleClose = () => {
    resetForms();
    onClose();
    if (redirectAfterAuth) {
      window.location.href = redirectAfterAuth;
    }
  };

  // Validate password strength in real-time
  const validatePasswordStrength = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password)
    });
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log('Starting login...', { email: loginData.email });
      const result = await signIn(loginData);
      console.log('Login result:', result);
      
      if (!result.error) {
        console.log('Login successful, closing modal');
        toast.success('Welcome back!');
        onClose(); // Close the modal on successful login
      } else {
        console.error('Login error:', result.error);
        toast.error(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate password requirements
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    if (!allRequirementsMet) {
      toast.error('Please ensure your password meets all requirements');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Starting signup process...', { email: signupData.email });
      const result = await signUp(signupData);
      console.log('Signup result:', result);
      
      if (!result.error) {
        // Check if email confirmation is needed
        if (result.needsEmailConfirmation) {
          console.log('Moving to email verification step');
          setStep('email-verification');
        } else {
          console.log('Moving to onboarding step');
          // Direct signup without email verification
          setStep('onboarding');
        }
      } else {
        console.error('Signup error:', result.error);
        // Show error toast as backup if AuthProvider doesn't
        toast.error(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await resetPassword(forgotPasswordData.email);
      if (!result.error) {
        setStep('method');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle onboarding
  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!onboardingData.first_name.trim()) {
      toast.error('Please enter your first name');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Starting onboarding...', onboardingData);
      const result = await completeOnboarding(onboardingData);
      console.log('Onboarding result:', result);
      
      if (!result.error) {
        toast.success('Welcome to GetBlessed! Your profile is complete.');
        onClose(); // Close the modal on success
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate alias suggestion from first name
  const generateAliasSuggestion = (firstName: string) => {
    const cleanName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanName && !onboardingData.alias) {
      setOnboardingData(prev => ({ ...prev, alias: cleanName }));
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to GetBlessed</h2>
        <p className="text-muted-foreground">
          Join our community of faith, hope, and support
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => setStep('login')}
          variant="outline"
          className="w-full h-12 text-left justify-start"
        >
          <Mail className="h-5 w-5 mr-3" />
          <div>
            <div className="font-medium">Sign In</div>
            <div className="text-sm text-muted-foreground">Continue with your account</div>
          </div>
        </Button>

        <Button
          onClick={() => setStep('signup')}
          variant="outline"
          className="w-full h-12 text-left justify-start"
        >
          <User className="h-5 w-5 mr-3" />
          <div>
            <div className="font-medium">Create Account</div>
            <div className="text-sm text-muted-foreground">Join our community</div>
          </div>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
          onClick={() => setStep('method')}
          className="p-1"
          >
          <ArrowLeft className="h-4 w-4" />
          </Button>
        <div>
          <h2 className="text-xl font-semibold">Sign In</h2>
          <p className="text-sm text-muted-foreground">Welcome back to GetBlessed</p>
        </div>
      </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
            value={loginData.email}
            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
                  <Input
                    id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              autoComplete="current-password"
                    required
                  />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="remember-me"
              checked={loginData.rememberMe}
              onCheckedChange={(checked) => setLoginData(prev => ({ ...prev, rememberMe: checked }))}
            />
            <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
          </div>
          
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => setStep('forgot-password')}
            className="p-0 h-auto"
          >
            Forgot password?
          </Button>
                </div>

                <Button
                  type="submit"
          className="w-full"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
            </>
                  ) : (
            'Sign In'
                  )}
                </Button>
              </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button
            variant="link"
            size="sm"
            onClick={() => setStep('signup')}
            className="p-0 h-auto"
          >
            Create one
          </Button>
        </p>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('method')}
          className="p-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Create Account</h2>
          <p className="text-sm text-muted-foreground">Join our community of faith</p>
        </div>
      </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
            value={signupData.email}
            onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
                  <Input
                    id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={signupData.password}
              onChange={(e) => {
                const password = e.target.value;
                setSignupData(prev => ({ ...prev, password }));
                validatePasswordStrength(password);
              }}
                    placeholder="Create a strong password"
              autoComplete="new-password"
                    required
                  />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Password Requirements */}
          {signupData.password && (
            <Card className="p-3 mt-2">
              <div className="text-sm font-medium mb-2">Password Requirements:</div>
              <div className="space-y-1 text-xs">
                <div className={`flex items-center space-x-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {passwordRequirements.minLength ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {passwordRequirements.hasUppercase ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {passwordRequirements.hasLowercase ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {passwordRequirements.hasNumber ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  <span>One number</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasSymbol ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {passwordRequirements.hasSymbol ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  <span>One special character</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <div className="relative">
            <Input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
            <p className="text-sm text-red-600">Passwords do not match</p>
          )}
        </div>

                <Button
                  type="submit"
          className="w-full"
          disabled={isSubmitting || loading || !Object.values(passwordRequirements).every(req => req)}
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button
            variant="link"
            size="sm"
            onClick={() => setStep('login')}
            className="p-0 h-auto"
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('method')}
          className="p-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <p className="text-sm text-muted-foreground">We'll send you a reset link</p>
        </div>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            value={forgotPasswordData.email}
            onChange={(e) => setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
                    </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send Reset Link'
                  )}
                </Button>
              </form>
    </div>
  );

  const renderOnboarding = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Welcome to GetBlessed!</h2>
        <p className="text-muted-foreground">Let's set up your profile</p>
      </div>

      <form onSubmit={handleOnboarding} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name *</Label>
          <Input
            id="first-name"
            value={onboardingData.first_name}
            onChange={(e) => {
              const firstName = e.target.value;
              setOnboardingData(prev => ({ ...prev, first_name: firstName }));
              generateAliasSuggestion(firstName);
            }}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alias">Alias</Label>
          <Input
            id="alias"
            value={onboardingData.alias}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, alias: e.target.value }))}
            placeholder="Choose your display name (optional)"
          />
          <p className="text-xs text-muted-foreground">
            This is how others will see you. Leave blank to use your first name.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="faith-view">Faith View (Optional)</Label>
          <Select
            value={onboardingData.faith_view}
            onValueChange={(value: FaithView) => setOnboardingData(prev => ({ ...prev, faith_view: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your faith view" />
            </SelectTrigger>
            <SelectContent>
              {FAITH_VIEW_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="incognito" className="text-sm font-medium">
              Incognito Mode
            </Label>
            <p className="text-xs text-muted-foreground">
              Hide your name from public posts by default
            </p>
          </div>
          <Switch
            id="incognito"
            checked={onboardingData.incognito}
            onCheckedChange={(checked) => setOnboardingData(prev => ({ ...prev, incognito: checked }))}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Completing setup...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </form>
    </div>
  );

  // Email Verification Step
  const renderEmailVerification = () => (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep('method')}
            className="p-1 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle>Check Your Email</DialogTitle>
        </div>
      </DialogHeader>

      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Verification Email Sent!</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to:
          </p>
          <p className="text-sm font-medium text-foreground">
            {signupData.email}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
          <p className="text-sm font-medium">Next Steps:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>1. Check your email inbox</li>
            <li>2. Click the verification link</li>
            <li>3. Return here to complete your profile</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or{' '}
          <button 
            onClick={() => {
              // TODO: Implement resend verification
              toast.info('Resend feature coming soon!');
            }}
            className="text-primary hover:underline"
          >
            resend verification
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep('method')}
          className="flex-1"
        >
          Back to Sign In
        </Button>
        <Button
          onClick={onClose}
          className="flex-1"
        >
          I'll Verify Later
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 'method':
        return renderMethodSelection();
      case 'login':
        return renderLogin();
      case 'signup':
        return renderSignup();
      case 'forgot-password':
        return renderForgotPassword();
      case 'email-verification':
        return renderEmailVerification();
      case 'onboarding':
        return renderOnboarding();
      default:
        return renderMethodSelection();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="p-6">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}