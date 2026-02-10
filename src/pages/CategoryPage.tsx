import { useParams, Navigate } from "react-router-dom";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategoryBySlug } from "@/data/oguraCategories";
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LuxuryHeader />
      <main className="flex-1 flex items-center justify-center px-4 pt-28">
        <div className="text-center space-y-4">
          <Layers className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Coming Soon</h1>
          <p className="text-muted-foreground max-w-md">
            {category.title} collection is coming soon. Stay tuned!
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default CategoryPage;
