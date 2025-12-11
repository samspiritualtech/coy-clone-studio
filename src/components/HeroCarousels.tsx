import { ProductCarousel } from "./ProductCarousel";
import { products } from "@/data/products";
import { Product } from "@/types";

// Helper to get random products
const getRandomProducts = (allProducts: Product[], count: number): Product[] => {
  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to get seasonal products (winter/festive items)
const getSeasonalProducts = (allProducts: Product[]): Product[] => {
  const seasonal = allProducts.filter(
    (p) =>
      p.occasions?.some((occ) =>
        ["festive", "wedding", "party"].includes(occ.toLowerCase())
      ) ||
      p.tags.includes("trending") ||
      p.material.toLowerCase().includes("velvet") ||
      p.material.toLowerCase().includes("silk")
  );
  return seasonal.slice(0, 20);
};

export const HeroCarousels = () => {
  // Filter products for each carousel
  const trendingProducts = products
    .filter((p) => p.tags.includes("trending"))
    .slice(0, 20);

  const newArrivals = products
    .filter((p) => p.tags.includes("new-arrivals"))
    .slice(0, 20);

  const exclusiveOffers = products
    .filter((p) => p.originalPrice !== undefined)
    .slice(0, 20);

  const personalizedPicks = getRandomProducts(products, 20);

  const seasonalFavorites = getSeasonalProducts(products);

  return (
    <section className="py-4 space-y-2">
      <ProductCarousel title="🔥 Trending Now" products={trendingProducts} />
      <ProductCarousel title="✨ New Arrivals" products={newArrivals} />
      <ProductCarousel
        title="💰 Exclusive Offers"
        products={exclusiveOffers}
        showOriginalPrice
      />
      <ProductCarousel
        title="💡 Personalized Picks"
        products={personalizedPicks}
        badge="AI"
      />
      <ProductCarousel
        title="🎄 Seasonal Favourites"
        products={seasonalFavorites}
      />
    </section>
  );
};
