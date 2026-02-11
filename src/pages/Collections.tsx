import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { getAllShopProducts } from "@/data/productCatalog";
import { CatalogProductCard } from "@/components/CatalogProductCard";

export default function Collections() {
  const products = getAllShopProducts();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LuxuryHeader />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Shop All
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <LuxuryFooter />
    </div>
  );
}
