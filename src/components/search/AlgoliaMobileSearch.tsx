import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InstantSearch, useHits, useSearchBox, Configure } from "react-instantsearch";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchClient, ALGOLIA_INDEX_NAME } from "@/lib/algoliaClient";
import { AlgoliaProductHit } from "./AlgoliaProductHit";
import { AlgoliaTrendingProducts, saveRecentSearch } from "./AlgoliaTrendingProducts";
import { AlgoliaNoResults } from "./AlgoliaNoResults";
import { cn } from "@/lib/utils";

interface AlgoliaMobileSearchProps {
  className?: string;
}

const MobileSearchContent = () => {
  const navigate = useNavigate();
  const { query, refine, clear } = useSearchBox();
  const { hits } = useHits();
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
  };

  const handleViewAll = () => {
    saveRecentSearch(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => refine(e.target.value)}
            onFocus={() => setShowResults(true)}
            className="pl-10 pr-10"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                clear();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
          <Configure hitsPerPage={5} />
          
          {!query ? (
            <AlgoliaTrendingProducts
              onSearchClick={(q) => {
                refine(q);
                saveRecentSearch(q);
                navigate(`/search?q=${encodeURIComponent(q)}`);
                setShowResults(false);
              }}
              onClose={() => setShowResults(false)}
            />
          ) : hits.length === 0 ? (
            <AlgoliaNoResults />
          ) : (
            <>
              <div className="p-3">
                <ul className="space-y-1">
                  {hits.slice(0, 5).map((hit: any) => (
                    <li key={hit.objectID}>
                      <AlgoliaProductHit hit={hit} onClick={handleResultClick} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 border-t border-border">
                <button
                  onClick={handleViewAll}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:underline"
                >
                  View all results
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export const AlgoliaMobileSearch = ({ className }: AlgoliaMobileSearchProps) => {
  return (
    <div className={cn("relative z-50", className)}>
      <InstantSearch
        searchClient={searchClient}
        indexName={ALGOLIA_INDEX_NAME}
      >
        <MobileSearchContent />
      </InstantSearch>
    </div>
  );
};
