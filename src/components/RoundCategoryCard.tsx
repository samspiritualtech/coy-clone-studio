import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface RoundCategoryCardProps {
  name: string;
  image: string;
  slug: string;
}

export const RoundCategoryCard = ({ name, image, slug }: RoundCategoryCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/collections?category=${slug}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
    >
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border-4 border-white/50">
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 rounded-full" />
        )}
        <img
          src={imageError ? `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80` : image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="text-sm sm:text-base lg:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
        {name}
      </span>
    </button>
  );
};
