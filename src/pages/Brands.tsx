import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { brands } from "@/data/brands";
import { useNavigate } from "react-router-dom";
import { Instagram, Store } from "lucide-react";
import { useBrandStores } from "@/hooks/useBrandStores";

export default function Brands() {
  const navigate = useNavigate();
  const { stores, isLoading } = useBrandStores();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">All Brands</h1>
        <p className="text-muted-foreground mb-10">
          Explore every brand store on OGURA and shop their full collection.
        </p>

        {/* Live brand stores from sellers */}
        <section className="mb-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Brand stores
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : stores.length === 0 ? (
            <p className="text-muted-foreground">No brand stores are live yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stores.map((store) => (
                <Card
                  key={store.slug}
                  onClick={() => navigate(`/store/${store.slug}`)}
                  className="cursor-pointer group overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <OptimizedImage
                    src={store.coverImages[0] ?? "/placeholder.svg"}
                    alt={`${store.name} brand store`}
                    aspectRatio="aspect-[4/3]"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="font-bold capitalize mb-1">{store.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Store className="h-3 w-3" /> {store.productCount}{" "}
                      {store.productCount === 1 ? "product" : "products"}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Featured brands
        </h2>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Card
              key={brand.id}
              onClick={() => navigate(`/brands/${brand.id}`)}
              className="cursor-pointer group hover:shadow-lg transition-shadow p-6 relative"
            >
              {brand.sellsOnInstagram && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 right-4 gap-1 text-xs"
                >
                  <Instagram className="h-3 w-3" />
                  Instagram
                </Badge>
              )}
              <div className="mb-4">
                <OptimizedImage
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  aspectRatio="aspect-square"
                  className="rounded-lg transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold mb-2">{brand.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{brand.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{brand.productCount} products</p>
                {brand.instagramFollowers && (
                  <p className="text-xs text-muted-foreground">{brand.instagramFollowers} followers</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
