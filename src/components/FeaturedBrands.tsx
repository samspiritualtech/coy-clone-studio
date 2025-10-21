import { Card } from "@/components/ui/card";

const brands = [
  { name: "Brand A", logo: "🌟" },
  { name: "Brand B", logo: "✨" },
  { name: "Brand C", logo: "💫" },
  { name: "Brand D", logo: "⭐" },
  { name: "Brand E", logo: "🌙" },
  { name: "Brand F", logo: "☀️" },
  { name: "Brand G", logo: "🔥" },
  { name: "Brand H", logo: "💎" },
];

export const FeaturedBrands = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Most Loved Brands</h2>
          <p className="text-muted-foreground">Shop from premium fashion labels</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {brands.map((brand, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 aspect-square flex items-center justify-center"
            >
              <div className="text-center p-4">
                <div className="text-5xl mb-2">{brand.logo}</div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand.name}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/brands"
            className="inline-flex items-center text-sm font-medium hover:text-accent transition-colors"
          >
            View All Brands
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
