import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  aspectRatio = "aspect-square",
  fallbackSrc = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
  priority = false,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Optimize image URL for better performance
  const optimizedSrc = src.includes("unsplash.com")
    ? `${src}${src.includes("?") ? "&" : "?"}auto=format&fit=crop&q=80`
    : src;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspectRatio, className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={hasError ? fallbackSrc : optimizedSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
