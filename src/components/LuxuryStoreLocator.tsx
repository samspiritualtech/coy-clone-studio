import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tilt3D } from "@/components/luxury3d/Tilt3D";
import { ParallaxLayer } from "@/components/luxury3d/ParallaxLayer";
import { useGsapReveal } from "@/hooks/useGsapReveal";


const stores = [
  { name: "Mumbai Flagship", address: "High Street Phoenix, Lower Parel" },
  { name: "Delhi", address: "Select Citywalk, Saket" },
  { name: "Bangalore", address: "UB City Mall, Vittal Mallya Road" },
];

export const LuxuryStoreLocator = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: "[data-reveal]", stagger: 0.1 });

  return (
    <section ref={sectionRef} className="relative h-[70vh] md:h-[80vh] overflow-hidden isolate">
      {/* Parallax Background Image */}
      <ParallaxLayer speed={70} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)",
          }}
        />
      </ParallaxLayer>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="luxury-vignette" aria-hidden />
      <div className="luxury-grain" aria-hidden />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container mx-auto px-4">
        <span data-reveal className="luxury-eyebrow-gold text-[10px] md:text-xs mb-5">
          Experience In Person
        </span>

        <h2
          data-reveal
          className="text-white text-4xl md:text-6xl font-light uppercase tracking-[0.18em] mb-12"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Visit Our Stores
          <span className="block mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-[#c9a56b] to-transparent" />
        </h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-12">
          {stores.map((store, index) => (
            <Tilt3D key={index} max={10} scale={1.04}>
              <div data-reveal>
              <div className="text-center luxury-glass luxury-spotlight luxury-sweep luxury-hairline-gold px-10 py-8 rounded-sm min-w-[220px]">
                <MapPin className="h-5 w-5 text-[#e9d4a3] mx-auto mb-3 relative z-10" strokeWidth={1.5} />
                <h3
                  className="text-white font-light text-base uppercase tracking-[0.18em] mb-2 relative z-10"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {store.name}
                </h3>
                <p className="text-white/65 text-xs tracking-wide relative z-10">
                  {store.address}
                </p>
              </div>
              </div>
            </Tilt3D>
          ))}
        </div>

        <div data-reveal>
          <Link to="/stores">
            <Button
              variant="outline"
              size="lg"
              className="border-[#c9a56b]/50 bg-transparent text-white hover:bg-[#c9a56b] hover:text-black transition-all duration-500 tracking-[0.2em] uppercase text-sm"
            >
              Find All Stores
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
