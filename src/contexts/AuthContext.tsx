import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentPhone, setCurrentPhone] = useState<string>('');

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name || 'User',
          phone: profile.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate phone number (Indian format: 10 digits starting with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return { success: false, error: 'Invalid mobile number. Please enter a valid 10-digit Indian mobile number.' };
      }

      const phoneWithCountry = `+91${phone}`;
      setCurrentPhone(phone);

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneWithCountry,
      });

      if (error) {
        console.error('Send OTP error:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message || 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOtp = async (otp: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const phoneWithCountry = `+91${currentPhone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneWithCountry,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('Verify OTP error:', error);
        return { success: false, error: error.message };
      }

      // Update profile with name if provided
      if (data.user && name) {
        await supabase
          .from('profiles')
          .update({ name, phone: currentPhone })
          .eq('id', data.user.id);
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
      logout,
      isAuthenticated: !!session
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
