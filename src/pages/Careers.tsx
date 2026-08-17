import { useEffect, useState } from "react";
import { z } from "zod";
import { Mail, Sparkles, Users, TrendingUp, Gem } from "lucide-react";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CAREERS_EMAIL = "careers@ogura.in";

const applicationSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
  role: z.string().trim().min(1, { message: "Please tell us the role you want" }).max(120),
  portfolio: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().min(1, { message: "A short note is required" }).max(1500),
});

const values = [
  {
    icon: Gem,
    title: "Craft first",
    copy: "We obsess over detail — in a seam, a shot, a screen. Quality is the culture, not a checkpoint.",
  },
  {
    icon: Users,
    title: "Close to designers",
    copy: "Work directly with India's designers, ateliers and emerging labels. No layers between you and the craft.",
  },
  {
    icon: Sparkles,
    title: "Real ownership",
    copy: "Small teams, wide scope. You own outcomes end to end and ship at pace.",
  },
  {
    icon: TrendingUp,
    title: "Grow with us",
    copy: "We are early. The work you do now defines how luxury fashion is bought in India.",
  },
];

const openRoles = [
  { title: "Fashion Merchandiser", location: "New Delhi", type: "Full-time", team: "Catalogue" },
  { title: "Growth Marketing Manager", location: "Remote, India", type: "Full-time", team: "Growth" },
  { title: "Frontend Engineer (React)", location: "Remote, India", type: "Full-time", team: "Product" },
  { title: "Studio Photographer", location: "New Delhi", type: "Contract", team: "Creative" },
  { title: "Seller Success Associate", location: "New Delhi", type: "Full-time", team: "Marketplace" },
];

const Careers = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    portfolio: "",
    message: "",
  });

  useEffect(() => {
    document.title = "Careers at OGURA | Luxury Fashion Marketplace Jobs";
    const desc =
      "Join OGURA — build India's luxury fashion marketplace with designers, brands and ateliers. See open roles and apply at careers@ogura.in.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const applyToRole = (role: string) => {
    setForm((f) => ({ ...f, role }));
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const subject = encodeURIComponent(`Application — ${form.role} — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nRole: ${form.role}\nPortfolio / LinkedIn: ${form.portfolio}\n\nAbout me:\n${form.message}\n\n(Please attach your CV before sending.)`
    );
    window.location.href = `mailto:${CAREERS_EMAIL}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      toast({
        title: "Application ready to send",
        description: "Your email client has opened — attach your CV and hit send.",
      });
      setSubmitting(false);
    }, 600);
  };

  return (
    <CustomerLayout>
      {/* Hero */}
      <section className="relative border-b border-border bg-card">
        <div className="container mx-auto px-4 py-20 md:py-28 text-center max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-6">
            OGURA Careers
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] mb-6">
            Build the house of Indian luxury fashion
          </h1>
          <p className="text-muted-foreground md:text-lg mb-10">
            We are a small team bringing India's designers, ateliers and emerging labels to a
            world-class storefront. If you care about craft as much as commerce, we would like to
            meet you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full h-12 px-8"
            >
              View open roles
            </Button>
            <a
              href={`mailto:${CAREERS_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
              {CAREERS_EMAIL}
            </a>
          </div>
        </div>
      </section>

      {/* Why OGURA */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-center mb-12">
          Why OGURA
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-7 rounded-lg border border-border bg-card hover:border-foreground/40 transition-colors"
            >
              <v.icon className="h-5 w-5 mb-5 text-accent" />
              <h3 className="text-base font-medium mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section id="roles" className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">Open roles</h2>
          <p className="text-sm text-muted-foreground mb-10">
            Do not see your role? Write to us anyway — we hire for talent before titles.
          </p>
          <ul className="divide-y divide-border border-t border-border">
            {openRoles.map((role) => (
              <li
                key={role.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6"
              >
                <div>
                  <h3 className="text-lg font-light">{role.title}</h3>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">
                    {role.team} · {role.location} · {role.type}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full px-6 shrink-0"
                  onClick={() => applyToRole(role.title)}
                >
                  Apply
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">Apply now</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Fill this in and we will open your mail client with the details — attach your CV or
            portfolio before sending. You can also email us directly at{" "}
            <a href={`mailto:${CAREERS_EMAIL}`} className="underline underline-offset-4">
              {CAREERS_EMAIL}
            </a>
            .
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-card p-8 rounded-lg border border-border"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">
                  Full Name<span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  maxLength={100}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Email<span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  maxLength={255}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Phone</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Mobile number"
                  maxLength={20}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Role of interest<span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Frontend Engineer"
                  maxLength={120}
                  className="h-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Portfolio / LinkedIn</label>
              <Input
                value={form.portfolio}
                onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                placeholder="https://"
                maxLength={300}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Tell us about you<span className="text-destructive">*</span>
              </label>
              <Textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What you have worked on, and why OGURA"
                maxLength={1500}
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" disabled={submitting} className="rounded-full h-12 px-8">
              {submitting ? "Preparing..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </section>
    </CustomerLayout>
  );
};

export default Careers;
