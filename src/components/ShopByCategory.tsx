import { Card } from "@/components/ui/card";

const categories = [
  {
    name: "Kurtas",
    image: "https://images.unsplash.com/photo-1583391265196-53c5e5e92b0d?w=600&q=80",
  },
  {
    name: "Dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  },
  {
    name: "Co-Ord Sets",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    name: "Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  },
];

export const ShopByCategory = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
