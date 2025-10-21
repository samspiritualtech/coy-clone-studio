import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/50" />
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Discover Your
            <span className="block text-accent">Perfect Style</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Curated fashion from premium brands. Experience personalized styling with our AI assistant.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="group">
              Shop New Arrivals
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Try AI Stylist
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-accent/30 to-transparent" />
      </div>
    </section>
  );
};
