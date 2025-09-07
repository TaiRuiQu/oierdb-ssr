import supabase from "@/lib/db";
import { unstable_cache } from "next/cache";

export type ContestRecord = {
  id: number;
  uid: number | null;
  name: string;
  enroll_middle: number | null;
  level: string | null;
  score: number | null;
  rank: number | null;
  province: string | null;
  school_name: string | null;
  school_id: number | null;
};

export type ContestDetail = {
  id: number;
  name: string;
  type: string;
  year: number;
  fall_semester: boolean;
  full_score: number;
  capacity: number | null;
  awardees: number | null;
  records: ContestRecord[];
};

export type ContestBase = Omit<ContestDetail, "records">;

async function fetchContestBaseByIdUncached(
  id: number
): Promise<ContestBase | null> {
  if (!Number.isFinite(id)) return null;
  const { data: c, error } = await supabase
    .from("contest")
    .select("id,name,type,year,fall_semester,full_score,capacity,awardees")
    .eq("id", id)
    .maybeSingle();
  if (error || !c) return null;
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    year: c.year,
    fall_semester: c.fall_semester,
    full_score: c.full_score,
    capacity: c.capacity ?? null,
    awardees: c.awardees ?? null,
  } satisfies ContestBase;
}

export const fetchContestBaseById = unstable_cache(
  async (id: number) => fetchContestBaseByIdUncached(id),
  ["fetchContestBaseById"],
  { revalidate: 300 }
);

export type ListContestRecordsParams = {
  contestId: number;
  page?: number;
  pageSize?: number;
  province?: string | "all";
  grade?:
    | "all"
    | "初一"
    | "初二"
    | "初三"
    | "高一"
    | "高二"
    | "高三"
    | "高中毕业";
};

export type ListContestRecordsResponse = {
  items: ContestRecord[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

async function listContestRecordsServerUncached(
  params: ListContestRecordsParams
): Promise<ListContestRecordsResponse> {
  const pageSize =
    Number.isFinite(params.pageSize) && (params.pageSize as number) > 0
      ? (params.pageSize as number)
      : 50;
  const page =
    Number.isFinite(params.page) && (params.page as number) > 0
      ? (params.page as number)
      : 1;
  const offset = (page - 1) * pageSize;
  const hasProvince = !!(params.province && params.province !== "all");
  const hasGrade = !!(params.grade && params.grade !== "all");

  const countSelect = hasGrade
    ? "id,oier!inner(uid,enroll_middle)"
    : "id";
  const dataSelect = `id,rank,level,score,province,` +
    (hasGrade
      ? `oier:oier!inner(uid,name,enroll_middle)`
      : `oier:oier(uid,name,enroll_middle)`) +
    `,school:school(name,id)`;

  const countQueryBase = supabase
    .from("record")
    .select(countSelect, { count: "exact", head: true })
    .eq("contest_id", params.contestId);
  const dataQueryBase = supabase
    .from("record")
    .select(dataSelect)
    .eq("contest_id", params.contestId)
    .order("rank", { ascending: true, nullsFirst: false })
    .order("score", { ascending: false, nullsFirst: true })
    .range(offset, offset + pageSize - 1);

  const applyFilters = (q: any) => {
    let query = q;
    if (hasProvince) {
      query = query.eq("province", params.province);
    }
    if (hasGrade) {
      const month = new Date().getMonth() + 1;
      const academicYearStart = new Date().getFullYear() - (month < 9 ? 1 : 0);
      switch (params.grade) {
        case "初一":
          query = query.gte("oier.enroll_middle", academicYearStart);
          break;
        case "初二":
          query = query.eq("oier.enroll_middle", academicYearStart - 1);
          break;
        case "初三":
          query = query.eq("oier.enroll_middle", academicYearStart - 2);
          break;
        case "高一":
          query = query.eq("oier.enroll_middle", academicYearStart - 3);
          break;
        case "高二":
          query = query.eq("oier.enroll_middle", academicYearStart - 4);
          break;
        case "高三":
          query = query.eq("oier.enroll_middle", academicYearStart - 5);
          break;
        case "高中毕业":
          query = query.lte("oier.enroll_middle", academicYearStart - 6);
          break;
      }
    }
    return query;
  };

  const [countRes, dataRes] = await Promise.all([
    applyFilters(countQueryBase),
    applyFilters(dataQueryBase),
  ]);

  const total =
    typeof countRes.count === "number" && Number.isFinite(countRes.count)
      ? (countRes.count as number)
      : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (dataRes.error || !dataRes.data) {
    return { items: [], total, totalPages, page, pageSize };
  }

  const items: ContestRecord[] = (dataRes.data ?? []).map((r: any) => ({
    id: r.id as number,
    uid: (r.oier?.uid ?? null) as number | null,
    name: (r.oier?.name ?? "") as string,
    enroll_middle: (r.oier?.enroll_middle ?? null) as number | null,
    level: (r.level ?? null) as string | null,
    score: (r.score ?? null) as number | null,
    rank: (r.rank ?? null) as number | null,
    province: (r.province ?? null) as string | null,
    school_name: (r.school?.name ?? null) as string | null,
    school_id: (r.school?.id ?? null) as number | null,
  }));

  return { items, total, totalPages, page, pageSize };
}

export const listContestRecordsServer = unstable_cache(
  async (params: ListContestRecordsParams) =>
    listContestRecordsServerUncached(params),
  ["listContestRecordsServer"],
  { revalidate: 300 }
);

