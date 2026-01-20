import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { allBrands, womenMenu, menMenu } from "@/data/menuData";
import { OptimizedImage } from "./OptimizedImage";

interface SmartSearchBarProps {
  isScrolled?: boolean;
  onClose?: () => void;
  className?: string;
  autoFocus?: boolean;
}

interface SearchResult {
  type: "product" | "category" | "brand";
  id: string;
  name: string;
  image?: string;
  price?: number;
  path: string;
}

const RECENT_SEARCHES_KEY = "ogura_recent_searches";
const MAX_RECENT_SEARCHES = 5;

export const SmartSearchBar = ({
  isScrolled = true,
  onClose,
  className = "",
  autoFocus = false,
}: SmartSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Debounced search
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search products (limit to 5)
    const matchingProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.brand?.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map((p) => ({
        type: "product" as const,
        id: p.id,
        name: p.name,
        image: p.images?.[0],
        price: p.price,
        path: `/product/${p.id}`,
      }));
    searchResults.push(...matchingProducts);

    // Search categories
    const allCategories = [
      ...womenMenu.categories.map((c) => ({ ...c, gender: "women" })),
      ...menMenu.categories.map((c) => ({ ...c, gender: "men" })),
    ];
    const matchingCategories = allCategories
      .filter((c) => c.name.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map((c) => ({
        type: "category" as const,
        id: c.slug,
        name: c.name,
        image: c.image,
        path: `/${c.gender}/${c.slug}`,
      }));
    searchResults.push(...matchingCategories);

    // Search brands
    const matchingBrands = allBrands
      .filter((b) => b.name.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map((b) => ({
        type: "brand" as const,
        id: b.slug,
        name: b.name,
        path: `/brand/${b.slug}`,
      }));
    searchResults.push(...matchingBrands);

    setResults(searchResults);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    saveRecentSearch(query);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query || result.name);
    setIsOpen(false);
    setQuery("");
    navigate(result.path);
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
  };

  const trendingSearches = ["Lehenga", "Co-ord Sets", "Designer Sarees", "Wedding Collection"];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          className={`pl-10 pr-10 h-10 ${
            isScrolled
              ? "bg-secondary border-border"
              : "bg-white/10 border-white/20 text-white placeholder:text-white/60"
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in">
          {/* Results */}
          {results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {/* Products */}
              {results.filter((r) => r.type === "product").length > 0 && (
                <div className="p-3 border-b border-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Products
                  </h4>
                  <ul className="space-y-2">
                    {results
                      .filter((r) => r.type === "product")
                      .map((result) => (
                        <li key={result.id}>
                          <button
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors text-left"
                          >
                            {result.image && (
                              <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                                <OptimizedImage
                                  src={result.image}
                                  alt={result.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {result.name}
                              </p>
                              {result.price && (
                                <p className="text-xs text-muted-foreground">
                                  ₹{result.price.toLocaleString("en-IN")}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Categories */}
              {results.filter((r) => r.type === "category").length > 0 && (
                <div className="p-3 border-b border-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Categories
                  </h4>
                  <ul className="space-y-1">
                    {results
                      .filter((r) => r.type === "category")
                      .map((result) => (
                        <li key={result.id}>
                          <button
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors text-left"
                          >
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{result.name}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Brands */}
              {results.filter((r) => r.type === "brand").length > 0 && (
                <div className="p-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Brands
                  </h4>
                  <ul className="space-y-1">
                    {results
                      .filter((r) => r.type === "brand")
                      .map((result) => (
                        <li key={result.id}>
                          <button
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs font-semibold">
                                {result.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-foreground">{result.name}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* View All Results */}
              {query && (
                <div className="p-3 border-t border-border">
                  <button
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:underline"
                  >
                    View all results for "{query}"
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* No Query - Show Recent & Trending */
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Recent Searches
                    </h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleRecentSearchClick(search)}
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trending
                </h4>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="px-3 py-1.5 text-sm bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;
