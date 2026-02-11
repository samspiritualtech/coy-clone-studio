import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  title: string;
  images: string[];
}

export const ProductGallery = ({ title, images }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const touchStartX = useRef(0);

  const changeImage = useCallback((newIndex: number) => {
    if (newIndex === selectedIndex || newIndex < 0 || newIndex >= images.length) return;
    setIsFading(true);
    setTimeout(() => {
      setSelectedIndex(newIndex);
      setIsFading(false);
    }, 150);
  }, [selectedIndex, images.length]);

  const openLightbox = () => {
    setLightboxIndex(selectedIndex);
    setLightboxOpen(true);
  };

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  // Body scroll lock
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) lightboxPrev();
    if (deltaX < -50) lightboxNext();
  };

  if (!images.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">{title}</h2>

      {/* Main image */}
      <div
        className="aspect-[3/4] overflow-hidden rounded-xl cursor-pointer relative bg-muted"
        onClick={openLightbox}
      >
        <img
          src={images[selectedIndex]}
          alt={`${title} - Image ${selectedIndex + 1}`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300 ease-in-out",
            isFading ? "opacity-0" : "opacity-100"
          )}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 mt-4 pb-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => changeImage(idx)}
            className={cn(
              "w-16 h-20 flex-shrink-0 snap-start overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105 cursor-pointer",
              selectedIndex === idx
                ? "ring-2 ring-primary ring-offset-1"
                : "border border-border/40"
            )}
          >
            <img
              src={img}
              alt={`${title} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-none w-screen h-screen p-0 border-none bg-black/90 flex items-center justify-center [&>button]:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <VisuallyHidden>
            <DialogTitle>{title} lightbox</DialogTitle>
          </VisuallyHidden>

          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Prev */}
          <button
            onClick={lightboxPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-9 h-9" />
          </button>

          {/* Next */}
          <button
            onClick={lightboxNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-9 h-9" />
          </button>

          {/* Image */}
          <img
            src={images[lightboxIndex]}
            alt={`${title} - Full view ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain animate-scale-in"
            key={lightboxIndex}
          />

          {/* Counter */}
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {lightboxIndex + 1} / {images.length}
          </span>
        </DialogContent>
      </Dialog>
    </div>
  );
};
