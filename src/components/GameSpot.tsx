import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameSpotProps {
  id: number;
  isClicked: boolean;
  isCorrect: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const GameSpot = ({ id, isClicked, isCorrect, onClick, disabled }: GameSpotProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isClicked}
      className={cn(
        "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full transition-all duration-300",
        "flex items-center justify-center font-bold text-lg",
        "disabled:cursor-not-allowed",
        !isClicked && "bg-gradient-to-br from-muted to-muted-foreground/20 hover:scale-110 hover:shadow-lg",
        isClicked && isCorrect && "bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-500 animate-in zoom-in duration-300",
        isClicked && !isCorrect && "bg-gradient-to-br from-red-100 to-red-200 border-4 border-destructive animate-in zoom-in duration-300"
      )}
      aria-label={`Spot ${id}`}
    >
      {isClicked && (
        isCorrect ? 
          <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" /> :
          <X className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" />
      )}
    </button>
  );
};
