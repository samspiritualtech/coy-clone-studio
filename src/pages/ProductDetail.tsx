import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  Star, 
  Share2, 
  Package, 
  Wallet, 
  Check,
  Ruler,
  AlertCircle,
  Minus,
  Plus
} from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLocation } from "@/contexts/LocationContext";
import { toast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { VirtualTryOnDialog } from "@/components/VirtualTryOnDialog";
import { RecommendationCarousel } from "@/components/RecommendationCarousel";
import { SimilarProductsGrid } from "@/components/SimilarProductsGrid";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ViewSimilarModal } from "@/components/ViewSimilarModal";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { ProductDetailsAccordion } from "@/components/ProductDetailsAccordion";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { AddressSelectionModal } from "@/components/AddressSelectionModal";
import { Product, ColorVariant } from "@/types";
import { cn } from "@/lib/utils";
import type { UserAddress } from "@/components/AddressCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { setShowAddressModal, showAddressModal, selectedAddress, setSelectedAddress } = useLocation();

  // Find the current product
  const currentProduct = useMemo(() => products.find(p => p.id === id), [id]);
  
  // Single source of truth: activeVariant controls images and color
  const [activeVariant, setActiveVariant] = useState<ColorVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSimilarModal, setShowSimilarModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [pendingBuyNow, setPendingBuyNow] = useState(false);

  // Initialize state when product changes
  useEffect(() => {
    if (currentProduct?.colorVariants?.[0]) {
      setActiveVariant(currentProduct.colorVariants[0]);
    } else {
      setActiveVariant(null);
    }
    setActiveImageIndex(0);
    setSelectedSize(null);
    setQuantity(1);
  }, [currentProduct?.id]);

  // Derived values - no redundant state
  const selectedColor = activeVariant?.name || currentProduct?.colors?.[0]?.name || null;
  const currentImages = activeVariant?.images?.length 
    ? activeVariant.images 
    : currentProduct?.images || [];
  const currentSizes = activeVariant?.available_sizes?.length 
    ? activeVariant.available_sizes 
    : currentProduct?.sizes || [];

  // Similar products for the modal
  const similarProducts = useMemo(() => {
    if (!currentProduct) return [];
    
    return products.filter(p => 
      p.id !== currentProduct.id &&
      (p.category === currentProduct.category ||
       (p.price >= currentProduct.price * 0.7 && p.price <= currentProduct.price * 1.3))
    ).slice(0, 12);
  }, [currentProduct]);

  // Handle color selection - CRITICAL: reset image index on variant change
  const handleColorSelect = (variant: ColorVariant) => {
    setActiveVariant(variant);
    setActiveImageIndex(0); // Reset to first image of new variant
    setSelectedSize(null);  // Reset size as variant may have different sizes
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
    toast({ title: "Added to bag", description: `${currentProduct.name} has been added to your bag` });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    const colorToUse = selectedColor || currentProduct.colors[0]?.name || 'Default';
    addItem(currentProduct, selectedSize, colorToUse, quantity);
    
    // Show address selection modal before proceeding to cart
    setPendingBuyNow(true);
    setShowAddressModal(true);
  };

  // Handle address selection for Buy Now flow
  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address);
    if (pendingBuyNow) {
      setPendingBuyNow(false);
      navigate('/cart');
    }
  };

  const handleWishlistToggle = () => {
    toggleItem(currentProduct);
    toast({
      title: isInWishlist(currentProduct.id) ? "Removed from wishlist" : "Added to wishlist"
    });
  };

  const discountPercent = currentProduct.originalPrice 
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-16">
          {/* Image Gallery - Left Side */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductImageGallery
              images={currentImages}
              productName={currentProduct.name}
              selectedIndex={activeImageIndex}
              onSelectIndex={setActiveImageIndex}
              onViewSimilar={() => setShowSimilarModal(true)}
            />
          </div>

          {/* Product Info - Right Side */}
          <div className="space-y-5">
            {/* Brand */}
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {currentProduct.brand}
              </p>
              <h1 className="text-xl lg:text-2xl font-light tracking-tight text-foreground leading-tight">
                {currentProduct.name}
              </h1>
            </div>
            
            {/* Rating */}
            {currentProduct.rating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full text-sm">
                  <Star className="w-3.5 h-3.5 fill-green-600 text-green-600" />
                  <span className="font-semibold">{currentProduct.rating}</span>
                </div>
                <button className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors">
                  {currentProduct.reviews?.toLocaleString()} Reviews
                </button>
              </div>
            )}

            {/* Price */}
            <div className="space-y-1 pt-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl lg:text-3xl font-semibold">
                  ₹{currentProduct.price.toLocaleString()}
                </span>
                {currentProduct.originalPrice && (
                  <>
                    <span className="text-base text-muted-foreground">
                      MRP <span className="line-through">₹{currentProduct.originalPrice.toLocaleString()}</span>
                    </span>
                    <Badge className="bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-50 font-medium">
                      {discountPercent}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Tags */}
            {currentProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentProduct.tags.slice(0, 4).map(tag => (
                  <Badge key={tag} variant="secondary" className="capitalize text-xs font-normal">
                    {tag.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            )}

            {/* Color Selection */}
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">Color:</span>
                {selectedColor && (
                  <span className="text-sm text-muted-foreground">{selectedColor}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProduct.colorVariants?.map((variant) => {
                  const isSelected = selectedColor === variant.name;
                  return (
                    <button
                      key={variant.name}
                      onClick={() => handleColorSelect(variant)}
                      className={cn(
                        "relative w-10 h-10 rounded-full transition-all duration-200",
                        isSelected
                          ? "ring-2 ring-offset-2 ring-foreground scale-110"
                          : "border-2 border-border hover:border-foreground/50 hover:scale-105"
                      )}
                      style={{ backgroundColor: variant.hex }}
                      title={variant.name}
                      aria-label={`Select ${variant.name} color`}
                    >
                      {isSelected && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="pt-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Size:</span>
                  {selectedSize && (
                    <span className="text-sm text-muted-foreground">{selectedSize}</span>
                  )}
                </div>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProduct.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[52px] h-11 text-sm font-medium transition-all",
                      selectedSize === size 
                        ? "bg-foreground text-background hover:bg-foreground/90" 
                        : "hover:border-foreground"
                    )}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pt-3">
              <span className="text-sm font-medium mb-3 block">Quantity</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-sm">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              {!isSelectionComplete && (
                <p className="text-sm text-amber-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please select a size to continue
                </p>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 text-sm font-medium rounded-full"
                  disabled={!isSelectionComplete}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Bag
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full shrink-0"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={cn(
                    "h-5 w-5 transition-colors",
                    isInWishlist(currentProduct.id) && "fill-rose-500 text-rose-500"
                  )} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full shrink-0"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="w-full h-12 text-sm font-medium rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
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

            {/* Delivery Checker */}
            <DeliveryChecker className="bg-muted/30" />

            {/* Delivery & Services */}
            <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Services
              </h4>
              
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Free Delivery</p>
                    <p className="text-xs text-muted-foreground">On orders above ₹999</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <RotateCcw className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">7-day return & exchange policy</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Available on orders under ₹10,000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Accordion */}
            <ProductDetailsAccordion product={currentProduct} />
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-8">
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
        </div>

        {/* Similar Products Grid - Myntra Style */}
        <SimilarProductsGrid
          currentProduct={currentProduct}
          allProducts={products}
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

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={currentProduct.category}
      />

      {/* Address Selection Modal */}
      <AddressSelectionModal
        open={showAddressModal}
        onOpenChange={(open) => {
          setShowAddressModal(open);
          if (!open) setPendingBuyNow(false);
        }}
        onAddressSelect={handleAddressSelect}
        selectedAddressId={selectedAddress?.id}
      />

      {/* Mobile Sticky Add to Bag Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex gap-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0"
          onClick={handleWishlistToggle}
        >
          <Heart className={cn(
            "h-5 w-5",
            isInWishlist(currentProduct.id) && "fill-rose-500 text-rose-500"
          )} />
        </Button>
        <Button
          onClick={handleAddToCart}
          className="flex-1 h-12 text-sm font-medium rounded-md"
          disabled={!isSelectionComplete}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isSelectionComplete ? `Add to Bag • ₹${currentProduct.price.toLocaleString()}` : "Select Size"}
        </Button>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
