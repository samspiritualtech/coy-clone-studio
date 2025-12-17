import { useNavigate } from "react-router-dom";
import { useDesigners } from "@/hooks/useDesigners";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export const DesignersSpotlight = () => {
  const navigate = useNavigate();
  const { data: designers, isLoading } = useDesigners();

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-64 h-96 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!designers || designers.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Curated Selection
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide">
              Designers In The Spotlight
            </h2>
          </div>
          <button
            onClick={() => navigate('/designers')}
            className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-primary transition-colors group"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {designers.slice(0, 8).map((designer) => (
            <div
              key={designer.id}
              onClick={() => navigate(`/designer/${designer.slug}`)}
              className="relative w-64 md:w-72 h-96 md:h-[28rem] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group snap-start"
            >
              {/* Full-height image */}
              <div className="absolute inset-0">
                <img
                  src={designer.profile_image || '/placeholder.svg'}
                  alt={designer.brand_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-serif text-white mb-1">
                  {designer.brand_name}
                </h3>
                <p className="text-sm text-white/70">{designer.city}</p>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
