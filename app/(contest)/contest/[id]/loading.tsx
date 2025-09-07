import { Skeleton } from "@/components/ui/skeleton";
import { RecordsTableSkeleton } from "./records-table-skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-28" />
      </div>

      <div className="border rounded-sm p-4">
        <div className="grid grid-cols-3 gap-3 text-sm p-1">
          <div>
            <div className="text-muted-foreground">参赛人数</div>
            <Skeleton className="h-4 w-16" />
          </div>
          <div>
            <div className="text-muted-foreground">获奖人数</div>
            <Skeleton className="h-4 w-16" />
          </div>
          <div>
            <div className="text-muted-foreground">满分</div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>

      <RecordsTableSkeleton />
    </div>
  );
}


