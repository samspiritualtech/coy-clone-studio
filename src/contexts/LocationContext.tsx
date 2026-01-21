import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserLocation {
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface DeliveryInfo {
  isDeliverable: boolean;
  deliveryDays: number;
  expressAvailable: boolean;
}

interface LocationContextType {
  location: UserLocation | null;
  isLoading: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unavailable';
  requestLocation: () => Promise<void>;
  setManualLocation: (location: UserLocation) => Promise<void>;
  checkDelivery: (pincode: string) => Promise<DeliveryInfo | null>;
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;
  showManualSelector: boolean;
  setShowManualSelector: (show: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = 'ogura_user_location';
const PERMISSION_ASKED_KEY = 'ogura_location_asked';

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);

  // Load location from storage or database on mount
  useEffect(() => {
    const loadLocation = async () => {
      // First check localStorage
      const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (storedLocation) {
        try {
          setLocation(JSON.parse(storedLocation));
        } catch (e) {
          console.error('Failed to parse stored location:', e);
        }
      }

      // If authenticated, try to get from database
      if (isAuthenticated && user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('city, state, country, pincode, latitude, longitude')
            .eq('id', user.id)
            .single();

          if (!error && data && data.city) {
            const dbLocation: UserLocation = {
              city: data.city,
              state: data.state || '',
              country: data.country || 'India',
              pincode: data.pincode || '',
              latitude: data.latitude || undefined,
              longitude: data.longitude || undefined,
            };
            setLocation(dbLocation);
            localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(dbLocation));
          }
        } catch (e) {
          console.error('Failed to fetch location from database:', e);
        }
      }
    };

    loadLocation();
  }, [isAuthenticated, user?.id]);

  // Check if we should show permission modal
  useEffect(() => {
    const hasAsked = localStorage.getItem(PERMISSION_ASKED_KEY);
    if (!hasAsked && !location) {
      // Delay showing modal for better UX
      const timer = setTimeout(() => {
        setShowPermissionModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Check geolocation permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
        result.onchange = () => {
          setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
        };
      }).catch(() => {
        setPermissionStatus('unavailable');
      });
    } else if (!('geolocation' in navigator)) {
      setPermissionStatus('unavailable');
    }
  }, []);

  const reverseGeocode = async (latitude: number, longitude: number): Promise<UserLocation | null> => {
    try {
      // Use OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'OguraFashion/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      const address = data.address || {};

      return {
        city: address.city || address.town || address.village || address.suburb || address.county || '',
        state: address.state || '',
        country: address.country || 'India',
        pincode: address.postcode || '',
        latitude,
        longitude,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const saveLocation = async (loc: UserLocation) => {
    // Save to localStorage
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
    setLocation(loc);

    // If authenticated, save to database
    if (isAuthenticated && user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            city: loc.city,
            state: loc.state,
            country: loc.country,
            pincode: loc.pincode,
            latitude: loc.latitude,
            longitude: loc.longitude,
          })
          .eq('id', user.id);
      } catch (e) {
        console.error('Failed to save location to database:', e);
      }
    }
  };

  const requestLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setPermissionStatus('unavailable');
      setShowManualSelector(true);
      return;
    }

    setIsLoading(true);
    localStorage.setItem(PERMISSION_ASKED_KEY, 'true');
    setShowPermissionModal(false);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        });
      });

      const { latitude, longitude } = position.coords;
      setPermissionStatus('granted');

      const geocodedLocation = await reverseGeocode(latitude, longitude);
      
      if (geocodedLocation) {
        await saveLocation(geocodedLocation);
      } else {
        // If geocoding fails, show manual selector
        setShowManualSelector(true);
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      if ((error as GeolocationPositionError).code === 1) {
        setPermissionStatus('denied');
      }
      setShowManualSelector(true);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const setManualLocation = useCallback(async (loc: UserLocation) => {
    localStorage.setItem(PERMISSION_ASKED_KEY, 'true');
    setShowPermissionModal(false);
    setShowManualSelector(false);
    await saveLocation(loc);
  }, [isAuthenticated, user?.id]);

  const checkDelivery = useCallback(async (pincode: string): Promise<DeliveryInfo | null> => {
    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('is_deliverable, delivery_days, express_available')
        .eq('pincode', pincode)
        .single();

      if (error || !data) {
        // If pincode not found, assume deliverable with default days
        return {
          isDeliverable: true,
          deliveryDays: 7,
          expressAvailable: false,
        };
      }

      return {
        isDeliverable: data.is_deliverable,
        deliveryDays: data.delivery_days,
        expressAvailable: data.express_available,
      };
    } catch (e) {
      console.error('Failed to check delivery:', e);
      return null;
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        permissionStatus,
        requestLocation,
        setManualLocation,
        checkDelivery,
        showPermissionModal,
        setShowPermissionModal,
        showManualSelector,
        setShowManualSelector,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
