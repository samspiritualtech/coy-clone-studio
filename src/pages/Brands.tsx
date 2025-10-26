import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { brands } from "@/data/brands";
import { useNavigate } from "react-router-dom";
import { Instagram } from "lucide-react";

export default function Brands() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Brands</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Card
              key={brand.id}
              onClick={() => navigate(`/brands/${brand.id}`)}
              className="cursor-pointer group hover:shadow-lg transition-shadow p-6 relative"
            >
              {brand.sellsOnInstagram && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 right-4 gap-1 text-xs"
                >
                  <Instagram className="h-3 w-3" />
                  Instagram
                </Badge>
              )}
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold mb-2">{brand.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{brand.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{brand.productCount} products</p>
                {brand.instagramFollowers && (
                  <p className="text-xs text-muted-foreground">{brand.instagramFollowers} followers</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
