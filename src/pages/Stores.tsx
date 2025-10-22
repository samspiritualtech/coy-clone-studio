import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Navigation, MessageCircle } from "lucide-react";
import { stores } from "@/data/stores";

export default function Stores() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Our Stores</h1>
        <p className="text-muted-foreground mb-8">Visit us at any of our locations</p>

        <div className="grid md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <Card key={store.id} className="overflow-hidden">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{store.name}</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p>{store.address}</p>
                      <p className="text-muted-foreground">{store.city}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <p>{store.phone}</p>
                  </div>

                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <p>{store.hours}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(store.mapLink, '_blank')}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(`https://wa.me/${store.whatsapp}`, '_blank')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
