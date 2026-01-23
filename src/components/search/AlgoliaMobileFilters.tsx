import { useState } from "react";
import { useClearRefinements, useCurrentRefinements } from "react-instantsearch";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { AlgoliaRefinementList } from "./AlgoliaRefinementList";
import { AlgoliaPriceRange } from "./AlgoliaPriceRange";

export const AlgoliaMobileFilters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { refine: clearAll, canRefine } = useClearRefinements();
  const { items: currentRefinements } = useCurrentRefinements();

  const activeCount = currentRefinements.reduce(
    (acc, item) => acc + item.refinements.length,
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filters
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
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <AlgoliaRefinementList
            attribute="category"
            title="Category"
            limit={10}
            showMore
            showMoreLimit={20}
          />

          <AlgoliaRefinementList
            attribute="brand"
            title="Brand"
            limit={10}
            showMore
            showMoreLimit={30}
          />

          <AlgoliaRefinementList
            attribute="gender"
            title="Gender"
            limit={5}
          />

          <AlgoliaPriceRange
            attribute="price"
            title="Price Range"
          />
        </div>

        <SheetFooter className="sticky bottom-0 bg-background border-t pt-4">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
