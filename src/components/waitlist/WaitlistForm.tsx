import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle } from "lucide-react";

const CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Jaipur",
  "Indore", "Agra", "Lucknow", "Chandigarh", "Gurugram", "Noida", "Other",
];

const BRAND_AGES = ["Just starting", "Under 1 year", "1 to 3 years", "3+ years"];
const CHANNELS = ["Instagram", "Own website", "Boutique or store", "Just starting out"];

const WHATSAPP_NUMBER = "919897014111";

const schema = z.object({
  brand_name: z.string().trim().min(2, "Please enter your brand name").max(120),
  handle_or_website: z.string().trim().min(2, "Add your Instagram handle or website").max(200),
  what_you_make: z.string().trim().min(2, "Tell us what you make").max(200),
  city: z.string().min(1, "Please select your city"),
  brand_age: z.string().min(1, "Please select one"),
  monthly_orders: z.string().trim().max(60).optional().or(z.literal("")),
  phone: z.string().trim().min(10, "Enter a valid contact number").max(20),
});

type Errors = Partial<Record<keyof z.infer<typeof schema> | "sell_channels", string>>;

const pill =
  "editorial-label text-xs px-4 py-2.5 rounded-full border transition-colors duration-200";

export const WaitlistForm = () => {
  const [form, setForm] = useState({
    brand_name: "",
    handle_or_website: "",
    what_you_make: "",
    city: "",
    brand_age: "",
    monthly_orders: "",
    phone: "+91 ",
  });
  const [channels, setChannels] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleChannel = (value: string) => {
    setChannels((c) => (c.includes(value) ? c.filter((v) => v !== value) : [...c, value]));
    setErrors((e) => ({ ...e, sell_channels: undefined }));
  };

  const whatsappHref = () => {
    const text = `Hi Ogura, I'd like to apply as a founding brand.\nBrand: ${form.brand_name || "-"}\nInstagram/Website: ${form.handle_or_website || "-"}\nWhat we make: ${form.what_you_make || "-"}\nCity: ${form.city || "-"}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    const nextErrors: Errors = {};
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof Errors;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      });
    }
    if (channels.length === 0) nextErrors.sell_channels = "Select at least one";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("brand_waitlist_applications").insert({
        brand_name: form.brand_name.trim(),
        handle_or_website: form.handle_or_website.trim(),
        what_you_make: form.what_you_make.trim(),
        city: form.city,
        brand_age: form.brand_age,
        sell_channels: channels,
        monthly_orders: form.monthly_orders.trim() || null,
        phone: form.phone.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 md:p-14 text-center">
        <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-7 h-7 text-brand" />
        </div>
        <h3 className="editorial-h3 text-2xl md:text-3xl text-foreground mb-3">
          Application received
        </h3>
        <p className="editorial-body text-muted-foreground max-w-md mx-auto">
          We review every application and respond within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-10 space-y-7 text-left">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brand_name" className="editorial-label text-xs uppercase">Brand name</Label>
          <Input id="brand_name" value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} placeholder="Your label's name" />
          {errors.brand_name && <p className="text-sm text-destructive">{errors.brand_name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="handle_or_website" className="editorial-label text-xs uppercase">Instagram handle or website</Label>
          <Input id="handle_or_website" value={form.handle_or_website} onChange={(e) => set("handle_or_website", e.target.value)} placeholder="@yourbrand" />
          {errors.handle_or_website && <p className="text-sm text-destructive">{errors.handle_or_website}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="what_you_make" className="editorial-label text-xs uppercase">What you make</Label>
          <Input id="what_you_make" value={form.what_you_make} onChange={(e) => set("what_you_make", e.target.value)} placeholder="e.g. contemporary ethnic, co-ords, occasion wear" />
          {errors.what_you_make && <p className="text-sm text-destructive">{errors.what_you_make}</p>}
        </div>
        <div className="space-y-2">
          <Label className="editorial-label text-xs uppercase">City</Label>
          <Select value={form.city} onValueChange={(v) => set("city", v)}>
            <SelectTrigger><SelectValue placeholder="Select your city" /></SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="editorial-label text-xs uppercase">How old is your brand?</Label>
        <div className="flex flex-wrap gap-2.5">
          {BRAND_AGES.map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => set("brand_age", age)}
              className={`${pill} ${form.brand_age === age ? "border-brand bg-brand-soft text-brand" : "border-border text-muted-foreground hover:border-foreground/40"}`}
            >
              {age}
            </button>
          ))}
        </div>
        {errors.brand_age && <p className="text-sm text-destructive">{errors.brand_age}</p>}
      </div>

      <div className="space-y-3">
        <Label className="editorial-label text-xs uppercase">Where do you sell today?</Label>
        <div className="flex flex-wrap gap-2.5">
          {CHANNELS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleChannel(c)}
              className={`${pill} ${channels.includes(c) ? "border-brand bg-brand-soft text-brand" : "border-border text-muted-foreground hover:border-foreground/40"}`}
            >
              {c}
            </button>
          ))}
        </div>
        {errors.sell_channels && <p className="text-sm text-destructive">{errors.sell_channels}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="monthly_orders" className="editorial-label text-xs uppercase">Roughly how many orders a month?</Label>
          <Input id="monthly_orders" value={form.monthly_orders} onChange={(e) => set("monthly_orders", e.target.value)} placeholder="An estimate is fine" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="editorial-label text-xs uppercase">Contact number, WhatsApp preferred</Label>
          <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91" />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" size="lg" disabled={submitting} className="flex-1 editorial-label uppercase text-xs h-12">
          {submitting ? "Submitting…" : "Submit application"}
        </Button>
        <Button asChild type="button" variant="outline" size="lg" className="flex-1 editorial-label uppercase text-xs h-12">
          <a href={whatsappHref()} target="_blank" rel="noreferrer">
            <MessageCircle className="w-4 h-4" /> Apply on WhatsApp
          </a>
        </Button>
      </div>

      <p className="editorial-body text-sm text-muted-foreground text-center">
        We review every application and respond within 48 hours.
      </p>
    </form>
  );
};
