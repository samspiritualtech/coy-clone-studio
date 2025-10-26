import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { useParams, useNavigate } from "react-router-dom";
import { Instagram, ArrowLeft, ExternalLink } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";

export default function BrandDetail() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const brand = brands.find((b) => b.id === brandId);

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Brand not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const brandProducts = products.filter((p) => 
    p.brand.toLowerCase() === brand.name.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          {/* Brand Info Card */}
          <div className="bg-card border rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/brands")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Brands
            </Button>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-border flex-shrink-0">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold">{brand.name}</h1>
                  {brand.sellsOnInstagram && (
                    <Badge variant="secondary" className="gap-1">
                      <Instagram className="h-3 w-3" />
                      Instagram Seller
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground text-lg mb-4">
                  {brand.description}
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="text-sm">
                    <span className="font-semibold">{brand.productCount}</span>{" "}
                    <span className="text-muted-foreground">products available</span>
                  </div>

                  {brand.sellsOnInstagram && brand.instagramHandle && (
                    <>
                      <div className="h-4 w-px bg-border" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          window.open(
                            `https://instagram.com/${brand.instagramHandle?.replace("@", "")}`,
                            "_blank"
                          )
                        }
                      >
                        <Instagram className="h-4 w-4" />
                        {brand.instagramHandle}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      {brand.instagramFollowers && (
                        <div className="text-sm">
                          <span className="font-semibold">{brand.instagramFollowers}</span>{" "}
                          <span className="text-muted-foreground">followers</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Products from {brand.name}
            </h2>
            <ProductGrid 
              title=""
              products={brandProducts.map(p => ({
                name: p.name,
                brand: p.brand,
                price: `₹${p.price.toLocaleString()}`,
                image: p.images[0]
              }))}
              showViewAll={false}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
