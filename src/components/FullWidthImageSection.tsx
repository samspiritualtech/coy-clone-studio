import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef, MouseEvent } from "react";


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
    medium: "from-black/50 via-black/30 to-black/20",
    dark: "from-black/60 via-black/40 to-black/30",
  };

  const alignClasses = {
    center: "items-center justify-center text-center",
    left: "items-start justify-center text-left pl-8 md:pl-16 lg:pl-24",
  };

  const sectionRef = useRef<HTMLElement>(null);
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
        "relative w-full overflow-hidden group luxury-spotlight",
        heightClasses[height],
        className
      )}
    >
      {/* Background Image with subtle parallax depth */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out",
          enableZoom && "group-hover:scale-[1.06]"
        )}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Premium cinematic light overlay — follows cursor */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]"
        style={{
          background:
            "radial-gradient(700px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.12), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t",
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
          <span className="text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] mb-4 animate-fade-in">
            {label}
          </span>
        )}
        
        <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-light uppercase tracking-[0.2em] mb-4 animate-fade-in">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-white/90 text-sm md:text-lg font-light tracking-wide max-w-md mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {subtitle}
          </p>
        )}
        
        {ctaText && (
          <Link to={ctaLink}>
            <Button
              variant="outline"
              size="lg"
              className="border-white/80 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 tracking-widest uppercase text-sm animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              {ctaText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};
