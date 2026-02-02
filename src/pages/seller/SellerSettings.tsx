import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSeller } from '@/contexts/SellerContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const SellerSettings = () => {
  const { seller, refreshSeller } = useSeller();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    brand_name: seller?.brand_name || '',
    city: seller?.city || '',
    instagram_handle: seller?.instagram_handle || '',
    description: seller?.description || '',
    bank_name: seller?.bank_name || '',
    bank_account_number: seller?.bank_account_number || '',
    bank_ifsc: seller?.bank_ifsc || '',
    gstin: seller?.gstin || '',
    pan_number: seller?.pan_number || '',
  });

  const handleSave = async () => {
    if (!seller?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('sellers')
        .update({
          brand_name: formData.brand_name,
          city: formData.city,
          instagram_handle: formData.instagram_handle,
          description: formData.description,
          bank_name: formData.bank_name,
          bank_account_number: formData.bank_account_number,
          bank_ifsc: formData.bank_ifsc,
          gstin: formData.gstin,
          pan_number: formData.pan_number,
        })
        .eq('id', seller.id);

      if (error) throw error;

      await refreshSeller();
      toast.success('Settings saved');
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your seller profile and business details
        </p>
      </div>

      {/* Brand Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand_name">Brand Name</Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram Handle</Label>
            <Input
              id="instagram"
              value={formData.instagram_handle}
              onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
              placeholder="@yourbrand"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">About Your Brand</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Required for receiving payouts
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              value={formData.bank_name}
              onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
              placeholder="e.g., HDFC Bank"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account">Account Number</Label>
            <Input
              id="account"
              value={formData.bank_account_number}
              onChange={(e) => setFormData(prev => ({ ...prev, bank_account_number: e.target.value }))}
              type="password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ifsc">IFSC Code</Label>
            <Input
              id="ifsc"
              value={formData.bank_ifsc}
              onChange={(e) => setFormData(prev => ({ ...prev, bank_ifsc: e.target.value }))}
              placeholder="e.g., HDFC0001234"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Details */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Optional but recommended
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              value={formData.gstin}
              onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value }))}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pan">PAN Number</Label>
            <Input
              id="pan"
              value={formData.pan_number}
              onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value }))}
              placeholder="AAAAA1234A"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            To deactivate your seller account or request data deletion, please contact our support team.
          </p>
          <Button variant="outline" className="text-destructive border-destructive/50">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerSettings;
