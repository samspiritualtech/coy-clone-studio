import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface RoundCategoryCardProps {
  name: string;
  gifSrc: string;
  staticFallback: string;
  slug: string;
}

export const RoundCategoryCard = ({ name, gifSrc, staticFallback, slug }: RoundCategoryCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleClick = () => {
    navigate(`/collections?category=${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const imageSrc = imageError || prefersReducedMotion ? staticFallback : gifSrc;

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`View ${name} collection`}
      className="flex flex-col items-center gap-3 group cursor-pointer focus:outline-none snap-center flex-shrink-0"
    >
      <div className="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:-translate-y-1 group-focus:ring-2 group-focus:ring-primary group-focus:ring-offset-2 border-4 border-white/60">
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 rounded-full" />
        )}
        <img
          src={imageSrc}
          alt={`${name} category`}
          width={192}
          height={192}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {/* Always visible on mobile, hover-reveal on desktop */}
      <span className="text-sm sm:text-base lg:text-lg font-medium text-foreground opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 group-focus:opacity-100">
        {name}
      </span>
    </button>
  );
};
