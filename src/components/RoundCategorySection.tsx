import { RoundCategoryCard } from "./RoundCategoryCard";

const categories = [
  {
    name: "Kurta Sets",
    slug: "kurta-sets",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
  },
  {
    name: "Sherwanis",
    slug: "sherwanis",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
  },
  {
    name: "Nehru Jackets",
    slug: "nehru-jackets",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80",
  },
  {
    name: "Bandhgalas",
    slug: "bandhgalas",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
  },
  {
    name: "Suits & Tuxedos",
    slug: "suits-tuxedos",
    image: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=400&q=80",
  },
  {
    name: "Co-Ord Sets",
    slug: "co-ord-sets",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
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
