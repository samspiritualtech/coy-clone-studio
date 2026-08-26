import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useBrandStores } from "@/hooks/useBrandStores";

interface BrandSearchResultsProps {
  query: string;
}

export const BrandSearchResults = ({ query }: BrandSearchResultsProps) => {
  const { stores, isLoading } = useBrandStores();
  const q = query.trim().toLowerCase();

  if (isLoading || !q) return null;

  const matches = stores
    .filter((s) => s.name.toLowerCase().includes(q) || s.slug.includes(q))
    .slice(0, 6);

  if (matches.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Brands
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {matches.map((store) => (
          <Link
            key={store.slug}
            to={`/store/${store.slug}`}
            className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
              <OptimizedImage
                src={store.coverImages[0] ?? "/placeholder.svg"}
                alt={`${store.name} brand store`}
                aspectRatio="aspect-square"
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate capitalize">{store.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Store className="h-3 w-3" /> {store.productCount} products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
