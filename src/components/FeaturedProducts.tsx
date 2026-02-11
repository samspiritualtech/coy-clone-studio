import { getExploreProducts } from "@/data/productCatalog";
import { CatalogProductCard } from "@/components/CatalogProductCard";

export const FeaturedProducts = () => {
  const products = getExploreProducts();

  if (!products.length) return null;

  return (
    <section id="featured-products" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Explore Our Collection
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <CatalogProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
