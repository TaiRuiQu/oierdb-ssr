import { Suspense } from "react";
import { searchServer } from "@/lib/search-server";
import type { SearchParams } from "@/lib/search-types";
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
import { GradeSelect } from "@/components/search/grade-select";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "选手列表 - OIerDB SSR",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Results({ page, province, grade }: { page: number; province: string; grade: string }) {
  const results = await searchServer({
    page,
    pageSize: 50,
    province: province as SearchParams["province"],
    grade: grade as SearchParams["grade"],
  });
  const isPrevDisabled = page <= 1;
  const qp = (n?: number) => {
    const params = new URLSearchParams();
    if (province && province !== "all") params.set("province", province);
    if (grade && grade !== "all") params.set("grade", grade);
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
  const grade = (() => {
    const raw =
      typeof sp.grade === "string"
        ? sp.grade
        : Array.isArray(sp.grade)
        ? sp.grade[0]
        : undefined;
    return raw && raw.trim() ? raw.trim() : "all";
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ProvinceSelect value={province} />
        <GradeSelect value={grade} />
        <span className="text-lg">信息学竞赛选手排名</span>
      </div>
      <Suspense key={`${page}-${province}-${grade}`} fallback={<SearchResultsSkeleton />}>
        <Results page={page} province={province} grade={grade} />
      </Suspense>
    </div>
  );
}
