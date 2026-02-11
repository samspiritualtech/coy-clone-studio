import { products } from "@/data/products";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useMemo } from "react";

interface CategoryProductGridProps {
  categorySlug: string;
  productCategories: string[];
  subCategoryFilter?: string;
}

export const CategoryProductGrid = ({
  categorySlug,
  productCategories,
  subCategoryFilter,
}: CategoryProductGridProps) => {
  const { toggleItem, isInWishlist } = useWishlist();

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      productCategories.some(
        (cat) => product.category.toLowerCase() === cat.toLowerCase()
      )
    );

    // Optional sub-category filtering could be added here
    // For now, we'll show all products in the main categories

    return result.slice(0, 12); // Limit to 12 products
  }, [productCategories, subCategoryFilter]);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-foreground">
            Shop the Collection
          </h2>
          <Link
            to={`/collections?category=${categorySlug}`}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All ({products.length}+ items)
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              {/* Product Image */}
              <Link
                to={`/product/${product.id}`}
                className="block aspect-[3/4] rounded-xl overflow-hidden bg-muted"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(product);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-white z-10"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isInWishlist(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>

              {/* Product Info */}
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {product.tags.includes("new-arrivals") && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
