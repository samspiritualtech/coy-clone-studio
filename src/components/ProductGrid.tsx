import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProductGridProps {
  title: string;
  products: Array<{
    name: string;
    brand?: string;
    price?: string;
    image: string;
  }>;
  columns?: number;
  showViewAll?: boolean;
}

export const ProductGrid = ({ title, products, columns = 4, showViewAll = true }: ProductGridProps) => {
  const gridCols = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    6: "lg:grid-cols-6",
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {showViewAll && (
            <Button variant="ghost" size="sm" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
          {products.map((product, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                {product.brand && (
                  <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                )}
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                {product.price && (
                  <p className="text-sm font-semibold">{product.price}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
