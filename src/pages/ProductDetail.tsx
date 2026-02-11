import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Package, Heart, ShoppingBag, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getProductById } from "@/data/productCatalog";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const touchStartX = useRef(0);

  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  // Convert CatalogProduct to Product type for cart/wishlist
  const toProduct = useCallback((): Product | undefined => {
    if (!product) return undefined;
    return {
      id: product.id,
      name: product.title,
      brand: "Ogura",
      price: product.price,
      category: "accessories" as const,
      images: product.images,
      sizes: product.sizes,
      colors: [{ name: "Default", hex: "#000000" }],
      description: product.description || "",
      material: "Cotton Blend",
      inStock: true,
      tags: [product.category],
    };
  }, [product]);

  const wishlisted = product ? isInWishlist(product.id) : false;

  const changeImage = (idx: number) => {
    if (!product || idx === selectedImage || idx < 0 || idx >= product.images.length) return;
    setIsFading(true);
    setTimeout(() => {
      setSelectedImage(idx);
      setIsFading(false);
    }, 150);
  };

  const openLightbox = () => {
    setLightboxIndex(selectedImage);
    setLightboxOpen(true);
  };

  const lightboxPrev = useCallback(() => {
    if (!product) return;
    setLightboxIndex((i) => (i > 0 ? i - 1 : product.images.length - 1));
  }, [product]);

  const lightboxNext = useCallback(() => {
    if (!product) return;
    setLightboxIndex((i) => (i < product.images.length - 1 ? i + 1 : 0));
  }, [product]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) lightboxPrev();
    if (delta < -50) lightboxNext();
  };

  const handleAddToBag = () => {
    const p = toProduct();
    if (!p || !selectedSize) return;
    addItem(p, selectedSize, "Default", 1);
  };

  const handleToggleWishlist = () => {
    const p = toProduct();
    if (p) toggleItem(p);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <LuxuryHeader />
        <main className="flex-1 flex items-center justify-center px-4 pt-28">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">Product Not Found</h1>
            <p className="text-muted-foreground max-w-md">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")} variant="outline">Back to Home</Button>
          </div>
        </main>
        <LuxuryFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LuxuryHeader />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: Gallery */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Vertical thumbnails (desktop) */}
            <div className="hidden lg:flex flex-col gap-2 w-16 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => changeImage(idx)}
                  className={cn(
                    "aspect-[3/4] overflow-hidden rounded border transition-all",
                    selectedImage === idx
                      ? "ring-2 ring-primary ring-offset-1"
                      : "border-border/40 hover:border-foreground/50"
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1">
              <div
                className="aspect-[3/4] overflow-hidden rounded-lg bg-muted cursor-zoom-in group relative"
                onClick={openLightbox}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    isFading ? "opacity-0" : "opacity-100",
                    "group-hover:scale-105"
                  )}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
              </div>

              {/* Horizontal thumbnails (mobile) */}
              <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-2 mt-3 pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeImage(idx)}
                    className={cn(
                      "w-14 h-[4.5rem] flex-shrink-0 snap-start overflow-hidden rounded transition-transform hover:scale-105",
                      selectedImage === idx
                        ? "ring-2 ring-primary ring-offset-1"
                        : "border border-border/40"
                    )}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col justify-start space-y-5 lg:pt-2">
            <h1 className="text-2xl font-bold text-foreground">{product.title}</h1>
            <p className="text-xl font-semibold text-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <hr className="border-border" />

            {/* Size selector */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                Select Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-10 min-w-[3rem] px-4 rounded-full border text-sm font-medium transition-colors",
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAddToBag}
                disabled={!selectedSize}
                className="flex-1 h-12 text-base font-bold uppercase tracking-wide gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                className={cn("h-12 px-4", wishlisted && "text-destructive border-destructive")}
              >
                <Heart className={cn("w-5 h-5", wishlisted && "fill-destructive")} />
              </Button>
            </div>

            <hr className="border-border" />

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Product Details
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <LuxuryFooter />

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-none w-screen h-screen p-0 border-none bg-black/90 flex items-center justify-center [&>button]:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <VisuallyHidden><DialogTitle>{product.title} lightbox</DialogTitle></VisuallyHidden>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 z-50 text-white/80 hover:text-white" aria-label="Close">
            <X className="w-7 h-7" />
          </button>
          <button onClick={lightboxPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white" aria-label="Previous">
            <ChevronLeft className="w-9 h-9" />
          </button>
          <button onClick={lightboxNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white" aria-label="Next">
            <ChevronRight className="w-9 h-9" />
          </button>
          <img
            src={product.images[lightboxIndex]}
            alt={`${product.title} - Full view ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain animate-scale-in"
            key={lightboxIndex}
          />
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {lightboxIndex + 1} / {product.images.length}
          </span>
        </DialogContent>
      </Dialog>
    </div>
  );
}
