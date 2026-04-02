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
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { cn } from "@/lib/utils";

const categories = [
  "dresses", "tops", "bottoms", "outerwear", "footwear", "accessories", "bags",
  "sarees", "lehengas", "kurtas", "co-ords", "jumpsuits",
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const colorOptions = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Beige", hex: "#D2B48C" },
  { name: "Brown", hex: "#92400E" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Maroon", hex: "#800000" },
  { name: "Grey", hex: "#6B7280" },
];

const occasionOptions = ["Wedding", "Festive", "Party", "Casual", "Work", "Brunch", "Date Night", "Vacation"];
const styleOptions = ["Boho", "Minimal", "Ethnic", "Western", "Indo-Western", "Streetwear", "Classic", "Contemporary"];

const SellerAddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

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

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.name === color.name)
        ? prev.filter((c) => c.name !== color.name)
        : [...prev, color]
    );
  };

  const toggleOccasion = (tag: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleStyle = (tag: string) => {
    setSelectedStyles((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!sellerId) return [];
    const urls: string[] = [];

    for (const file of imageFiles) {
      const filePath = `${sellerId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      urls.push(publicUrl.publicUrl);
    }

    return urls;
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
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setSubmitting(true);

    // Upload images first
    const imageUrls = await uploadImages();
    if (imageUrls.length === 0) {
      toast.error("Failed to upload images. Please try again.");
      setSubmitting(false);
      return;
    }

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
      status: "submitted",
      images: imageUrls,
      colors: selectedColors,
      sizes: selectedSizes,
      occasion_tags: selectedOccasions,
      style_tags: selectedStyles,
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
        {/* Product Images */}
        <Card>
          <CardHeader><CardTitle className="text-base">Product Images *</CardTitle></CardHeader>
          <CardContent>
            <ImageUploadZone onFilesSelected={setImageFiles} maxFiles={9} maxSizeMB={20} />
          </CardContent>
        </Card>

        {/* Basic Details */}
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

        {/* Pricing */}
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

        {/* Sizes */}
        <Card>
          <CardHeader><CardTitle className="text-base">Available Sizes</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader><CardTitle className="text-base">Available Colors</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => {
                const isSelected = selectedColors.some((c) => c.name === color.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check className={cn("w-5 h-5", color.name === "White" || color.name === "Yellow" || color.name === "Beige" ? "text-foreground" : "text-white")} />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Occasion Tags</Label>
              <div className="flex flex-wrap gap-2">
                {occasionOptions.map((tag) => {
                  const isSelected = selectedOccasions.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleOccasion(tag)}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div>
              <Label className="text-sm mb-2 block">Style Tags</Label>
              <div className="flex flex-wrap gap-2">
                {styleOptions.map((tag) => {
                  const isSelected = selectedStyles.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleStyle(tag)}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material & Care */}
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
