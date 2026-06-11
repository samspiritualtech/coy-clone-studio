import { useRef, MouseEvent } from "react";
import { ParallaxLayer } from "@/components/luxury3d/ParallaxLayer";
import { useGsapReveal } from "@/hooks/useGsapReveal";

export const LuxuryGiftCard = () => {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-reveal]", stagger: 0.14, y: 60 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative h-[65vh] md:h-[75vh] overflow-hidden museum-spotlight isolate"
    >
      <ParallaxLayer speed={110} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-125"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1920&q=80)",
          }}
        />
      </ParallaxLayer>

      <div className="absolute inset-0 bg-gradient-to-r from-[#08070a]/90 via-[#08070a]/65 to-transparent z-[2]" />
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 35%, rgba(0,0,0,0.7) 100%)", mixBlendMode: "multiply" }}
      />

      <div className="relative z-10 h-full flex flex-col items-start justify-center container mx-auto px-4 md:px-8 lg:px-16">
        <span data-reveal className="museum-eyebrow mb-6">
          The Perfect Present
        </span>

        <h2 data-reveal className="museum-display mb-3">
          OGURA <em>Gift Card</em>
        </h2>

        <p data-reveal className="museum-lede mb-9">
          The perfect gift for fashion lovers. Available in multiple denominations, delivered instantly via email.
        </p>

        <div data-reveal>
          <span className="museum-cta">Buy Gift Card</span>
        </div>
      </div>
    </section>
  );
};
