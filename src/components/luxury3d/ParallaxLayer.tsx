import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Pixels to translate over the scroll range. Positive = moves down slower. */
  speed?: number;
  disableOnMobile?: boolean;
}

/**
 * Translates children on scroll for a cinematic parallax effect.
 * No-op on reduced motion and (optionally) on mobile.
 */
export const ParallaxLayer = ({
  children,
  className,
  speed = 60,
  disableOnMobile = true,
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (disableOnMobile && window.matchMedia("(max-width: 768px)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -speed },
        {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [speed, disableOnMobile]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
};
