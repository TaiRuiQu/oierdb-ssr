import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchSchoolBaseById } from "@/lib/fetch-school";
import { GradeSelect } from "@/components/search/grade-select";
import OierSection from "@/app/(school)/school/[id]/oier-section";
import { OierTableSkeleton } from "@/app/(school)/school/[id]/oier-table-skeleton";
import AwardsSection from "@/app/(school)/school/[id]/awards-section";
import AwardsSkeleton from "@/app/(school)/school/[id]/awards-skeleton";

type Params = { id: string };


export const metadata: Metadata = {
  title: "学校详情 - OIerDB SSR",
};

type PageProps = {
  params: Promise<Params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SchoolPage({ params, searchParams }: PageProps) {
  const sp = await searchParams;
  const rawPage =
    typeof sp.page === "string"
      ? sp.page
      : Array.isArray(sp.page)
      ? sp.page[0]
      : undefined;
  const page = (() => {
    const n = rawPage ? Number.parseInt(rawPage, 10) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();
  const { id } = await params;
  const schoolId = Number.parseInt(id, 10);
  const base = await fetchSchoolBaseById(schoolId);

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
        <div className="text-lg">未找到该学校</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2">
          <span className="text-lg">{base.name}</span>
          <span className="text-muted-foreground">{base.province}</span>
          <span className="text-muted-foreground">{base.city ?? "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <GradeSelect value={grade} />
        </div>
      </div>

      <div className="border rounded-sm p-4">
        <div className="grid grid-cols-3 gap-3 text-sm p-1">
          <div>
            <div className="text-muted-foreground">学校评分</div>
            <div className="font-mono">{base.score.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">省份</div>
            <div className="">{base.province}</div>
          </div>
          <div>
            <div className="text-muted-foreground">城市</div>
            <div className="">{base.city ?? "-"}</div>
          </div>
        </div>
      </div>

      <Suspense key={`awards-${schoolId}`} fallback={<AwardsSkeleton />}>
        <AwardsSection schoolId={schoolId} />
      </Suspense>

      <Suspense key={`oiers-${page}-${grade}`} fallback={<OierTableSkeleton />}>
        <OierSection schoolId={schoolId} page={page} grade={grade} />
      </Suspense>
    </div>
  );
}


