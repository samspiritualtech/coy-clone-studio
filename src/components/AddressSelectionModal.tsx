import { useState, useEffect } from 'react';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserAddress } from '@/types';

interface AddressSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressSelect: (address: UserAddress) => void;
  selectedAddressId?: string;
}

export const AddressSelectionModal = ({
  open,
  onOpenChange,
  onAddressSelect,
  selectedAddressId,
}: AddressSelectionModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [localSelectedId, setLocalSelectedId] = useState<string | undefined>(selectedAddressId);

  // Fetch addresses on mount
  useEffect(() => {
    if (open && isAuthenticated) {
      fetchAddresses();
    } else if (open && !isAuthenticated) {
      // Load guest addresses from localStorage
      const guestAddresses = localStorage.getItem('ogura_guest_addresses');
      if (guestAddresses) {
        setAddresses(JSON.parse(guestAddresses));
      }
      setIsLoading(false);
    }
  }, [open, isAuthenticated]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to UserAddress type
      const typedAddresses = (data || []).map(addr => ({
        ...addr,
        address_type: addr.address_type as 'home' | 'work'
      }));
      
      setAddresses(typedAddresses);
      
      // Auto-select default address if none selected
      if (!localSelectedId && typedAddresses.length > 0) {
        const defaultAddr = typedAddresses.find(a => a.is_default) || typedAddresses[0];
        setLocalSelectedId(defaultAddr.id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load addresses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (data: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    
    try {
      if (isAuthenticated && user) {
        // Save to database
        const { data: newAddress, error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            ...data,
          })
          .select()
          .single();

        if (error) throw error;
        
        const typedAddress = {
          ...newAddress,
          address_type: newAddress.address_type as 'home' | 'work'
        };
        
        setAddresses(prev => [typedAddress, ...prev]);
        setLocalSelectedId(typedAddress.id);
        setShowAddForm(false);
        
        toast({
          title: 'Address Added',
          description: 'Your address has been saved successfully.',
        });
      } else {
        // Save to localStorage for guest users
        const newAddress: UserAddress = {
          id: crypto.randomUUID(),
          user_id: 'guest',
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const updatedAddresses = [newAddress, ...addresses];
        setAddresses(updatedAddresses);
        localStorage.setItem('ogura_guest_addresses', JSON.stringify(updatedAddresses));
        setLocalSelectedId(newAddress.id);
        setShowAddForm(false);
        
        toast({
          title: 'Address Added',
          description: 'Your address has been saved for this session.',
        });
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save address',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAddress = async (data: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!editingAddress) return;
    
    setIsSaving(true);
    
    try {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('user_addresses')
          .update(data)
          .eq('id', editingAddress.id);

        if (error) throw error;
        
        setAddresses(prev => 
          prev.map(addr => 
            addr.id === editingAddress.id 
              ? { ...addr, ...data } 
              : addr
          )
        );
        
        toast({
          title: 'Address Updated',
          description: 'Your address has been updated successfully.',
        });
      } else {
        // Update localStorage for guest
        const updatedAddresses = addresses.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, ...data, updated_at: new Date().toISOString() }
            : addr
        );
        setAddresses(updatedAddresses);
        localStorage.setItem('ogura_guest_addresses', JSON.stringify(updatedAddresses));
        
        toast({
          title: 'Address Updated',
          description: 'Your address has been updated.',
        });
      }
      
      setEditingAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: 'Error',
        description: 'Failed to update address',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      if (isAuthenticated) {
        const { error } = await supabase
          .from('user_addresses')
          .delete()
          .eq('id', addressId);

        if (error) throw error;
      }
      
      const updatedAddresses = addresses.filter(a => a.id !== addressId);
      setAddresses(updatedAddresses);
      
      if (!isAuthenticated) {
        localStorage.setItem('ogura_guest_addresses', JSON.stringify(updatedAddresses));
      }
      
      if (localSelectedId === addressId) {
        setLocalSelectedId(updatedAddresses[0]?.id);
      }
      
      toast({
        title: 'Address Deleted',
        description: 'The address has been removed.',
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete address',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmSelection = () => {
    const selectedAddress = addresses.find(a => a.id === localSelectedId);
    if (selectedAddress) {
      onAddressSelect(selectedAddress);
      onOpenChange(false);
    }
  };

  // Show add form view
  if (showAddForm || editingAddress) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 px-6 pb-6">
            <AddressForm
              initialData={editingAddress || undefined}
              onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
              onCancel={() => {
                setShowAddForm(false);
                setEditingAddress(null);
              }}
              isLoading={isSaving}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select Delivery Address
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-3 py-2">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={localSelectedId === address.id}
                    onSelect={() => setLocalSelectedId(address.id)}
                    onEdit={() => setEditingAddress(address)}
                    onDelete={() => handleDeleteAddress(address.id)}
                  />
                ))}

                {/* Add New Address Button */}
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add New Address</span>
                </button>
              </div>
            </ScrollArea>

            {/* Confirm Button */}
            {addresses.length > 0 && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleConfirmSelection}
                  disabled={!localSelectedId}
                  className="w-full"
                  size="lg"
                >
                  Deliver to This Address
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
