import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { brands } from "@/data/brands";
import { useNavigate } from "react-router-dom";

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
              className="cursor-pointer group hover:shadow-lg transition-shadow p-6"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold mb-2">{brand.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{brand.description}</p>
              <p className="text-sm font-medium">{brand.productCount} products</p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
