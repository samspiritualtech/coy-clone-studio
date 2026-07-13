import { useRef } from "react";
import { Link } from "react-router-dom";
import { Tilt3D } from "@/components/luxury3d/Tilt3D";
import { ParallaxLayer } from "@/components/luxury3d/ParallaxLayer";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import chanderiShine from "@/assets/chanderi-shine.jpg";
import instaLoved from "@/assets/insta-loved.jpg";
import indieVogue from "@/assets/indie-vogue.jpg";
import urbanLoom from "@/assets/urban-loom.jpg";
import sareeSociety from "@/assets/saree-society.jpg";

const brands = [
  { name: "Chanderi Shine", image: chanderiShine, slug: "chanderi-shine" },
  { name: "Insta Loved", image: instaLoved, slug: "insta-loved" },
  { name: "Indie Vogue", image: indieVogue, slug: "indie-vogue" },
  { name: "Urban Loom", image: urbanLoom, slug: "urban-loom" },
  { name: "Saree Society", image: sareeSociety, slug: "saree-society" },
  { name: "Velvet Threads", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80", slug: "velvet-threads" },
];

export const HiddenGemsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: "[data-reveal]", stagger: 0.14, y: 60 });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-4 md:px-8 lg:px-16 overflow-hidden isolate"
    >
      {/* Section Header — museum gallery treatment */}
      <div className="relative z-10 max-w-7xl mx-auto mb-16 md:mb-20">
        <p data-reveal className="museum-eyebrow mb-7">
          Gallery 01 — Hidden Gems
        </p>
        <h2 data-reveal className="museum-display max-w-4xl">
          Pieces that <em>find you</em>
        </h2>
        <p data-reveal className="museum-lede mt-7">
          Niche, homegrown labels discovered from Instagram creators. Rare finds float in their own light — move closer, the spotlight follows.
        </p>
      </div>

      {/* Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left - Large Banner */}
        <Tilt3D className="lg:w-1/2" max={6} scale={1.015} style={{ opacity: 0 }}>
          <div data-reveal>
            <Link
              to="/collections?category=instagram"
              className="relative block museum-card museum-spotlight overflow-hidden"
            >
              <div style={{ aspectRatio: "3/4" }} className="relative overflow-hidden">
                <ParallaxLayer speed={100} className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
                    alt="Hidden Gems Collection"
                    className="w-full h-full object-cover scale-110 transition-transform duration-[1200ms] group-hover:scale-[1.18]"
                  />
                </ParallaxLayer>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[2]" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                  <p className="museum-eyebrow text-[10px] mb-4">Featured</p>
                  <h3 className="museum-display-sm mb-4">
                    Hidden <em>Gems</em>
                  </h3>
                  <p className="museum-lede mb-6 text-[13px]">
                    Niche, homegrown labels discovered from Instagram creators.
                  </p>
                  <div className="museum-meta mb-6">
                    <div>
                      <span className="k">Now showing</span>
                      24 curated objects
                    </div>
                  </div>
                  <span className="museum-cta">Explore Instagram</span>
                </div>
              </div>
            </Link>
          </div>
        </Tilt3D>

        {/* Right - Brand Cards Grid */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6 content-start">
          {brands.map((brand) => (
            <Tilt3D key={brand.slug} max={9} scale={1.03} style={{ opacity: 0 }}>
              <div data-reveal>
                <Link
                  to={`/collections/${brand.slug}`}
                  className="group block museum-card museum-spotlight"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-4 py-4 border-t border-[rgba(233,212,163,0.18)]">
                    <p className="text-[11px] tracking-[0.32em] uppercase text-[#c9a56b] italic font-serif text-center">
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
