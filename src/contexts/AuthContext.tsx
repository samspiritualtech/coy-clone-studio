import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(() => {
            fetchUserProfile(session.user.id, session);
          }, 0);
        } else {
          setUser(null);
          setIsNewUser(false);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, currentSession: Session | null) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name || currentSession?.user?.user_metadata?.full_name || 'User',
          email: profile.email || currentSession?.user?.email || '',
          phone: profile.phone || undefined,
          avatarUrl: profile.avatar_url || currentSession?.user?.user_metadata?.avatar_url
        });
        // Check if user has completed onboarding
        setIsNewUser(profile.is_onboarded === false);
      } else if (currentSession?.user) {
        // Fallback to session metadata if profile doesn't exist yet
        setUser({
          id: currentSession.user.id,
          name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || 'User',
          email: currentSession.user.email || '',
          phone: currentSession.user.user_metadata?.phone,
          avatarUrl: currentSession.user.user_metadata?.avatar_url
        });
        // New user without profile
        setIsNewUser(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Still set user from session metadata on error
      if (currentSession?.user) {
        setUser({
          id: currentSession.user.id,
          name: currentSession.user.user_metadata?.full_name || 'User',
          email: currentSession.user.email || '',
          avatarUrl: currentSession.user.user_metadata?.avatar_url
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        return { success: false, error: result.error.message || 'Google sign-in failed' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsNewUser(false);
  };

  const completeOnboarding = async () => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('profiles')
      .update({ is_onboarded: true, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }

    setIsNewUser(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      logout,
      isAuthenticated: !!session,
      isLoading,
      isNewUser,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
