import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  firstName: z.string().trim().max(100).optional(),
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  mobile: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000),
  agree: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
});

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    mobile: "",
    message: "",
    agree: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const subject = encodeURIComponent(`OGURA Enquiry from ${form.firstName || "Website"}`);
    const body = encodeURIComponent(
      `Name: ${form.firstName}\nEmail: ${form.email}\nMobile: ${form.mobile}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:brands@ogura.in?subject=${subject}&body=${body}`;
    setTimeout(() => {
      toast({
        title: "Inquiry ready to send",
        description: "Your email client has opened with your message.",
      });
      setSubmitting(false);
      setForm({ firstName: "", email: "", mobile: "", message: "", agree: false });
    }, 600);
  };

  return (
    <CustomerLayout>
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Get in touch
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Contact Us</h1>
          <p className="text-muted-foreground">
            We'd love to hear from you. Reach out for brand collaborations, wholesale enquiries or any
            questions about OGURA.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="md:col-span-1 space-y-6">
            <a
              href="mailto:brands@ogura.in"
              className="flex items-start gap-4 p-5 rounded-lg border border-border hover:border-foreground transition-colors"
            >
              <Mail className="h-5 w-5 mt-1 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">brands@ogura.in</p>
              </div>
            </a>
            <a
              href="tel:+919897014111"
              className="flex items-start gap-4 p-5 rounded-lg border border-border hover:border-foreground transition-colors"
            >
              <Phone className="h-5 w-5 mt-1 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                <p className="text-sm font-medium">+91 98970 14111</p>
              </div>
            </a>
            <div className="flex items-start gap-4 p-5 rounded-lg border border-border">
              <MapPin className="h-5 w-5 mt-1 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Studio</p>
                <p className="text-sm font-medium">India</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-card p-8 rounded-lg border border-border">
            <div>
              <label className="block text-sm mb-2">Your First Name</label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Enter your first name"
                maxLength={100}
                className="h-12 rounded-none border-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Your Email Address<span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email address"
                maxLength={255}
                className="h-12 rounded-none border-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Mobile Number</label>
              <Input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="Mobile number"
                maxLength={20}
                className="h-12 rounded-none border-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Your Message<span className="text-destructive">*</span>
              </label>
              <Textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Type your message here"
                maxLength={1000}
                className="min-h-[140px] rounded-none border-2"
              />
            </div>
            <div>
              <p className="text-sm mb-2">terms</p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={form.agree}
                  onCheckedChange={(v) => setForm({ ...form, agree: v === true })}
                />
                I agree to receive messages for communication via RCS.
              </label>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full h-12 px-8 bg-[#1E9FD9] hover:bg-[#1a8bbf] text-white"
            >
              {submitting ? "Sending..." : "Submit Your Inquiry"}
            </Button>
          </form>
        </div>
      </section>
    </CustomerLayout>
  );
};

export default Contact;
