import { useNavigate } from "react-router-dom";
import { useDesigners } from "@/hooks/useDesigners";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const AzaDesignerCarousel = () => {
  const navigate = useNavigate();
  const { data: designers, isLoading } = useDesigners();

  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-56 h-80 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!designers || designers.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-wide mb-8">
          New Arrivals
        </h2>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {designers.map((designer) => (
              <CarouselItem
                key={designer.id}
                className="pl-3 basis-[45%] sm:basis-[35%] md:basis-[25%] lg:basis-[20%]"
              >
                <div
                  onClick={() => navigate(`/designer/${designer.slug}`)}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
                >
                  {/* Full Image */}
                  <img
                    src={designer.profile_image || '/placeholder.svg'}
                    alt={designer.brand_name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-medium text-sm md:text-base leading-tight">
                      {designer.brand_name}
                    </h3>
                    {designer.collection_name && (
                      <p className="text-white/70 text-xs md:text-sm mt-1">
                        {designer.collection_name}
                      </p>
                    )}
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-white/40 transition-all duration-300" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="hidden md:flex -left-4 h-10 w-10 rounded-full bg-background/90 border-0 shadow-lg hover:bg-background" />
          <CarouselNext className="hidden md:flex -right-4 h-10 w-10 rounded-full bg-background/90 border-0 shadow-lg hover:bg-background" />
        </Carousel>
      </div>
    </section>
  );
};
