import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecordsTableSkeleton() {
  const rows = Array.from({ length: 10 });

  return (
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
          {rows.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-muted-foreground">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-36" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


