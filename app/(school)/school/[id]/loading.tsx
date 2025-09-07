import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="border rounded-sm p-4">
        <div className="grid grid-cols-3 gap-3 text-sm p-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="text-muted-foreground"><Skeleton className="h-4 w-16" /></div>
              <div className="font-mono mt-1"><Skeleton className="h-4 w-24" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


