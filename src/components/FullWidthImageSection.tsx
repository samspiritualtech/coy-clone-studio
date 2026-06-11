import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useRef, MouseEvent } from "react";
import { ParallaxLayer } from "@/components/luxury3d/ParallaxLayer";
import { useGsapReveal } from "@/hooks/useGsapReveal";

interface FullWidthImageSectionProps {
  backgroundImage: string;
  height?: "screen" | "70vh" | "60vh" | "50vh";
  overlayOpacity?: "light" | "medium" | "dark";
  contentAlign?: "center" | "left";
  label?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
  enableZoom?: boolean;
}

export const FullWidthImageSection = ({
  backgroundImage,
  height = "60vh",
  overlayOpacity = "medium",
  contentAlign = "center",
  label,
  title,
  subtitle,
  ctaText,
  ctaLink = "/collections",
  className,
  enableZoom = true,
}: FullWidthImageSectionProps) => {
  const heightClasses = {
    screen: "h-screen",
    "70vh": "h-[70vh]",
    "60vh": "h-[60vh]",
    "50vh": "h-[50vh]",
  };

  const overlayClasses = {
    light: "from-black/60 via-black/35 to-black/20",
    medium: "from-black/80 via-black/45 to-black/25",
    dark: "from-black/90 via-black/60 to-black/35",
  };

  const alignClasses = {
    center: "items-center justify-center text-center",
    left: "items-start justify-center text-left pl-8 md:pl-16 lg:pl-24",
  };

  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: "[data-reveal]", stagger: 0.16, y: 70 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className={cn(
        "relative w-full overflow-hidden group museum-spotlight isolate",
        heightClasses[height],
        className
      )}
    >
      {/* Parallax background image */}
      <ParallaxLayer speed={120} className="absolute inset-0">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat scale-125 transition-transform duration-[8000ms] ease-out",
            enableZoom && "group-hover:scale-[1.32]"
          )}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </ParallaxLayer>

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t z-[2]",
          overlayClasses[overlayOpacity]
        )}
      />

      {/* Vignette + grain (cinematic) */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 35%, rgba(0,0,0,0.7) 100%)", mixBlendMode: "multiply" }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 h-full flex flex-col px-4",
          alignClasses[contentAlign]
        )}
      >
        {label && (
          <span data-reveal className="museum-eyebrow mb-6">
            {label}
          </span>
        )}

        <h2 data-reveal className="museum-display max-w-4xl mb-6">
          <em>{title}</em>
        </h2>

        {subtitle && (
          <p data-reveal className="museum-lede mb-8">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <div data-reveal>
            <Link to={ctaLink} className="museum-cta">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
