import { DesignerProduct } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface DesignerProductCardProps {
  product: DesignerProduct;
}

export const DesignerProductCard = ({ product }: DesignerProductCardProps) => {
  const navigate = useNavigate();
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  return (
    <div className="product-tile-3d">
    <Card
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer overflow-hidden border-0 bg-transparent"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted product-tile-3d-shimmer">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            -{discountPercent}%
          </Badge>
        )}

        {/* Out of Stock Overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-sm font-medium uppercase tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium uppercase tracking-wide">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            ₹{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.original_price!.toLocaleString()}
            </span>
          )}
        </div>

        {/* Sizes Preview */}
        {product.sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-xs text-muted-foreground">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
    </div>
  );
};
