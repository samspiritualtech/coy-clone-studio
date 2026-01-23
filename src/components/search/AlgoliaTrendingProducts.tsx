import { TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TRENDING_SEARCHES = [
  "Lehenga",
  "Co-ord Sets",
  "Designer Sarees",
  "Wedding Collection",
  "Anarkali",
  "Kurta Sets",
];

const RECENT_SEARCHES_KEY = "ogura_recent_searches";

interface AlgoliaTrendingProductsProps {
  onSearchClick: (query: string) => void;
  onClose?: () => void;
}

export const AlgoliaTrendingProducts = ({
  onSearchClick,
  onClose,
}: AlgoliaTrendingProductsProps) => {
  const navigate = useNavigate();

  const getRecentSearches = (): string[] => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    // Force re-render by navigating to same page
    window.location.reload();
  };

  const recentSearches = getRecentSearches();

  const handleSearchClick = (query: string) => {
    onSearchClick(query);
  };

  return (
    <div className="p-4">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Recent Searches
            </h4>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-1">
            {recentSearches.slice(0, 5).map((search, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSearchClick(search)}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors text-left"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{search}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trending Searches */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
          <TrendingUp className="h-3.5 w-3.5" />
          Trending
        </h4>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((search) => (
            <button
              key={search}
              onClick={() => handleSearchClick(search)}
              className="px-3 py-1.5 text-sm bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper to save recent search
export const saveRecentSearch = (query: string) => {
  if (!query.trim()) return;
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    const recentSearches: string[] = stored ? JSON.parse(stored) : [];
    const updated = [
      query,
      ...recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase()),
    ].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
};
