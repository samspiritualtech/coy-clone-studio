import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Props {
  id?: string;
  kicker?: string;
  heading?: string;
  children?: ReactNode;
  className?: string;
  narrow?: boolean;
  center?: boolean;
}

export const WaitlistSection = ({
  id,
  kicker,
  heading,
  children,
  className = "",
  narrow = false,
  center = false,
}: Props) => {
  const { ref, isVisible } = useScrollAnimation(0.08);

  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div
        ref={ref}
        className={`container mx-auto px-6 ${narrow ? "max-w-3xl" : "max-w-6xl"} ${center ? "text-center" : ""}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
          transitionDuration: "700ms",
          transitionProperty: "opacity, transform",
        }}
      >
        {kicker && (
          <p className={`editorial-eyebrow text-brand mb-5 ${center ? "" : ""}`}>{kicker}</p>
        )}
        {heading && (
          <h2 className="waitlist-serif text-3xl md:text-5xl text-foreground mb-8 max-w-3xl"
              style={center ? { marginLeft: "auto", marginRight: "auto" } : undefined}>
            {heading}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
};
