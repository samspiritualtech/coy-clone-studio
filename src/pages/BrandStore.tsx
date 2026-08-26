import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ArrowLeft, PackageOpen, Store } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchBrandStores, type BrandStore as BrandStoreType } from "@/lib/brandStores";

export default function BrandStore() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [stores, setStores] = useState<BrandStoreType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchBrandStores();
      if (!active) return;
      setStores(data);
      setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const store = useMemo(
    () => stores.find((s) => s.slug === slug),
    [stores, slug]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/brands">Brands</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{store?.name ?? "Brand store"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        ) : !store ? (
          <div className="text-center py-24">
            <Store className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Brand store not found</h1>
            <p className="text-muted-foreground mb-6">
              This brand may not be live yet.
            </p>
            <Button onClick={() => navigate("/brands")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Browse all brands
            </Button>
          </div>
        ) : (
          <>
            {/* Store header */}
            <section className="relative overflow-hidden rounded-2xl border bg-card mb-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px opacity-90">
                {(store.coverImages.length ? store.coverImages : ["/placeholder.svg"])
                  .slice(0, 4)
                  .map((img, i) => (
                    <OptimizedImage
                      key={i}
                      src={img}
                      alt={`${store.name} collection ${i + 1}`}
                      aspectRatio="aspect-[4/3]"
                      className="h-full"
                      priority={i === 0}
                    />
                  ))}
              </div>
              <div className="p-6 md:p-8">
                <Badge variant="secondary" className="gap-1 mb-3">
                  <Store className="h-3 w-3" /> Brand store
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold capitalize mb-2">
                  {store.name}
                </h1>
                <p className="text-muted-foreground">
                  {store.productCount} {store.productCount === 1 ? "product" : "products"} on OGURA
                </p>
              </div>
            </section>

            {/* Products */}
            {store.products.length === 0 ? (
              <div className="text-center py-16">
                <PackageOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {store.products.map((product) => (
                  <Card
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="group cursor-pointer overflow-hidden border-border/60"
                  >
                    <OptimizedImage
                      src={product.images?.[0] ?? "/placeholder.svg"}
                      alt={product.name}
                      aspectRatio="aspect-[3/4]"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 capitalize">
                        {product.brand}
                      </p>
                      <h3 className="font-medium line-clamp-2 mb-2">{product.name}</h3>
                      <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
