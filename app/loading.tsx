import { SearchForm } from "@/components/search/search-form";
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <SearchForm />
      <SearchResultsSkeleton />
    </div>
  );
}


