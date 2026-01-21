import { useState, useEffect, useCallback } from 'react';
import { MapPin, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocation, UserLocation } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';

export const ManualLocationSelector = () => {
  const {
    showManualSelector,
    setShowManualSelector,
    setManualLocation,
    location: currentLocation,
    lookupPincode,
  } = useLocation();

  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState('');
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with current location if available
  useEffect(() => {
    if (currentLocation && showManualSelector) {
      setPincode(currentLocation.pincode || '');
      setCity(currentLocation.city || '');
      setState(currentLocation.state || '');
      if (currentLocation.city && currentLocation.state) {
        setIsAutoDetected(true);
      }
    }
  }, [currentLocation, showManualSelector]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!showManualSelector) {
      setDetectionError('');
      setIsDetecting(false);
    }
  }, [showManualSelector]);

  // Auto-detect location when 6 digits are entered
  const handlePincodeChange = useCallback(async (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setPincode(numericValue);
    setDetectionError('');

    // Reset city/state if pincode changes
    if (numericValue.length < 6) {
      setCity('');
      setState('');
      setIsAutoDetected(false);
      return;
    }

    // Auto-detect when 6 digits entered
    if (numericValue.length === 6) {
      setIsDetecting(true);
      setDetectionError('');
      
      try {
        const result = await lookupPincode(numericValue);
        
        if (result.success && result.city && result.state) {
          setCity(result.city);
          setState(result.state);
          setIsAutoDetected(true);
        } else {
          setDetectionError(result.error || 'Unable to detect location');
          setIsAutoDetected(false);
        }
      } catch (error) {
        setDetectionError('Connection error. Please try again.');
        setIsAutoDetected(false);
      } finally {
        setIsDetecting(false);
      }
    }
  }, [lookupPincode]);

  const handleSubmit = async () => {
    if (!pincode || pincode.length !== 6 || !city || !state) return;

    setIsSubmitting(true);
    
    const newLocation: UserLocation = {
      city: city,
      state: state,
      country: 'India',
      pincode: pincode,
    };

    await setManualLocation(newLocation);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    localStorage.setItem('ogura_location_asked', 'true');
    setShowManualSelector(false);
  };

  const handleClearPincode = () => {
    setPincode('');
    setCity('');
    setState('');
    setDetectionError('');
    setIsAutoDetected(false);
  };

  const isValid = pincode.length === 6 && city.trim() && state.trim();

  return (
    <Dialog open={showManualSelector} onOpenChange={setShowManualSelector}>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center sm:text-center flex-shrink-0">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Select Your Location</DialogTitle>
          <DialogDescription>
            Enter PIN code to auto-detect your city
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {/* PIN Code Input */}
            <div className="space-y-2">
              <Label htmlFor="pincode">PIN Code</Label>
              <div className="relative">
                <Input
                  id="pincode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className={cn(
                    "pr-10",
                    detectionError && "border-destructive focus-visible:ring-destructive",
                    isAutoDetected && "border-primary focus-visible:ring-primary"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isDetecting && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {!isDetecting && isAutoDetected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  {!isDetecting && detectionError && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              
              {/* Status Messages */}
              {isDetecting && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Detecting location...
                </p>
              )}
              {detectionError && (
                <p className="text-sm text-destructive">{detectionError}</p>
              )}
              {!isDetecting && !detectionError && pincode.length < 6 && (
                <p className="text-sm text-muted-foreground">
                  Enter 6-digit PIN code
                </p>
              )}
              
              {/* Clear button */}
              {pincode.length > 0 && !isDetecting && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleClearPincode}
                >
                  Clear & Change PIN Code
                </Button>
              )}
            </div>

            {/* City Input */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                City
                {isAutoDetected && city && (
                  <span className="text-xs text-primary font-normal">(auto-detected)</span>
                )}
              </Label>
              <Input
                id="city"
                type="text"
                placeholder={pincode.length === 6 ? "Enter city" : "Enter PIN code first"}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (isAutoDetected) setIsAutoDetected(false);
                }}
                disabled={pincode.length !== 6 && !detectionError}
                className={cn(
                  isAutoDetected && city && "bg-primary/5 border-primary/30"
                )}
              />
            </div>

            {/* State Input */}
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                State
                {isAutoDetected && state && (
                  <span className="text-xs text-primary font-normal">(auto-detected)</span>
                )}
              </Label>
              <Input
                id="state"
                type="text"
                placeholder={pincode.length === 6 ? "Enter state" : "Enter PIN code first"}
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  if (isAutoDetected) setIsAutoDetected(false);
                }}
                disabled={pincode.length !== 6 && !detectionError}
                className={cn(
                  isAutoDetected && state && "bg-primary/5 border-primary/30"
                )}
              />
            </div>

            {/* Country (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                value="India"
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </div>

        {/* Save Button - Always at bottom */}
        <div className="flex-shrink-0 pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting || isDetecting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Save Location
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
