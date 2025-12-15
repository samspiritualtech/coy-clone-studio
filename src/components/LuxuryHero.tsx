import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    title: "New Season",
    subtitle: "Discover the latest collection",
    cta: "Shop Now",
    ctaLink: "/collections",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
    title: "Timeless Elegance",
    subtitle: "Curated pieces for the modern woman",
    cta: "Explore",
    ctaLink: "/collections",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80",
    title: "Designer Edit",
    subtitle: "Exclusive collaborations and limited editions",
    cta: "View Collection",
    ctaLink: "/designers",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
    title: "Summer Luxe",
    subtitle: "Effortless style for warmer days",
    cta: "Discover",
    ctaLink: "/collections",
  },
];

export const LuxuryHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          {/* Background Image with Ken Burns effect */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-[kenburns_20s_ease-out_infinite]"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        </div>
      ))}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 h-full flex flex-col items-center justify-center text-center px-4 transition-all duration-700",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <span className="text-white/70 text-xs uppercase tracking-[0.4em] mb-6">
          {slides[currentSlide].subtitle}
        </span>
        
        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-extralight uppercase tracking-[0.3em] mb-8">
          {slides[currentSlide].title}
        </h1>
        
        <Link to={slides[currentSlide].ctaLink}>
          <Button
            variant="outline"
            size="lg"
            className="border-white/60 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-500 tracking-[0.2em] uppercase text-sm px-12 py-6"
          >
            {slides[currentSlide].cta}
          </Button>
        </Link>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-10 w-10 stroke-1" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-10 w-10 stroke-1" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-1 transition-all duration-500",
              index === currentSlide ? "w-12 bg-white" : "w-6 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
};
