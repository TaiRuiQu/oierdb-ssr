import { Suspense } from "react";
import { listOiersServer } from "@/lib/list-oiers-server";
import { SearchResults } from "@/components/search/search-results";
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProvinceSelect } from "@/components/search/province-select";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Results({ page, province }: { page: number; province: string }) {
  const results = await listOiersServer({ page, pageSize: 50, province });
  const isPrevDisabled = page <= 1;
  const qp = (n?: number) => {
    const params = new URLSearchParams();
    if (province && province !== "all") params.set("province", province);
    if (n && n > 1) params.set("page", String(n));
    const s = params.toString();
    return s ? `/oiers?${s}` : "/oiers";
  };
  const prevHref = isPrevDisabled ? "#" : qp(page - 1);
  const nextHref = qp(page + 1);
  const pages = Array.from({ length: 5 }, (_, i) => page - 2 + i).filter(
    (n) => n >= 1
  );
  return (
    <div className="space-y-4">
      <SearchResults results={results} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={prevHref} />
          </PaginationItem>
          {pages[0] !== 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pages.map((n) => (
            <PaginationItem key={n}>
              <PaginationLink
                href={n === 1 ? qp(1) : qp(n)}
                isActive={n === page}
              >
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={nextHref} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default async function OiersPage(props: PageProps) {
  const sp = await props.searchParams;
  const page = (() => {
    const raw =
      typeof sp.page === "string"
        ? sp.page
        : Array.isArray(sp.page)
        ? sp.page[0]
        : undefined;
    const n = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();
  const province = (() => {
    const raw =
      typeof sp.province === "string"
        ? sp.province
        : Array.isArray(sp.province)
        ? sp.province[0]
        : undefined;
    return raw && raw.trim() ? raw.trim() : "all";
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ProvinceSelect value={province} />
        <span className="text-lg">信息学竞赛选手排名</span>
      </div>
      <Suspense key={`${page}-${province}`} fallback={<SearchResultsSkeleton />}>
        <Results page={page} province={province} />
      </Suspense>
    </div>
  );
}
