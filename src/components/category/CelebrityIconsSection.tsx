import { celebrities } from "@/data/oguraCategories";

export const CelebrityIconsSection = () => {
  const indianCelebs = celebrities.filter((c) => c.category === "indian");
  const hollywoodCelebs = celebrities.filter((c) => c.category === "hollywood");

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
            Style Icons
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-wide text-foreground">
            Shop by Celebrity
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl mx-auto">
            Get inspired by your favorite stars – Indian & Hollywood icons
          </p>
        </div>

        {/* Indian Celebrities */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl font-medium text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-primary to-transparent" />
            Indian Icons
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {indianCelebs.map((celeb) => (
              <div
                key={celeb.name}
                className="group cursor-pointer text-center"
              >
                <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:scale-105 shadow-lg group-hover:shadow-primary/25">
                  <img
                    src={celeb.image}
                    alt={celeb.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="mt-2 text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {celeb.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hollywood Celebrities */}
        <div>
          <h3 className="text-lg md:text-xl font-medium text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-primary to-transparent" />
            Hollywood Icons
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {hollywoodCelebs.map((celeb) => (
              <div
                key={celeb.name}
                className="group cursor-pointer text-center"
              >
                <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:scale-105 shadow-lg group-hover:shadow-primary/25">
                  <img
                    src={celeb.image}
                    alt={celeb.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="mt-2 text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {celeb.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
