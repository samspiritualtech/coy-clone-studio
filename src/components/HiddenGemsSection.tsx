import { useRef } from "react";
import { Link } from "react-router-dom";
import { Tilt3D } from "@/components/luxury3d/Tilt3D";
import { ParallaxLayer } from "@/components/luxury3d/ParallaxLayer";
import { useGsapReveal } from "@/hooks/useGsapReveal";


const brands = [
  {
    name: "Chanderi Shine",
    image: "https://images.unsplash.com/photo-1583391265196-53c5e5e92b0d?w=600&q=80",
    slug: "chanderi-shine",
  },
  {
    name: "Insta Loved",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    slug: "insta-loved",
  },
  {
    name: "Indie Vogue",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
    slug: "indie-vogue",
  },
  {
    name: "Urban Loom",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    slug: "urban-loom",
  },
  {
    name: "Saree Society",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    slug: "saree-society",
  },
  {
    name: "Velvet Threads",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
    slug: "velvet-threads",
  },
];

export const HiddenGemsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: "[data-reveal]", stagger: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-20 px-4 md:px-8 lg:px-16 overflow-hidden isolate"
      style={{ backgroundColor: "#2A0A14" }}
    >
      {/* Cinematic overlays */}
      <div className="luxury-vignette" aria-hidden />
      <div className="luxury-grain" aria-hidden />

      {/* Section Header */}
      <div className="text-center mb-10 md:mb-14">
        <p className="text-[#C9A96E] text-xs md:text-sm uppercase tracking-[0.3em] mb-3 font-light">
          Instagram Brands
        </p>
        <h2 className="text-white text-3xl md:text-5xl font-serif font-light tracking-wide">
          Hidden Gems
        </h2>
      </div>

      {/* Split Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left - Large Banner */}
        <Tilt3D className="lg:w-1/2" max={4} scale={1.01}>
          <Link to="/collections?category=instagram" className="relative rounded-2xl overflow-hidden group block luxury-depth luxury-spotlight">
            <div style={{ aspectRatio: "3/4" }} className="relative">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
                alt="Hidden Gems Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                <h3 className="text-white text-4xl md:text-5xl font-serif font-light tracking-wide mb-3">
                  HIDDEN GEMS
                </h3>
                <p className="text-white/80 text-sm md:text-base font-light max-w-sm leading-relaxed mb-5">
                  Niche, homegrown labels discovered from Instagram creators.
                </p>
                <span className="inline-block px-6 py-2 text-xs uppercase tracking-[0.2em] text-white/90 luxury-glass rounded-full transition-all duration-300 group-hover:bg-white/15">
                  Explore Instagram
                </span>
              </div>
            </div>
          </Link>
        </Tilt3D>


        {/* Right - Brand Cards Grid */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6 content-start">
          {brands.map((brand) => (
            <Tilt3D key={brand.slug} max={8} scale={1.02}>
              <Link
                to={`/collections?brand=${brand.slug}`}
                className="group block luxury-spotlight rounded-xl overflow-hidden luxury-depth"
              >
                <div className="rounded-xl overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="py-3 px-4 luxury-glass" style={{ backgroundColor: "rgba(58,26,36,0.85)" }}>
                    <p className="text-white/90 text-sm md:text-base font-serif tracking-wide text-center">
                      {brand.name}
                    </p>
                  </div>
                </div>
              </Link>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
};
