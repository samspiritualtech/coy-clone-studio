import { useParams, useNavigate } from "react-router-dom";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { ProductGallery } from "@/components/ProductGallery";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { getProductById } from "@/data/productCatalog";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <LuxuryHeader />
        <main className="flex-1 flex items-center justify-center px-4 pt-28">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">Product Not Found</h1>
            <p className="text-muted-foreground max-w-md">
              The product you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </main>
        <LuxuryFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LuxuryHeader />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductGallery title={product.title} images={product.images} />
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold text-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </main>
      <LuxuryFooter />
    </div>
  );
}
