import { useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Category mapping from URL params to product categories
const categoryMapping: Record<string, string[]> = {
  accessories: ["accessories", "bags"],
  dresses: ["dresses"],
  tops: ["tops"],
  bottoms: ["bottoms"],
  outerwear: ["outerwear"],
  footwear: ["footwear"],
  bags: ["bags"],
};

// Subcategory mapping for more specific filters
const subcategoryMapping: Record<string, string[]> = {
  "bags-backpacks": ["bags"],
  "jewelry": ["accessories"],
};

// Display names for categories
const categoryDisplayNames: Record<string, string> = {
  accessories: "Accessories",
  "bags-backpacks": "Bags & Backpacks",
  dresses: "Dresses",
  tops: "Tops",
  bottoms: "Bottoms",
  outerwear: "Outerwear",
  footwear: "Footwear",
  bags: "Bags",
};

export default function Collections() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleItem, isInWishlist } = useWishlist();

  // Parse URL parameters
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  // Filter products based on URL params
  const filteredProducts = useMemo(() => {
    // If subcategory is specified, use that filter first
    if (subcategoryParam && subcategoryMapping[subcategoryParam]) {
      return products.filter((product) =>
        subcategoryMapping[subcategoryParam].includes(product.category)
      );
    }

    // If category is specified, use category filter
    if (categoryParam && categoryMapping[categoryParam]) {
      return products.filter((product) =>
        categoryMapping[categoryParam].includes(product.category)
      );
    }

    // No filters - show all products
    return products;
  }, [categoryParam, subcategoryParam]);

  // Get display title based on active filters
  const getPageTitle = () => {
    if (subcategoryParam) {
      return categoryDisplayNames[subcategoryParam] || subcategoryParam;
    }
    if (categoryParam) {
      return categoryDisplayNames[categoryParam] || categoryParam;
    }
    return "Shop All";
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // Clear specific filter
  const clearFilter = (type: "category" | "subcategory") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(type);
    if (type === "category") {
      newParams.delete("subcategory"); // Clear subcategory too if clearing category
    }
    setSearchParams(newParams);
  };

  const hasActiveFilters = categoryParam || subcategoryParam;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {categoryParam ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/collections">Collections</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>Collections</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {getPageTitle()} ({filteredProducts.length} items)
        </h1>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categoryParam && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-secondary/80"
                onClick={() => clearFilter("category")}
              >
                {categoryDisplayNames[categoryParam] || categoryParam}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {subcategoryParam && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-secondary/80"
                onClick={() => clearFilter("subcategory")}
              >
                {categoryDisplayNames[subcategoryParam] || subcategoryParam}
                <X className="h-3 w-3" />
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <OptimizedImage
                  src={product.images[0]}
                  alt={product.name}
                  aspectRatio="aspect-[3/4]"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  className="absolute top-2 right-2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(product);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isInWishlist(product.id) ? "fill-destructive text-destructive" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
