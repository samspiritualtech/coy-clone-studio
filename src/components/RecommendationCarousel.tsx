import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationSkeleton } from "@/components/RecommendationSkeleton";

interface RecommendationCarouselProps {
  title: string;
  type: 'similar' | 'brand' | 'search' | 'category';
  productId?: string;
  brandName?: string;
  query?: string;
  category?: string;
  enabled?: boolean;
}

export const RecommendationCarousel = ({
  title,
  type,
  productId,
  brandName,
  query,
  category,
  enabled = true
}: RecommendationCarouselProps) => {
  const navigate = useNavigate();
  
  const { recommendations, isLoading, error } = useRecommendations(
    type,
    { productId, brandName, query, category },
    enabled
  );

  // Don't render if disabled or no recommendations and not loading
  if (!enabled) return null;
  if (!isLoading && recommendations.length === 0) return null;

  return (
    <section className="py-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {recommendations.length > 4 && (
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <RecommendationSkeleton count={4} />
      ) : error ? (
        <p className="text-muted-foreground text-center py-8">
          Unable to load recommendations
        </p>
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: recommendations.length > 4,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {recommendations.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-1/2 md:basis-1/4"
              >
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted mb-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {product.tags.includes('new-arrivals') && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    {product.tags.includes('sale') && (
                      <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded">
                        SALE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold">
                      ₹{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Shop Now
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {recommendations.length > 4 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </>
          )}
        </Carousel>
      )}
    </section>
  );
};
