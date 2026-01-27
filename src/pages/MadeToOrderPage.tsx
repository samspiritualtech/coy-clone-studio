import { useRef } from "react";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { MadeToOrderProvider, useMadeToOrder } from "@/contexts/MadeToOrderContext";
import {
  MTOHeroSection,
  MTOEntryPaths,
  MTOProgressIndicator,
  MTOInspirationUpload,
  MTODesignerSelector,
  MTOBaseDesignGallery,
  MTOCustomizationPanel,
} from "@/components/made-to-order";

const MadeToOrderContent = () => {
  const { state, setEntryPath, setCurrentStep } = useMadeToOrder();
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectPath = (path: "inspiration" | "designer" | "base-design") => {
    setEntryPath(path);
    scrollToContent();
  };

  const handleStartJourney = () => {
    const element = document.getElementById("mto-entry-paths");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const renderCurrentStep = () => {
    // Step 0: Entry Paths
    if (state.currentStep === 0) {
      return null;
    }

    // Step 1: Based on entry path
    if (state.currentStep === 1) {
      switch (state.entryPath) {
        case "inspiration":
          return (
            <MTOInspirationUpload
              onProceed={() => setCurrentStep(2)}
            />
          );
        case "designer":
          return (
            <MTODesignerSelector
              onProceed={() => setCurrentStep(3)}
            />
          );
        case "base-design":
          return (
            <MTOBaseDesignGallery
              onProceed={() => setCurrentStep(3)}
            />
          );
        default:
          return null;
      }
    }

    // Step 2: Designer Selection (after inspiration)
    if (state.currentStep === 2) {
      return (
        <MTODesignerSelector
          onProceed={() => setCurrentStep(3)}
        />
      );
    }

    // Step 3: Customization
    if (state.currentStep === 3) {
      return (
        <MTOCustomizationPanel
          onProceed={() => setCurrentStep(4)}
        />
      );
    }

    // Step 4+: Placeholder for future phases
    if (state.currentStep >= 4) {
      return (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-light mb-4">
              Design Preview Coming Soon
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              AI-assisted design generation and designer review features will be
              available in the next phase.
            </p>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <LuxuryHeader />

      {/* Progress Indicator (show after step 0) */}
      {state.currentStep > 0 && (
        <MTOProgressIndicator currentStep={state.currentStep} />
      )}

      <main>
        {/* Hero Section */}
        <MTOHeroSection onStartJourney={handleStartJourney} />

        {/* Entry Paths (always visible initially) */}
        {state.currentStep === 0 && (
          <MTOEntryPaths onSelectPath={handleSelectPath} />
        )}

        {/* Dynamic Content based on step */}
        <div ref={contentRef}>{renderCurrentStep()}</div>
      </main>

      <LuxuryFooter />
    </div>
  );
};

const MadeToOrderPage = () => {
  return (
    <MadeToOrderProvider>
      <MadeToOrderContent />
    </MadeToOrderProvider>
  );
};

export default MadeToOrderPage;
