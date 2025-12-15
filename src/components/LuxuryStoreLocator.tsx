import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stores = [
  { name: "Mumbai Flagship", address: "High Street Phoenix, Lower Parel" },
  { name: "Delhi", address: "Select Citywalk, Saket" },
  { name: "Bangalore", address: "UB City Mall, Vittal Mallya Road" },
];

export const LuxuryStoreLocator = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)",
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container mx-auto px-4">
        <span className="text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
          Experience In Person
        </span>
        
        <h2 className="text-white text-4xl md:text-6xl font-light uppercase tracking-[0.2em] mb-12">
          Visit Our Stores
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-12">
          {stores.map((store, index) => (
            <div
              key={index}
              className="text-center border border-white/20 px-8 py-6 hover:border-white/40 transition-colors"
            >
              <MapPin className="h-5 w-5 text-white/60 mx-auto mb-3" strokeWidth={1.5} />
              <h3 className="text-white font-light text-sm uppercase tracking-[0.15em] mb-1">
                {store.name}
              </h3>
              <p className="text-white/50 text-xs">
                {store.address}
              </p>
            </div>
          ))}
        </div>
        
        <Link to="/stores">
          <Button
            variant="outline"
            size="lg"
            className="border-white/60 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-500 tracking-[0.2em] uppercase text-sm"
          >
            Find All Stores
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
