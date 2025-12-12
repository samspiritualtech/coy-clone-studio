import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  setupRecaptcha: (containerId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [currentPhone, setCurrentPhone] = useState<string>('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const setupRecaptcha = (containerId: string) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          window.recaptchaVerifier = undefined;
        }
      });
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const phoneWithCountry = `+91${phone}`;
      setCurrentPhone(phone);

      // Ensure recaptcha is set up
      if (!window.recaptchaVerifier) {
        setupRecaptcha('recaptcha-container');
      }

      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        return { success: false, error: 'reCAPTCHA not initialized. Please refresh the page.' };
      }

      const result = await signInWithPhoneNumber(auth, phoneWithCountry, appVerifier);
      setConfirmationResult(result);
      window.confirmationResult = result;
      
      return { success: true };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      
      // Reset recaptcha on error
      window.recaptchaVerifier = undefined;
      
      // Handle specific Firebase errors
      if (error.code === 'auth/invalid-phone-number') {
        return { success: false, error: 'Invalid phone number format.' };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many requests. Please try again later.' };
      } else if (error.code === 'auth/captcha-check-failed') {
        return { success: false, error: 'reCAPTCHA verification failed. Please try again.' };
      }
      
      return { success: false, error: error.message || 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOtp = async (otp: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const confirmation = confirmationResult || window.confirmationResult;
      
      if (!confirmation) {
        return { success: false, error: 'No OTP request found. Please request a new OTP.' };
      }

      const result = await confirmation.confirm(otp);
      const firebaseUser = result.user;

      // Create app user from Firebase user
      const appUser: User = {
        id: firebaseUser.uid,
        name: name || `User ${currentPhone.slice(-4)}`,
        phone: currentPhone
      };

      setUser(appUser);
      setConfirmationResult(null);
      window.confirmationResult = undefined;
      
      return { success: true };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      if (error.code === 'auth/invalid-verification-code') {
        return { success: false, error: 'Invalid OTP. Please check and try again.' };
      } else if (error.code === 'auth/code-expired') {
        return { success: false, error: 'OTP has expired. Please request a new one.' };
      }
      
      return { success: false, error: error.message || 'Verification failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setConfirmationResult(null);
    window.confirmationResult = undefined;
  };

  return (
    <AuthContext.Provider value={{
      user,
      sendOtp,
      verifyOtp,
      logout,
      isAuthenticated: !!user,
      setupRecaptcha
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
