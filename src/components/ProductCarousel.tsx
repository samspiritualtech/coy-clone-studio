import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  showOriginalPrice?: boolean;
  badge?: string;
}

export const ProductCarousel = ({
  title,
  products,
  showOriginalPrice = false,
  badge,
}: ProductCarouselProps) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="w-full py-8 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/search")}
            className="hidden sm:flex items-center gap-1"
          >
            View All →
          </Button>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="group relative">
                    {/* Product Image */}
                    <div
                      className="aspect-[3/4] overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Discount Badge */}
                    {showOriginalPrice && product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}

                    {/* Product Info */}
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {product.brand}
                      </p>
                      <h3
                        className="font-medium truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {showOriginalPrice && product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shop Now Button */}
                    <Button
                      className="w-full mt-3"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Shop Now
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 hidden md:flex rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 hidden md:flex rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
