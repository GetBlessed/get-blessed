// Authentication & User Management Types
// Based on PRD 1 requirements

export interface User {
  id: string;
  email: string;
  first_name?: string;
  alias?: string;
  faith_view?: string;
  incognito: boolean;
  email_verified: boolean;
  email_verified_at?: string;
  onboarding_completed: boolean;
  last_activity?: string;
  avatar_url?: string;
  organization?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  device_name?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  revoked: boolean;
}

export interface LoginAttempt {
  id: string;
  email?: string;
  ip_address?: string;
  success: boolean;
  attempted_at: string;
  user_agent?: string;
}

// Auth Form Types
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface OnboardingFormData {
  first_name: string;
  faith_view?: string;
  alias?: string;
  incognito: boolean;
}

export interface PasswordResetFormData {
  email: string;
}

export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangeEmailFormData {
  newEmail: string;
  password: string;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  session: any | null; // Supabase session type
  loading: boolean;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (data: SignupFormData) => Promise<{ user: User | null; error: string | null; needsEmailConfirmation?: boolean }>;
  signIn: (data: LoginFormData) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (data: NewPasswordFormData) => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<OnboardingFormData>) => Promise<{ error: string | null }>;
  completeOnboarding: (data: OnboardingFormData) => Promise<{ error: string | null }>;
  resendVerification: () => Promise<{ error: string | null }>;
  refreshSession: () => Promise<void>;
  getUserSessions: () => Promise<{ sessions: UserSession[]; error: string | null }>;
  revokeSession: (sessionId: string) => Promise<{ error: string | null }>;
  revokeAllSessions: () => Promise<{ error: string | null }>;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

// API Response Types
export interface AuthResponse<T = any> {
  data: T | null;
  error: AuthError | null;
}

// Password validation requirements
export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

// Rate limiting types
export interface RateLimitStatus {
  attempts: number;
  maxAttempts: number;
  resetTime: string;
  blocked: boolean;
  requiresCaptcha: boolean;
}

// Email verification types
export interface EmailVerificationStatus {
  verified: boolean;
  sent: boolean;
  canResend: boolean;
  nextResendTime?: string;
}

// Faith view options (can be extended)
export type FaithView = 
  | 'christian'
  | 'muslim'
  | 'jewish'
  | 'hindu'
  | 'buddhist'
  | 'spiritual'
  | 'other'
  | 'prefer_not_to_say';

export const FAITH_VIEW_OPTIONS: { value: FaithView; label: string }[] = [
  { value: 'christian', label: 'Christian' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'jewish', label: 'Jewish' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'spiritual', label: 'Spiritual (non-religious)' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

// Activity tracking for auto-logout
export interface ActivityEvent {
  type: 'mouse' | 'keyboard' | 'scroll' | 'click' | 'focus';
  timestamp: number;
}

export interface InactivityConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  checkIntervalSeconds: number;
}
