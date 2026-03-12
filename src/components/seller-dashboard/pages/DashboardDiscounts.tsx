import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Percent, Gift, Truck, Tag, ArrowLeft, Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  status: string;
  usage_count: number;
  usage_limit: number | null;
  start_date: string | null;
  end_date: string | null;
  min_purchase: number;
  applies_to: string;
}

const discountTypes = [
  { icon: Tag, type: "percentage_product", title: "Amount off products", desc: "Discount specific products or collections" },
  { icon: Gift, type: "buy_x_get_y", title: "Buy X get Y", desc: "Offer free or discounted products with purchase" },
  { icon: Percent, type: "percentage_order", title: "Amount off order", desc: "Discount the total order amount" },
  { icon: Truck, type: "free_shipping", title: "Free shipping", desc: "Offer free shipping on orders" },
];

export const DashboardDiscounts = () => {
  const { user } = useAuth();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formType, setFormType] = useState("percentage_product");
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setSellerId(data.id); });
  }, [user?.id]);

  const fetchDiscounts = async () => {
    if (!sellerId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await (supabase as any)
      .from("discounts")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    setDiscounts((data as Discount[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchDiscounts(); }, [sellerId]);

  const resetForm = () => {
    setCode(""); setValue(""); setMinPurchase(""); setUsageLimit(""); setStartDate(""); setEndDate("");
  };

  const openCreate = (type: string) => {
    setFormType(type);
    resetForm();
    setCreating(true);
  };

  const handleSave = async () => {
    if (!sellerId) return;
    if (!code.trim()) { toast({ title: "Code required", variant: "destructive" }); return; }
    if (formType !== "free_shipping" && !value) { toast({ title: "Value required", variant: "destructive" }); return; }

    setSaving(true);
    try {
      const { error } = await supabase.from("discounts").insert({
        seller_id: sellerId,
        code: code.trim().toUpperCase(),
        type: formType,
        value: formType === "free_shipping" ? 0 : Number(value),
        min_purchase: minPurchase ? Number(minPurchase) : 0,
        usage_limit: usageLimit ? Number(usageLimit) : null,
        start_date: startDate || new Date().toISOString(),
        end_date: endDate || null,
        status: "active",
      });
      if (error) throw error;
      toast({ title: "Discount created!", description: `Code ${code.toUpperCase()} is now active.` });
      setCreating(false);
      resetForm();
      fetchDiscounts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (d: Discount) => {
    const newStatus = d.status === "active" ? "expired" : "active";
    await supabase.from("discounts").update({ status: newStatus }).eq("id", d.id);
    fetchDiscounts();
  };

  if (creating) {
    const typeLabel = discountTypes.find(d => d.type === formType)?.title || "Discount";
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setCreating(false)}><ArrowLeft className="h-4 w-4" /></Button>
          <h1 className="text-xl font-semibold text-foreground">Create {typeLabel}</h1>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-xs font-medium">Discount code *</Label>
              <div className="flex gap-2 mt-1">
                <Input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SUMMER20" className="uppercase" />
                <Button variant="outline" size="sm" onClick={() => setCode(`OGURA${Math.random().toString(36).substring(2, 7).toUpperCase()}`)}>
                  Generate
                </Button>
              </div>
            </div>

            {formType !== "free_shipping" && (
              <div>
                <Label className="text-xs font-medium">
                  {formType.includes("percentage") ? "Percentage off (%)" : formType === "buy_x_get_y" ? "Min quantity to buy" : "Fixed amount (₹)"}
                </Label>
                <Input type="number" value={value} onChange={e => setValue(e.target.value)}
                  placeholder={formType.includes("percentage") ? "10" : "100"} className="mt-1 w-40" />
              </div>
            )}

            <div>
              <Label className="text-xs font-medium">Minimum purchase amount (₹)</Label>
              <Input type="number" value={minPurchase} onChange={e => setMinPurchase(e.target.value)} placeholder="0" className="mt-1 w-40" />
            </div>

            <div>
              <Label className="text-xs font-medium">Usage limit (leave blank for unlimited)</Label>
              <Input type="number" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} placeholder="Unlimited" className="mt-1 w-40" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">Start date</Label>
                <Input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-medium">End date (optional)</Label>
                <Input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : "Save discount"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Discounts</h1>
        <Button size="sm" onClick={() => openCreate("percentage_product")}><Plus className="h-3.5 w-3.5 mr-1.5" />Create discount</Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {discountTypes.map(d => (
          <Card key={d.type} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openCreate(d.type)}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <d.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-sm font-medium mb-3">Your discounts</h2>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : discounts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No discounts yet. Create one above.</p>
          ) : (
            <div className="space-y-2">
              {discounts.map(d => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <span className="text-sm font-mono font-medium">{d.code}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {d.type === "free_shipping" ? "Free shipping" : d.type.includes("percentage") ? `${d.value}% off` : `₹${d.value} off`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{d.usage_count} used{d.usage_limit ? `/${d.usage_limit}` : ""}</span>
                    <Badge variant="secondary" className={d.status === "active" ? "bg-green-100 text-green-800 cursor-pointer" : "bg-muted text-muted-foreground cursor-pointer"}
                      onClick={() => toggleStatus(d)}>
                      {d.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
