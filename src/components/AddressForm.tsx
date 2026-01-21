import { useState, useEffect, useCallback } from 'react';
import { Home, Building2, MapPin, Loader2, Check, X, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';
import type { UserAddress } from './AddressCard';

interface AddressFormProps {
  initialData?: Partial<UserAddress>;
  onSubmit: (data: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const AddressForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: AddressFormProps) => {
  const { lookupPincode, requestLocation } = useLocation();

  // Form state
  const [fullName, setFullName] = useState(initialData?.full_name || '');
  const [mobile, setMobile] = useState(initialData?.mobile || '');
  const [pincode, setPincode] = useState(initialData?.pincode || '');
  const [addressLine, setAddressLine] = useState(initialData?.address_line || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state, setState] = useState(initialData?.state || '');
  const [landmark, setLandmark] = useState(initialData?.landmark || '');
  const [addressType, setAddressType] = useState<'home' | 'work'>(initialData?.address_type || 'home');
  const [isDefault, setIsDefault] = useState(initialData?.is_default || false);

  // PIN code lookup state
  const [isDetectingPincode, setIsDetectingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);

  // GPS state
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle PIN code change with auto-detection
  const handlePincodeChange = useCallback(async (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setPincode(numericValue);
    setPincodeError(null);
    setPincodeSuccess(false);

    if (numericValue.length === 6) {
      setIsDetectingPincode(true);
      try {
        const result = await lookupPincode(numericValue);
        if (result.success && result.city && result.state) {
          setCity(result.city);
          setState(result.state);
          setPincodeSuccess(true);
        } else {
          setPincodeError(result.error || 'Invalid PIN code');
        }
      } catch {
        setPincodeError('Failed to lookup PIN code');
      } finally {
        setIsDetectingPincode(false);
      }
    } else {
      setCity('');
      setState('');
    }
  }, [lookupPincode]);

  // Handle GPS location detection
  const handleUseCurrentLocation = async () => {
    setIsDetectingGPS(true);
    try {
      await requestLocation();
      // Location context will be updated, we can use it if needed
    } catch (error) {
      console.error('GPS detection failed:', error);
    } finally {
      setIsDetectingGPS(false);
    }
  };

  // Handle mobile number format
  const handleMobileChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setMobile(numericValue);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!mobile || mobile.length !== 10) {
      newErrors.mobile = 'Valid 10-digit mobile number is required';
    }

    if (!pincode || pincode.length !== 6) {
      newErrors.pincode = 'Valid 6-digit PIN code is required';
    }

    if (!addressLine.trim()) {
      newErrors.addressLine = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit({
      full_name: fullName.trim(),
      mobile,
      pincode,
      address_line: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      landmark: landmark.trim() || undefined,
      address_type: addressType,
      is_default: isDefault,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 px-1">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className={errors.fullName ? 'border-destructive' : ''}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
              +91
            </span>
            <Input
              id="mobile"
              type="tel"
              inputMode="numeric"
              value={mobile}
              onChange={(e) => handleMobileChange(e.target.value)}
              placeholder="9876543210"
              className={cn(
                "rounded-l-none",
                errors.mobile && 'border-destructive'
              )}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-destructive">{errors.mobile}</p>
          )}
        </div>

        {/* PIN Code */}
        <div className="space-y-2">
          <Label htmlFor="pincode">PIN Code *</Label>
          <div className="relative">
            <Input
              id="pincode"
              type="text"
              inputMode="numeric"
              value={pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              placeholder="Enter 6-digit PIN code"
              maxLength={6}
              className={cn(
                "pr-10",
                errors.pincode && 'border-destructive',
                pincodeSuccess && 'border-primary'
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isDetectingPincode && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {pincodeSuccess && !isDetectingPincode && (
                <Check className="h-4 w-4 text-primary" />
              )}
              {pincodeError && !isDetectingPincode && (
                <X className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>
          {pincodeError && (
            <p className="text-xs text-destructive">{pincodeError}</p>
          )}
          {pincodeSuccess && city && (
            <p className="text-xs text-primary">
              {city}, {state}
            </p>
          )}
          {errors.pincode && !pincodeError && (
            <p className="text-xs text-destructive">{errors.pincode}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="addressLine">Address (House No, Building, Street, Area) *</Label>
          <Textarea
            id="addressLine"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            placeholder="Enter your complete address"
            rows={2}
            className={errors.addressLine ? 'border-destructive' : ''}
          />
          {errors.addressLine && (
            <p className="text-xs text-destructive">{errors.addressLine}</p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              disabled={isDetectingPincode}
              className={cn(
                errors.city && 'border-destructive',
                pincodeSuccess && 'bg-muted/50'
              )}
            />
            {errors.city && (
              <p className="text-xs text-destructive">{errors.city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              disabled={isDetectingPincode}
              className={cn(
                errors.state && 'border-destructive',
                pincodeSuccess && 'bg-muted/50'
              )}
            />
            {errors.state && (
              <p className="text-xs text-destructive">{errors.state}</p>
            )}
          </div>
        </div>

        {/* Landmark */}
        <div className="space-y-2">
          <Label htmlFor="landmark">Landmark (Optional)</Label>
          <Input
            id="landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="Near Central Park, etc."
          />
        </div>

        {/* Address Type */}
        <div className="space-y-2">
          <Label>Address Type</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={addressType === 'home' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAddressType('home')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              type="button"
              variant={addressType === 'work' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAddressType('work')}
              className="flex-1"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Work
            </Button>
          </div>
        </div>

        {/* Use Current Location Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isDetectingGPS}
          className="w-full"
        >
          {isDetectingGPS ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Detecting Location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              Use My Current Location
            </>
          )}
        </Button>
      </div>

      {/* Action Buttons - Always at bottom */}
      <div className="flex gap-3 pt-4 mt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className={cn("flex-1", !onCancel && "w-full")}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Save Address
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
