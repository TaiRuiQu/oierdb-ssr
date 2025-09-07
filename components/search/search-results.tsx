"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SearchResult } from "@/lib/search-types";
import { computeGradeText } from "@/lib/grade";
import { useState } from "react";
import { OierDialog } from "@/components/oier/oier-dialog";

export function SearchResults({ results }: { results: SearchResult[] }) {
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState<number | null>(null);
  if (!results.length) return null;

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
            {results.map((r) => (
              <TableRow key={r.uid}>
                <TableCell className="text-muted-foreground">{r.rank}</TableCell>
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
      <OierDialog open={open} uid={uid} onOpenChange={setOpen} />
    </>
  );
}
