import { useClearRefinements, useCurrentRefinements } from "react-instantsearch";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlgoliaRefinementList } from "./AlgoliaRefinementList";
import { AlgoliaPriceRange } from "./AlgoliaPriceRange";
import { cn } from "@/lib/utils";

interface AlgoliaFilterSidebarProps {
  className?: string;
}

export const AlgoliaFilterSidebar = ({ className }: AlgoliaFilterSidebarProps) => {
  const { refine: clearAll, canRefine } = useClearRefinements();
  const { items: currentRefinements } = useCurrentRefinements();

  const activeCount = currentRefinements.reduce(
    (acc, item) => acc + item.refinements.length,
    0
  );

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({activeCount} active)
            </span>
          )}
        </h3>
        {canRefine && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearAll()}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <AlgoliaRefinementList
        attribute="category"
        title="Category"
        limit={10}
        showMore
        showMoreLimit={20}
      />

      {/* Brand Filter */}
      <AlgoliaRefinementList
        attribute="brand"
        title="Brand"
        limit={10}
        showMore
        showMoreLimit={30}
      />

      {/* Gender Filter */}
      <AlgoliaRefinementList
        attribute="gender"
        title="Gender"
        limit={5}
      />

      {/* Price Range */}
      <AlgoliaPriceRange
        attribute="price"
        title="Price Range"
      />
    </aside>
  );
};
