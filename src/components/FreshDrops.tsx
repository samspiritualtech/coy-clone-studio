import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const products = [
  {
    brand: "OGURA",
    name: "Floral Print Dress",
    image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80",
  },
  {
    brand: "OGURA",
    name: "Embroidered Kurta Set",
    image: "https://images.unsplash.com/photo-1583391265196-53c5e5e92b0d?w=400&q=80",
  },
  {
    brand: "OGURA",
    name: "Designer Saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
  },
  {
    brand: "OGURA",
    name: "Contemporary Co-Ord",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
  },
  {
    brand: "OGURA",
    name: "Elegant Gown",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
  },
  {
    brand: "OGURA",
    name: "Traditional Lehenga",
    image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=400&q=80",
  },
];

export const FreshDrops = () => {
  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Fresh Drops</h2>
          <Button variant="ghost" size="sm" className="group">
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {products.map((product, index) => (
              <Card
                key={index}
                className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all duration-300 flex-shrink-0 w-[200px] md:w-[240px]"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                  <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                </div>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};
