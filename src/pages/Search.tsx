import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/products";
import { useMemo } from "react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = useMemo(() => {
    if (!query) return [];

    const search = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-8">
          {searchResults.length} results for "{query}"
        </p>

        {searchResults.length > 0 ? (
          <ProductGrid
            title=""
            products={searchResults.map(p => ({
              name: p.name,
              brand: p.brand,
              price: `₹${p.price.toLocaleString()}`,
              image: p.images[0]
            }))}
            showViewAll={false}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No products found</p>
            <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
