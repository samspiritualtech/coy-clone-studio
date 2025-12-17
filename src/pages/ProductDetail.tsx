import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Truck, RotateCcw, Star, Share2 } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { VirtualTryOnDialog } from "@/components/VirtualTryOnDialog";
import { RecommendationCarousel } from "@/components/RecommendationCarousel";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ViewSimilarModal } from "@/components/ViewSimilarModal";
import { Product, ColorVariant } from "@/types";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  // Find the current product
  const currentProduct = useMemo(() => products.find(p => p.id === id), [id]);
  
  // State management for color variants
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSimilarModal, setShowSimilarModal] = useState(false);

  // Initialize with first color variant when product changes
  useEffect(() => {
    if (currentProduct?.colorVariants?.[0]) {
      const firstVariant = currentProduct.colorVariants[0];
      setSelectedVariant(firstVariant);
      setSelectedColor(firstVariant.name);
    } else if (currentProduct?.colors?.[0]) {
      setSelectedColor(currentProduct.colors[0].name);
    }
    setSelectedSize(null);
    setQuantity(1);
  }, [id, currentProduct]);

  // Get current images based on selected variant
  const currentImages = useMemo(() => {
    if (selectedVariant?.images?.length) {
      return selectedVariant.images;
    }
    return currentProduct?.images || [];
  }, [selectedVariant, currentProduct]);

  // Get current sizes based on selected variant
  const currentSizes = useMemo(() => {
    if (selectedVariant?.available_sizes?.length) {
      return selectedVariant.available_sizes;
    }
    return currentProduct?.sizes || [];
  }, [selectedVariant, currentProduct]);

  // Similar products for the modal
  const similarProducts = useMemo(() => {
    if (!currentProduct) return [];
    
    return products.filter(p => 
      p.id !== currentProduct.id &&
      (p.category === currentProduct.category ||
       (p.price >= currentProduct.price * 0.7 && p.price <= currentProduct.price * 1.3))
    ).slice(0, 12);
  }, [currentProduct]);

  // Handle color selection - update state only, NO navigation
  const handleColorSelect = (variant: ColorVariant) => {
    setSelectedVariant(variant);
    setSelectedColor(variant.name);
    // Reset size when color changes (variant may have different sizes)
    setSelectedSize(null);
  };

  const isSelectionComplete = selectedSize !== null;

  if (!currentProduct) {
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
    const colorToUse = selectedColor || currentProduct.colors[0]?.name || 'Default';
    addItem(currentProduct, selectedSize, colorToUse, quantity);
    toast({ title: "Added to cart", description: `${currentProduct.name} has been added to your cart` });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    const colorToUse = selectedColor || currentProduct.colors[0]?.name || 'Default';
    addItem(currentProduct, selectedSize, colorToUse, quantity);
    navigate('/cart');
  };

  const discountPercent = currentProduct.originalPrice 
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery - Left Side */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductImageGallery
              images={currentImages}
              productName={currentProduct.name}
              onViewSimilar={() => setShowSimilarModal(true)}
            />
          </div>

          {/* Product Info - Right Side */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                {currentProduct.brand}
              </p>
              <h1 className="text-2xl lg:text-3xl font-semibold mb-3">{currentProduct.name}</h1>
              
              {/* Rating */}
              {currentProduct.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                    <span className="font-medium">{currentProduct.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentProduct.reviews?.toLocaleString()} Reviews
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-2xl lg:text-3xl font-bold">₹{currentProduct.price.toLocaleString()}</p>
                {currentProduct.originalPrice && (
                  <>
                    <p className="text-lg text-muted-foreground line-through">
                      ₹{currentProduct.originalPrice.toLocaleString()}
                    </p>
                    <Badge variant="destructive" className="text-sm">
                      {discountPercent}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
            </div>

            {/* Tags */}
            {currentProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentProduct.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            )}

            {/* Color Selection */}
            <div className="pt-2">
              <p className="font-medium mb-3">
                Select Color
                {selectedColor && (
                  <span className="ml-2 text-muted-foreground font-normal">— {selectedColor}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                {currentProduct.colorVariants?.map((variant) => {
                  const isSelected = selectedColor === variant.name;
                  return (
                    <button
                      key={variant.name}
                      onClick={() => handleColorSelect(variant)}
                      className={`group relative w-12 h-12 rounded-full transition-all ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                          : 'hover:scale-105 border border-border'
                      }`}
                      style={{ backgroundColor: variant.hex }}
                      title={variant.name}
                      aria-label={`Select ${variant.name} color`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-md" />
                        </span>
                      )}
                      {/* Tooltip */}
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {variant.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">
                  Select Size
                  {selectedSize && (
                    <span className="ml-2 text-muted-foreground font-normal">— {selectedSize}</span>
                  )}
                </p>
                <button className="text-sm text-primary hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProduct.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] transition-all ${
                      selectedSize === size ? 'ring-2 ring-primary/30' : ''
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pt-2">
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
            <div className="space-y-3 pt-4">
              {!isSelectionComplete && (
                <p className="text-sm text-amber-600">
                  Please select a size to continue
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
                    toggleItem(currentProduct);
                    toast({
                      title: isInWishlist(currentProduct.id) ? "Removed from wishlist" : "Added to wishlist"
                    });
                  }}
                >
                  <Heart className={isInWishlist(currentProduct.id) ? "fill-current text-destructive" : ""} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
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
                productImageUrl={currentProduct.images[0]}
                productName={currentProduct.name}
                category={currentProduct.category as "upper_body" | "lower_body" | "dresses"}
              />
            </div>

            {/* Delivery Info */}
            <div className="border-t border-b py-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-muted-foreground">On orders over ₹999 • Estimated delivery 3-5 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Easy Returns & Exchange</p>
                  <p className="text-sm text-muted-foreground">7-day return policy • Free pickup</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <p className="text-muted-foreground leading-relaxed">{currentProduct.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Material</span>
                    <span className="font-medium">{currentProduct.material}</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Category</span>
                    <span className="font-medium capitalize">{currentProduct.category}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Brand</span>
                    <span className="font-medium">{currentProduct.brand}</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">SKU</span>
                    <span className="font-medium uppercase">{currentProduct.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <RecommendationCarousel
          title={`More from ${currentProduct.brand}`}
          type="brand"
          brandName={currentProduct.brand}
          productId={currentProduct.id}
        />

        <RecommendationCarousel
          title="You May Also Like"
          type="similar"
          productId={currentProduct.id}
        />
      </main>
      <Footer />

      {/* View Similar Modal */}
      <ViewSimilarModal
        isOpen={showSimilarModal}
        onClose={() => setShowSimilarModal(false)}
        products={similarProducts}
        currentProductId={currentProduct.id}
      />
    </div>
  );
}
