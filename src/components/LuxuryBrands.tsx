import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80)",
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-white/60 text-xs uppercase tracking-[0.3em] mb-2 block">
              Curated Selection
            </span>
            <h2 className="text-white text-3xl md:text-5xl font-light uppercase tracking-[0.2em]">
              Top Brands
            </h2>
          </div>
          <Link to="/brands">
            <Button
              variant="outline"
              className="mt-6 md:mt-0 border-white/40 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 tracking-widest uppercase text-xs"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand, index) => (
            <Link
              key={index}
              to={`/brands/${brand.name.toLowerCase().replace(/\s/g, "-")}`}
              className="group relative aspect-square flex items-center justify-center border border-white/20 hover:border-white/50 transition-all duration-500 hover:bg-white/5"
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-extralight text-white/80 group-hover:text-white transition-colors mb-2">
                  {brand.logo}
                </div>
                <p className="text-[10px] md:text-xs font-light text-white/50 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">
                  {brand.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
