import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useState } from "react";

interface Props {
  onBack: () => void;
}

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const colorOptions = ["Black", "White", "Red", "Blue", "Green", "Pink", "Beige", "Brown"];

export const DashboardAddProduct = ({ onBack }: Props) => {
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [trackInventory, setTrackInventory] = useState(true);
  const [physicalProduct, setPhysicalProduct] = useState(true);

  const toggleSize = (s: string) => setSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleColor = (c: string) => setColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-xl font-semibold text-foreground">Add product</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4">
          {/* Title & Description */}
          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-xs font-medium">Title</Label>
                <Input placeholder="Short sleeve t-shirt" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium">Description</Label>
                <Textarea placeholder="Write a description..." className="mt-1 min-h-[120px]" />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Media</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Add images, videos or 3D models</p>
                <p className="text-xs text-muted-foreground mt-1">Accepts images, videos. Max 20MB.</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Price</Label>
                  <Input placeholder="₹ 0.00" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Compare-at price</Label>
                  <Input placeholder="₹ 0.00" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">SKU</Label>
                  <Input placeholder="SKU-001" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Barcode</Label>
                  <Input placeholder="ISBN, UPC, etc." className="mt-1" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Track quantity</Label>
                <Switch checked={trackInventory} onCheckedChange={setTrackInventory} />
              </div>
              {trackInventory && (
                <div>
                  <Label className="text-xs font-medium">Quantity</Label>
                  <Input type="number" placeholder="0" className="mt-1 w-32" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Shipping</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Physical product</Label>
                <Switch checked={physicalProduct} onCheckedChange={setPhysicalProduct} />
              </div>
              {physicalProduct && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium">Weight (kg)</Label>
                    <Input placeholder="0.0" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Country of origin</Label>
                    <Input placeholder="India" className="mt-1" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Variants</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium mb-2 block">Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                        sizes.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-2 block">Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleColor(c)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                        colors.includes(c) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Search engine listing</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs font-medium">SEO title</Label>
                <Input placeholder="Product title" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium">Meta description</Label>
                <Textarea placeholder="Brief description for search engines" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium">URL handle</Label>
                <Input placeholder="product-title" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Status</CardTitle></CardHeader>
            <CardContent>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                <option>Draft</option>
                <option>Active</option>
              </select>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Product organization</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs font-medium">Category</Label>
                <Input placeholder="e.g. Sarees" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium">Vendor</Label>
                <Input placeholder="Vendor name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium">Collection</Label>
                <Input placeholder="Collection name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium">Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary" className="gap-1">
                        {t}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setTags(tags.filter((x) => x !== t))} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-4">
        <Button variant="outline" onClick={onBack}>Discard</Button>
        <Button>Save product</Button>
      </div>
    </div>
  );
};
