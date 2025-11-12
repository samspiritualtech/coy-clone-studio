import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { LaunchStudioHero } from "./launch-studio/LaunchStudioHero";
import { LaunchStudioTimeline } from "./launch-studio/LaunchStudioTimeline";
import { LaunchStudioFeatures } from "./launch-studio/LaunchStudioFeatures";
import { LaunchStudioTestimonials } from "./launch-studio/LaunchStudioTestimonials";
import { LaunchStudioCTA } from "./launch-studio/LaunchStudioCTA";

export const LaunchStudio = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="launch-studio"
      ref={ref}
      className={`
        relative bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 lg:py-32
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <LaunchStudioHero />
      <LaunchStudioTimeline />
      <LaunchStudioFeatures />
      <LaunchStudioTestimonials />
      <LaunchStudioCTA />
    </section>
  );
};
