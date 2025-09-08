import { Suspense } from "react";
import type { Metadata } from "next";
import { listSchoolsServer } from "@/lib/list-schools-server";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SchoolListSkeleton } from "@/components/search/school-list-skeleton";
import { ProvinceSelect } from "@/components/search/province-select";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "学校排名 - OIerDB SSR",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Results({ page, province }: { page: number; province: string }) {
  const { items, totalPages } = await listSchoolsServer({ page, pageSize: 50, province });
  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;
  const qp = (n?: number) => {
    const params = new URLSearchParams();
    if (province && province !== "all") params.set("province", province);
    if (n && n > 1) params.set("page", String(n));
    const s = params.toString();
    return s ? `/schools?${s}` : "/schools";
  };
  const prevHref = isPrevDisabled ? "#" : qp(page - 1);
  const nextHref = isNextDisabled ? "#" : qp(page + 1);
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, i) => start + i
  );

  return (
    <div className="space-y-4">
      <div className="border rounded-sm p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-muted-foreground">#</TableHead>
              <TableHead>学校</TableHead>
              <TableHead>省份</TableHead>
              <TableHead>城市</TableHead>
              <TableHead>评分</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground">{s.rank}</TableCell>
                <TableCell>
                  <Link href={`/school/${s.id}`} className="hover:underline">{s.name}</Link>
                </TableCell>
                <TableCell>{s.province}</TableCell>
                <TableCell>{s.city ?? <span className="text-muted-foreground">-</span>}</TableCell>
                <TableCell className="font-mono">{s.score.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          {!isPrevDisabled && (
            <PaginationItem>
              <PaginationPrevious href={prevHref} />
            </PaginationItem>
          )}
          {pages[0] !== 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pages.map((n) => (
            <PaginationItem key={n}>
              <PaginationLink href={n === 1 ? qp(1) : qp(n)} isActive={n === page}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          {pages[pages.length - 1] !== totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {!isNextDisabled && (
            <PaginationItem>
              <PaginationNext href={nextHref} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default async function SchoolsPage(props: PageProps) {
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
        <span className="text-lg">信息学竞赛学校排名</span>
      </div>
      <Suspense key={`${page}-${province}`} fallback={<SchoolListSkeleton />}>
        <Results page={page} province={province} />
      </Suspense>
    </div>
  );
}

