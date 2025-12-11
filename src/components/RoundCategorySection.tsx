import { Link } from "react-router-dom";
import { RoundCategoryCard } from "./RoundCategoryCard";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Dresses",
    slug: "dresses",
    gifSrc: "https://ogura.in/assets/gifs/dresses-loop.gif",
    staticFallback: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
  },
  {
    name: "Tops",
    slug: "tops",
    gifSrc: "https://ogura.in/assets/gifs/tops-loop.gif",
    staticFallback: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=400&q=80",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    gifSrc: "https://ogura.in/assets/gifs/bottoms-loop.gif",
    staticFallback: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
  },
  {
    name: "Outerwear",
    slug: "outerwear",
    gifSrc: "https://ogura.in/assets/gifs/outerwear-loop.gif",
    staticFallback: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    gifSrc: "https://ogura.in/assets/gifs/accessories-loop.gif",
    staticFallback: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
  },
];

export const RoundCategorySection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 md:px-20">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Explore our curated collection of premium ethnic and formal wear
          </p>
        </div>

        {/* Scrollable container with gradient overlays */}
        <div className="relative">
          {/* Left gradient overlay - hidden on desktop */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none lg:hidden" />
          
          {/* Category cards container */}
          <div className="flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:justify-center pb-4 scrollbar-hide px-4 lg:px-0">
            {categories.map((category) => (
              <RoundCategoryCard
                key={category.slug}
                name={category.name}
                gifSrc={category.gifSrc}
                staticFallback={category.staticFallback}
                slug={category.slug}
              />
            ))}
          </div>
          
          {/* Right gradient overlay - hidden on desktop */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none lg:hidden" />
        </div>

        {/* Explore all categories CTA */}
        <div className="text-center mt-8">
          <Link 
            to="/collections" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200 group"
          >
            Explore all categories
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
