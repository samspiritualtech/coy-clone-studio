import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/types";
import { OptimizedImage } from "./OptimizedImage";

interface PLPProductCardProps {
  product: Product;
}

export const PLPProductCard = ({ product }: PLPProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  
  // Get primary and secondary images
  const primaryImage = product.images?.[0] || "/placeholder.svg";
  const secondaryImage = product.images?.[1] || primaryImage;

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary/20">
        {/* Product Images with hover swap */}
        <OptimizedImage
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
            {discountPercent}% OFF
          </div>
        )}

        {/* New Tag */}
        {product.tags?.includes("new-arrival") && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
            NEW
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isWishlisted
              ? "bg-destructive/10 text-destructive"
              : "bg-background/80 text-foreground/60 hover:text-destructive hover:bg-background"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
          />
        </button>

        {/* Quick View Overlay - appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-xs font-medium uppercase tracking-wider">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        {/* Brand Name */}
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand || "Ogura"}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm font-semibold text-foreground">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-medium text-destructive">
                ({discountPercent}% off)
              </span>
            </>
          )}
        </div>

        {/* Available Sizes Preview */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            <span className="text-xs text-muted-foreground">Sizes:</span>
            <span className="text-xs text-foreground/70">
              {product.sizes.slice(0, 4).join(", ")}
              {product.sizes.length > 4 && ` +${product.sizes.length - 4}`}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PLPProductCard;
