import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockPinterestBoards, PinterestBoard } from "@/data/pinterestMockData";
import { PinterestBoardModal } from "./PinterestBoardModal";
import { OptimizedImage } from "./OptimizedImage";

export const UserPinterestBoards = () => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(
    () => localStorage.getItem("pinterest_connected") === "true"
  );
  const [selectedBoard, setSelectedBoard] = useState<PinterestBoard | null>(null);

  useEffect(() => {
    const handler = () => {
      setIsConnected(localStorage.getItem("pinterest_connected") === "true");
    };
    window.addEventListener("pinterest_connection_change", handler);
    return () => window.removeEventListener("pinterest_connection_change", handler);
  }, []);

  if (!isAuthenticated || !isConnected) return null;

  // TODO: Replace with real Pinterest API call:
  // const boards = await fetchBoards(localStorage.getItem("pinterest_token"));
  const boards = mockPinterestBoards;

  return (
    <div className="mt-16">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
        Your Pinterest Boards
      </h3>
      <p className="text-muted-foreground text-sm mb-8">
        Browse your saved boards and shop similar looks on Ogura.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => setSelectedBoard(board)}
            className="group relative rounded-xl overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300 text-left"
          >
            <OptimizedImage
              src={board.coverImage}
              alt={board.name}
              className="aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-white font-semibold text-sm">{board.name}</h4>
              <span className="text-white/70 text-xs">{board.pinCount} pins</span>
            </div>
          </button>
        ))}
      </div>

      <PinterestBoardModal
        board={selectedBoard}
        open={!!selectedBoard}
        onClose={() => setSelectedBoard(null)}
      />
    </div>
  );
};
