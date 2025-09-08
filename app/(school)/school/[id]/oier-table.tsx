"use client";

import { useState } from "react";
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
import { usePathname, useSearchParams } from "next/navigation";
import { computeGradeText } from "@/lib/grade";
import { OierDialog } from "@/components/oier/oier-dialog";

type OierItem = {
  uid: number;
  name: string;
  enroll_middle: number | null;
  province: string | null;
  oierdb_score: number | null;
  ccf_level: number | null;
};

export function OierTable({
  items,
  page,
  totalPages,
}: {
  items: OierItem[];
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
              <TableHead className="w-20 text-muted-foreground">#</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>省份</TableHead>
              <TableHead>年级</TableHead>
              <TableHead>评分</TableHead>
              <TableHead>CCF 评级</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((r, idx) => (
              <TableRow key={r.uid}>
                <TableCell className="text-muted-foreground">{idx + 1 + (page - 1) * 50}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={() => {
                      setUid(r.uid);
                      setOpen(true);
                    }}
                  >
                    {r.name}
                  </button>
                </TableCell>
                <TableCell>{r.province ?? "-"}</TableCell>
                <TableCell>{computeGradeText(r.enroll_middle)}</TableCell>
                <TableCell className="font-mono">
                  {r.oierdb_score != null ? r.oierdb_score.toFixed(2) : "-"}
                </TableCell>
                <TableCell className="font-mono">{r.ccf_level ?? "-"}</TableCell>
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
          {!isNextDisabled && (
            <PaginationItem>
              <PaginationNext href={nextHref} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      <OierDialog open={open} uid={uid} onOpenChange={setOpen} />
    </>
  );
}


