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
  blur?: boolean;
}

/** GSAP scroll-triggered reveal for children matching selector inside ref. */
export const useGsapReveal = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  {
    selector = "[data-reveal]",
    y = 60,
    stagger = 0.14,
    duration = 1.2,
    start = "top 85%",
    clip = true,
    blur = true,
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
        ...(clip ? { clipPath: "inset(10% 0% 10% 0%)" } : {}),
        ...(blur ? { filter: "blur(12px)" } : {}),
      });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        ...(clip ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
        ...(blur ? { filter: "blur(0px)" } : {}),
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
  }, [ref, selector, y, stagger, duration, start, clip, blur]);
};
