import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string; demoOtp?: string }>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message || 'Failed to sign in with Google' };
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string; demoOtp?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone }
      });

      if (error) {
        console.error('Send OTP error:', error);
        return { success: false, error: error.message || 'Failed to send OTP' };
      }

      if (!data.success) {
        return { success: false, error: data.error };
      }

      return { success: true, demoOtp: data.demoOtp };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message || 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOtp = async (phone: string, otp: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone, otp, name }
      });

      if (error) {
        console.error('Verify OTP error:', error);
        return { success: false, error: error.message || 'Verification failed' };
      }

      if (!data.success) {
        return { success: false, error: data.error };
      }

      // Set the session from the response
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message || 'Verification failed. Please try again.' };
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
      sendOtp,
      verifyOtp,
      signInWithGoogle,
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
