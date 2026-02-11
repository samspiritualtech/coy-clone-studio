import { useParams, Navigate } from "react-router-dom";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategoryBySlug } from "@/data/oguraCategories";
import { getProductsByCategory } from "@/data/productCatalog";
import { CatalogProductCard } from "@/components/CatalogProductCard";
import MadeToOrderPage from "./MadeToOrderPage";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  if (slug === "made-to-order") {
    return <MadeToOrderPage />;
  }

  const category = slug ? getCategoryBySlug(slug) : undefined;

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const products = slug ? getProductsByCategory(slug) : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LuxuryHeader />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {category.title}
          </h1>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Layers className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground max-w-md mx-auto">
                {category.title} collection is coming soon. Stay tuned!
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default CategoryPage;
