import { useHits, usePagination, useInstantSearch } from "react-instantsearch";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AlgoliaNoResults } from "./AlgoliaNoResults";

export const AlgoliaSearchResults = () => {
  const { hits } = useHits();
  const { status } = useInstantSearch();
  const navigate = useNavigate();

  if (status === "loading" || status === "stalled") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-[3/4] bg-muted rounded-lg" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (hits.length === 0) {
    return <AlgoliaNoResults />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {hits.map((hit: any) => (
        <button
          key={hit.objectID}
          onClick={() => navigate(`/product/${hit.objectID}`)}
          className="group text-left"
        >
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted mb-3">
            <OptimizedImage
              src={hit.image || hit.images?.[0] || "/placeholder.svg"}
              alt={hit.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="space-y-1">
            {hit.brand && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {hit.brand}
              </p>
            )}
            <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {hit.name}
            </h3>
            <p className="text-sm font-semibold text-foreground">
              ₹{hit.price?.toLocaleString("en-IN")}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export const AlgoliaPagination = () => {
  const { pages, currentRefinement, nbPages, refine } = usePagination();

  if (nbPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => refine(currentRefinement - 1)}
        disabled={currentRefinement === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentRefinement ? "default" : "outline"}
          size="icon"
          onClick={() => refine(page)}
        >
          {page + 1}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => refine(currentRefinement + 1)}
        disabled={currentRefinement === nbPages - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
