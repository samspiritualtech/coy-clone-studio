import { useNavigate } from "react-router-dom";
import { Designer } from "@/types";

interface AzaDesignerCardProps {
  designer: Designer;
}

export const AzaDesignerCard = ({ designer }: AzaDesignerCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/designer/${designer.slug}`)}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Full Image */}
      <img
        src={designer.profile_image || '/placeholder.svg'}
        alt={designer.brand_name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <h3 className="text-white font-medium text-base md:text-lg leading-tight">
          {designer.brand_name}
        </h3>
        {designer.collection_name && (
          <p className="text-white/70 text-sm mt-1">
            {designer.collection_name}
          </p>
        )}
      </div>

      {/* Hover Border */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-white/40 transition-all duration-300" />
    </div>
  );
};
