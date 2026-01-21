import { Home, Building2, Phone, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface UserAddress {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string;
  pincode: string;
  address_line: string;
  city: string;
  state: string;
  landmark?: string;
  address_type: 'home' | 'work';
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AddressCardProps {
  address: UserAddress;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  selectable?: boolean;
}

export const AddressCard = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  showActions = true,
  selectable = true,
}: AddressCardProps) => {
  return (
    <div
      className={cn(
        "relative border rounded-lg p-4 transition-all cursor-pointer",
        isSelected 
          ? "border-primary bg-primary/5 ring-1 ring-primary" 
          : "border-border hover:border-muted-foreground/50",
        selectable && "cursor-pointer"
      )}
      onClick={selectable ? onSelect : undefined}
    >
      {/* Selection indicator */}
      {selectable && (
        <div className="absolute top-4 left-4">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
            isSelected 
              ? "border-primary bg-primary" 
              : "border-muted-foreground/40"
          )}>
            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
        </div>
      )}

      {/* Address content */}
      <div className={cn("space-y-2", selectable && "pl-8")}>
        {/* Name and type badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{address.full_name}</span>
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded",
              address.address_type === 'home' 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            )}>
              {address.address_type === 'home' ? (
                <Home className="h-3 w-3" />
              ) : (
                <Building2 className="h-3 w-3" />
              )}
              {address.address_type === 'home' ? 'Home' : 'Work'}
            </span>
            {address.is_default && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">
                Default
              </span>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Address details */}
        <p className="text-sm text-muted-foreground">
          {address.address_line}
          {address.landmark && `, ${address.landmark}`}
        </p>
        <p className="text-sm text-muted-foreground">
          {address.city}, {address.state} - {address.pincode}
        </p>

        {/* Phone */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span>{address.mobile}</span>
        </div>
      </div>
    </div>
  );
};
