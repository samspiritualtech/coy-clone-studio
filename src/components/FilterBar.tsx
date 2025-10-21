import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const filters = [
  "All",
  "New Arrivals",
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Footwear",
  "Accessories",
  "Sale",
];

export const FilterBar = () => {
  return (
    <section className="border-b bg-background sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 py-4">
            {filters.map((filter, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                {filter}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};
