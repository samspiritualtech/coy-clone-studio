import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const categories = [
  "dresses", "tops", "bottoms", "outerwear", "footwear", "accessories", "bags",
  "sarees", "lehengas", "kurtas", "co-ords", "jumpsuits",
];

const SellerAddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    original_price: "",
    description: "",
    material: "",
    fabric: "",
    care_instructions: "",
    dispatch_days: "7",
    is_made_to_order: false,
    is_returnable: true,
  });

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("sellers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setSellerId(data?.id || null));
  }, [user?.id]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerId) {
      toast.error("Seller profile not found");
      return;
    }
    if (!form.title || !form.category || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("products").insert({
      seller_id: sellerId,
      title: form.title,
      category: form.category,
      price: parseInt(form.price),
      original_price: form.original_price ? parseInt(form.original_price) : null,
      description: form.description || null,
      material: form.material || null,
      fabric: form.fabric || null,
      care_instructions: form.care_instructions || null,
      dispatch_days: parseInt(form.dispatch_days) || 7,
      is_made_to_order: form.is_made_to_order,
      is_returnable: form.is_returnable,
      status: "pending",
      images: [],
      colors: [],
      sizes: [],
    });

    if (error) {
      toast.error("Failed to create product: " + error.message);
      console.error(error);
    } else {
      toast.success("Product submitted for review!");
      navigate("/seller/products");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" className="gap-2 mb-4" onClick={() => navigate("/seller/products")}>
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Button>

      <h1 className="text-2xl font-bold text-foreground mb-1">Add New Product</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Fill in the details below. Your product will be reviewed before going live.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="e.g. Embroidered Silk Lehenga" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dispatch">Dispatch Days</Label>
                <Input id="dispatch" type="number" value={form.dispatch_days} onChange={(e) => handleChange("dispatch_days", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={4} value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Describe your product..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (₹) *</Label>
                <Input id="price" type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="4999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrp">MRP / Original Price (₹)</Label>
                <Input id="mrp" type="number" value={form.original_price} onChange={(e) => handleChange("original_price", e.target.value)} placeholder="6999" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Material & Care</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input id="material" value={form.material} onChange={(e) => handleChange("material", e.target.value)} placeholder="e.g. Silk" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabric">Fabric</Label>
                <Input id="fabric" value={form.fabric} onChange={(e) => handleChange("fabric", e.target.value)} placeholder="e.g. Banarasi Silk" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="care">Care Instructions</Label>
              <Textarea id="care" rows={2} value={form.care_instructions} onChange={(e) => handleChange("care_instructions", e.target.value)} placeholder="e.g. Dry clean only" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/seller/products")}>Cancel</Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SellerAddProduct;
