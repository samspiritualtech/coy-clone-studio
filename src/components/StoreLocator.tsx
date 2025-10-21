import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

const stores = [
  {
    name: "Ogura Mumbai",
    address: "Bandra West, Mumbai",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
  },
  {
    name: "Ogura Delhi",
    address: "Connaught Place, Delhi",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
  },
];

export const StoreLocator = () => {
  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Visit Our Stores</h2>
          <Button variant="ghost" size="sm" className="group">
            Find Stores
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                <img
                  src={store.image}
                  alt={store.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
