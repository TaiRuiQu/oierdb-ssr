"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { OierDetail } from "@/lib/oier";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

type OierDialogProps = {
  open: boolean;
  uid: number | null;
  onOpenChange: (open: boolean) => void;
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

export function OierDialog({ open, uid, onOpenChange }: OierDialogProps) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<OierDetail | null>(null);

  useEffect(() => {
    if (!open || uid == null) {
      setDetail(null);
      return;
    }
    setLoading(true);
    fetch(`/api/oier/${uid}`)
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data) => setDetail(data))
      .finally(() => setLoading(false));
  }, [open, uid]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="px-0.5">
            {detail?.name ?? <Skeleton className="h-6 w-40" />}
          </DialogTitle>
        </DialogHeader>

        {loading || !detail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-sm p-1">
              <div>
                <div className="text-muted-foreground">年级</div>
                <div className="font-medium">{detail.grade}</div>
              </div>
              <div>
                <div className="text-muted-foreground">OIerDb 排名分</div>
                <div className="font-mono">{detail.oierdbScore.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">CCF 评级</div>
                <div className="font-mono">{detail.ccfLevel ?? "-"}</div>
              </div>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>比赛</TableHead>
                    <TableHead>获奖</TableHead>
                    <TableHead>得分</TableHead>
                    <TableHead>排名</TableHead>
                    <TableHead>学校</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.records.slice(0, 8).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="truncate">
                        <Link href={`/contest/${r.contestId}`} className="hover:underline">{r.contestName}</Link>
                      </TableCell>
                      <TableCell>{r.level ?? "-"}</TableCell>
                      <TableCell className="font-mono">
                        <span
                          className={getColor(
                            r.score ?? 0,
                            r.contestFullScore ?? 0
                          )}
                        >
                          {r.score ?? "-"}
                        </span>
                        <span className="text-muted-foreground ml-1 text-xs">
                          /{r.contestFullScore ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">
                        <span
                          className={getColor(
                            r.rank ?? 0,
                            r.contestCapacity ?? 0,
                            true
                          )}
                        >
                          {r.rank ?? "-"}
                        </span>
                        <span className="text-muted-foreground ml-1 text-xs">
                          /{r.contestCapacity ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link href={`/school/${r.schoolId}`} className="hover:underline">{r.schoolName ?? "-"}</Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
