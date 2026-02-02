import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferences, setPreferences] = useState({
    womenswear: false,
    menswear: false,
    bridal: false,
    ethnic: false,
    contemporary: false,
    accessories: false,
    notifications: true,
    promotions: false,
  });

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding();
      toast.success("Welcome to Ogura! Your profile is all set.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { key: "womenswear", label: "Women's Fashion", emoji: "👗" },
    { key: "menswear", label: "Men's Fashion", emoji: "🎩" },
    { key: "bridal", label: "Bridal & Wedding", emoji: "💍" },
    { key: "ethnic", label: "Ethnic & Traditional", emoji: "🪷" },
    { key: "contemporary", label: "Contemporary", emoji: "✨" },
    { key: "accessories", label: "Accessories", emoji: "👜" },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">
            Welcome to <span className="font-medium">OGURA</span>, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Let's personalize your experience. This will only take a moment.
          </p>
        </div>

        {/* Preferences Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">What interests you?</CardTitle>
            <CardDescription>
              Select categories to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handlePreferenceChange(category.key)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    preferences[category.key]
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{category.emoji}</span>
                    {preferences[category.key] && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm font-medium">{category.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Stay Updated</CardTitle>
            <CardDescription>
              Choose how you'd like to hear from us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={() => handlePreferenceChange("notifications")}
              />
              <Label htmlFor="notifications" className="text-sm cursor-pointer">
                Order updates and important notifications
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="promotions"
                checked={preferences.promotions}
                onCheckedChange={() => handlePreferenceChange("promotions")}
              />
              <Label htmlFor="promotions" className="text-sm cursor-pointer">
                Exclusive offers, new arrivals, and promotions
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard", { replace: true })}
            disabled={isSubmitting}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          You can always update these preferences in your profile settings
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
