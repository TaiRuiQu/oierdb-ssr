import { Suspense } from "react";
import { SearchForm } from "@/components/search/search-form";
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";
import { SearchResultsWrapper } from "@/components/search/search-results-wrapper";
import { Faq } from "@/components/site/faq";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home(props: PageProps) {
  const sp = await props.searchParams;
  const query = typeof sp.query === "string" ? sp.query : "";

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <SearchForm />
      </Suspense>
      <Suspense key={query} fallback={<SearchResultsSkeleton />}>
        <SearchResultsWrapper query={query} />
      </Suspense>
      <Faq />
    </div>
  );
}
