import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AzaDesignerCard } from "@/components/AzaDesignerCard";
import { DesignerFilters } from "@/components/DesignerFilters";
import { useDesigners } from "@/hooks/useDesigners";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const Designers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: designers, isLoading, refetch } = useDesigners({
    search: debouncedSearch,
    category: selectedCategory,
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('designers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'designers'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Curated Selection
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide">
              Designer Labels
            </h1>
          </div>

          {/* Filters */}
          <DesignerFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : designers && designers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {designers.map((designer) => (
                <AzaDesignerCard key={designer.id} designer={designer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No designers found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Designers;
