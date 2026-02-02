import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSeller } from '@/contexts/SellerContext';
import { supabase } from '@/integrations/supabase/client';
import { SellerType, SellerApplicationData } from '@/types/seller';
import { toast } from 'sonner';
import { Loader2, Palette, Building2 } from 'lucide-react';

export const SellerApplicationForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { seller, refreshSeller } = useSeller();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SellerApplicationData>({
    brand_name: '',
    city: '',
    instagram_handle: '',
    description: '',
    seller_type: 'independent_designer',
  });

  // If user already has a seller profile, show status
  if (seller) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          {seller.application_status === 'pending' && (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h3 className="text-xl font-bold mb-2">Application Under Review</h3>
              <p className="text-muted-foreground">
                Your application for <strong>{seller.brand_name}</strong> is being reviewed.
                We typically respond within 5 working days.
              </p>
            </>
          )}
          {seller.application_status === 'approved' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Application Approved!</h3>
              <p className="text-muted-foreground mb-4">
                Welcome to Ogura! You can now access your seller dashboard.
              </p>
              <Button onClick={() => navigate('/seller')}>
                Go to Seller Dashboard
              </Button>
            </>
          )}
          {seller.application_status === 'rejected' && (
            <>
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✕</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Application Not Approved</h3>
              <p className="text-muted-foreground">
                Unfortunately, your application was not approved at this time.
                Please contact support for more information.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // If not authenticated, prompt login
  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <h3 className="text-xl font-bold mb-2">Sign in to Apply</h3>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to submit a seller application.
          </p>
          <Button onClick={() => navigate('/login', { state: { from: { pathname: '/join' } } })}>
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Please sign in first');
      return;
    }

    if (!formData.brand_name || !formData.city || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('sellers')
        .insert({
          user_id: user.id,
          brand_name: formData.brand_name,
          city: formData.city,
          instagram_handle: formData.instagram_handle || null,
          description: formData.description,
          seller_type: formData.seller_type,
          application_status: 'pending',
        });

      if (error) throw error;

      await refreshSeller();
      toast.success('Application submitted successfully!');
    } catch (error: unknown) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Seller Application</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us about your brand and we'll review your application.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seller Type */}
          <div className="space-y-3">
            <Label>I am a... *</Label>
            <RadioGroup
              value={formData.seller_type}
              onValueChange={(v) => setFormData(prev => ({ ...prev, seller_type: v as SellerType }))}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="independent_designer" id="designer" className="peer sr-only" />
                <Label
                  htmlFor="designer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Palette className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Independent Designer</span>
                  <span className="text-xs text-muted-foreground">Design only</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="studio_owner" id="studio" className="peer sr-only" />
                <Label
                  htmlFor="studio"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Building2 className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Studio Owner</span>
                  <span className="text-xs text-muted-foreground">Design + Production</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="brand_name">Brand Name *</Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
              placeholder="Your brand or studio name"
              required
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="e.g., Mumbai, Delhi, Jaipur"
              required
            />
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram Handle</Label>
            <Input
              id="instagram"
              value={formData.instagram_handle}
              onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
              placeholder="@yourbrand"
            />
            <p className="text-xs text-muted-foreground">
              Optional, but helps us verify your work
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">About Your Brand *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell us about your design philosophy, specializations, and experience..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to Ogura's seller terms and policies.
            We review each application individually and respond within 5 working days.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
