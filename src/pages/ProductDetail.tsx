import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Truck, RotateCcw } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { VirtualTryOnDialog } from "@/components/VirtualTryOnDialog";
import { RecommendationCarousel } from "@/components/RecommendationCarousel";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Map color index to image index for color-based image switching
  const currentImageIndex = useMemo(() => {
    if (!product || !selectedColor) return 0;
    const colorIndex = product.colors.findIndex(c => c.name === selectedColor);
    return colorIndex >= 0 ? colorIndex % product.images.length : 0;
  }, [selectedColor, product]);

  const isSelectionComplete = selectedSize !== null && selectedColor !== null;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate('/collections')}>Browse Collections</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    if (!selectedColor) {
      toast({ title: "Please select a color", variant: "destructive" });
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    toast({ title: "Added to cart", description: `${product.name} has been added to your cart` });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    if (!selectedColor) {
      toast({ title: "Please select a color", variant: "destructive" });
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.tags.includes('new-arrivals') && (
                <Badge className="absolute top-4 left-4">NEW</Badge>
              )}
              {product.tags.includes('sale') && (
                <Badge variant="destructive" className="absolute top-4 left-4">SALE</Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square rounded-md overflow-hidden bg-muted cursor-pointer border-2 transition-all ${
                      currentImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                    }`}
                    onClick={() => {
                      // Find a color that maps to this image index
                      if (product.colors[idx]) {
                        setSelectedColor(product.colors[idx].name);
                      }
                    }}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-bold">₹{product.price.toLocaleString()}</p>
                {product.originalPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
            </div>

            {/* Colors */}
            <div>
              <p className="font-medium mb-3">
                Select Color
                {selectedColor && (
                  <span className="ml-2 text-muted-foreground font-normal">— {selectedColor}</span>
                )}
              </p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full transition-all relative ${
                      selectedColor === color.name 
                        ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  >
                    {selectedColor === color.name && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-white shadow-md" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="font-medium mb-3">
                Select Size
                {selectedSize && (
                  <span className="ml-2 text-muted-foreground font-normal">— {selectedSize}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[60px] transition-all ${
                      selectedSize === size ? 'ring-2 ring-primary/30' : ''
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {!isSelectionComplete && (
                <p className="text-sm text-muted-foreground">
                  Please select {!selectedColor && !selectedSize ? 'color and size' : !selectedColor ? 'a color' : 'a size'} to continue
                </p>
              )}
              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1" 
                  size="lg"
                  disabled={!isSelectionComplete}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    toggleItem(product);
                    toast({
                      title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist"
                    });
                  }}
                >
                  <Heart className={isInWishlist(product.id) ? "fill-current" : ""} />
                </Button>
              </div>
              <Button 
                onClick={handleBuyNow} 
                variant="secondary" 
                className="w-full" 
                size="lg"
                disabled={!isSelectionComplete}
              >
                Buy Now
              </Button>
              <VirtualTryOnDialog
                productImageUrl={product.images[currentImageIndex]}
                productName={product.name}
                category={product.category as "upper_body" | "lower_body" | "dresses"}
              />
            </div>

            {/* Delivery Info */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-muted-foreground">On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">7-day return policy</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="font-bold mb-3">Product Details</h3>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium w-24">Material:</span>
                  <span className="text-muted-foreground">{product.material}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Category:</span>
                  <span className="text-muted-foreground capitalize">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Brand Recommendations */}
        <RecommendationCarousel
          title={`Similar from ${product.brand}`}
          type="brand"
          brandName={product.brand}
          productId={product.id}
        />

        {/* AI-Powered Similar Products */}
        <RecommendationCarousel
          title="You May Also Like"
          type="similar"
          productId={product.id}
        />
      </main>
      <Footer />
    </div>
  );
}