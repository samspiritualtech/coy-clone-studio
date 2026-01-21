import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocation, UserLocation } from '@/contexts/LocationContext';
import { getStates, getCitiesByState, getPincodesByCity } from '@/data/indianLocations';

export const ManualLocationSelector = () => {
  const {
    showManualSelector,
    setShowManualSelector,
    setManualLocation,
    location: currentLocation,
  } = useLocation();

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [suggestedPincodes, setSuggestedPincodes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const states = getStates();

  // Initialize with current location if available
  useEffect(() => {
    if (currentLocation && showManualSelector) {
      setSelectedState(currentLocation.state || '');
      setSelectedCity(currentLocation.city || '');
      setPincode(currentLocation.pincode || '');
    }
  }, [currentLocation, showManualSelector]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedState) {
      setCities(getCitiesByState(selectedState));
      setSelectedCity('');
      setPincode('');
      setSuggestedPincodes([]);
    }
  }, [selectedState]);

  // Update suggested pincodes when city changes
  useEffect(() => {
    if (selectedState && selectedCity) {
      const pincodes = getPincodesByCity(selectedState, selectedCity);
      setSuggestedPincodes(pincodes);
      if (pincodes.length > 0 && !pincode) {
        setPincode(pincodes[0]);
      }
    }
  }, [selectedCity, selectedState]);

  const handleSubmit = async () => {
    if (!selectedState || !selectedCity || !pincode) return;

    setIsSubmitting(true);
    
    const newLocation: UserLocation = {
      city: selectedCity,
      state: selectedState,
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

  const isValid = selectedState && selectedCity && pincode && pincode.length === 6;

  return (
    <Dialog open={showManualSelector} onOpenChange={setShowManualSelector}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Select Your Location</DialogTitle>
          <DialogDescription>
            Choose your delivery location for accurate shipping information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value="India" disabled>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">🇮🇳 India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
              disabled={!selectedState}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <div className="space-y-2">
              <Input
                id="pincode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPincode(value);
                }}
                disabled={!selectedCity}
              />
              {suggestedPincodes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestedPincodes.slice(0, 5).map((pc) => (
                    <Button
                      key={pc}
                      type="button"
                      variant={pincode === pc ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setPincode(pc)}
                    >
                      {pc}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Save Location
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
