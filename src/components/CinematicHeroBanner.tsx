import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CinematicHeroBanner = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Premium hero image - using high-quality fashion photography
  const heroImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80";

  return (
    <section className="relative w-full h-[500px] sm:h-[550px] lg:h-[650px] overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${scrollY * 0.3}px)`,
          opacity: imageLoaded ? 1 : 0,
        }}
      />

      {/* Preload image */}
      <img
        src={heroImage}
        alt=""
        className="hidden"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/80 animate-pulse" />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content Container */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl lg:max-w-3xl animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-white/90 text-sm font-medium">New Collection 2024</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            <span className="block">Luxury</span>
            <span className="block text-primary">Collection</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-8 max-w-xl leading-relaxed">
            Premium fashion for the modern man. Discover elegance in every thread.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/collections")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold group"
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/collections?category=new-arrivals")}
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
            >
              Explore New Arrivals
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-white">500+</p>
              <p className="text-white/60 text-sm">Premium Styles</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-white">50K+</p>
              <p className="text-white/60 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-white">4.9</p>
              <p className="text-white/60 text-sm">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
