import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { recommendationService } from "@/services/recommendationService";
import { Product } from "@/types";
import { RecommendationSkeleton } from "@/components/RecommendationSkeleton";

interface ImageSearchDialogProps {
  trigger?: React.ReactNode;
}

export const ImageSearchDialog = ({ trigger }: ImageSearchDialogProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const { products, attributes } = await recommendationService.getImageRecommendations(imageBase64);
      setResults(products);
      setAttributes(attributes);
    } catch (err) {
      console.error('Image analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setResults([]);
    setAttributes(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProductClick = (productId: string) => {
    setOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" title="Search by image">
            <Camera className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search by Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Upload an image</p>
              <p className="text-sm text-muted-foreground mb-4">
                Take a photo or upload from your device
              </p>
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded image"
                  className="w-full max-h-64 object-contain rounded-lg bg-muted"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Detected Attributes */}
              {attributes && (
                <div className="flex flex-wrap gap-2">
                  {attributes.category && (
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {attributes.category}
                    </span>
                  )}
                  {attributes.style && (
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {attributes.style}
                    </span>
                  )}
                  {attributes.colors?.map((color: string) => (
                    <span
                      key={color}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing image and finding similar products...</span>
              </div>
              <RecommendationSkeleton count={4} />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={handleReset}>
                Try Again
              </Button>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && !isLoading && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Similar to Your Image</h3>
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {results.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-2 md:pl-4 basis-1/2 md:basis-1/4"
                    >
                      <div
                        onClick={() => handleProductClick(product.id)}
                        className="cursor-pointer group"
                      >
                        <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted mb-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {product.brand}
                        </p>
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-sm font-semibold">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {results.length > 4 && (
                  <>
                    <CarouselPrevious className="hidden md:flex -left-4" />
                    <CarouselNext className="hidden md:flex -right-4" />
                  </>
                )}
              </Carousel>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
