import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { products as staticProducts } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, ShoppingBag, PackageOpen } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const EXTERNAL_API_URL = "https://pyesltzkemtranachpne.supabase.co/functions/v1/products";

const categoryMapping: Record<string, string[]> = {
  accessories: ["accessories", "bags"],
  dresses: ["dresses"],
  tops: ["tops"],
  bottoms: ["bottoms"],
  outerwear: ["outerwear"],
  footwear: ["footwear"],
  bags: ["bags"],
};

const subcategoryMapping: Record<string, string[]> = {
  "bags-backpacks": ["bags"],
  "jewelry": ["accessories"],
};

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
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(EXTERNAL_API_URL);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.products ?? data?.data ?? [];
        const mapped: Product[] = items.map((p: any, i: number) => ({
          id: p.id ?? `api-${i}`,
          name: p.name ?? p.title ?? "Untitled",
          brand: p.brand ?? "External",
          price: Number(p.price) || 0,
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          category: (p.category as Product["category"]) ?? "accessories",
          images: p.image_urls ?? (p.image_url ? [p.image_url] : p.images ?? ["/placeholder.svg"]),
          tags: p.tags ?? [],
          sizes: p.sizes ?? [],
          colors: p.colors ?? [],
          rating: 0,
          reviews: 0,
          inStock: true,
          description: p.description ?? "",
          material: p.material ?? "",
          occasions: [],
        }));
        setApiProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch external products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  const allProducts = useMemo(() => {
    const apiIds = new Set(apiProducts.map((p) => p.id));
    return [...apiProducts, ...staticProducts.filter((p) => !apiIds.has(p.id))];
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    if (subcategoryParam && subcategoryMapping[subcategoryParam]) {
      return allProducts.filter((product) =>
        subcategoryMapping[subcategoryParam].includes(product.category)
      );
    }
    if (categoryParam && categoryMapping[categoryParam]) {
      return allProducts.filter((product) =>
        categoryMapping[categoryParam].includes(product.category)
      );
    }
    return allProducts;
  }, [categoryParam, subcategoryParam, allProducts]);

  const getPageTitle = () => {
    if (subcategoryParam) return categoryDisplayNames[subcategoryParam] || subcategoryParam;
    if (categoryParam) return categoryDisplayNames[categoryParam] || categoryParam;
    return "Shop All";
  };

  const clearFilters = () => setSearchParams({});
  const clearFilter = (type: "category" | "subcategory") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(type);
    if (type === "category") newParams.delete("subcategory");
    setSearchParams(newParams);
  };

  const hasActiveFilters = categoryParam || subcategoryParam;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {categoryParam ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/collections">Collections</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{getPageTitle()}</BreadcrumbPage></BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem><BreadcrumbPage>Collections</BreadcrumbPage></BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {getPageTitle()} ({filteredProducts.length} items)
        </h1>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categoryParam && (
              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-secondary/80" onClick={() => clearFilter("category")}>
                {categoryDisplayNames[categoryParam] || categoryParam}<X className="h-3 w-3" />
              </Badge>
            )}
            {subcategoryParam && (
              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-secondary/80" onClick={() => clearFilter("subcategory")}>
                {categoryDisplayNames[subcategoryParam] || subcategoryParam}<X className="h-3 w-3" />
              </Badge>
            )}
            <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-foreground underline">Clear all</button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <PackageOpen className="h-16 w-16 mb-4" />
            <p className="text-lg font-medium">No products available</p>
            <p className="text-sm mt-1">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <OptimizedImage src={product.images[0]} alt={product.name} aspectRatio="aspect-[3/4]" className="transition-transform duration-500 group-hover:scale-105" />
                  <button
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); toggleItem(product); }}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : ""}`} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full gap-1.5"
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Buy Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}