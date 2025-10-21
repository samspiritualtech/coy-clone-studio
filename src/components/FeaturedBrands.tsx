import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const brands = [
  { name: "RARA AVIS", logo: "R" },
  { name: "TWEEDTM", logo: "T" },
  { name: "LOOM", logo: "L" },
  { name: "KAVITA", logo: "K" },
  { name: "GULMOHR", logo: "G" },
  { name: "INDIGO", logo: "I" },
  { name: "DARZAA", logo: "D" },
  { name: "FAE", logo: "F" },
  { name: "SUAVE", logo: "S" },
  { name: "KAVERI", logo: "K" },
  { name: "BLOOM", logo: "B" },
  { name: "ESSENCE", logo: "E" },
];

export const FeaturedBrands = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Top Brands</h2>
          <Button variant="ghost" size="sm" className="group">
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 aspect-square flex items-center justify-center"
            >
              <div className="text-center p-4">
                <div className="text-2xl font-bold mb-1 text-muted-foreground group-hover:text-accent transition-colors">
                  {brand.logo}
                </div>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {brand.name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
