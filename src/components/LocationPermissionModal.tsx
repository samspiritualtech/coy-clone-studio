import { MapPin, Shield, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocation } from '@/contexts/LocationContext';

export const LocationPermissionModal = () => {
  const {
    showPermissionModal,
    setShowPermissionModal,
    setShowManualSelector,
    requestLocation,
    isLoading,
  } = useLocation();

  const handleAllowLocation = async () => {
    await requestLocation();
  };

  const handleManualEntry = () => {
    setShowPermissionModal(false);
    setShowManualSelector(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('ogura_location_asked', 'true');
    setShowPermissionModal(false);
  };

  return (
    <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Enable Location for Better Experience</DialogTitle>
          <DialogDescription className="text-base pt-2">
            We'd like to detect your location to personalize your shopping experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Accurate Delivery Timelines</p>
              <p className="text-xs text-muted-foreground">See when your order will arrive</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Region-Specific Collections</p>
              <p className="text-xs text-muted-foreground">Discover trending styles in your area</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Local Offers & Pricing</p>
              <p className="text-xs text-muted-foreground">Get the best deals available in your city</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAllowLocation}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Detecting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Allow Location Access
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleManualEntry}
            className="w-full text-muted-foreground"
          >
            Enter Location Manually
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          <Shield className="inline-block h-3 w-3 mr-1" />
          Your location is never shared with third parties
        </p>
      </DialogContent>
    </Dialog>
  );
};
