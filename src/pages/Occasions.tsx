import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OptimizedImage } from "@/components/OptimizedImage";
import { occasions } from "@/data/occasions";
import { useNavigate } from "react-router-dom";

export default function Occasions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shop by Occasion</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occasion) => (
            <div
              key={occasion.id}
              onClick={() => navigate(`/occasions/${occasion.id}`)}
              className="cursor-pointer group relative overflow-hidden rounded-xl"
            >
              <OptimizedImage
                src={occasion.image}
                alt={`${occasion.name} occasion fashion`}
                aspectRatio="aspect-[4/3]"
                className="transition-transform duration-500 group-hover:scale-110"
                priority={occasion.id === "wedding"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{occasion.name}</h3>
                <p className="text-sm text-white/90">{occasion.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
