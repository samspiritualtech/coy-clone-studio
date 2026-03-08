import { Link } from "react-router-dom";

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
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: "#2A0A14" }}>
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
        <Link to="/collections?category=instagram" className="lg:w-1/2 relative rounded-2xl overflow-hidden group block shadow-lg hover:shadow-2xl transition-shadow duration-500">
          <div style={{ aspectRatio: "3/4" }} className="relative">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
              alt="Hidden Gems Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <h3 className="text-white text-4xl md:text-5xl font-serif font-light tracking-wide mb-3">
                HIDDEN GEMS
              </h3>
              <p className="text-white/80 text-sm md:text-base font-light max-w-sm leading-relaxed mb-5">
                Niche, homegrown labels discovered from Instagram creators.
              </p>
              <span className="inline-block px-6 py-2 text-xs uppercase tracking-[0.2em] text-white/90 border border-white/30 rounded-full backdrop-blur-sm bg-white/5 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/50">
                Explore Instagram
              </span>
            </div>
          </div>
        </Link>

        {/* Right - Brand Cards Grid */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6 content-start">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/collections?brand=${brand.slug}`}
              className="group block"
            >
              <div className="rounded-xl overflow-hidden shadow-lg shadow-black/30 transition-all duration-500 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="py-3 px-4" style={{ backgroundColor: "#3A1A24" }}>
                  <p className="text-white/90 text-sm md:text-base font-serif tracking-wide text-center">
                    {brand.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
