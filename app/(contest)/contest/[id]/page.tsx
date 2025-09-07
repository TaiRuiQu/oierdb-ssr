import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { fetchContestBaseById } from "@/lib/fetch-contest";
import RecordsSection from "./records-section";
import { RecordsTableSkeleton } from "./records-table-skeleton";
import { ProvinceSelect } from "@/components/search/province-select";
import { GradeSelect } from "@/components/search/grade-select";

type Params = { id: string };

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<Params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ContestPage({ params, searchParams }: PageProps) {
  const sp = await searchParams;
  const raw =
    typeof sp.page === "string"
      ? sp.page
      : Array.isArray(sp.page)
      ? sp.page[0]
      : undefined;
  const page = (() => {
    const n = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();
  const { id } = await params;
  const contestId = Number.parseInt(id, 10);
  const base = await fetchContestBaseById(contestId);

  const province = (() => {
    const raw =
      typeof sp.province === "string"
        ? sp.province
        : Array.isArray(sp.province)
        ? sp.province[0]
        : undefined;
    return raw && raw.trim() ? raw.trim() : "all";
  })();
  const grade = (() => {
    const raw =
      typeof sp.grade === "string"
        ? sp.grade
        : Array.isArray(sp.grade)
        ? sp.grade[0]
        : undefined;
    return raw && raw.trim() ? raw.trim() : "all";
  })();

  if (!base) {
    return (
      <div className="space-y-4">
        <div className="text-lg">未找到该比赛</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{base.name}</span>
          <Badge variant="outline">{base.type}</Badge>
          <Badge variant="secondary">
            {base.year}
            {base.fall_semester ? " 秋季" : " 春季"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <ProvinceSelect value={province} />
          <GradeSelect value={grade} />
        </div>
      </div>

      <div className="border rounded-sm p-4">
        <div className="grid grid-cols-3 gap-3 text-sm p-1">
          <div>
            <div className="text-muted-foreground">参赛人数</div>
            <div className="font-mono">{base.capacity ?? "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">获奖人数</div>
            <div className="font-mono">{base.awardees}</div>
          </div>
          <div>
            <div className="text-muted-foreground">满分</div>
            <div className="font-mono">{base.full_score}</div>
          </div>
        </div>
      </div>

      <Suspense key={`${page}-${province}-${grade}`} fallback={<RecordsTableSkeleton />}>
        <RecordsSection
          contestId={contestId}
          page={page}
          fullScore={base.full_score}
          capacity={base.capacity}
          year={base.year}
          fallSemester={base.fall_semester}
          province={province}
          grade={grade}
        />
      </Suspense>
    </div>
  );
}
