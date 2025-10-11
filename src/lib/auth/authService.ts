// Authentication Service
// Handles all auth operations with Supabase

import { createSupabaseClient } from '@/lib/supabase/client';
import type { 
  User, 
  SignupFormData, 
  LoginFormData, 
  OnboardingFormData,
  NewPasswordFormData,
  UserSession,
  AuthResponse,
  LoginAttempt,
  RateLimitStatus,
  EmailVerificationStatus
} from './types';

class AuthService {
  private supabase = createSupabaseClient();

  // Sign up with email and password
  async signUp(data: SignupFormData): Promise<AuthResponse<any>> {
    try {
      // Check rate limiting first
      const rateLimitCheck = await this.checkRateLimit(data.email);
      if (rateLimitCheck.blocked) {
        return {
          data: null,
          error: {
            message: `Too many attempts. Please try again in ${Math.ceil((new Date(rateLimitCheck.resetTime).getTime() - Date.now()) / 60000)} minutes.`,
            code: 'RATE_LIMITED'
          }
        };
      }

      // Validate password strength
      const passwordValidation = this.validatePassword(data.password);
      if (!passwordValidation.valid) {
        return {
          data: null,
          error: {
            message: passwordValidation.message,
            field: 'password',
            code: 'WEAK_PASSWORD'
          }
        };
      }

      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        return {
          data: null,
          error: {
            message: 'Passwords do not match',
            field: 'confirmPassword',
            code: 'PASSWORD_MISMATCH'
          }
        };
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            email_verified: false,
            onboarding_completed: false
          }
        }
      });

      // Log the signup attempt for debugging
      console.log('Supabase signup result:', {
        user: authData.user?.id,
        session: !!authData.session,
        error: authError?.message,
        needsConfirmation: !authData.session && !authError
      });

      if (authError) {
        // Log failed attempt
        await this.logLoginAttempt(data.email, false);
        
        return {
          data: null,
          error: {
            message: this.formatAuthError(authError.message),
            code: authError.message
          }
        };
      }

      if (!authData.user) {
        return {
          data: null,
          error: {
            message: 'Failed to create user account',
            code: 'SIGNUP_FAILED'
          }
        };
      }

      // Check if email confirmation is required
      if (!authData.session) {
        console.log('Email confirmation required for:', data.email);
        return {
          data: {
            user: authData.user,
            session: null,
            needsEmailConfirmation: true
          },
          error: null
        };
      }

      // User is immediately signed in (email confirmation disabled)
      // Create user profile record
      const { error: profileError } = await this.supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verified: true,
          onboarding_completed: false,
          incognito: false
        });

      if (profileError) {
        console.error('Failed to create user profile:', profileError);
      }

      // Log successful attempt
      await this.logLoginAttempt(data.email, true);

      return {
        data: {
          user: this.transformSupabaseUser(authData.user),
          session: authData.session
        },
        error: null
      };

    } catch (error) {
      console.error('Signup error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred. Please try again.',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }

  // Sign in with email and password
  async signIn(data: LoginFormData): Promise<AuthResponse<User>> {
    try {
      // Check rate limiting
      const rateLimitCheck = await this.checkRateLimit(data.email);
      if (rateLimitCheck.blocked) {
        return {
          data: null,
          error: {
            message: `Too many failed attempts. Please try again in ${Math.ceil((new Date(rateLimitCheck.resetTime).getTime() - Date.now()) / 60000)} minutes.`,
            code: 'RATE_LIMITED'
          }
        };
      }

      // Sign in with Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        // Log failed attempt
        await this.logLoginAttempt(data.email, false);
        
        return {
          data: null,
          error: {
            message: this.formatAuthError(authError.message),
            code: authError.message
          }
        };
      }

      if (!authData.user) {
        return {
          data: null,
          error: {
            message: 'Login failed',
            code: 'LOGIN_FAILED'
          }
        };
      }

      // Log successful attempt
      await this.logLoginAttempt(data.email, true);

      // Update last activity
      await this.updateLastActivity(authData.user.id);

      // Create session record
      await this.createSessionRecord(authData.user.id);

      return {
        data: this.transformSupabaseUser(authData.user),
        error: null
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred. Please try again.',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('Signout error:', error);
      return { error: 'Failed to sign out' };
    }
  }

  // Password reset
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return { error: this.formatAuthError(error.message) };
      }

      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: 'Failed to send password reset email' };
    }
  }

  // Update password
  async updatePassword(data: NewPasswordFormData): Promise<{ error: string | null }> {
    try {
      if (data.password !== data.confirmPassword) {
        return { error: 'Passwords do not match' };
      }

      const passwordValidation = this.validatePassword(data.password);
      if (!passwordValidation.valid) {
        return { error: passwordValidation.message };
      }

      const { error } = await this.supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        return { error: this.formatAuthError(error.message) };
      }

      // Revoke all other sessions for security
      await this.revokeAllOtherSessions();

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: 'Failed to update password' };
    }
  }

  // Complete onboarding
  async completeOnboarding(data: OnboardingFormData): Promise<{ error: string | null }> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return { error: 'Not authenticated' };
      }

      // Generate alias if not provided
      let alias = data.alias;
      if (!alias) {
        alias = await this.generateUniqueAlias(data.first_name);
      }

      // Update user profile
      const { error } = await this.supabase
        .from('users')
        .update({
          first_name: data.first_name,
          faith_view: data.faith_view,
          alias: alias,
          incognito: data.incognito,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Onboarding error:', error);
        return { error: 'Failed to complete onboarding' };
      }

      return { error: null };
    } catch (error) {
      console.error('Onboarding error:', error);
      return { error: 'Failed to complete onboarding' };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      // Get full user profile
      const { data: profile } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        alias: profile.alias,
        faith_view: profile.faith_view,
        incognito: profile.incognito || false,
        email_verified: profile.email_verified || false,
        email_verified_at: profile.email_verified_at,
        onboarding_completed: profile.onboarding_completed || false,
        last_activity: profile.last_activity,
        avatar_url: profile.avatar_url,
        organization: profile.organization,
        phone: profile.phone,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Utility methods
  private validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (password.length > 64) {
      return { valid: false, message: 'Password must be less than 64 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true, message: '' };
  }

  private formatAuthError(message: string): string {
    // Map Supabase error messages to user-friendly messages
    const errorMap: { [key: string]: string } = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please verify your email address before signing in',
      'User already registered': 'An account with this email already exists',
      'Password should be at least 6 characters': 'Password must be at least 8 characters long'
    };

    return errorMap[message] || message;
  }

  private transformSupabaseUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name,
      alias: user.user_metadata?.alias,
      faith_view: user.user_metadata?.faith_view,
      incognito: user.user_metadata?.incognito || false,
      email_verified: user.email_confirmed_at != null,
      email_verified_at: user.email_confirmed_at,
      onboarding_completed: user.user_metadata?.onboarding_completed || false,
      avatar_url: user.user_metadata?.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  private async checkRateLimit(email: string): Promise<RateLimitStatus> {
    // Implementation for rate limiting check
    // This would query login_attempts table and calculate if user is rate limited
    // For now, return a basic implementation
    return {
      attempts: 0,
      maxAttempts: 6,
      resetTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      blocked: false,
      requiresCaptcha: false
    };
  }

  private async logLoginAttempt(email: string, success: boolean): Promise<void> {
    try {
      await this.supabase
        .from('login_attempts')
        .insert({
          email,
          ip_address: null, // Would need to get from request
          success,
          attempted_at: new Date().toISOString(),
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Failed to log login attempt:', error);
    }
  }

  private async updateLastActivity(userId: string): Promise<void> {
    try {
      await this.supabase
        .from('users')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to update last activity:', error);
    }
  }

  private async createSessionRecord(userId: string): Promise<void> {
    try {
      await this.supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          device_name: this.getDeviceName(),
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });
    } catch (error) {
      console.error('Failed to create session record:', error);
    }
  }

  private async generateUniqueAlias(firstName: string): Promise<string> {
    // Call the database function to generate unique alias
    const { data, error } = await this.supabase
      .rpc('generate_unique_alias', { first_name: firstName });

    if (error || !data) {
      // Fallback to simple generation
      const baseAlias = firstName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'blessed';
      const randomSuffix = Math.floor(Math.random() * 1000);
      return `${baseAlias}${randomSuffix}`;
    }

    return data;
  }

  private async revokeAllOtherSessions(): Promise<void> {
    // Implementation would revoke all other sessions except current
    console.log('Revoking all other sessions');
  }

  private getDeviceName(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Mobile')) return 'Mobile Device';
    if (ua.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  }
}

export const authService = new AuthService();