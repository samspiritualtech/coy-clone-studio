import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const SellerSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("sellers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setSeller(data);
        setLoading(false);
      });
  }, [user?.id]);

  const handleSave = async () => {
    if (!seller) return;
    setSaving(true);
    const { error } = await supabase
      .from("sellers")
      .update({
        brand_name: seller.brand_name,
        description: seller.description,
        city: seller.city,
        instagram_handle: seller.instagram_handle,
      })
      .eq("id", seller.id);

    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Settings saved");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Seller profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Store Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Brand Name</Label>
            <Input value={seller.brand_name || ""} onChange={(e) => setSeller({ ...seller, brand_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={seller.city || ""} onChange={(e) => setSeller({ ...seller, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Instagram Handle</Label>
            <Input value={seller.instagram_handle || ""} onChange={(e) => setSeller({ ...seller, instagram_handle: e.target.value })} placeholder="@yourbrand" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={seller.description || ""} onChange={(e) => setSeller({ ...seller, description: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">Application Status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="text-sm font-medium capitalize">{seller.application_status}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-muted-foreground">Seller Type:</span>
            <span className="text-sm font-medium capitalize">{seller.seller_type}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerSettings;
