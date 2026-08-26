import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle, Check } from "lucide-react";

const CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Jaipur",
  "Indore", "Agra", "Lucknow", "Chandigarh", "Gurugram", "Noida", "Other",
];

const BRAND_AGES = ["Just starting", "Under 1 year", "1 to 3 years", "3+ years"];
const CHANNELS = ["Instagram", "Own website", "Boutique or store", "Just starting out"];

const WHATSAPP_NUMBER = "917742698970";

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
    const text = `Hi Ogura, I'd like to join the Seller Program.\nBrand: ${form.brand_name || "-"}\nInstagram/Website: ${form.handle_or_website || "-"}\nWhat we make: ${form.what_you_make || "-"}\nCity: ${form.city || "-"}`;
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
      toast.error("Please complete the highlighted fields");
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
      <div className="wl-form-card p-8 md:p-14 text-center">
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

  const fieldGroup = "space-y-2.5";

  return (
    <form onSubmit={handleSubmit} className="wl-form-card text-left" noValidate>
      {/* Step 1 — your brand */}
      <fieldset className="wl-fieldset">
        <legend className="wl-legend">
          <span className="wl-step-num">1</span> Your brand
        </legend>

        <div className="grid gap-5 md:grid-cols-2">
          <div className={fieldGroup}>
            <Label htmlFor="brand_name" className="wl-field-label">Brand name</Label>
            <Input
              id="brand_name"
              className="wl-input"
              value={form.brand_name}
              onChange={(e) => set("brand_name", e.target.value)}
              placeholder="Your label's name"
              autoComplete="organization"
            />
            {errors.brand_name && <p className="wl-error">{errors.brand_name}</p>}
          </div>
          <div className={fieldGroup}>
            <Label htmlFor="handle_or_website" className="wl-field-label">Instagram or website</Label>
            <Input
              id="handle_or_website"
              className="wl-input"
              value={form.handle_or_website}
              onChange={(e) => set("handle_or_website", e.target.value)}
              placeholder="@yourbrand"
              inputMode="url"
              autoCapitalize="none"
            />
            {errors.handle_or_website && <p className="wl-error">{errors.handle_or_website}</p>}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 mt-5">
          <div className={fieldGroup}>
            <Label htmlFor="what_you_make" className="wl-field-label">What you make</Label>
            <Input
              id="what_you_make"
              className="wl-input"
              value={form.what_you_make}
              onChange={(e) => set("what_you_make", e.target.value)}
              placeholder="Co-ords, occasion wear, sarees…"
            />
            {errors.what_you_make && <p className="wl-error">{errors.what_you_make}</p>}
          </div>
          <div className={fieldGroup}>
            <Label className="wl-field-label">City</Label>
            <Select value={form.city} onValueChange={(v) => set("city", v)}>
              <SelectTrigger className="wl-input"><SelectValue placeholder="Select your city" /></SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.city && <p className="wl-error">{errors.city}</p>}
          </div>
        </div>
      </fieldset>

      {/* Step 2 — where you are today */}
      <fieldset className="wl-fieldset">
        <legend className="wl-legend">
          <span className="wl-step-num">2</span> Where you are today
        </legend>

        <div className="space-y-3">
          <Label className="wl-field-label">How old is your brand?</Label>
          <div className="grid grid-cols-2 gap-2.5">
            {BRAND_AGES.map((age) => (
              <button
                key={age}
                type="button"
                aria-pressed={form.brand_age === age}
                onClick={() => set("brand_age", age)}
                className={`wl-chip ${form.brand_age === age ? "wl-chip-on" : ""}`}
              >
                <span>{age}</span>
                {form.brand_age === age && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
          {errors.brand_age && <p className="wl-error">{errors.brand_age}</p>}
        </div>

        <div className="space-y-3 mt-6">
          <Label className="wl-field-label">
            Where do you sell today? <span className="wl-field-hint">Select all that apply</span>
          </Label>
          <div className="grid grid-cols-2 gap-2.5">
            {CHANNELS.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={channels.includes(c)}
                onClick={() => toggleChannel(c)}
                className={`wl-chip ${channels.includes(c) ? "wl-chip-on" : ""}`}
              >
                <span>{c}</span>
                {channels.includes(c) && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
          {errors.sell_channels && <p className="wl-error">{errors.sell_channels}</p>}
        </div>
      </fieldset>

      {/* Step 3 — how we reach you */}
      <fieldset className="wl-fieldset wl-fieldset-last">
        <legend className="wl-legend">
          <span className="wl-step-num">3</span> How we reach you
        </legend>

        <div className="grid gap-5 md:grid-cols-2">
          <div className={fieldGroup}>
            <Label htmlFor="monthly_orders" className="wl-field-label">
              Orders a month <span className="wl-field-hint">Optional</span>
            </Label>
            <Input
              id="monthly_orders"
              className="wl-input"
              value={form.monthly_orders}
              onChange={(e) => set("monthly_orders", e.target.value)}
              placeholder="An estimate is fine"
              inputMode="numeric"
            />
          </div>
          <div className={fieldGroup}>
            <Label htmlFor="phone" className="wl-field-label">
              Contact number <span className="wl-field-hint">WhatsApp preferred</span>
            </Label>
            <Input
              id="phone"
              className="wl-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="wl-error">{errors.phone}</p>}
          </div>
        </div>
      </fieldset>

      <div className="wl-form-actions">
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full sm:flex-1 editorial-label uppercase text-xs h-14 sm:h-12 rounded-full"
        >
          {submitting ? "Submitting…" : "Submit application"}
        </Button>
        <Button
          asChild
          type="button"
          variant="outline"
          size="lg"
          className="w-full sm:flex-1 editorial-label uppercase text-xs h-14 sm:h-12 rounded-full"
        >
          <a href={whatsappHref()} target="_blank" rel="noreferrer">
            <MessageCircle className="w-4 h-4" /> Apply on WhatsApp
          </a>
        </Button>
        <p className="editorial-body text-sm text-muted-foreground text-center w-full">
          Free to apply. We review every application and respond within 48 hours.
        </p>
      </div>
    </form>
  );
};
