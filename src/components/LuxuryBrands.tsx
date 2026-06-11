import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tilt3D } from "@/components/luxury3d/Tilt3D";
import { useGsapReveal } from "@/hooks/useGsapReveal";


const brands = [
  { name: "RARA AVIS", logo: "R" },
  { name: "TWEEDTM", logo: "T" },
  { name: "LOOM", logo: "L" },
  { name: "KAVITA", logo: "K" },
  { name: "GULMOHR", logo: "G" },
  { name: "INDIGO", logo: "I" },
  { name: "DARZAA", logo: "D" },
  { name: "FAE", logo: "F" },
];

export const LuxuryBrands = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: "[data-reveal]", stagger: 0.06, y: 30 });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden isolate">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80)",
        }}
      />

      {/* Overlay + grain + vignette */}
      <div className="absolute inset-0 bg-black/75" />
      <div className="luxury-grain" aria-hidden />
      <div className="luxury-vignette" aria-hidden />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span data-reveal className="luxury-eyebrow-gold text-[10px] md:text-xs mb-3">
              Curated Selection
            </span>
            <h2
              data-reveal
              className="text-white text-3xl md:text-5xl font-light uppercase tracking-[0.18em] mt-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Top Brands
              <span className="block mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[#c9a56b] to-transparent" />
            </h2>
          </div>
          <Link to="/brands" data-reveal>
            <Button
              variant="outline"
              className="mt-6 md:mt-0 border-[#c9a56b]/50 bg-transparent text-white hover:bg-[#c9a56b] hover:text-black transition-all duration-500 tracking-widest uppercase text-xs"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand, index) => (
            <Tilt3D key={index} max={10} scale={1.03}>
              <div data-reveal>
              <Link
                to={`/brands/${brand.name.toLowerCase().replace(/\s/g, "-")}`}
                className="group relative aspect-square flex items-center justify-center luxury-glass luxury-sweep luxury-spotlight luxury-hairline-gold rounded-sm transition-all duration-500"
              >
                <div className="text-center relative z-10">
                  <div
                    className="text-4xl md:text-5xl font-extralight text-[#e9d4a3]/80 group-hover:text-[#e9d4a3] transition-colors mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {brand.logo}
                  </div>
                  <p className="text-[10px] md:text-xs font-light text-white/55 uppercase tracking-[0.25em] group-hover:text-white/90 transition-colors">
                    {brand.name}
                  </p>
                </div>
              </Link>
              </div>
            </Tilt3D>
          ))}
        </div>

      </div>
    </section>
  );
};
