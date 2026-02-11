import { memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { products as allProducts } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ProductGridProps {
  title: string;
  products: Array<{
    name: string;
    brand?: string;
    price?: string;
    image: string;
  }>;
  columns?: number;
  showViewAll?: boolean;
}

const ProductCardComponent = ({ 
  product, 
  productId, 
  inWishlist, 
  onNavigate, 
  onWishlistToggle 
}: {
  product: { name: string; brand?: string; price?: string; image: string };
  productId?: string;
  inWishlist: boolean;
  onNavigate: (id: string) => void;
  onWishlistToggle: (e: React.MouseEvent, name: string) => void;
}) => {
  return (
    <Card
      onClick={() => productId && onNavigate(productId)}
      className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          aspectRatio="aspect-[3/4]"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => onWishlistToggle(e, product.name)}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </Button>
      </div>
      <div className="p-3">
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        )}
        <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
        {product.price && (
          <p className="text-sm font-semibold">{product.price}</p>
        )}
      </div>
    </Card>
  );
};

const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = "ProductCard";

export const ProductGrid = ({ title, products, columns = 4, showViewAll = true }: ProductGridProps) => {
  const navigate = useNavigate();
  const { toggleItem, isInWishlist } = useWishlist();

  const gridCols = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    6: "lg:grid-cols-6",
  };

  const getProductId = useCallback((productName: string) => {
    const product = allProducts.find(p => p.name === productName);
    return product?.id;
  }, []);

  const handleWishlistToggle = useCallback((e: React.MouseEvent, productName: string) => {
    e.stopPropagation();
    const product = allProducts.find(p => p.name === productName);
    if (product) {
      toggleItem(product);
      toast({
        title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist"
      });
    }
  }, [toggleItem, isInWishlist]);

  const handleNavigate = useCallback((id: string) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            {showViewAll && (
              <Button variant="ghost" size="sm" className="group" onClick={() => navigate('/collections')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
        )}

        <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
          {products.map((product, index) => {
            const productId = getProductId(product.name);
            const inWishlist = productId ? isInWishlist(productId) : false;

            return (
              <ProductCard
                key={`product-${index}`}
                product={product}
                productId={productId}
                inWishlist={inWishlist}
                onNavigate={handleNavigate}
                onWishlistToggle={handleWishlistToggle}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
