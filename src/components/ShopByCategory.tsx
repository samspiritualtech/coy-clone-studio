import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Dresses", icon: "👗", count: "1,240" },
  { name: "Tops", icon: "👚", count: "890" },
  { name: "Bottoms", icon: "👖", count: "650" },
  { name: "Outerwear", icon: "🧥", count: "420" },
  { name: "Footwear", icon: "👠", count: "780" },
  { name: "Accessories", icon: "👜", count: "1,100" },
  { name: "Jewelry", icon: "💍", count: "560" },
  { name: "Bags", icon: "🎒", count: "340" },
];

export const ShopByCategory = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.count} items</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
