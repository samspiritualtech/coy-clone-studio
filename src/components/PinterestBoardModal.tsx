import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PinterestBoard, PinterestPin, getPinImageUrl, extractKeywords } from "@/data/pinterestMockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { OptimizedImage } from "./OptimizedImage";

interface PinterestBoardModalProps {
  board: PinterestBoard | null;
  open: boolean;
  onClose: () => void;
}

export const PinterestBoardModal = ({ board, open, onClose }: PinterestBoardModalProps) => {
  const navigate = useNavigate();
  const [pins, setPins] = useState<PinterestPin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!board || !open) {
      setPins([]);
      return;
    }

    const fetchPins = async () => {
      const token = localStorage.getItem("pinterest_token");
      if (!token) return;

      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.pinterest.com/v5/boards/${board.id}/pins?page_size=25`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch pins");

        const data = await res.json();
        setPins(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, [board, open]);

  if (!board) return null;

  const handleShopSimilar = (keyword: string) => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{board.name}</DialogTitle>
          <DialogDescription>{board.pin_count ?? 0} pins saved</DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && <p className="text-sm text-destructive py-4">{error}</p>}

        {!loading && !error && pins.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No pins found in this board.</p>
        )}

        {!loading && pins.length > 0 && (
          <div className="columns-2 sm:columns-3 gap-3 space-y-3 mt-4">
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="break-inside-avoid group relative rounded-lg overflow-hidden bg-muted"
              >
                <OptimizedImage
                  src={getPinImageUrl(pin)}
                  alt={pin.description || pin.title || "Pin"}
                  className="aspect-[3/4]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
                  <span className="text-white text-xs text-center line-clamp-2">
                    {pin.description || pin.title || ""}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1.5 text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopSimilar(extractKeywords(pin.description || pin.title));
                    }}
                  >
                    <Search className="h-3 w-3" />
                    Shop Similar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
