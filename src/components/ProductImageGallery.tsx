import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, Copy, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onViewSimilar?: () => void;
}

export const ProductImageGallery = ({
  images,
  productName,
  selectedIndex,
  onSelectIndex,
  onViewSimilar,
}: ProductImageGalleryProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Use images directly - no fake generation
  const galleryImages = images.length > 0 ? images : [];

  // Guard against empty images
  if (galleryImages.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted rounded-sm flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  // Ensure selectedIndex is within bounds
  const safeIndex = Math.min(selectedIndex, galleryImages.length - 1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex gap-3 lg:gap-4 h-full">
      {/* Vertical Thumbnail Strip */}
      <div className="flex flex-col gap-2 lg:gap-3 w-16 lg:w-20 shrink-0">
        {galleryImages.map((image, idx) => (
          <button
            key={`${image}-${idx}`}
            onClick={() => onSelectIndex(idx)}
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-sm transition-all duration-200",
              safeIndex === idx
                ? "ring-2 ring-foreground ring-offset-1"
                : "border border-border/40 hover:border-foreground/50"
            )}
          >
            <img
              src={image}
              alt={`${productName} view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Video indicator for last item */}
            {idx === galleryImages.length - 1 && galleryImages.length > 3 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-4 h-4 lg:w-5 lg:h-5 text-white fill-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div className="flex-1 relative">
        <div 
          ref={imageContainerRef}
          className="aspect-[3/4] overflow-hidden bg-muted rounded-sm cursor-zoom-in relative group"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={galleryImages[safeIndex]}
            alt={productName}
            className={cn(
              "w-full h-full object-cover transition-transform duration-200 ease-out",
              isZoomed && "scale-150"
            )}
            style={isZoomed ? {
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            } : undefined}
          />
          
          {/* Zoom indicator */}
          <div className={cn(
            "absolute bottom-4 left-4 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs font-medium transition-opacity duration-200",
            isZoomed ? "opacity-0" : "opacity-100 group-hover:opacity-100"
          )}>
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Hover to zoom</span>
          </div>
        </div>

        {/* View Similar Button - Top Right */}
        {onViewSimilar && (
          <button
            onClick={onViewSimilar}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-md hover:bg-background transition-all text-sm font-medium"
            title="View Similar"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">View Similar</span>
          </button>
        )}
      </div>
    </div>
  );
};
