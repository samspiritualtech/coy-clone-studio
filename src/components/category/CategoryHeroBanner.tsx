import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryHeroBannerProps {
  title: string;
  subtitle: string;
  heroImage: string;
}

export const CategoryHeroBanner = ({
  title,
  subtitle,
  heroImage,
}: CategoryHeroBannerProps) => {
  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt={title}
        className="w-full h-full object-cover object-center"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      
      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-4 md:left-8 lg:left-16 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </Link>
      
      {/* Content */}
      <div className="absolute bottom-8 md:bottom-12 lg:bottom-16 left-4 md:left-8 lg:left-16 right-4 md:right-auto max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-white tracking-wide mb-2 md:mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-white/80 font-light">
          {subtitle}
        </p>
      </div>
      
      {/* Bottom Gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
