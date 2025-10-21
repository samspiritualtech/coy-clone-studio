import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { ShopByCategory } from "@/components/ShopByCategory";
import { AIStylistCTA } from "@/components/AIStylistCTA";
import { FeaturedBrands } from "@/components/FeaturedBrands";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedCollections />
        <ShopByCategory />
        <AIStylistCTA />
        <FeaturedBrands />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
