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
    light: "from-black/30 via-black/20 to-black/10",
    medium: "from-black/55 via-black/30 to-black/20",
    dark: "from-black/70 via-black/45 to-black/30",
  };

  const alignClasses = {
    center: "items-center justify-center text-center",
    left: "items-start justify-center text-left pl-8 md:pl-16 lg:pl-24",
  };

  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, { selector: "[data-reveal]", stagger: 0.12, y: 30 });

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
        "relative w-full overflow-hidden group luxury-spotlight isolate",
        heightClasses[height],
        className
      )}
    >
      {/* Parallax background image */}
      <ParallaxLayer speed={50} className="absolute inset-0">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 transition-transform duration-[8000ms] ease-out",
            enableZoom && "group-hover:scale-[1.18]"
          )}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </ParallaxLayer>

      {/* Cinematic gold spotlight following cursor */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]"
        style={{
          background:
            "radial-gradient(700px circle at var(--mx,50%) var(--my,50%), rgba(233,212,163,0.18), rgba(255,255,255,0.05) 30%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Vignette */}
      <div className="luxury-vignette" aria-hidden />

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t z-[1]",
          overlayClasses[overlayOpacity]
        )}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 h-full flex flex-col px-4",
          alignClasses[contentAlign]
        )}
      >
        {label && (
          <span data-reveal className="luxury-eyebrow-gold text-[10px] md:text-xs mb-5">
            {label}
          </span>
        )}

        <h2
          data-reveal
          className="text-white text-4xl md:text-6xl lg:text-7xl font-light uppercase tracking-[0.2em] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.18em" }}
        >
          {title}
        </h2>

        {subtitle && (
          <p data-reveal className="text-white/90 text-sm md:text-lg font-light tracking-wide max-w-md mb-8">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <div data-reveal>
            <Link to={ctaLink} className="luxury-cta-glass luxury-sweep">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
