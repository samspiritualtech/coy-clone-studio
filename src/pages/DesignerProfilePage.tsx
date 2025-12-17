import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDesignerBySlug } from "@/hooks/useDesignerBySlug";
import { useDesignerProducts, useDesignerCategories } from "@/hooks/useDesignerProducts";
import { ProductFilters } from "@/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DesignerProductFilters } from "@/components/DesignerProductFilters";
import { DesignerProductGrid } from "@/components/DesignerProductGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Instagram, Mail, Phone, Filter, MapPin, Users } from "lucide-react";

const DesignerProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const { data: designer, isLoading: designerLoading } = useDesignerBySlug(slug || '');
  const { data: productsData, isLoading: productsLoading } = useDesignerProducts(
    designer?.id,
    filters,
    page
  );
  const { data: categories = [] } = useDesignerCategories(designer?.id);

  // Accumulate products for pagination
  const handleLoadMore = () => {
    if (productsData?.products) {
      setAllProducts((prev) => [...prev, ...productsData.products]);
    }
    setPage((p) => p + 1);
  };

  // Reset pagination when filters change
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1);
    setAllProducts([]);
  };

  // Combine accumulated products with current page
  const displayProducts = page === 1 ? (productsData?.products || []) : [...allProducts, ...(productsData?.products || [])];

  if (designerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <Skeleton className="w-full h-80" />
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Designer not found</h1>
          <p className="text-muted-foreground mb-8">
            The designer you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/designers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Designers
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Banner Section */}
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={designer.banner_image || designer.profile_image || '/placeholder.svg'}
            alt={designer.brand_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/designers')}
            className="absolute top-4 left-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Designer Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-2">
                {designer.brand_name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {designer.city}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {designer.followers.toLocaleString()} followers
                </span>
                <span>{designer.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Designer Details & Contact */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-muted-foreground max-w-2xl">
                {designer.description}
              </p>
              <div className="flex gap-3">
                {designer.instagram_link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(designer.instagram_link, '_blank')}
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                )}
                {designer.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${designer.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}
                {designer.contact_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `tel:${designer.contact_number}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif">
              Shop {designer.brand_name}
            </h2>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <DesignerProductFilters
                  categories={categories}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-10">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <DesignerProductFilters
                  categories={categories}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <DesignerProductGrid
                products={displayProducts}
                isLoading={productsLoading}
                hasMore={productsData?.hasMore || false}
                onLoadMore={handleLoadMore}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DesignerProfilePage;
