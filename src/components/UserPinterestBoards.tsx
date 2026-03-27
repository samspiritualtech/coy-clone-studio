import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PinterestBoard, getBoardCoverUrl } from "@/data/pinterestMockData";
import { PinterestBoardModal } from "./PinterestBoardModal";
import { OptimizedImage } from "./OptimizedImage";
import { Skeleton } from "./ui/skeleton";

export const UserPinterestBoards = () => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(
    () => localStorage.getItem("pinterest_connected") === "true"
  );
  const [boards, setBoards] = useState<PinterestBoard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBoard, setSelectedBoard] = useState<PinterestBoard | null>(null);

  useEffect(() => {
    const handler = () => {
      setIsConnected(localStorage.getItem("pinterest_connected") === "true");
    };
    window.addEventListener("pinterest_connection_change", handler);
    return () => window.removeEventListener("pinterest_connection_change", handler);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isConnected) return;

    const fetchBoards = async () => {
      const token = localStorage.getItem("pinterest_token");
      if (!token) return;

      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://api.pinterest.com/v5/boards?page_size=25", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Token expired — disconnect
            localStorage.removeItem("pinterest_connected");
            localStorage.removeItem("pinterest_token");
            window.dispatchEvent(new Event("pinterest_connection_change"));
            throw new Error("Session expired. Please reconnect Pinterest.");
          }
          throw new Error("Failed to fetch boards");
        }

        const data = await res.json();
        setBoards(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [isAuthenticated, isConnected]);

  if (!isAuthenticated || !isConnected) return null;

  return (
    <div className="mt-16">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
        Your Pinterest Boards
      </h3>
      <p className="text-muted-foreground text-sm mb-8">
        Browse your saved boards and shop similar looks on Ogura.
      </p>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!loading && !error && boards.length === 0 && (
        <p className="text-sm text-muted-foreground">No boards found.</p>
      )}

      {!loading && boards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setSelectedBoard(board)}
              className="group relative rounded-xl overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300 text-left"
            >
              <OptimizedImage
                src={getBoardCoverUrl(board)}
                alt={board.name}
                className="aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-semibold text-sm">{board.name}</h4>
                <span className="text-white/70 text-xs">{board.pin_count ?? 0} pins</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <PinterestBoardModal
        board={selectedBoard}
        open={!!selectedBoard}
        onClose={() => setSelectedBoard(null)}
      />
    </div>
  );
};
