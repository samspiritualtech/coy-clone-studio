import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryHero } from "@/components/LuxuryHero";

import { Premium3DCategorySection } from "@/components/Premium3DCategorySection";
import { HiddenGemsSection } from "@/components/HiddenGemsSection";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { DesignersSpotlight } from "@/components/DesignersSpotlight";
import { PinterestInspiredSection } from "@/components/PinterestInspiredSection";
import { LuxuryTrustBadges } from "@/components/LuxuryTrustBadges";
import { LuxuryBrands } from "@/components/LuxuryBrands";
import { LuxuryGiftCard } from "@/components/LuxuryGiftCard";
import { LuxuryStoreLocator } from "@/components/LuxuryStoreLocator";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { useLenis } from "@/hooks/useLenis";

const Index = () => {
  useLenis();
  return (
    <div className="min-h-screen bg-background">
      <LuxuryHeader />
      <main>
        <LuxuryHero />
        
        <Premium3DCategorySection />
        <HiddenGemsSection />
        <CategoryShowcase />
        <DesignersSpotlight />
        <PinterestInspiredSection />
        <LuxuryTrustBadges />
        <LuxuryBrands />
        <LuxuryGiftCard />
        <LuxuryStoreLocator />
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default Index;
