import supabase from "@/lib/db";
import { unstable_cache } from "next/cache";

export type SchoolBase = {
  id: number;
  name: string;
  province: string;
  city: string | null;
  score: number;
};

export async function fetchSchoolBaseByIdUncached(
  id: number
): Promise<SchoolBase | null> {
  if (!Number.isFinite(id)) return null;
  const { data, error } = await supabase
    .from("school")
    .select("id,name,province,city,score")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id as number,
    name: data.name as string,
    province: data.province as unknown as string,
    city: (data.city ?? null) as string | null,
    score: (data.score as number) ?? 0,
  } satisfies SchoolBase;
}

export const fetchSchoolBaseById = unstable_cache(
  async (id: number) => fetchSchoolBaseByIdUncached(id),
  ["fetchSchoolBaseById"],
  { revalidate: 300 }
);

export type SchoolOierItem = {
  uid: number;
  name: string;
  enroll_middle: number | null;
  province: string | null;
  oierdb_score: number | null;
  ccf_level: number | null;
};

export type ListSchoolOiersParams = {
  schoolId: number;
  page?: number;
  pageSize?: number;
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

export type ListSchoolOiersResponse = {
  items: SchoolOierItem[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

async function listSchoolOiersServerUncached(
  params: ListSchoolOiersParams
): Promise<ListSchoolOiersResponse> {
  const pageSize =
    Number.isFinite(params.pageSize) && (params.pageSize as number) > 0
      ? (params.pageSize as number)
      : 50;
  const page =
    Number.isFinite(params.page) && (params.page as number) > 0
      ? (params.page as number)
      : 1;
  const offset = (page - 1) * pageSize;

  const hasGrade = !!(params.grade && params.grade !== "all");

  // 仅统计“有获奖记录”的选手：通过存在 record 表记录来约束
  // 由于我们要筛选属于某学校的选手，依据 oier.schools 数组包含 schoolId
  let countQuery = supabase
    .from("oier")
    .select("uid,record:record!inner(id)", { count: "exact", head: true })
    .contains("schools", [params.schoolId]);

  let dataQuery = supabase
    .from("oier")
    .select(
      `uid,name,enroll_middle,province,oierdb_score,ccf_level,
       record:record(id)`
    )
    .contains("schools", [params.schoolId])
    .order("oierdb_score", { ascending: false, nullsFirst: false })
    .order("ccf_level", { ascending: false, nullsFirst: false })
    .order("uid", { ascending: true })
    .range(offset, offset + pageSize - 1);

  // 年级筛选（与比赛详情/搜索一致的区间推导）
  if (hasGrade) {
    const now = new Date();
    const month = now.getMonth() + 1; // 1..12
    const academicYearStart = now.getFullYear() - (month < 9 ? 1 : 0);
    const applyGradeFilter = (q: any) => {
      switch (params.grade) {
        case "初一":
          return q.gte("enroll_middle", academicYearStart);
        case "初二":
          return q.eq("enroll_middle", academicYearStart - 1);
        case "初三":
          return q.eq("enroll_middle", academicYearStart - 2);
        case "高一":
          return q.eq("enroll_middle", academicYearStart - 3);
        case "高二":
          return q.eq("enroll_middle", academicYearStart - 4);
        case "高三":
          return q.eq("enroll_middle", academicYearStart - 5);
        case "高中毕业":
          return q.lte("enroll_middle", academicYearStart - 6);
        default:
          return q;
      }
    };
    countQuery = applyGradeFilter(countQuery);
    dataQuery = applyGradeFilter(dataQuery);
  }

  // 仅保留“有获奖记录”的选手：限制关联表记录存在
  dataQuery = dataQuery
    .order("id", { referencedTable: "record", ascending: false })
    .limit(1, { referencedTable: "record" });

  const [{ count: totalRaw }, { data, error }] = await Promise.all([
    countQuery,
    dataQuery,
  ]);

  const total = typeof totalRaw === "number" && Number.isFinite(totalRaw) ? (totalRaw as number) : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (error || !data?.length) {
    return { items: [], total, totalPages, page, pageSize };
  }

  const items: SchoolOierItem[] = (data ?? [])
    // 过滤掉没有任何 record 的选手（虽然上面的 limit 应已限制）
    .filter((row: any) => Array.isArray(row.record) && row.record.length > 0)
    .map((row: any) => ({
      uid: row.uid as number,
      name: row.name as string,
      enroll_middle: (row.enroll_middle ?? null) as number | null,
      province: (row.province ?? null) as string | null,
      oierdb_score: (row.oierdb_score ?? null) as number | null,
      ccf_level: (row.ccf_level ?? null) as number | null,
    }));

  return { items, total, totalPages, page, pageSize };
}

export const listSchoolOiersServer = unstable_cache(
  async (params: ListSchoolOiersParams) => listSchoolOiersServerUncached(params),
  ["listSchoolOiersServer"],
  { revalidate: 300 }
);


// ===== 学校获奖趋势（一次返回所有竞赛类型） =====
export type ContestType =
  | "APIO"
  | "CSP入门"
  | "CSP提高"
  | "CTSC"
  | "IOI"
  | "NGOI"
  | "NOI"
  | "NOID类"
  | "NOIP"
  | "NOIP提高"
  | "NOIP普及"
  | "NOIST"
  | "WC";

export type SchoolAwardsTrendPoint = {
  year: number;
  [key: string]: number | number[] | string | null;
};

export type SchoolAwardsTrendsItem = {
  type: ContestType;
  legend: string[];
  items: SchoolAwardsTrendPoint[];
};

export type SchoolAwardsTrendsResponse = SchoolAwardsTrendsItem[];

async function fetchSchoolAwardsTrendsUncached(
  params: { schoolId: number }
): Promise<SchoolAwardsTrendsResponse> {
  const TYPES: ContestType[] = [
    "NOI",
    "CTSC",
    "APIO",
    "IOI",
    "NGOI",
    "WC",
    "CSP提高",
    "CSP入门",
    "NOIP",
    "NOIP提高",
    "NOIP普及",
    "NOID类",
    "NOIST",
  ];

  const { data, error } = await supabase
    .from("record")
    .select(`id,level,contest:contest!inner(year,type)`) // 仅依赖 contest 的 year/type
    .eq("school_id", params.schoolId)
    .order("year", { referencedTable: "contest", ascending: true })
    .limit(50000);

  if (error || !data) {
    return TYPES.map((t) => ({ type: t, legend: legendForType(t), items: [] }));
  }

  // 按类型分桶
  const byType = new Map<ContestType, any[]>();
  for (const row of data as any[]) {
    const t = (row?.contest?.type ?? "") as ContestType;
    if (!TYPES.includes(t)) continue;
    if (!byType.has(t)) byType.set(t, []);
    byType.get(t)!.push(row);
  }

  const results: SchoolAwardsTrendsResponse = [];
  for (const t of TYPES) {
    const rows = byType.get(t) ?? [];
    const legend = legendForType(t);
    if (rows.length === 0) {
      results.push({ type: t, legend, items: [] });
      continue;
    }

    const normalizeLevel = (level: string | null): string | null => {
      if (!level) return null;
      if (["国际金牌", "金牌"].includes(level)) return "金牌";
      if (["国际银牌", "银牌"].includes(level)) return "银牌";
      if (["国际铜牌", "铜牌"].includes(level)) return "铜牌";
      if (["前5%", "一等奖"].includes(level)) return "一等奖";
      if (["前15%", "二等奖"].includes(level)) return "二等奖";
      if (["前25%", "三等奖"].includes(level)) return "三等奖";
      return null;
    };

    const byYear = new Map<number, Record<string, number>>();
    let minYear = Number.POSITIVE_INFINITY;
    let maxYear = Number.NEGATIVE_INFINITY;
    for (const row of rows) {
      const year: number | null = row?.contest?.year ?? null;
      const rawLevel: string | null = row?.level ?? null;
      const key = normalizeLevel(rawLevel);
      if (!year || !key) continue;
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      if (!byYear.has(year)) byYear.set(year, {});
      const bucket = byYear.get(year)!;
      bucket[key] = (bucket[key] ?? 0) + 1;
    }

    if (!Number.isFinite(minYear) || !Number.isFinite(maxYear)) {
      results.push({ type: t, legend, items: [] });
      continue;
    }

    const items: SchoolAwardsTrendPoint[] = [];
    for (let y = minYear; y <= maxYear; y++) {
      const bucket = byYear.get(y) ?? {};
      const point: SchoolAwardsTrendPoint = { year: y };
      for (const k of legend) point[k] = (bucket[k] ?? 0) as number;
      items.push(point);
    }

    results.push({ type: t, legend, items });
  }

  return results;
}

function legendForType(t: ContestType): string[] {
  const medalTypes: ContestType[] = ["NOI", "CTSC", "APIO", "IOI", "WC", "NOID类"];
  return medalTypes.includes(t) ? ["金牌", "银牌", "铜牌"] : ["一等奖", "二等奖", "三等奖"];
}

export const fetchSchoolAwardsTrends = unstable_cache(
  async (params: { schoolId: number }) => fetchSchoolAwardsTrendsUncached(params),
  ["fetchSchoolAwardsTrends"],
  { revalidate: 300 }
);

