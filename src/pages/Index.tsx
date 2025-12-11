import { Header } from "@/components/Header";
import { FullScreenHeroCarousel } from "@/components/FullScreenHeroCarousel";
import { RoundCategorySection } from "@/components/RoundCategorySection";
import { FilterBar } from "@/components/FilterBar";
import { Spline3DBackground } from "@/components/Spline3DBackground";
import { ProductGrid } from "@/components/ProductGrid";
import { FreshDrops } from "@/components/FreshDrops";
import { RewardGame } from "@/components/RewardGame";
import { CertificateSection } from "@/components/CertificateSection";
import { FeaturedBrands } from "@/components/FeaturedBrands";
import { GiftCardSection } from "@/components/GiftCardSection";
import { StoreLocator } from "@/components/StoreLocator";
import { LaunchStudio } from "@/components/LaunchStudio";
import { Footer } from "@/components/Footer";

const newArrivals = [
  { name: "Embroidered Kurta", brand: "OGURA", price: "₹3,499", image: "https://images.unsplash.com/photo-1583391265196-53c5e5e92b0d?w=400&q=80" },
  { name: "Floral Maxi Dress", brand: "OGURA", price: "₹4,299", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" },
  { name: "Designer Co-Ord Set", brand: "OGURA", price: "₹5,999", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
  { name: "Traditional Saree", brand: "OGURA", price: "₹6,499", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" },
];

const bestSellers = [
  { name: "Cotton Kurta Set", brand: "OGURA", image: "https://images.unsplash.com/photo-1583391265196-53c5e5e92b0d?w=400&q=80" },
  { name: "Silk Saree", brand: "OGURA", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" },
  { name: "Party Wear Dress", brand: "OGURA", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" },
  { name: "Casual Co-Ord", brand: "OGURA", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
  { name: "Evening Gown", brand: "OGURA", image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80" },
  { name: "Traditional Lehenga", brand: "OGURA", image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=400&q=80" },
];

const occasions = [
  { name: "Wedding Collection", image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=400&q=80" },
  { name: "Festive Wear", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" },
  { name: "Casual Daily", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
  { name: "Party Outfits", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Spline3DBackground />
      <Header />
      <FilterBar />
      <main className="relative z-10">
        <FullScreenHeroCarousel />
        <RoundCategorySection />
        <ProductGrid title="New Skies & Fresh Looks" products={newArrivals} columns={4} />
        <FreshDrops />
        <RewardGame />
        <ProductGrid title="Shop by Occasion" products={occasions} columns={4} showViewAll={false} />
        <ProductGrid title="Best Sellers" products={bestSellers} columns={6} />
        <CertificateSection />
        <FeaturedBrands />
        <GiftCardSection />
        <StoreLocator />
      </main>
      <LaunchStudio />
      <Footer />
    </div>
  );
};

export default Index;
