import { DesignerProduct } from "@/types";
import { DesignerProductCard } from "./DesignerProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface DesignerProductGridProps {
  products: DesignerProduct[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const DesignerProductGrid = ({
  products,
  isLoading,
  hasMore,
  onLoadMore,
}: DesignerProductGridProps) => {
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your filters or check back later for new arrivals from this designer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <DesignerProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
            className="min-w-48"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};
