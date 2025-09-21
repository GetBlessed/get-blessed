import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/supabase/prayers';

interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  nickname?: string;
  avatar_url?: string;
  organization?: string;
  phone?: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    nickname?: string;
    avatar_url?: string;
    organization?: string;
  };
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { user: currentUser } = await getCurrentUser();

      if (currentUser) {
        // Fetch full user profile from users table
        const supabase = createSupabaseClient();
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        const userWithProfile = {
          ...currentUser,
          profile: profile || undefined
        };

        setUser(userWithProfile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const signOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    // Check for existing session
    fetchUser();

    // Set up auth state listener
    const supabase = createSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          // Fetch full user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const userWithProfile = {
            ...session.user,
            profile: profile || undefined
          };

          setUser(userWithProfile as User);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};