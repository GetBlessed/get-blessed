// Authentication Context Provider
// Manages global auth state and provides auth methods to components

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { authService } from './authService';
import type { 
  AuthContextType, 
  AuthState, 
  User, 
  SignupFormData, 
  LoginFormData, 
  OnboardingFormData,
  NewPasswordFormData,
  UserSession
} from './types';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false
  });

  const supabase = createSupabaseClient();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setState(prev => ({
              ...prev,
              loading: false,
              initialized: true
            }));
          }
          return;
        }

        if (session?.user) {
          const user = await authService.getCurrentUser();
          if (mounted) {
            setState(prev => ({
              ...prev,
              user,
              session,
              loading: false,
              initialized: true
            }));
          }
        } else {
          if (mounted) {
            setState(prev => ({
              ...prev,
              user: null,
              session: null,
              loading: false,
              initialized: true
            }));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            initialized: true
          }));
        }
      }
    }

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          const user = await authService.getCurrentUser();
          if (mounted) {
            setState(prev => ({
              ...prev,
              user,
              session,
              loading: false
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setState(prev => ({
              ...prev,
              user: null,
              session: null,
              loading: false
            }));
          }
        } else if (event === 'TOKEN_REFRESHED' && session) {
          if (mounted) {
            setState(prev => ({
              ...prev,
              session,
              loading: false
            }));
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Auto-logout on inactivity
  useEffect(() => {
    if (!state.user) return;

    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let warningShown = false;

    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    const WARNING_TIME = 4 * 60 * 1000; // 4 minutes (1 minute warning)

    function resetTimers() {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      warningShown = false;

      // Show warning after 4 minutes
      warningTimer = setTimeout(() => {
        if (!warningShown) {
          warningShown = true;
          toast.warning('Your session will expire in 1 minute due to inactivity.', {
            duration: 60000, // Show for 1 minute
            action: {
              label: 'Stay signed in',
              onClick: () => {
                resetTimers();
                toast.success('Session extended');
              }
            }
          });
        }
      }, WARNING_TIME);

      // Auto logout after 5 minutes
      inactivityTimer = setTimeout(async () => {
        toast.error('Session timed out for your safety. Please sign in again.');
        await signOut();
      }, INACTIVITY_TIMEOUT);
    }

    function handleActivity() {
      resetTimers();
    }

    // Activity events to track
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start timers
    resetTimers();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [state.user]);

  // Auth methods
  const signUp = useCallback(async (data: SignupFormData) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await authService.signUp(data);
      
      if (result.error) {
        const errorMessage = typeof result.error === 'string' ? result.error : result.error.message;
        toast.error(errorMessage);
        return { user: null, error: errorMessage };
      }

      if (result.data) {
        // Check if email confirmation is needed
        if (result.data.needsEmailConfirmation) {
          // Don't show any toast - let the modal handle the messaging
          return { 
            user: result.data.user, 
            error: null, 
            needsEmailConfirmation: true 
          };
        } else {
          toast.success('Account created successfully!');
          return { user: result.data.user, error: null };
        }
      }

      return { user: null, error: 'Failed to create account' };
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
      return { user: null, error: 'An unexpected error occurred' };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signIn = useCallback(async (data: LoginFormData) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await authService.signIn(data);
      
      if (result.error) {
        // Don't show toast here - let AuthModal handle it
        return { user: null, error: result.error.message || result.error };
      }

      if (result.data) {
        // Don't show success toast here - let AuthModal handle it
        return { user: result.data, error: null };
      }

      return { user: null, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return { user: null, error: 'An unexpected error occurred' };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Signout error:', error);
      toast.error('Error signing out');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const result = await authService.resetPassword(email);
      
      if (result.error) {
        toast.error(result.error);
        return { error: result.error };
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email');
      return { error: 'Failed to send password reset email' };
    }
  }, []);

  const updatePassword = useCallback(async (data: NewPasswordFormData) => {
    try {
      const result = await authService.updatePassword(data);
      
      if (result.error) {
        toast.error(result.error);
        return { error: result.error };
      }

      toast.success('Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Failed to update password');
      return { error: 'Failed to update password' };
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<OnboardingFormData>) => {
    if (!state.user) {
      return { error: 'Not authenticated' };
    }

    try {
      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id);

      if (error) {
        toast.error('Failed to update profile');
        return { error: 'Failed to update profile' };
      }

      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        setState(prev => ({
          ...prev,
          user: updatedUser
        }));
      }

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return { error: 'Failed to update profile' };
    }
  }, [state.user, supabase]);

  const completeOnboarding = useCallback(async (data: OnboardingFormData) => {
    try {
      const result = await authService.completeOnboarding(data);
      
      if (result.error) {
        toast.error(result.error);
        return { error: result.error };
      }

      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        setState(prev => ({
          ...prev,
          user: updatedUser
        }));
      }

      toast.success('Welcome to GetBlessed! Your profile is now complete.');
      return { error: null };
    } catch (error) {
      console.error('Complete onboarding error:', error);
      toast.error('Failed to complete onboarding');
      return { error: 'Failed to complete onboarding' };
    }
  }, []);

  const resendVerification = useCallback(async () => {
    if (!state.user) {
      return { error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: state.user.email
      });

      if (error) {
        toast.error('Failed to resend verification email');
        return { error: 'Failed to resend verification email' };
      }

      toast.success('Verification email sent! Check your inbox.');
      return { error: null };
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email');
      return { error: 'Failed to resend verification email' };
    }
  }, [state.user, supabase.auth]);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        return;
      }

      if (session) {
        setState(prev => ({
          ...prev,
          session
        }));
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }, [supabase.auth]);

  const getUserSessions = useCallback(async () => {
    if (!state.user) {
      return { sessions: [], error: 'Not authenticated' };
    }

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', state.user.id)
        .eq('revoked', false)
        .order('last_activity', { ascending: false });

      if (error) {
        return { sessions: [], error: 'Failed to fetch sessions' };
      }

      return { sessions: data || [], error: null };
    } catch (error) {
      console.error('Get sessions error:', error);
      return { sessions: [], error: 'Failed to fetch sessions' };
    }
  }, [state.user, supabase]);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ revoked: true })
        .eq('id', sessionId);

      if (error) {
        toast.error('Failed to revoke session');
        return { error: 'Failed to revoke session' };
      }

      toast.success('Session revoked successfully');
      return { error: null };
    } catch (error) {
      console.error('Revoke session error:', error);
      toast.error('Failed to revoke session');
      return { error: 'Failed to revoke session' };
    }
  }, [supabase]);

  const revokeAllSessions = useCallback(async () => {
    if (!state.user) {
      return { error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ revoked: true })
        .eq('user_id', state.user.id);

      if (error) {
        toast.error('Failed to revoke all sessions');
        return { error: 'Failed to revoke all sessions' };
      }

      toast.success('All sessions revoked successfully');
      return { error: null };
    } catch (error) {
      console.error('Revoke all sessions error:', error);
      toast.error('Failed to revoke all sessions');
      return { error: 'Failed to revoke all sessions' };
    }
  }, [state.user, supabase]);

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    completeOnboarding,
    resendVerification,
    refreshSession,
    getUserSessions,
    revokeSession,
    revokeAllSessions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
