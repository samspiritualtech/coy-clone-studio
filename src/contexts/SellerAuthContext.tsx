import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Session } from '@supabase/supabase-js';

interface SellerAuthContextType {
  sellerUser: User | null;
  sellerSignInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  sellerSignInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  sellerSignUpWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  sellerLogout: () => void;
  isSellerAuthenticated: boolean;
  isSellerLoading: boolean;
}

const SellerAuthContext = createContext<SellerAuthContextType | undefined>(undefined);

export const SellerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [sellerUser, setSellerUser] = useState<User | null>(null);
  const [isSellerLoading, setIsSellerLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setTimeout(() => {
            checkSellerStatus(session);
          }, 0);
        } else {
          setSellerUser(null);
          setIsSellerLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkSellerStatus(session);
      } else {
        setIsSellerLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSellerStatus = async (session: Session) => {
    try {
      const userId = session.user.id;

      // Check if user has a seller record
      const { data: seller } = await supabase
        .from('sellers')
        .select('id, brand_name, application_status')
        .eq('user_id', userId)
        .maybeSingle();

      if (seller) {
        // User has a seller record — load profile info
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        setSellerUser({
          id: userId,
          name: profile?.name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Seller',
          email: profile?.email || session.user.email || '',
          phone: profile?.phone || undefined,
          avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
        });
      } else {
        setSellerUser(null);
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
      setSellerUser(null);
    } finally {
      setIsSellerLoading(false);
    }
  };

  const sellerSignInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        const errorMsg = result.error.message || '';
        if (errorMsg.includes('redirect_uri_mismatch') || errorMsg.includes('redirect')) {
          return { success: false, error: 'Sign-in configuration error. Please try again or contact support.' };
        }
        if (errorMsg.includes('access_denied')) {
          return { success: false, error: 'Sign-in was cancelled.' };
        }
        return { success: false, error: 'Google sign-in failed. Please try again.' };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const sellerSignInWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign-in failed' };
    }
  };

  const sellerSignUpWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { success: false, error: error.message };
      if (!data.user) return { success: false, error: 'Signup failed' };

      // Auto-create seller record
      await supabase.from('sellers').insert({
        user_id: data.user.id,
        brand_name: email.split('@')[0],
        city: 'Unknown',
        seller_type: 'individual',
        application_status: 'approved',
      });

      // Assign seller role
      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: 'seller',
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const sellerLogout = async () => {
    await supabase.auth.signOut();
    setSellerUser(null);
  };

  return (
    <SellerAuthContext.Provider value={{
      sellerUser,
      sellerSignInWithGoogle,
      sellerSignInWithEmail,
      sellerSignUpWithEmail,
      sellerLogout,
      isSellerAuthenticated: !!sellerUser,
      isSellerLoading,
    }}>
      {children}
    </SellerAuthContext.Provider>
  );
};

export const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);
  if (!context) throw new Error('useSellerAuth must be used within SellerAuthProvider');
  return context;
};
