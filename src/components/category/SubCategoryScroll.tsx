import { SubCategory } from "@/data/oguraCategories";

interface SubCategoryScrollProps {
  subCategories: SubCategory[];
  onSelectSubCategory: (filter: string) => void;
  activeFilter?: string;
}

export const SubCategoryScroll = ({
  subCategories,
  onSelectSubCategory,
  activeFilter,
}: SubCategoryScrollProps) => {
  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4">
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* All option */}
          <button
            onClick={() => onSelectSubCategory("")}
            className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px] group"
          >
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-[#6B1C23] to-[#A3404E] ${
                !activeFilter
                  ? "border-primary shadow-lg scale-105"
                  : "border-transparent group-hover:border-primary/50"
              }`}
            >
              <span className="text-white font-semibold text-xs md:text-sm">All</span>
            </div>
            <span
              className={`text-xs md:text-sm font-medium transition-colors ${
                !activeFilter ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              All
            </span>
          </button>

          {subCategories.map((sub) => (
            <button
              key={sub.filter}
              onClick={() => onSelectSubCategory(sub.filter)}
              className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px] group"
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  activeFilter === sub.filter
                    ? "border-primary shadow-lg scale-105"
                    : "border-transparent group-hover:border-primary/50"
                }`}
              >
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span
                className={`text-xs md:text-sm font-medium text-center transition-colors ${
                  activeFilter === sub.filter
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {sub.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
