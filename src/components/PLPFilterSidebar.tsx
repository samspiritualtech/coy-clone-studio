import { useState } from "react";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { filterOptions, allBrands } from "@/data/menuData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

export interface PLPFilters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  fabrics: string[];
  occasions: string[];
  fits: string[];
  availability: boolean;
  discounts: number[];
}

interface PLPFilterSidebarProps {
  filters: PLPFilters;
  onChange: (filters: PLPFilters) => void;
  availableCategories?: string[];
  productCount?: number;
}

const defaultFilters: PLPFilters = {
  categories: [],
  brands: [],
  priceRange: [0, 100000],
  sizes: [],
  colors: [],
  fabrics: [],
  occasions: [],
  fits: [],
  availability: false,
  discounts: [],
};

export const PLPFilterSidebar = ({
  filters,
  onChange,
  availableCategories = [],
  productCount = 0,
}: PLPFilterSidebarProps) => {
  const [brandSearch, setBrandSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleArrayFilter = (
    key: keyof Pick<PLPFilters, "categories" | "brands" | "sizes" | "colors" | "fabrics" | "occasions" | "fits" | "discounts">,
    value: string | number
  ) => {
    const current = filters[key] as (string | number)[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const clearFilters = () => {
    onChange(defaultFilters);
  };

  const activeFilterCount = [
    filters.categories.length,
    filters.brands.length,
    filters.sizes.length,
    filters.colors.length,
    filters.fabrics.length,
    filters.occasions.length,
    filters.fits.length,
    filters.discounts.length,
    filters.availability ? 1 : 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const filteredBrands = allBrands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const FilterContent = () => (
    <div className="space-y-1">
      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground h-auto p-0"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["categories", "brands", "price"]} className="w-full">
        {/* Categories */}
        {availableCategories.length > 0 && (
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium py-3">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 py-2">
                {availableCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleArrayFilter("categories", category)}
                    />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger className="text-sm font-medium py-3">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              <Input
                placeholder="Search brands..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="h-8 text-sm"
              />
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-4">
                  {filteredBrands.map((brand) => (
                    <label
                      key={brand.slug}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <Checkbox
                        checked={filters.brands.includes(brand.slug)}
                        onCheckedChange={() => toggleArrayFilter("brands", brand.slug)}
                      />
                      <span className="text-sm text-foreground/80 group-hover:text-foreground">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium py-3">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onChange({ ...filters, priceRange: value as [number, number] })
                  }
                  max={100000}
                  min={0}
                  step={500}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>₹{filters.priceRange[0].toLocaleString("en-IN")}</span>
                <span>₹{filters.priceRange[1].toLocaleString("en-IN")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.priceRanges.map((range) => (
                  <Button
                    key={range.label}
                    variant="outline"
                    size="sm"
                    className={`text-xs h-8 ${
                      filters.priceRange[0] === range.min &&
                      filters.priceRange[1] === range.max
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() =>
                      onChange({ ...filters, priceRange: [range.min, range.max] })
                    }
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size">
          <AccordionTrigger className="text-sm font-medium py-3">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 py-2">
              {filterOptions.sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  className={`min-w-[44px] h-9 text-sm ${
                    filters.sizes.includes(size)
                      ? "border-primary bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => toggleArrayFilter("sizes", size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color">
          <AccordionTrigger className="text-sm font-medium py-3">
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-2 py-2">
              {filterOptions.colors.map((color) => (
                <button
                  key={color.name}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-md transition-colors ${
                    filters.colors.includes(color.name)
                      ? "bg-secondary ring-2 ring-primary"
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => toggleArrayFilter("colors", color.name)}
                  title={color.name}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fabric */}
        <AccordionItem value="fabric">
          <AccordionTrigger className="text-sm font-medium py-3">
            Fabric
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {filterOptions.fabrics.map((fabric) => (
                <label
                  key={fabric}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.fabrics.includes(fabric)}
                    onCheckedChange={() => toggleArrayFilter("fabrics", fabric)}
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground">
                    {fabric}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Occasion */}
        <AccordionItem value="occasion">
          <AccordionTrigger className="text-sm font-medium py-3">
            Occasion
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {filterOptions.occasions.map((occasion) => (
                <label
                  key={occasion}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.occasions.includes(occasion)}
                    onCheckedChange={() => toggleArrayFilter("occasions", occasion)}
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground">
                    {occasion}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Discount */}
        <AccordionItem value="discount">
          <AccordionTrigger className="text-sm font-medium py-3">
            Discount
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {filterOptions.discounts.map((discount) => (
                <label
                  key={discount.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.discounts.includes(discount.value)}
                    onCheckedChange={() => toggleArrayFilter("discounts", discount.value)}
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground">
                    {discount.label}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium py-3">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <label className="flex items-center gap-2 cursor-pointer group py-2">
              <Checkbox
                checked={filters.availability}
                onCheckedChange={(checked) =>
                  onChange({ ...filters, availability: !!checked })
                }
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground">
                In Stock Only
              </span>
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Filters</h2>
            <span className="text-xs text-muted-foreground">
              {productCount} Products
            </span>
          </div>
          <ScrollArea className="h-[calc(100vh-180px)] pr-4">
            <FilterContent />
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md p-0">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle className="flex items-center justify-between">
                <span>Filters</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {productCount} Products
                </span>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-140px)] p-4">
              <FilterContent />
            </ScrollArea>
            <SheetFooter className="p-4 border-t border-border gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default PLPFilterSidebar;
