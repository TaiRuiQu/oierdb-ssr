import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SchoolListSkeleton() {
  const rows = Array.from({ length: 8 });

  return (
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
          {rows.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-muted-foreground">
                <Skeleton className="h-4 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}



