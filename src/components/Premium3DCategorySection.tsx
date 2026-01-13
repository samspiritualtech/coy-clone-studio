import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const categories = [
  {
    id: "women-clothes",
    name: "Women Clothes",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=90",
  },
  {
    id: "men-clothes",
    name: "Men Clothes",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=90",
  },
  {
    id: "footwear",
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=90",
  },
  {
    id: "bags",
    name: "Bags",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=90",
  },
  {
    id: "made-to-order",
    name: "Made to Order",
    slug: "customize",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90",
  },
];

export const Premium3DCategorySection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrollX(scrollContainerRef.current.scrollLeft);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center">
          Shop by Category
        </h2>
        <p className="text-muted-foreground text-center mt-2 text-sm md:text-base">
          Explore our curated collections
        </p>
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto px-4 md:px-8 lg:px-16 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((category, index) => {
          // Calculate parallax offset based on scroll position
          const parallaxOffset = (scrollX * 0.05) - (index * 10);

          return (
            <Link
              key={category.id}
              to={`/collections?category=${category.slug}`}
              className="group flex-shrink-0 snap-center"
            >
              {/* 3D Card */}
              <div
                className="relative w-[260px] h-[340px] md:w-[280px] md:h-[360px] lg:w-[300px] lg:h-[380px] rounded-2xl overflow-visible cursor-pointer transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.02]"
                style={{
                  perspective: "1000px",
                }}
              >
                {/* Card Background with Festive Red Gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#DC143C] shadow-xl transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-red-900/40" />

                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-10 bg-[radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] bg-[length:20px_20px]" />

                {/* Image Container with 3D Pop Effect */}
                <div
                  className="absolute inset-x-0 top-4 bottom-16 flex items-end justify-center overflow-visible"
                  style={{
                    transform: `translateX(${parallaxOffset * 0.1}px)`,
                  }}
                >
                  <div className="relative w-full h-full flex items-end justify-center">
                    {/* Shadow beneath the image */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/30 blur-xl rounded-full transition-all duration-500 group-hover:w-4/5 group-hover:blur-2xl" />

                    {/* Product Image */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="relative z-10 w-auto h-[85%] max-w-[90%] object-contain object-bottom drop-shadow-2xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2"
                      style={{
                        filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))",
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-b-2xl" />

                {/* Category Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                  <span className="text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-lg">
                    {category.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                    <ChevronRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Custom scrollbar hide styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
