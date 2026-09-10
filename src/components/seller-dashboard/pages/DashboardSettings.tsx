import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const DEV_SELLER_ID = "07edb482-2c8e-4711-8cda-d2f3a87b790a";

interface SellerForm {
  brand_name: string;
  description: string;
  city: string;
  instagram_handle: string;
}

export const DashboardSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [form, setForm] = useState<SellerForm>({
    brand_name: "",
    description: "",
    city: "",
    instagram_handle: "",
  });

  useEffect(() => {
    const resolve = async () => {
      let id: string | null = null;
      if (user?.id) {
        const { data } = await supabase
          .from("sellers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        id = data?.id ?? null;
      }
      if (!id) id = DEV_SELLER_ID;
      setSellerId(id);
    };
    resolve();
  }, [user?.id]);

  useEffect(() => {
    if (!sellerId) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("sellers")
        .select("brand_name, description, city, instagram_handle")
        .eq("id", sellerId)
        .maybeSingle();
      if (data) {
        setForm({
          brand_name: data.brand_name || "",
          description: data.description || "",
          city: data.city || "",
          instagram_handle: data.instagram_handle || "",
        });
      }
      setLoading(false);
    };
    fetch();
  }, [sellerId]);

  const handleSave = async () => {
    if (!sellerId) return;
    if (!form.brand_name.trim()) {
      toast.error("Store name is required");
      return;
    }
    if (!form.city.trim()) {
      toast.error("City is required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("sellers")
      .update({
        brand_name: form.brand_name.trim(),
        description: form.description.trim(),
        city: form.city.trim(),
        instagram_handle: form.instagram_handle.trim(),
      })
      .eq("id", sellerId);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Store settings saved");
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

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">Settings</h1>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Store details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-medium">Store name</Label>
            <Input
              value={form.brand_name}
              onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Instagram handle</Label>
            <Input
              value={form.instagram_handle}
              onChange={(e) => setForm({ ...form, instagram_handle: e.target.value })}
              placeholder="@yourbrand"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Store description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-medium">City</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </div>
    </div>
  );
};
