import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Seller, AppRole } from '@/types/seller';

interface SellerContextType {
  seller: Seller | null;
  isSeller: boolean;
  isSellerLoading: boolean;
  isApprovedSeller: boolean;
  userRoles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  refreshSeller: () => Promise<void>;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export const SellerProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [isSellerLoading, setIsSellerLoading] = useState(true);

  const fetchSellerData = async () => {
    if (!user?.id) {
      setSeller(null);
      setUserRoles([]);
      setIsSellerLoading(false);
      return;
    }

    try {
      // Fetch user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const roles = (rolesData || []).map(r => r.role as AppRole);
      setUserRoles(roles);

      // Fetch seller profile if user has seller role or has applied
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (sellerData) {
        setSeller(sellerData as Seller);
      } else {
        setSeller(null);
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setIsSellerLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSellerData();
    } else {
      setSeller(null);
      setUserRoles([]);
      setIsSellerLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const hasRole = (role: AppRole): boolean => {
    return userRoles.includes(role);
  };

  const isSeller = hasRole('seller') || (seller?.application_status === 'approved');
  const isApprovedSeller = seller?.application_status === 'approved' && seller?.is_active;

  const refreshSeller = async () => {
    setIsSellerLoading(true);
    await fetchSellerData();
  };

  return (
    <SellerContext.Provider
      value={{
        seller,
        isSeller,
        isSellerLoading,
        isApprovedSeller,
        userRoles,
        hasRole,
        refreshSeller,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};
