import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterBar } from "@/components/FilterBar";
import { occasions } from "@/data/occasions";
import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronRight } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useFilter } from "@/contexts/FilterContext";
import { toast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function OccasionDetail() {
  const { occasionId } = useParams<{ occasionId: string }>();
  const navigate = useNavigate();
  const { toggleItem, isInWishlist } = useWishlist();
  const { filters } = useFilter();

  const occasion = occasions.find((o) => o.id === occasionId);

  if (!occasion) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Occasion not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter products by occasion
  let filteredProducts = products.filter(
    (product) => product.occasions?.includes(occasionId || "")
  );

  // Apply additional filters
  if (filters.search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 15000) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );
  }

  if (filters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.sizes.some((size) => filters.sizes.includes(size))
    );
  }

  if (filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.colors.some((color) => filters.colors.includes(color.name))
    );
  }

  if (filters.tags.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.tags.some((tag) => product.tags.includes(tag))
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filteredProducts.sort((a, b) => {
        const aIsNew = a.tags.includes("new-arrivals");
        const bIsNew = b.tags.includes("new-arrivals");
        return bIsNew ? 1 : aIsNew ? -1 : 0;
      });
      break;
  }

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const product = products.find((p) => p.id === productId);
    if (product) {
      toggleItem(product);
      toast({
        title: isInWishlist(productId)
          ? "Removed from wishlist"
          : "Added to wishlist",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={occasion.image}
          alt={occasion.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {occasion.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            {occasion.description}
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/")}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/occasions")}>
                Occasions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{occasion.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Filter Bar */}
        <FilterBar />

        {/* Product Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} items for {occasion.name}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);

            return (
              <Card
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleWishlistToggle(e, product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`}
                    />
                  </Button>
                  {product.tags.includes("sale") && (
                    <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-semibold rounded">
                      SALE
                    </div>
                  )}
                  {product.tags.includes("new-arrivals") && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded">
                      NEW
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">₹{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No products found for this occasion with the selected filters.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
