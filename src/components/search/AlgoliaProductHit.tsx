import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";

interface AlgoliaProductHitProps {
  hit: {
    objectID: string;
    name: string;
    brand?: string;
    price: number;
    image?: string;
    images?: string[];
    category?: string;
  };
  onClick?: () => void;
}

export const AlgoliaProductHit = ({ hit, onClick }: AlgoliaProductHitProps) => {
  const navigate = useNavigate();
  const imageUrl = hit.image || hit.images?.[0] || "/placeholder.svg";

  const handleClick = () => {
    onClick?.();
    navigate(`/product/${hit.objectID}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
    >
      <div className="w-14 h-14 rounded-md bg-muted overflow-hidden flex-shrink-0">
        <OptimizedImage
          src={imageUrl}
          alt={hit.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {hit.name}
        </p>
        {hit.brand && (
          <p className="text-xs text-muted-foreground truncate">{hit.brand}</p>
        )}
        <p className="text-sm font-semibold text-foreground">
          ₹{hit.price?.toLocaleString("en-IN")}
        </p>
      </div>
    </button>
  );
};
