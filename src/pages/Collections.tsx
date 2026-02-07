import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { OptimizedImage } from "@/components/OptimizedImage";

export default function Collections() {
  const navigate = useNavigate();
  const { toggleItem, isInWishlist } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Shop All ({products.length} items)
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <OptimizedImage
                  src={product.images[0]}
                  alt={product.name}
                  aspectRatio="aspect-[3/4]"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(product);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
