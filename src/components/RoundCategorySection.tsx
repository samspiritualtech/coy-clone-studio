import { RoundCategoryCard } from "./RoundCategoryCard";

const categories = [
  {
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
  },
  {
    name: "Tops",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=400&q=80",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
  },
  {
    name: "Outerwear",
    slug: "outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
  },
  {
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
  },
];

export const RoundCategorySection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Explore our curated collection of premium ethnic and formal wear
          </p>
        </div>

        <div className="flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto pb-4 scrollbar-hide justify-start lg:justify-center">
          {categories.map((category) => (
            <RoundCategoryCard
              key={category.slug}
              name={category.name}
              image={category.image}
              slug={category.slug}
            />
          ))}
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
