import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

interface ViewSimilarModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentProductId: string;
}

export const ViewSimilarModal = ({
  isOpen,
  onClose,
  products,
  currentProductId,
}: ViewSimilarModalProps) => {
  const navigate = useNavigate();
  const { toggleItem, isInWishlist } = useWishlist();

  const handleProductClick = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const filteredProducts = products.filter(p => p.id !== currentProductId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Similar Products</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] px-6 py-4">
          {filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No similar products found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.slice(0, 12).map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(product);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart
                        className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : ""}`}
                      />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
