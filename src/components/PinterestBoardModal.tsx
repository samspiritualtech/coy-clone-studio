import { useNavigate } from "react-router-dom";
import { PinterestBoard } from "@/data/pinterestMockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { OptimizedImage } from "./OptimizedImage";

interface PinterestBoardModalProps {
  board: PinterestBoard | null;
  open: boolean;
  onClose: () => void;
}

export const PinterestBoardModal = ({ board, open, onClose }: PinterestBoardModalProps) => {
  const navigate = useNavigate();

  if (!board) return null;

  // TODO: Replace with real Pinterest API call:
  // const pins = await fetchPins(board.id, localStorage.getItem("pinterest_token"));
  const pins = board.pins;

  const handleShopSimilar = (keyword: string) => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{board.name}</DialogTitle>
          <DialogDescription>{board.pinCount} pins saved</DialogDescription>
        </DialogHeader>

        <div className="columns-2 sm:columns-3 gap-3 space-y-3 mt-4">
          {pins.map((pin) => (
            <div
              key={pin.id}
              className="break-inside-avoid group relative rounded-lg overflow-hidden bg-muted"
            >
              <OptimizedImage
                src={pin.image}
                alt={pin.description}
                className="aspect-[3/4]"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
                <span className="text-white text-xs text-center line-clamp-2">
                  {pin.description}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1.5 text-xs h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopSimilar(pin.searchKeyword);
                  }}
                >
                  <Search className="h-3 w-3" />
                  Shop Similar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
