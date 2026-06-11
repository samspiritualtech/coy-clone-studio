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
import { MouseEvent, useRef } from "react";

const Index = () => {
  useLenis();
  const museumRef = useRef<HTMLDivElement>(null);

  const onMuseumMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = museumRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="min-h-screen bg-background">
      <LuxuryHeader />
      <main>
        <LuxuryHero />

        <Premium3DCategorySection />

        {/* ============================================================
            MUSEUM BAND — Atelier of Light
            Continuous cinematic atmosphere from Hidden Gems → Stores.
            ============================================================ */}
        <div
          ref={museumRef}
          onMouseMove={onMuseumMove}
          className="museum-surface relative isolate"
        >
          <div className="museum-gold-glow" aria-hidden />
          <div className="museum-grain-strong" aria-hidden />
          <div className="museum-vignette-strong" aria-hidden />

          <div className="relative z-10">
            <HiddenGemsSection />
            <CategoryShowcase />
            <DesignersSpotlight />
            <PinterestInspiredSection />
            <LuxuryTrustBadges />
            <LuxuryBrands />
            <LuxuryGiftCard />
            <LuxuryStoreLocator />
          </div>
        </div>
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default Index;
