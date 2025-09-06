import { SearchResults } from "@/components/search/search-results";
import { searchServer } from "@/lib/search-server";

export async function SearchResultsWrapper({
  query,
}: {
  query?: string;
}) {
  const results = await searchServer({ query });
  return <SearchResults results={results} />;
}


