import { Link } from "react-router-dom";
import { Product } from "@/types";
import { useMemo } from "react";

interface SimilarProductsGridProps {
  currentProduct: Product;
  allProducts: Product[];
}

export const SimilarProductsGrid = ({
  currentProduct,
  allProducts,
}: SimilarProductsGridProps) => {
  const similarProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== currentProduct.id)
      .filter((p) => p.category === currentProduct.category)
      .sort((a, b) => {
        // Prioritize products with matching occasions
        const aOccasionMatch = a.occasions?.some((o) =>
          currentProduct.occasions?.includes(o)
        )
          ? 1
          : 0;
        const bOccasionMatch = b.occasions?.some((o) =>
          currentProduct.occasions?.includes(o)
        )
          ? 1
          : 0;
        return bOccasionMatch - aOccasionMatch;
      })
      .slice(0, 6);
  }, [currentProduct, allProducts]);

  if (similarProducts.length === 0) return null;

  return (
    <section className="mt-16 border-t pt-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Similar Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {similarProducts.map((product) => (
          <div key={product.id} className="product-tile-3d">
          <Link
            to={`/product/${product.id}`}
            className="group block"
          >
            <div className="aspect-[3/4] rounded-lg overflow-hidden border bg-muted product-tile-3d-shimmer">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </p>
              <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
