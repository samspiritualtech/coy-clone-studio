import { liteClient as algoliasearch } from "algoliasearch/lite";

// Search-only API key (safe to expose in frontend)
// This key only has search permissions - no admin/write access
export const searchClient = algoliasearch(
  "KEBAEMMQPI",
  "765787a04065dd199e268ba75e81e34f"
);

export const ALGOLIA_INDEX_NAME = "ogura-products";
