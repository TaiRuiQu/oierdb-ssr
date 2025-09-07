"use client"

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { computeGradeTextAtContest } from "@/lib/grade";
import { OierDialog } from "@/components/oier/oier-dialog";
import { usePathname, useSearchParams } from "next/navigation";

type RecordItem = {
  id: number;
  uid: number | null;
  name: string;
  enroll_middle: number | null;
  level: string | null;
  score: number | null;
  rank: number | null;
  province: string | null;
  school_name: string | null;
};

function getColor(x: number, total: number, reverse: boolean = false) {
  if (reverse) x = total - x;
  if (total === 0) return "text-muted-foreground";
  const ratio = x / total;
  if (ratio < 0.2) return "text-red-500";
  if (ratio < 0.6) return "text-orange-500";
  if (ratio < 0.8) return "text-yellow-500";
  return "text-green-500";
}

export function RecordsTable({
  items,
  fullScore,
  capacity,
  year,
  fallSemester,
  page,
  totalPages,
}: {
  items: RecordItem[];
  fullScore: number;
  capacity: number | null;
  year: number;
  fallSemester: boolean;
  page: number;
  totalPages: number;
}) {
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState<number | null>(null);
  const pathname = usePathname();
  const sp = useSearchParams();


  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;
  const qp = (n?: number) => {
    const params = new URLSearchParams(sp.toString());
    if (n && n > 1) params.set("page", String(n));
    else params.delete("page");
    const s = params.toString();
    return s ? `${pathname}?${s}` : `${pathname}`;
  };
  const prevHref = isPrevDisabled ? "#" : qp(page - 1);
  const nextHref = isNextDisabled ? "#" : qp(page + 1);
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

  return (
    <>
      <div className="border rounded-sm p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-muted-foreground">排名</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>年级</TableHead>
              <TableHead>获奖</TableHead>
              <TableHead>得分</TableHead>
              <TableHead>学校</TableHead>
              <TableHead>省份</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((r, idx) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-muted-foreground">
                  <span className={getColor(r.rank ?? (idx + 1 + (page - 1) * 50), capacity ?? 0, true)}>
                    {r.rank ?? idx + 1 + (page - 1) * 50}
                  </span>
                  {capacity != null && (
                    <span className="text-muted-foreground ml-1 text-xs">/{capacity}</span>
                  )}
                </TableCell>
                <TableCell>
                  {r.uid != null ? (
                    <button
                      type="button"
                      className="text-primary hover:underline cursor-pointer"
                      onClick={() => {
                        setUid(r.uid as number);
                        setOpen(true);
                      }}
                    >
                      {r.name}
                    </button>
                  ) : (
                    r.name
                  )}
                </TableCell>
                <TableCell>
                  {computeGradeTextAtContest(r.enroll_middle, year, fallSemester)}
                </TableCell>
                <TableCell>{r.level ?? "-"}</TableCell>
                <TableCell className="font-mono">
                  <span className={getColor(r.score ?? 0, fullScore ?? 0)}>
                    {r.score ?? "-"}
                  </span>
                  <span className="text-muted-foreground ml-1 text-xs">/{fullScore}</span>
                </TableCell>
                <TableCell>{r.school_name ?? "-"}</TableCell>
                <TableCell>{r.province ?? "-"}</TableCell>
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
              <PaginationLink href={qp(n)} isActive={n === page}>
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

      <OierDialog open={open} uid={uid} onOpenChange={setOpen} />
    </>
  )
}


