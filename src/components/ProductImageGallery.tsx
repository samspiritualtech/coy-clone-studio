import { useState } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

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
      {/* Vertical Thumbnail Strip */}
      <div className="flex flex-col gap-2 w-20 shrink-0">
        {galleryImages.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              "relative aspect-[3/4] rounded-md overflow-hidden border-2 transition-all duration-200",
              selectedIndex === idx
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/50 hover:border-border"
            )}
          >
            <img
              src={image}
              alt={`${productName} view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Video indicator placeholder - can be used if video URLs are provided */}
            {idx === galleryImages.length - 1 && galleryImages.length > 3 && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative">
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
          <img
            src={galleryImages[selectedIndex]}
            alt={productName}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* View Similar Button */}
        {onViewSimilar && (
          <button
            onClick={onViewSimilar}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border px-6 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-background transition-all hover:scale-105"
          >
            View Similar
          </button>
        )}
      </div>
    </div>
  );
};
