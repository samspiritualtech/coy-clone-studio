import { useSearchParams } from "react-router-dom";
import { InstantSearch, Configure, useInstantSearch } from "react-instantsearch";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { searchClient, ALGOLIA_INDEX_NAME } from "@/lib/algoliaClient";
import {
  AlgoliaSearchResults,
  AlgoliaPagination,
  AlgoliaFilterSidebar,
  AlgoliaMobileFilters,
} from "@/components/search";

const SearchContent = () => {
  const { indexUiState } = useInstantSearch();
  const query = indexUiState.query || "";

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query && (
          <p className="text-muted-foreground">
            Showing results for "{query}"
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <AlgoliaFilterSidebar />
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <AlgoliaMobileFilters />
          </div>

          <AlgoliaSearchResults />
          <AlgoliaPagination />
        </div>
      </div>
    </main>
  );
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <InstantSearch
        searchClient={searchClient}
        indexName={ALGOLIA_INDEX_NAME}
        initialUiState={{
          [ALGOLIA_INDEX_NAME]: {
            query: query,
          },
        }}
      >
        <Configure hitsPerPage={12} />
        <SearchContent />
      </InstantSearch>
      <Footer />
    </div>
  );
}
