import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { UserAddress } from '@/components/AddressCard';

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

interface PincodeLookupResult {
  success: boolean;
  city?: string;
  state?: string;
  country?: string;
  error?: string;
}

interface LocationContextType {
  // Browse location (IP-based or manually set)
  location: UserLocation | null;
  isLoading: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unavailable';
  
  // Location actions
  requestLocation: () => Promise<void>;
  setManualLocation: (location: UserLocation) => Promise<void>;
  detectLocationByIP: () => Promise<void>;
  
  // Delivery
  checkDelivery: (pincode: string) => Promise<DeliveryInfo | null>;
  lookupPincode: (pincode: string) => Promise<PincodeLookupResult>;
  
  // Modals
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;
  showManualSelector: boolean;
  setShowManualSelector: (show: boolean) => void;
  
  // Address selection for checkout
  showAddressModal: boolean;
  setShowAddressModal: (show: boolean) => void;
  selectedAddress: UserAddress | null;
  setSelectedAddress: (address: UserAddress | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = 'ogura_user_location';
const SELECTED_ADDRESS_KEY = 'ogura_selected_address';

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);

  // Detect location silently using IP on mount
  const detectLocationByIP = useCallback(async () => {
    try {
      console.log('Detecting location by IP...');
      const response = await supabase.functions.invoke('ip-geolocation');
      
      if (response.data?.success) {
        const ipLocation: UserLocation = {
          city: response.data.city,
          state: response.data.state,
          country: response.data.country || 'India',
          pincode: '', // IP detection doesn't provide pincode
        };
        
        console.log('IP location detected:', ipLocation);
        setLocation(ipLocation);
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(ipLocation));
      }
    } catch (error) {
      console.error('IP geolocation error:', error);
      // Silent failure - just set a default location
      const defaultLocation: UserLocation = {
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '',
      };
      setLocation(defaultLocation);
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(defaultLocation));
    }
  }, []);

  // Load location from storage or database on mount, then fallback to IP detection
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
            return; // We have location, no need for IP detection
          }
        } catch (e) {
          console.error('Failed to fetch location from database:', e);
        }
      }

      // If no stored location, detect by IP (silently, no popup)
      if (!storedLocation) {
        detectLocationByIP();
      }
    };

    loadLocation();
  }, [isAuthenticated, user?.id, detectLocationByIP]);

  // Load selected address from storage
  useEffect(() => {
    const storedAddress = localStorage.getItem(SELECTED_ADDRESS_KEY);
    if (storedAddress) {
      try {
        setSelectedAddress(JSON.parse(storedAddress));
      } catch (e) {
        console.error('Failed to parse stored address:', e);
      }
    }
  }, []);

  // Save selected address to storage
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem(SELECTED_ADDRESS_KEY, JSON.stringify(selectedAddress));
    }
  }, [selectedAddress]);

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

  // Request GPS location - ONLY called when user explicitly clicks "Use My Current Location"
  const requestLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setPermissionStatus('unavailable');
      setShowManualSelector(true);
      return;
    }

    setIsLoading(true);
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
        .maybeSingle();

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

  const lookupPincode = useCallback(async (pincode: string): Promise<PincodeLookupResult> => {
    try {
      const response = await supabase.functions.invoke('pincode-lookup', {
        body: { pincode }
      });
      
      if (response.error) {
        console.error('Pincode lookup error:', response.error);
        return { success: false, error: 'Unable to detect location. Please enter manually.' };
      }
      
      return response.data as PincodeLookupResult;
    } catch (error) {
      console.error('Pincode lookup error:', error);
      return { success: false, error: 'Connection error. Please try again.' };
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
        detectLocationByIP,
        checkDelivery,
        lookupPincode,
        showPermissionModal,
        setShowPermissionModal,
        showManualSelector,
        setShowManualSelector,
        showAddressModal,
        setShowAddressModal,
        selectedAddress,
        setSelectedAddress,
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
