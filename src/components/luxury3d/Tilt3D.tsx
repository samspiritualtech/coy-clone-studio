import { useRef, ReactNode, MouseEvent, CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  max?: number; // max tilt in degrees
  scale?: number;
  glare?: boolean;
  perspective?: number;
  as?: "div" | "article" | "section";
  style?: CSSProperties;
}

/**
 * Premium luxury 3D tilt wrapper.
 * - Cursor-tracked rotateX/Y
 * - Spotlight follow via CSS vars (--mx, --my)
 * - Subtle entrance fade-in via framer-motion
 * - Fully transparent to clicks (children stay clickable)
 */
export const Tilt3D = ({
  children,
  className,
  max = 6,
  scale = 1.015,
  glare = true,
  perspective = 1200,
  style,
}: Tilt3DProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -2 * max;
    const ry = (px - 0.5) * 2 * max;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--s", `${scale}`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--s", `1`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: `${perspective}px`, ...style }}
      className={cn("luxury-tilt-root", className)}
    >
      <div className="luxury-tilt-inner">
        {children}
        {glare && <div className="luxury-tilt-glare" aria-hidden />}
      </div>
    </motion.div>
  );
};
