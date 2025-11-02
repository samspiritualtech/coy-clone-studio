import { memo, useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/contexts/FilterContext";

const filters = [
  { label: "All", value: "All" },
  { label: "New Arrivals", value: "new-arrivals", tag: true },
  { label: "Dresses", value: "dresses" },
  { label: "Tops", value: "tops" },
  { label: "Bottoms", value: "bottoms" },
  { label: "Outerwear", value: "outerwear" },
  { label: "Footwear", value: "footwear" },
  { label: "Accessories", value: "accessories" },
  { label: "Sale", value: "sale", tag: true },
];

const FilterBarComponent = () => {
  const { filters: activeFilters, setCategory, toggleTag } = useFilter();

  const handleFilterClick = useCallback((filter: typeof filters[0]) => {
    if (filter.tag) {
      toggleTag(filter.value);
    } else {
      setCategory(filter.value);
    }
  }, [setCategory, toggleTag]);

  const isActive = useCallback((filter: typeof filters[0]) => {
    if (filter.tag) {
      return activeFilters.tags.includes(filter.value);
    }
    return activeFilters.category === filter.value;
  }, [activeFilters]);

  return (
    <section className="border-b bg-background sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 py-4">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={isActive(filter) ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap transition-all duration-150"
                onClick={() => handleFilterClick(filter)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export const FilterBar = memo(FilterBarComponent);
FilterBar.displayName = "FilterBar";
