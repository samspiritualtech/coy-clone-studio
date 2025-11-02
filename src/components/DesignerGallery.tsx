import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { OptimizedImage } from "@/components/OptimizedImage";

interface DesignerGalleryProps {
  images: string[];
  brandName: string;
}

export const DesignerGallery = ({ images, brandName }: DesignerGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Product Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div 
                className="cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(image)}
              >
                <OptimizedImage
                  src={image}
                  alt={`${brandName} product ${index + 1}`}
                  aspectRatio="aspect-square"
                  className="rounded-lg"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <img
                src={image}
                alt={`${brandName} product ${index + 1}`}
                className="w-full h-auto"
                loading="lazy"
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
};
