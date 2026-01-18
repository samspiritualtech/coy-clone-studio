import { FeaturedCollection } from "@/data/oguraCategories";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedCollectionGridProps {
  collection: FeaturedCollection;
  categorySlug: string;
}

export const FeaturedCollectionGrid = ({
  collection,
  categorySlug,
}: FeaturedCollectionGridProps) => {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-foreground">
              {collection.title}
            </h2>
            {collection.description && (
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {collection.description}
              </p>
            )}
          </div>
          <Link
            to={`/collections?category=${categorySlug}`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {collection.images.map((image, idx) => (
            <Link
              key={idx}
              to={`/collections?category=${categorySlug}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <img
                src={image}
                alt={`${collection.title} ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Quick View Text */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-white text-sm font-medium">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
