import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const LaunchStudioCTA = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    brandName: "",
    journeyStage: "",
    vision: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 2 business days.",
      });
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        brandName: "",
        journeyStage: "",
        vision: ""
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4">
      <Card className="max-w-2xl mx-auto shadow-2xl border-2">
        <CardContent className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Ready to Launch Your Fashion Brand?
            </h3>
            <p className="text-gray-600">Apply now and start your 4-week journey to success</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-gray-900">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 focus-visible:ring-[hsl(var(--ogura-red))]"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-900">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1.5 focus-visible:ring-[hsl(var(--ogura-red))]"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-900">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1.5 focus-visible:ring-[hsl(var(--ogura-red))]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <Label htmlFor="brandName" className="text-gray-900">Brand/Business Name *</Label>
                <Input
                  id="brandName"
                  required
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="mt-1.5 focus-visible:ring-[hsl(var(--ogura-red))]"
                  placeholder="Your brand name"
                />
              </div>

              <div>
                <Label htmlFor="journeyStage" className="text-gray-900">Where are you in your journey? *</Label>
                <Select
                  required
                  value={formData.journeyStage}
                  onValueChange={(value) => setFormData({ ...formData, journeyStage: value })}
                >
                  <SelectTrigger className="mt-1.5 focus:ring-[hsl(var(--ogura-red))]">
                    <SelectValue placeholder="Select your stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Just an idea</SelectItem>
                    <SelectItem value="designs">Have designs</SelectItem>
                    <SelectItem value="manufacture">Ready to manufacture</SelectItem>
                    <SelectItem value="launch">Ready to launch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vision" className="text-gray-900">Tell us about your vision *</Label>
                <Textarea
                  id="vision"
                  required
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="mt-1.5 min-h-[100px] focus-visible:ring-[hsl(var(--ogura-red))]"
                  placeholder="Describe your fashion brand vision, target audience, and what makes it unique..."
                  minLength={50}
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 50 characters</p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[hsl(var(--ogura-red))] hover:bg-[hsl(var(--ogura-red))]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Apply to Launch Studio"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
