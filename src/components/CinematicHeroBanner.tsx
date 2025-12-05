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

  // Premium hero image - stylish woman in luxury fashion
  const heroImage = "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80";

  return (
    <section className="relative w-full h-[500px] sm:h-[550px] lg:h-[650px] overflow-hidden">
      {/* Background Image with Ken Burns Animation */}
      <div
        className="absolute inset-0 ken-burns-container"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns transition-opacity duration-700"
          style={{
            backgroundImage: `url(${heroImage})`,
            opacity: imageLoaded ? 1 : 0,
          }}
        />
      </div>

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

      {/* Shimmer Light Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="shimmer-overlay" />
      </div>

      {/* Floating Bokeh Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="bokeh-particle bokeh-1" />
        <div className="bokeh-particle bokeh-2" />
        <div className="bokeh-particle bokeh-3" />
        <div className="bokeh-particle bokeh-4" />
      </div>

      {/* Gradient Overlays for elegant lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      
      {/* Warm highlight overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-rose-500/5" />

      {/* Decorative Animated Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl floating-orb" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl floating-orb-delayed" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl floating-orb-slow" />

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
            Premium fashion for the modern woman. Discover elegance in every detail.
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
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }

        /* Ken Burns zoom effect */
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(-1%, -0.5%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .ken-burns {
          animation: kenBurns 25s ease-in-out infinite;
        }
        .ken-burns-container {
          overflow: hidden;
        }

        /* Shimmer light streak */
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(15deg); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: translateX(200%) rotate(15deg); opacity: 0; }
        }
        .shimmer-overlay {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 6s ease-in-out infinite;
        }

        /* Floating bokeh particles */
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(5px); opacity: 0.6; }
          50% { transform: translateY(-25px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-10px) translateX(10px); opacity: 0.7; }
        }
        .bokeh-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          filter: blur(1px);
        }
        .bokeh-1 {
          width: 8px; height: 8px;
          top: 20%; right: 30%;
          animation: floatParticle 7s ease-in-out infinite;
        }
        .bokeh-2 {
          width: 12px; height: 12px;
          top: 40%; right: 20%;
          animation: floatParticle 9s ease-in-out infinite 1s;
        }
        .bokeh-3 {
          width: 6px; height: 6px;
          top: 60%; right: 35%;
          animation: floatParticle 8s ease-in-out infinite 2s;
        }
        .bokeh-4 {
          width: 10px; height: 10px;
          top: 30%; right: 15%;
          animation: floatParticle 10s ease-in-out infinite 3s;
        }

        /* Floating orbs */
        @keyframes floatOrb {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .floating-orb {
          animation: floatOrb 4s ease-in-out infinite;
        }
        .floating-orb-delayed {
          animation: floatOrb 5s ease-in-out infinite 1s;
        }
        .floating-orb-slow {
          animation: floatOrb 6s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
};
