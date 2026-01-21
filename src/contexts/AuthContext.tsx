import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const handleAuthError = (error: any): string => {
  const message = error?.message || 'Authentication failed';
  
  // Handle provider-related errors
  if (message.includes('provider') || message.includes('OAuth')) {
    return 'This authentication method is not currently supported.';
  }
  
  // Handle common errors
  if (message === 'Invalid login credentials') {
    return 'Invalid email or password.';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email before logging in.';
  }
  
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists.';
  }

  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters.';
  }
  
  return message;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } else if (currentSession?.user) {
        // Fallback to session metadata if profile doesn't exist yet
        setUser({
          id: currentSession.user.id,
          name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || 'User',
          email: currentSession.user.email || '',
          phone: currentSession.user.user_metadata?.phone,
          avatarUrl: currentSession.user.user_metadata?.avatar_url
        });
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

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name }
        }
      });

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: handleAuthError(error) };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: handleAuthError(error) };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      signUp,
      signIn,
      logout,
      isAuthenticated: !!session,
      isLoading
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
