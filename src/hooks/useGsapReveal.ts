import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Options {
  selector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  clip?: boolean;
}

/** GSAP scroll-triggered reveal for children matching selector inside ref. */
export const useGsapReveal = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  {
    selector = "[data-reveal]",
    y = 36,
    stagger = 0.08,
    duration = 1.0,
    start = "top 85%",
    clip = true,
  }: Options = {}
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const targets = el.querySelectorAll<HTMLElement>(selector);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, {
        opacity: 0,
        y,
        ...(clip ? { clipPath: "inset(8% 0% 8% 0%)" } : {}),
      });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        ...(clip ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
        duration,
        ease: "expo.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, selector, y, stagger, duration, start, clip]);
};
