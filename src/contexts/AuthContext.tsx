import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string; demoOtp?: string }>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const sendOtp = async (phone: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone }
      });

      if (error) {
        return { success: false, error: error.message || 'Failed to send OTP' };
      }

      if (!data.success) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }

      return { success: true, demoOtp: data.demoOtp };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyOtp = async (phone: string, otp: string, name?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone, otp, name }
      });

      if (error) {
        return { success: false, error: error.message || 'Verification failed' };
      }

      if (!data.success) {
        return { success: false, error: data.error || 'Invalid OTP' };
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      sendOtp,
      verifyOtp,
      logout,
      isAuthenticated: !!user
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
