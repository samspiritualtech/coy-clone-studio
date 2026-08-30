import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, Sparkles } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { supabase } from "@/integrations/supabase/client";

interface CollectionRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  published_at: string | null;
}

interface CollectionProduct {
  id: string;
  title: string;
  price: number;
  images: unknown;
}

const firstImage = (images: unknown): string => {
  if (Array.isArray(images) && typeof images[0] === "string") return images[0];
  if (typeof images === "string" && images) return images;
  return "/placeholder.svg";
};

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<CollectionRow | null>(null);
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("collections")
        .select("id, title, slug, description, cover_image, published_at")
        .eq("slug", slug ?? "")
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setCollection(null);
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setCollection(data as CollectionRow);

      const { data: productRows } = await supabase
        .from("products")
        .select("id, title, price, images")
        .eq("status", "live")
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (!cancelled) {
        setProducts((productRows ?? []) as CollectionProduct[]);
        setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {isLoading ? (
          <div className="container mx-auto px-4 py-12 space-y-6">
            <Skeleton className="h-72 w-full rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : notFound ? (
          <div className="container mx-auto px-4 py-24 text-center space-y-4">
            <PackageOpen className="h-10 w-10 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-semibold">Collection not found</h1>
            <p className="text-muted-foreground">
              This collection may have been unpublished or the link has changed.
            </p>
            <Button asChild>
              <Link to="/collections">Browse all collections</Link>
            </Button>
          </div>
        ) : (
          collection && (
            <>
              <section className="relative">
                <div className="relative h-[46vh] min-h-[300px] w-full overflow-hidden bg-muted">
                  {collection.cover_image && (
                    <img
                      src={collection.cover_image}
                      alt={collection.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 container mx-auto px-4 pb-10">
                    <Badge className="mb-3 gap-1">
                      <Sparkles className="h-3 w-3" />
                      New Collection
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary-foreground">
                      {collection.title}
                    </h1>
                    {collection.description && (
                      <p className="mt-3 max-w-2xl text-sm md:text-base text-primary-foreground/80">
                        {collection.description}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="container mx-auto px-4 py-10">
                <h2 className="text-lg font-semibold mb-5">Pieces in this collection</h2>
                {products.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Pieces are being added to this collection. Check back shortly.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <Link key={product.id} to={`/product/${product.id}`}>
                        <Card className="overflow-hidden group">
                          <div className="aspect-[3/4] overflow-hidden bg-muted">
                            <OptimizedImage
                              src={firstImage(product.images)}
                              alt={product.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                            <p className="text-sm text-muted-foreground">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CollectionDetail;
