import { useState } from "react";
import { cn } from "@/lib/utils";
import { Play, Copy } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  onViewSimilar?: () => void;
}

export const ProductImageGallery = ({
  images,
  productName,
  onViewSimilar,
}: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Generate multiple images if only one exists (for demo purposes)
  const galleryImages = images.length > 1 
    ? images 
    : [
        images[0],
        images[0]?.replace('w=800', 'w=801') || images[0],
        images[0]?.replace('w=800', 'w=802') || images[0],
        images[0]?.replace('w=800', 'w=803') || images[0],
      ];

  return (
    <div className="flex gap-4 h-full">
      {/* Vertical Thumbnail Strip - Aza Style */}
      <div className="flex flex-col gap-3 w-24 shrink-0">
        {galleryImages.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              "relative aspect-[3/4] overflow-hidden transition-all duration-200",
              selectedIndex === idx
                ? "border-2 border-foreground"
                : "border border-border/40 hover:border-border"
            )}
          >
            <img
              src={image}
              alt={`${productName} view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Video indicator */}
            {idx === galleryImages.length - 1 && galleryImages.length > 3 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={galleryImages[selectedIndex]}
            alt={productName}
            className="w-full h-full object-cover transition-all duration-300 ease-in-out"
          />
        </div>

        {/* View Similar Button - Top Right Aza Style */}
        {onViewSimilar && (
          <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
            <button
              onClick={onViewSimilar}
              className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md hover:bg-white transition-all group"
              title="View Similar"
            >
              <Copy className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </button>
            <span className="text-xs font-medium text-foreground/80 bg-white/90 px-2 py-1 rounded shadow-sm">
              View Similar
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
