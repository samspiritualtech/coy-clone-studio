import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';

interface HeaderLocationIndicatorProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const HeaderLocationIndicator = ({ className, variant = 'default' }: HeaderLocationIndicatorProps) => {
  const { location, setShowManualSelector, setShowPermissionModal } = useLocation();

  const handleClick = () => {
    if (location) {
      setShowManualSelector(true);
    } else {
      setShowPermissionModal(true);
    }
  };

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={cn("gap-1 text-xs h-7 px-2", className)}
      >
        <MapPin className="h-3 w-3" />
        {location ? (
          <span className="truncate max-w-[80px]">{location.city}</span>
        ) : (
          <span>Set Location</span>
        )}
        <ChevronDown className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "gap-2 hover:bg-accent/50 transition-colors",
        className
      )}
    >
      <MapPin className="h-4 w-4 text-primary" />
      <div className="flex flex-col items-start text-left">
        <span className="text-[10px] text-muted-foreground leading-none">Delivering to</span>
        {location ? (
          <span className="text-sm font-medium leading-tight">
            {location.city}{location.pincode ? `, ${location.pincode}` : `, ${location.state}`}
          </span>
        ) : (
          <span className="text-sm font-medium leading-tight text-primary">
            Select Location
          </span>
        )}
      </div>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
};
