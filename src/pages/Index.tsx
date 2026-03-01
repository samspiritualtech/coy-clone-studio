import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryHero } from "@/components/LuxuryHero";
import HoliDhamakaSale from "@/components/HoliDhamakaSale";
import { Premium3DCategorySection } from "@/components/Premium3DCategorySection";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { DesignersSpotlight } from "@/components/DesignersSpotlight";
import { LuxuryTrustBadges } from "@/components/LuxuryTrustBadges";
import { LuxuryBrands } from "@/components/LuxuryBrands";
import { LuxuryGiftCard } from "@/components/LuxuryGiftCard";
import { LuxuryStoreLocator } from "@/components/LuxuryStoreLocator";
import { LuxuryFooter } from "@/components/LuxuryFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LuxuryHeader />
      <main>
        <LuxuryHero />
        <HoliDhamakaSale />
        <Premium3DCategorySection />
        <CategoryShowcase />
        <DesignersSpotlight />
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
