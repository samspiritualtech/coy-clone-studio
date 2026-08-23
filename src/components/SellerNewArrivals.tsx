import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductCarousel } from "./ProductCarousel";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = "https://pyesltzkemtranachpne.supabase.co/functions/v1/products";

const normalize = (raw: any): Product => ({
  id: String(raw?.id ?? ""),
  name: raw?.name ?? raw?.title ?? "Untitled",
  brand: raw?.brand ?? raw?.brand_name ?? raw?.store?.name ?? "Ogura",
  price: Number(raw?.price) || 0,
  originalPrice: raw?.original_price ? Number(raw.original_price) : undefined,
  category: raw?.category ?? "dresses",
  images: Array.isArray(raw?.image_urls) && raw.image_urls.length
    ? raw.image_urls
    : raw?.image_url
    ? [raw.image_url]
    : Array.isArray(raw?.images) && raw.images.length
    ? raw.images
    : ["/placeholder.svg"],
  videoUrl: raw?.video_url ?? undefined,
  sizes: Array.isArray(raw?.sizes) ? raw.sizes : ["S", "M", "L", "XL"],
  colors: Array.isArray(raw?.colors) ? raw.colors : [{ name: "Default", hex: "#000000" }],
  description: raw?.description ?? "",
  material: raw?.material ?? raw?.fabric ?? "",
  inStock: raw?.in_stock ?? raw?.is_available ?? true,
  tags: Array.isArray(raw?.tags) ? raw.tags : Array.isArray(raw?.style_tags) ? raw.style_tags : [],
  occasions: Array.isArray(raw?.occasions) ? raw.occasions : Array.isArray(raw?.occasion_tags) ? raw.occasion_tags : [],
  rating: raw?.rating ?? 4.2,
  reviews: raw?.reviews ?? 0,
}) as Product;

export const SellerNewArrivals = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data?.products ?? data?.data ?? [];
        const mapped = raw
          .filter((p: any) => p && (p.id ?? p.ID))
          .map(normalize)
          .slice(0, 20);
        if (!cancelled) setItems(mapped);
      } catch (e) {
        console.error("[SellerNewArrivals] fetch failed:", e);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-4">
      <ProductCarousel title="New Arrivals" products={items} />
    </section>
  );
};
