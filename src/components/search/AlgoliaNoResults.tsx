import { useInstantSearch } from "react-instantsearch";
import { SearchX } from "lucide-react";

export const AlgoliaNoResults = () => {
  const { indexUiState } = useInstantSearch();
  const query = indexUiState.query || "";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        No results found
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        We couldn't find any products matching "{query}". Try checking your spelling or using different keywords.
      </p>
    </div>
  );
};
