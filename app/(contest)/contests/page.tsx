import { Suspense } from "react";
import type { Metadata } from "next";
import { listContestsServer } from "@/lib/list-contests-server";
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
import { ContestListSkeleton } from "@/components/search/contest-list-skeleton";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "比赛列表 - OIerDB SSR",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Results({ page }: { page: number }) {
  const { items, totalPages } = await listContestsServer({
    page,
    pageSize: 50,
  });
  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;
  const qp = (n?: number) => {
    const params = new URLSearchParams();
    if (n && n > 1) params.set("page", String(n));
    const s = params.toString();
    return s ? `/contests?${s}` : "/contests";
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
              <TableHead>名称</TableHead>
              <TableHead>获奖人数</TableHead>
              <TableHead>参赛人数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-muted-foreground">
                  {c.id + 1}
                </TableCell>
                <TableCell>
                  <Link href={`/contest/${c.id}`} className="hover:underline">
                    {c.name}
                  </Link>
                </TableCell>
                <TableCell className="font-mono">{c.awardees}</TableCell>
                <TableCell className="font-mono">
                  {c.participants ?? (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
          {pages[pages.length - 1] !== totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href={nextHref} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default async function ContestsPage(props: PageProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">比赛列表</span>
      </div>
      <Suspense key={`${page}`} fallback={<ContestListSkeleton />}>
        <Results page={page} />
      </Suspense>
    </div>
  );
}
