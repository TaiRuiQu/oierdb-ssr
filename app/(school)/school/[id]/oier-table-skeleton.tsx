import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function OierTableSkeleton() {
  return (
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
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="text-muted-foreground">-</TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


