import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const AIStylistCTA = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-accent via-accent/90 to-accent/80 text-accent-foreground">
          <div className="relative z-10 p-8 md:p-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Your Personal AI Stylist
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get personalized style recommendations powered by artificial intelligence. 
              Tell us what you're looking for and let our AI find your perfect match.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-accent hover:bg-white/90"
            >
              Try AI Stylist Now
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </Card>
      </div>
    </section>
  );
};
