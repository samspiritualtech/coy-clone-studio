import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { useFilter } from "@/contexts/FilterContext";
import { useMemo } from "react";

export default function Collections() {
  const { filters } = useFilter();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category.toLowerCase());
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter(p => filters.tags.some(tag => p.tags.includes(tag)));
    }

    // Price range filter
    result = result.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.tags.includes('new-arrivals') ? 1 : 0) - (a.tags.includes('new-arrivals') ? 1 : 0));
    }

    return result;
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FilterBar />
      <main className="flex-1">
        <ProductGrid
          title={`Shop All (${filteredProducts.length} items)`}
          products={filteredProducts.map(p => ({
            name: p.name,
            brand: p.brand,
            price: `₹${p.price.toLocaleString()}`,
            image: p.images[0]
          }))}
          showViewAll={false}
        />
      </main>
      <Footer />
    </div>
  );
}
